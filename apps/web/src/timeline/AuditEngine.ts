/* =====================================================
   CHE·NU — Audit Engine
   PHASE 5: Generate audit reports and insights
   ===================================================== */

import {
  TimelineEvent, EventId, EventCategory, EventSource,
  AuditQuery, AuditReport, AuditSummary, AuditInsight,
} from './types';
import { TimelineStore } from './TimelineStore';

export class AuditEngine {
  private store: TimelineStore;
  
  constructor(store: TimelineStore) {
    this.store = store;
  }
  
  // ─────────────────────────────────────────────────────
  // REPORT GENERATION
  // ─────────────────────────────────────────────────────
  
  generateReport(query: AuditQuery): AuditReport {
    const events = this.store.query(query);
    const summary = this.generateSummary(events);
    const insights = this.generateInsights(events);
    
    return {
      id: `audit-${Date.now()}`,
      generatedAt: Date.now(),
      query,
      summary,
      events,
      insights,
    };
  }
  
  private generateSummary(events: TimelineEvent[]): AuditSummary {
    if (events.length === 0) {
      return {
        totalEvents: 0,
        timeSpan: { start: 0, end: 0 },
        eventsByCategory: {},
        eventsBySource: {},
        decisionsFlow: { created: 0, resolved: 0, pending: 0 },
      };
    }
    
    const byCategory: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let decisionsCreated = 0;
    let decisionsResolved = 0;
    
    for (const event of events) {
      byCategory[event.category] = (byCategory[event.category] || 0) + 1;
      bySource[event.source] = (bySource[event.source] || 0) + 1;
      
      if (event.type === 'decision:created') decisionsCreated++;
      if (event.type === 'decision:resolved') decisionsResolved++;
    }
    
    return {
      totalEvents: events.length,
      timeSpan: {
        start: events[0].timestamp,
        end: events[events.length - 1].timestamp,
      },
      eventsByCategory: byCategory,
      eventsBySource: bySource,
      decisionsFlow: {
        created: decisionsCreated,
        resolved: decisionsResolved,
        pending: decisionsCreated - decisionsResolved,
      },
    };
  }
  
  // ─────────────────────────────────────────────────────
  // INSIGHT GENERATION
  // ─────────────────────────────────────────────────────
  
  private generateInsights(events: TimelineEvent[]): AuditInsight[] {
    const insights: AuditInsight[] = [];
    
    // Pattern: High error rate
    const errorInsight = this.detectErrorPatterns(events);
    if (errorInsight) insights.push(errorInsight);
    
    // Pattern: Decision bottleneck
    const decisionInsight = this.detectDecisionBottleneck(events);
    if (decisionInsight) insights.push(decisionInsight);
    
    // Pattern: Agent rejection rate
    const agentInsight = this.detectAgentRejectionRate(events);
    if (agentInsight) insights.push(agentInsight);
    
    // Pattern: Sphere concentration
    const sphereInsight = this.detectSphereConcentration(events);
    if (sphereInsight) insights.push(sphereInsight);
    
    // Pattern: Activity spikes
    const activityInsight = this.detectActivitySpikes(events);
    if (activityInsight) insights.push(activityInsight);
    
    // Pattern: Repeated navigation
    const navInsight = this.detectNavigationPatterns(events);
    if (navInsight) insights.push(navInsight);
    
    return insights;
  }
  
  private detectErrorPatterns(events: TimelineEvent[]): AuditInsight | null {
    const errors = events.filter(e => e.category === 'error');
    if (errors.length === 0) return null;
    
    const errorRate = errors.length / events.length;
    
    if (errorRate > 0.1) {
      return {
        type: 'anomaly',
        severity: 'critical',
        title: 'High Error Rate',
        description: `${(errorRate * 100).toFixed(1)}% of events are errors (${errors.length} errors in ${events.length} events)`,
        relatedEvents: errors.slice(0, 10).map(e => e.id),
      };
    }
    
    if (errors.length >= 3) {
      return {
        type: 'pattern',
        severity: 'warning',
        title: 'Multiple Errors Detected',
        description: `${errors.length} errors occurred during this period`,
        relatedEvents: errors.map(e => e.id),
      };
    }
    
    return null;
  }
  
