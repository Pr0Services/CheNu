/* CHE·NU — Meeting Timeline Adapter (Phase 6) */

import { MeetingRoom, MeetingListener } from './MeetingRoom';
import { MeetingEventPayload, MeetingEventType } from './types';

export class MeetingTimelineAdapter {
  private room: MeetingRoom;
  private recorder: any; // TimelineRecorder
  private unsubscribe: (() => void) | null = null;
  
  constructor(room: MeetingRoom, recorder: any) {
    this.room = room;
    this.recorder = recorder;
  }
  
  connect(): void {
    if (this.unsubscribe) return;
    this.unsubscribe = this.room.subscribe(this.handleEvent.bind(this));
    if (this.recorder.setContext) {
      this.recorder.setContext({
        sphereId: this.room.getState().context.objective.sphereId,
        nodeId: this.room.getId(),
        viewMode: 'detail',
      });
    }
  }
  
  disconnect(): void {
    if (this.unsubscribe) { this.unsubscribe(); this.unsubscribe = null; }
  }
  
  private handleEvent(event: MeetingEventPayload): void {
    const map = this.mapEvent(event);
    if (!map || !this.recorder.record) return;
    this.recorder.record(
      this.getSource(event.eventType),
      map.category,
      map.type,
      { kind: 'meeting-event', ...event.data },
      map.description,
      { correlationId: event.meetingId }
    );
  }
  
  private getSource(t: MeetingEventType): 'user' | 'system' | 'agent' {
    if (t.startsWith('human:') || t === 'decision:recorded') return 'user';
    if (t.startsWith('agent:')) return 'agent';
    return 'system';
  }
  
  private mapEvent(e: MeetingEventPayload): { category: string; type: string; description: string } | null {
    const { eventType, meetingId, data } = e;
    switch (eventType) {
      case 'meeting:created': return { category: 'milestone', type: 'milestone:session-start', description: `Meeting created: ${meetingId}` };
      case 'meeting:started': return { category: 'milestone', type: 'milestone:session-start', description: `Meeting started` };
      case 'meeting:paused': return { category: 'state', type: 'state:activity-change', description: `Meeting paused` };
      case 'meeting:resumed': return { category: 'state', type: 'state:activity-change', description: `Meeting resumed` };
      case 'meeting:phase-changed': return { category: 'navigation', type: 'nav:depth-change', description: `Phase: ${data.from} → ${data.to}` };
      case 'meeting:closed': return { category: 'milestone', type: 'milestone:session-end', description: `Meeting closed (${data.decisionsCount} decisions)` };
      case 'meeting:cancelled': return { category: 'milestone', type: 'milestone:session-end', description: `Meeting cancelled` };
      case 'participant:joined': return { category: 'interaction', type: 'interact:select', description: `${data.type} joined` };
      case 'participant:left': return { category: 'interaction', type: 'interact:select', description: `${data.type} left` };
      case 'agent:contributed': return { category: 'agent', type: 'agent:recommendation', description: `Agent contributed` };
      case 'human:contributed': return { category: 'interaction', type: 'interact:click', description: `Human contribution` };
      case 'decision:recorded': return { category: 'decision', type: 'decision:resolved', description: `Decision: ${(data.decision as any)?.summary}` };
      case 'decision:amended': return { category: 'decision', type: 'decision:resolved', description: `Decision amended` };
      default: return null;
    }
  }
}

export function connectMeetingToTimeline(room: MeetingRoom, recorder: any): MeetingTimelineAdapter {
  const adapter = new MeetingTimelineAdapter(room, recorder);
  adapter.connect();
  return adapter;
}