  private detectDecisionBottleneck(events: TimelineEvent[]): AuditInsight | null {
    const decisionEvents = events.filter(e => e.category === 'decision');
    const created = decisionEvents.filter(e => e.type === 'decision:created');
    const resolved = decisionEvents.filter(e => e.type === 'decision:resolved');
    
    const pending = created.length - resolved.length;
    
    if (pending >= 5) {
      return {
        type: 'pattern',
        severity: 'warning',
        title: 'Decision Bottleneck',
        description: `${pending} decisions remain unresolved (${created.length} created, ${resolved.length} resolved)`,
        relatedEvents: created.slice(-5).map(e => e.id),
      };
    }
    
    return null;
  }
  
  private detectAgentRejectionRate(events: TimelineEvent[]): AuditInsight | null {
    const accepted = events.filter(e => e.type === 'agent:proposal-accepted');
    const rejected = events.filter(e => e.type === 'agent:proposal-rejected');
    
    const total = accepted.length + rejected.length;
    if (total < 3) return null;
    
    const rejectionRate = rejected.length / total;
    
    if (rejectionRate > 0.5) {
      return {
        type: 'anomaly',
        severity: 'warning',
        title: 'High Agent Rejection Rate',
        description: `${(rejectionRate * 100).toFixed(1)}% of agent proposals were rejected`,
        relatedEvents: rejected.map(e => e.id),
      };
    }
    
    if (rejectionRate === 0 && total >= 5) {
      return {
        type: 'pattern',
        severity: 'info',
        title: 'High Agent Acceptance',
        description: `All ${total} agent proposals were accepted`,
        relatedEvents: accepted.map(e => e.id),
      };
    }
    
    return null;
  }
  
  private detectSphereConcentration(events: TimelineEvent[]): AuditInsight | null {
    const sphereCounts: Record<string, number> = {};
    
    for (const event of events) {
      if (event.context.sphereId) {
        sphereCounts[event.context.sphereId] = (sphereCounts[event.context.sphereId] || 0) + 1;
      }
    }
    
    const spheres = Object.entries(sphereCounts);
    if (spheres.length === 0) return null;
    
    const sorted = spheres.sort((a, b) => b[1] - a[1]);
    const topSphere = sorted[0];
    const topPercentage = topSphere[1] / events.length;
    
    if (topPercentage > 0.7) {
      return {
        type: 'pattern',
        severity: 'info',
        title: 'Sphere Focus',
        description: `${(topPercentage * 100).toFixed(1)}% of activity concentrated in "${topSphere[0]}" sphere`,
        relatedEvents: events.filter(e => e.context.sphereId === topSphere[0]).slice(0, 5).map(e => e.id),
      };
    }
    
    return null;
  }
  
  private detectActivitySpikes(events: TimelineEvent[]): AuditInsight | null {
    if (events.length < 10) return null;
    
    // Group by minute
    const byMinute: Record<number, TimelineEvent[]> = {};
    
    for (const event of events) {
      const minute = Math.floor(event.timestamp / 60000);
      if (!byMinute[minute]) byMinute[minute] = [];
      byMinute[minute].push(event);
    }
    
    const counts = Object.values(byMinute).map(arr => arr.length);
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    
    // Find spikes (2x average)
    const spikes = Object.entries(byMinute).filter(([_, arr]) => arr.length > avg * 2);
    
    if (spikes.length > 0) {
      const maxSpike = spikes.reduce((max, curr) => curr[1].length > max[1].length ? curr : max);
      
      return {
        type: 'pattern',
        severity: 'info',
        title: 'Activity Spike Detected',
        description: `Peak activity of ${maxSpike[1].length} events/minute (average: ${avg.toFixed(1)})`,
        relatedEvents: maxSpike[1].slice(0, 5).map(e => e.id),
      };
    }
    
    return null;
  }
  
  private detectNavigationPatterns(events: TimelineEvent[]): AuditInsight | null {
    const navEvents = events.filter(e => e.category === 'navigation');
    if (navEvents.length < 5) return null;
    
    // Check for back-and-forth pattern
    const sphereSequence = navEvents.map(e => e.context.sphereId);
    let backAndForth = 0;
    
    for (let i = 2; i < sphereSequence.length; i++) {
      if (sphereSequence[i] === sphereSequence[i - 2] && 
          sphereSequence[i] !== sphereSequence[i - 1]) {
        backAndForth++;
      }
    }
    
    if (backAndForth >= 3) {
      return {
        type: 'anomaly',
        severity: 'warning',
        title: 'Navigation Thrashing',
        description: `${backAndForth} back-and-forth navigation patterns detected`,
        relatedEvents: navEvents.slice(-10).map(e => e.id),
      };
    }
    
    return null;
  }
  
  // ─────────────────────────────────────────────────────
  // SPECIALIZED QUERIES
  // ─────────────────────────────────────────────────────
  
  getAgentPerformance(): AgentPerformance[] {
    const events = this.store.getAllEvents();
    const agentStats: Record<string, AgentPerformance> = {};
    
    for (const event of events) {
      if (event.category !== 'agent') continue;
      
      const agentId = event.context.agentId || (event.payload as any).agentId;
      if (!agentId) continue;
      
      if (!agentStats[agentId]) {
        agentStats[agentId] = {
          agentId,
          activations: 0,
          signals: 0,
          recommendations: 0,
          proposalsAccepted: 0,
          proposalsRejected: 0,
          acceptanceRate: 0,
        };
      }
      
      const stats = agentStats[agentId];
      
      switch (event.type) {
        case 'agent:activated': stats.activations++; break;
        case 'agent:signal': stats.signals++; break;
        case 'agent:recommendation': stats.recommendations++; break;
        case 'agent:proposal-accepted': stats.proposalsAccepted++; break;
        case 'agent:proposal-rejected': stats.proposalsRejected++; break;
      }
    }
    
    // Calculate acceptance rates
    for (const stats of Object.values(agentStats)) {
      const total = stats.proposalsAccepted + stats.proposalsRejected;
      stats.acceptanceRate = total > 0 ? stats.proposalsAccepted / total : 0;
    }
    
    return Object.values(agentStats);
  }
  
  getDecisionMetrics(): DecisionMetrics {
    const events = this.store.getAllEvents();
    const decisionEvents = events.filter(e => e.category === 'decision');
    
    const created = decisionEvents.filter(e => e.type === 'decision:created');
    const resolved = decisionEvents.filter(e => e.type === 'decision:resolved');
    const deferred = decisionEvents.filter(e => e.type === 'decision:deferred');
    
    // Calculate resolution times
    const resolutionTimes: number[] = [];
    const createdMap = new Map(created.map(e => [(e.payload as any).decisionId, e.timestamp]));
    
    for (const r of resolved) {
      const decisionId = (r.payload as any).decisionId;
      const createdAt = createdMap.get(decisionId);
      if (createdAt) {
        resolutionTimes.push(r.timestamp - createdAt);
      }
    }
    
    const avgResolutionTime = resolutionTimes.length > 0
      ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
      : 0;
    
    return {
      totalCreated: created.length,
      totalResolved: resolved.length,
      totalDeferred: deferred.length,
      pendingCount: created.length - resolved.length,
      resolutionRate: created.length > 0 ? resolved.length / created.length : 0,
      averageResolutionTimeMs: avgResolutionTime,
    };
  }
  
  // ─────────────────────────────────────────────────────
  // EXPORT
  // ─────────────────────────────────────────────────────
  
  exportReportAsMarkdown(report: AuditReport): string {
    const lines: string[] = [
      `# Audit Report`,
      `Generated: ${new Date(report.generatedAt).toISOString()}`,
      ``,
      `## Summary`,
      `- Total Events: ${report.summary.totalEvents}`,
      `- Time Span: ${new Date(report.summary.timeSpan.start).toISOString()} to ${new Date(report.summary.timeSpan.end).toISOString()}`,
      ``,
      `### Events by Category`,
    ];
    
    for (const [category, count] of Object.entries(report.summary.eventsByCategory)) {
      lines.push(`- ${category}: ${count}`);
    }
    
    lines.push(``, `### Decisions Flow`);
    lines.push(`- Created: ${report.summary.decisionsFlow.created}`);
    lines.push(`- Resolved: ${report.summary.decisionsFlow.resolved}`);
    lines.push(`- Pending: ${report.summary.decisionsFlow.pending}`);
    
    if (report.insights.length > 0) {
      lines.push(``, `## Insights`);
      for (const insight of report.insights) {
        lines.push(``, `### ${insight.severity.toUpperCase()}: ${insight.title}`);
        lines.push(insight.description);
      }
    }
    
    return lines.join('\n');
  }
}

export interface AgentPerformance {
  agentId: string;
  activations: number;
  signals: number;
  recommendations: number;
  proposalsAccepted: number;
  proposalsRejected: number;
  acceptanceRate: number;
}

export interface DecisionMetrics {
  totalCreated: number;
  totalResolved: number;
  totalDeferred: number;
  pendingCount: number;
  resolutionRate: number;
  averageResolutionTimeMs: number;
}
