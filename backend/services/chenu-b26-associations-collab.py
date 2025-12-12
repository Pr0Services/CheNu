"""
CHE·NU™ B26 - Espace Associations & Collaboration
Gestion organisations et collaboration avancée

Features:
- Espace Associations (membres, projets, communications)
- Gestion des membres et rôles
- Projets communautaires
- Système de votes et décisions
- Événements et calendrier
- Communications internes
- Collaboration en temps réel

Author: CHE·NU Dev Team
Date: December 2024
Lines: ~650
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Set
from datetime import datetime, date, timedelta
from enum import Enum
from uuid import uuid4
import json

router = APIRouter(prefix="/api/v2/collaboration", tags=["Associations & Collaboration"])

# =============================================================================
# ENUMS
# =============================================================================

class OrganizationType(str, Enum):
    ASSOCIATION = "association"
    NONPROFIT = "nonprofit"
    CLUB = "club"
    COMMUNITY = "community"
    PROFESSIONAL = "professional"
    COOPERATIVE = "cooperative"

class MemberRole(str, Enum):
    PRESIDENT = "president"
    VICE_PRESIDENT = "vice_president"
    SECRETARY = "secretary"
    TREASURER = "treasurer"
    BOARD_MEMBER = "board_member"
    MEMBER = "member"
    VOLUNTEER = "volunteer"
    GUEST = "guest"

class MemberStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class VoteType(str, Enum):
    YES_NO = "yes_no"
    MULTIPLE_CHOICE = "multiple_choice"
    RANKED_CHOICE = "ranked_choice"
    APPROVAL = "approval"

class VoteStatus(str, Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    CANCELLED = "cancelled"

class EventType(str, Enum):
    MEETING = "meeting"
    ASSEMBLY = "assembly"
    WORKSHOP = "workshop"
    SOCIAL = "social"
    FUNDRAISER = "fundraiser"
    VOLUNTEER = "volunteer"
    OTHER = "other"

class EventStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class MessageType(str, Enum):
    ANNOUNCEMENT = "announcement"
    DISCUSSION = "discussion"
    QUESTION = "question"
    POLL = "poll"

# =============================================================================
# MODELS - ORGANIZATION
# =============================================================================

class Organization(BaseModel):
    """Organisation/Association"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    owner_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Basic info
    name: str
    org_type: OrganizationType
    description: Optional[str] = None
    
    # Branding
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    color_primary: str = "#D8B26A"
    
    # Contact
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    
    # Address
    address: Optional[str] = None
    city: Optional[str] = None
    province: str = "QC"
    
    # Legal
    registration_number: Optional[str] = None
    founded_date: Optional[date] = None
    
    # Settings
    is_public: bool = False
    membership_fee: float = 0
    fiscal_year_end: int = 12  # Month
    
    # Stats
    members_count: int = 0
    active_projects: int = 0

class Member(BaseModel):
    """Membre d'organisation"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    user_id: str
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Info
    display_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    
    # Role
    role: MemberRole = MemberRole.MEMBER
    status: MemberStatus = MemberStatus.PENDING
    
    # Permissions
    permissions: List[str] = []
    
    # Membership
    membership_expires_at: Optional[date] = None
    membership_paid: bool = False
    
    # Engagement
    volunteer_hours: float = 0
    events_attended: int = 0
    
    # Bio
    bio: Optional[str] = None
    skills: List[str] = []

class MemberInvite(BaseModel):
    """Invitation membre"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    
    email: str
    role: MemberRole = MemberRole.MEMBER
    
    invited_by: str
    invited_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=7))
    
    # Status
    accepted: bool = False
    accepted_at: Optional[datetime] = None

# =============================================================================
# MODELS - PROJECTS
# =============================================================================

class CommunityProject(BaseModel):
    """Projet communautaire"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Basic
    name: str
    description: Optional[str] = None
    
    # Lead
    project_lead_id: Optional[str] = None
    team_member_ids: List[str] = []
    
    # Dates
    start_date: Optional[date] = None
    target_date: Optional[date] = None
    completed_at: Optional[datetime] = None
    
    # Status
    status: str = "planning"  # planning, active, on_hold, completed, cancelled
    
    # Goals
    goals: List[str] = []
    milestones: List[Dict] = []
    
    # Budget
    budget_allocated: float = 0
    budget_spent: float = 0
    
    # Volunteers
    volunteers_needed: int = 0
    volunteers_signed_up: int = 0
    
    # Tags
    tags: List[str] = []

class VolunteerSignup(BaseModel):
    """Inscription bénévole"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    project_id: str
    member_id: str
    signed_up_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Commitment
    hours_committed: float = 0
    hours_completed: float = 0
    
    # Availability
    availability: List[str] = []  # "weekdays", "weekends", "evenings"
    
    # Status
    status: str = "active"  # active, completed, withdrawn

# =============================================================================
# MODELS - VOTING
# =============================================================================

class VoteOption(BaseModel):
    """Option de vote"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    text: str
    description: Optional[str] = None
    votes_count: int = 0

class Vote(BaseModel):
    """Vote/Scrutin"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Details
    title: str
    description: Optional[str] = None
    vote_type: VoteType
    
    # Options
    options: List[VoteOption] = []
    
    # Timing
    opens_at: datetime
    closes_at: datetime
    
    # Status
    status: VoteStatus = VoteStatus.DRAFT
    
    # Settings
    anonymous: bool = True
    require_quorum: bool = False
    quorum_percent: float = 50.0
    
    # Results
    total_votes: int = 0
    eligible_voters: int = 0

class Ballot(BaseModel):
    """Bulletin de vote"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    vote_id: str
    member_id: str
    cast_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Selection
    selected_option_ids: List[str] = []
    
    # For ranked choice
    rankings: Dict[str, int] = {}

# =============================================================================
# MODELS - EVENTS
# =============================================================================

class Event(BaseModel):
    """Événement"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Details
    title: str
    description: Optional[str] = None
    event_type: EventType
    
    # Timing
    start_time: datetime
    end_time: datetime
    timezone: str = "America/Montreal"
    
    # Location
    location_type: str = "in_person"  # in_person, online, hybrid
    location_address: Optional[str] = None
    location_url: Optional[str] = None  # For online events
    
    # Status
    status: EventStatus = EventStatus.SCHEDULED
    
    # Attendance
    max_attendees: Optional[int] = None
    rsvp_required: bool = False
    
    # Stats
    attendees_count: int = 0
    
    # Recurrence
    is_recurring: bool = False
    recurrence_rule: Optional[str] = None  # iCal RRULE format

class EventRSVP(BaseModel):
    """RSVP événement"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    event_id: str
    member_id: str
    responded_at: datetime = Field(default_factory=datetime.utcnow)
    
    response: str  # yes, no, maybe
    guests: int = 0
    notes: Optional[str] = None
    
    # Attendance
    attended: bool = False

# =============================================================================
# MODELS - COMMUNICATIONS
# =============================================================================

class Channel(BaseModel):
    """Canal de communication"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    name: str
    description: Optional[str] = None
    
    # Access
    is_private: bool = False
    member_ids: List[str] = []  # For private channels
    
    # Settings
    allow_threads: bool = True
    
    # Stats
    messages_count: int = 0
    last_activity_at: Optional[datetime] = None

class Message(BaseModel):
    """Message"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    channel_id: str
    author_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    # Content
    message_type: MessageType = MessageType.DISCUSSION
    content: str
    
    # Threading
    thread_id: Optional[str] = None
    replies_count: int = 0
    
    # Attachments
    attachment_urls: List[str] = []
    
    # Reactions
    reactions: Dict[str, List[str]] = {}  # emoji -> user_ids
    
    # Mentions
    mentioned_user_ids: List[str] = []
    mention_everyone: bool = False
    
    # Status
    is_pinned: bool = False
    is_edited: bool = False

class Announcement(BaseModel):
    """Annonce officielle"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    author_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    title: str
    content: str
    
    # Targeting
    target_roles: List[MemberRole] = []  # Empty = all members
    
    # Settings
    is_important: bool = False
    require_acknowledgment: bool = False
    
    # Stats
    views_count: int = 0
    acknowledgments: List[str] = []  # User IDs

# =============================================================================
# MODELS - COLLABORATION
# =============================================================================

class Document(BaseModel):
    """Document collaboratif"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    organization_id: str
    created_by: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    title: str
    content: str = ""
    
    # Folder
    folder_id: Optional[str] = None
    
    # Sharing
    is_public: bool = False
    shared_with: List[str] = []  # Member IDs
    
    # Versioning
    version: int = 1
    
    # Editing
    last_edited_by: Optional[str] = None
    is_locked: bool = False
    locked_by: Optional[str] = None

class Comment(BaseModel):
    """Commentaire sur document"""
    id: str = Field(default_factory=lambda: str(uuid4()))
    document_id: str
    author_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    content: str
    
    # Position
    position_start: Optional[int] = None
    position_end: Optional[int] = None
    
    # Status
    is_resolved: bool = False
    resolved_by: Optional[str] = None

# =============================================================================
# STORAGE
# =============================================================================

class CollabStore:
    def __init__(self):
        # Organizations
        self.organizations: Dict[str, Organization] = {}
        self.members: Dict[str, Member] = {}
        self.invites: Dict[str, MemberInvite] = {}
        
        # Projects
        self.projects: Dict[str, CommunityProject] = {}
        self.signups: Dict[str, VolunteerSignup] = {}
        
        # Voting
        self.votes: Dict[str, Vote] = {}
        self.ballots: Dict[str, Ballot] = {}
        
        # Events
        self.events: Dict[str, Event] = {}
        self.rsvps: Dict[str, EventRSVP] = {}
        
        # Communications
        self.channels: Dict[str, Channel] = {}
        self.messages: Dict[str, Message] = {}
        self.announcements: Dict[str, Announcement] = {}
        
        # Documents
        self.documents: Dict[str, Document] = {}
        self.comments: Dict[str, Comment] = {}
        
        # Indexes
        self.members_by_org: Dict[str, List[str]] = {}
        self.projects_by_org: Dict[str, List[str]] = {}
        self.events_by_org: Dict[str, List[str]] = {}
        self.channels_by_org: Dict[str, List[str]] = {}
        
        # WebSocket connections
        self.active_connections: Dict[str, Set[WebSocket]] = {}

store = CollabStore()

# =============================================================================
# WEBSOCKET MANAGER
# =============================================================================

class ConnectionManager:
    """Gestionnaire de connexions WebSocket"""
    
    async def connect(self, websocket: WebSocket, channel_id: str):
        await websocket.accept()
        if channel_id not in store.active_connections:
            store.active_connections[channel_id] = set()
        store.active_connections[channel_id].add(websocket)
    
    def disconnect(self, websocket: WebSocket, channel_id: str):
        if channel_id in store.active_connections:
            store.active_connections[channel_id].discard(websocket)
    
    async def broadcast(self, channel_id: str, message: Dict):
        if channel_id in store.active_connections:
            for connection in store.active_connections[channel_id]:
                try:
                    await connection.send_json(message)
                except:
                    pass

manager = ConnectionManager()

# =============================================================================
# API - ORGANIZATIONS
# =============================================================================

@router.post("/organizations", response_model=Organization)
async def create_organization(owner_id: str, name: str, org_type: OrganizationType, description: Optional[str] = None):
    """Crée une organisation"""
    org = Organization(
        owner_id=owner_id,
        name=name,
        org_type=org_type,
        description=description
    )
    store.organizations[org.id] = org
    store.members_by_org[org.id] = []
    store.projects_by_org[org.id] = []
    store.events_by_org[org.id] = []
    store.channels_by_org[org.id] = []
    
    # Create default general channel
    general = Channel(
        organization_id=org.id,
        name="Général",
        description="Canal principal de discussion"
    )
    store.channels[general.id] = general
    store.channels_by_org[org.id].append(general.id)
    
    # Add owner as president
    member = Member(
        organization_id=org.id,
        user_id=owner_id,
        display_name="Admin",
        role=MemberRole.PRESIDENT,
        status=MemberStatus.ACTIVE,
        permissions=["all"]
    )
    store.members[member.id] = member
    store.members_by_org[org.id].append(member.id)
    org.members_count = 1
    
    return org

@router.get("/organizations", response_model=List[Organization])
async def list_organizations(user_id: str, public_only: bool = False):
    """Liste les organisations"""
    orgs = []
    
    for org in store.organizations.values():
        if public_only and not org.is_public:
            continue
        
        # Check if user is member
        member_ids = store.members_by_org.get(org.id, [])
        for mid in member_ids:
            if mid in store.members and store.members[mid].user_id == user_id:
                orgs.append(org)
                break
        else:
            if public_only:
                orgs.append(org)
    
    return orgs

@router.get("/organizations/{org_id}", response_model=Organization)
async def get_organization(org_id: str):
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    return store.organizations[org_id]

# =============================================================================
# API - MEMBERS
# =============================================================================

@router.post("/organizations/{org_id}/members/invite")
async def invite_member(org_id: str, email: str, role: MemberRole, invited_by: str):
    """Invite un membre"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    invite = MemberInvite(
        organization_id=org_id,
        email=email,
        role=role,
        invited_by=invited_by
    )
    store.invites[invite.id] = invite
    
    return {"invite_id": invite.id, "status": "invited"}

@router.post("/organizations/{org_id}/members", response_model=Member)
async def add_member(org_id: str, user_id: str, display_name: str, role: MemberRole = MemberRole.MEMBER):
    """Ajoute un membre"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    member = Member(
        organization_id=org_id,
        user_id=user_id,
        display_name=display_name,
        role=role,
        status=MemberStatus.ACTIVE
    )
    store.members[member.id] = member
    store.members_by_org[org_id].append(member.id)
    store.organizations[org_id].members_count += 1
    
    return member

@router.get("/organizations/{org_id}/members", response_model=List[Member])
async def list_members(org_id: str, role: Optional[MemberRole] = None, status: Optional[MemberStatus] = None):
    """Liste les membres"""
    member_ids = store.members_by_org.get(org_id, [])
    members = [store.members[mid] for mid in member_ids if mid in store.members]
    
    if role:
        members = [m for m in members if m.role == role]
    if status:
        members = [m for m in members if m.status == status]
    
    return members

@router.put("/organizations/{org_id}/members/{member_id}", response_model=Member)
async def update_member(org_id: str, member_id: str, updates: Dict[str, Any]):
    """Met à jour un membre"""
    if member_id not in store.members:
        raise HTTPException(404, "Member not found")
    
    member = store.members[member_id]
    for key, value in updates.items():
        if hasattr(member, key) and key not in ['id', 'organization_id', 'user_id', 'joined_at']:
            setattr(member, key, value)
    
    return member

# =============================================================================
# API - PROJECTS
# =============================================================================

@router.post("/organizations/{org_id}/projects", response_model=CommunityProject)
async def create_project(org_id: str, name: str, description: Optional[str] = None, project_lead_id: Optional[str] = None):
    """Crée un projet communautaire"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    project = CommunityProject(
        organization_id=org_id,
        name=name,
        description=description,
        project_lead_id=project_lead_id
    )
    store.projects[project.id] = project
    store.projects_by_org[org_id].append(project.id)
    store.organizations[org_id].active_projects += 1
    
    return project

@router.get("/organizations/{org_id}/projects", response_model=List[CommunityProject])
async def list_projects(org_id: str, status: Optional[str] = None):
    """Liste les projets"""
    project_ids = store.projects_by_org.get(org_id, [])
    projects = [store.projects[pid] for pid in project_ids if pid in store.projects]
    
    if status:
        projects = [p for p in projects if p.status == status]
    
    return projects

@router.post("/projects/{project_id}/volunteer", response_model=VolunteerSignup)
async def volunteer_signup(project_id: str, member_id: str, hours_committed: float = 0):
    """S'inscrit comme bénévole"""
    if project_id not in store.projects:
        raise HTTPException(404, "Project not found")
    
    signup = VolunteerSignup(
        project_id=project_id,
        member_id=member_id,
        hours_committed=hours_committed
    )
    store.signups[signup.id] = signup
    store.projects[project_id].volunteers_signed_up += 1
    
    return signup

# =============================================================================
# API - VOTING
# =============================================================================

@router.post("/organizations/{org_id}/votes", response_model=Vote)
async def create_vote(
    org_id: str,
    created_by: str,
    title: str,
    vote_type: VoteType,
    options: List[Dict],
    opens_at: datetime,
    closes_at: datetime
):
    """Crée un vote"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    vote = Vote(
        organization_id=org_id,
        created_by=created_by,
        title=title,
        vote_type=vote_type,
        options=[VoteOption(**opt) for opt in options],
        opens_at=opens_at,
        closes_at=closes_at,
        eligible_voters=store.organizations[org_id].members_count
    )
    store.votes[vote.id] = vote
    
    return vote

@router.post("/votes/{vote_id}/open")
async def open_vote(vote_id: str):
    """Ouvre un vote"""
    if vote_id not in store.votes:
        raise HTTPException(404, "Vote not found")
    
    vote = store.votes[vote_id]
    vote.status = VoteStatus.OPEN
    
    return {"status": "opened"}

@router.post("/votes/{vote_id}/cast", response_model=Ballot)
async def cast_vote(vote_id: str, member_id: str, selected_option_ids: List[str]):
    """Vote"""
    if vote_id not in store.votes:
        raise HTTPException(404, "Vote not found")
    
    vote = store.votes[vote_id]
    if vote.status != VoteStatus.OPEN:
        raise HTTPException(400, "Vote is not open")
    
    # Check if already voted
    for ballot in store.ballots.values():
        if ballot.vote_id == vote_id and ballot.member_id == member_id:
            raise HTTPException(400, "Already voted")
    
    ballot = Ballot(
        vote_id=vote_id,
        member_id=member_id,
        selected_option_ids=selected_option_ids
    )
    store.ballots[ballot.id] = ballot
    
    # Update vote counts
    vote.total_votes += 1
    for opt in vote.options:
        if opt.id in selected_option_ids:
            opt.votes_count += 1
    
    return ballot

@router.get("/votes/{vote_id}/results")
async def get_vote_results(vote_id: str):
    """Récupère les résultats"""
    if vote_id not in store.votes:
        raise HTTPException(404, "Vote not found")
    
    vote = store.votes[vote_id]
    
    results = {
        "vote_id": vote_id,
        "title": vote.title,
        "status": vote.status.value,
        "total_votes": vote.total_votes,
        "eligible_voters": vote.eligible_voters,
        "participation_rate": (vote.total_votes / vote.eligible_voters * 100) if vote.eligible_voters > 0 else 0,
        "options": [
            {
                "id": opt.id,
                "text": opt.text,
                "votes": opt.votes_count,
                "percentage": (opt.votes_count / vote.total_votes * 100) if vote.total_votes > 0 else 0
            }
            for opt in vote.options
        ]
    }
    
    # Check quorum
    if vote.require_quorum:
        results["quorum_met"] = results["participation_rate"] >= vote.quorum_percent
    
    return results

# =============================================================================
# API - EVENTS
# =============================================================================

@router.post("/organizations/{org_id}/events", response_model=Event)
async def create_event(
    org_id: str,
    created_by: str,
    title: str,
    event_type: EventType,
    start_time: datetime,
    end_time: datetime,
    location_type: str = "in_person"
):
    """Crée un événement"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    event = Event(
        organization_id=org_id,
        created_by=created_by,
        title=title,
        event_type=event_type,
        start_time=start_time,
        end_time=end_time,
        location_type=location_type
    )
    store.events[event.id] = event
    store.events_by_org[org_id].append(event.id)
    
    return event

@router.get("/organizations/{org_id}/events", response_model=List[Event])
async def list_events(org_id: str, upcoming_only: bool = True):
    """Liste les événements"""
    event_ids = store.events_by_org.get(org_id, [])
    events = [store.events[eid] for eid in event_ids if eid in store.events]
    
    if upcoming_only:
        now = datetime.utcnow()
        events = [e for e in events if e.start_time >= now]
    
    return sorted(events, key=lambda x: x.start_time)

@router.post("/events/{event_id}/rsvp", response_model=EventRSVP)
async def rsvp_event(event_id: str, member_id: str, response: str, guests: int = 0):
    """RSVP à un événement"""
    if event_id not in store.events:
        raise HTTPException(404, "Event not found")
    
    rsvp = EventRSVP(
        event_id=event_id,
        member_id=member_id,
        response=response,
        guests=guests
    )
    store.rsvps[rsvp.id] = rsvp
    
    if response == "yes":
        store.events[event_id].attendees_count += 1 + guests
    
    return rsvp

# =============================================================================
# API - CHANNELS & MESSAGES
# =============================================================================

@router.post("/organizations/{org_id}/channels", response_model=Channel)
async def create_channel(org_id: str, name: str, description: Optional[str] = None, is_private: bool = False):
    """Crée un canal"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    channel = Channel(
        organization_id=org_id,
        name=name,
        description=description,
        is_private=is_private
    )
    store.channels[channel.id] = channel
    store.channels_by_org[org_id].append(channel.id)
    
    return channel

@router.get("/organizations/{org_id}/channels", response_model=List[Channel])
async def list_channels(org_id: str):
    """Liste les canaux"""
    channel_ids = store.channels_by_org.get(org_id, [])
    return [store.channels[cid] for cid in channel_ids if cid in store.channels]

@router.post("/channels/{channel_id}/messages", response_model=Message)
async def send_message(channel_id: str, author_id: str, content: str, message_type: MessageType = MessageType.DISCUSSION):
    """Envoie un message"""
    if channel_id not in store.channels:
        raise HTTPException(404, "Channel not found")
    
    message = Message(
        channel_id=channel_id,
        author_id=author_id,
        content=content,
        message_type=message_type
    )
    store.messages[message.id] = message
    
    channel = store.channels[channel_id]
    channel.messages_count += 1
    channel.last_activity_at = datetime.utcnow()
    
    # Broadcast to WebSocket clients
    await manager.broadcast(channel_id, {
        "type": "new_message",
        "message": message.model_dump(mode='json')
    })
    
    return message

@router.get("/channels/{channel_id}/messages", response_model=List[Message])
async def list_messages(channel_id: str, limit: int = 50, before: Optional[str] = None):
    """Liste les messages"""
    messages = [m for m in store.messages.values() if m.channel_id == channel_id and not m.thread_id]
    
    return sorted(messages, key=lambda x: x.created_at, reverse=True)[:limit]

@router.post("/messages/{message_id}/react")
async def react_to_message(message_id: str, user_id: str, emoji: str):
    """Réagit à un message"""
    if message_id not in store.messages:
        raise HTTPException(404, "Message not found")
    
    message = store.messages[message_id]
    
    if emoji not in message.reactions:
        message.reactions[emoji] = []
    
    if user_id in message.reactions[emoji]:
        message.reactions[emoji].remove(user_id)
    else:
        message.reactions[emoji].append(user_id)
    
    return {"reactions": message.reactions}

# =============================================================================
# API - ANNOUNCEMENTS
# =============================================================================

@router.post("/organizations/{org_id}/announcements", response_model=Announcement)
async def create_announcement(org_id: str, author_id: str, title: str, content: str, is_important: bool = False):
    """Crée une annonce"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    announcement = Announcement(
        organization_id=org_id,
        author_id=author_id,
        title=title,
        content=content,
        is_important=is_important
    )
    store.announcements[announcement.id] = announcement
    
    return announcement

@router.get("/organizations/{org_id}/announcements", response_model=List[Announcement])
async def list_announcements(org_id: str, limit: int = 20):
    """Liste les annonces"""
    announcements = [a for a in store.announcements.values() if a.organization_id == org_id]
    return sorted(announcements, key=lambda x: (x.is_important, x.created_at), reverse=True)[:limit]

# =============================================================================
# API - DOCUMENTS
# =============================================================================

@router.post("/organizations/{org_id}/documents", response_model=Document)
async def create_document(org_id: str, created_by: str, title: str, content: str = ""):
    """Crée un document"""
    if org_id not in store.organizations:
        raise HTTPException(404, "Organization not found")
    
    doc = Document(
        organization_id=org_id,
        created_by=created_by,
        title=title,
        content=content
    )
    store.documents[doc.id] = doc
    
    return doc

@router.put("/documents/{doc_id}", response_model=Document)
async def update_document(doc_id: str, content: str, edited_by: str):
    """Met à jour un document"""
    if doc_id not in store.documents:
        raise HTTPException(404, "Document not found")
    
    doc = store.documents[doc_id]
    if doc.is_locked and doc.locked_by != edited_by:
        raise HTTPException(400, "Document is locked")
    
    doc.content = content
    doc.updated_at = datetime.utcnow()
    doc.last_edited_by = edited_by
    doc.version += 1
    
    return doc

# =============================================================================
# WEBSOCKET - REAL-TIME
# =============================================================================

@router.websocket("/ws/{channel_id}")
async def websocket_endpoint(websocket: WebSocket, channel_id: str):
    """WebSocket pour messages en temps réel"""
    await manager.connect(websocket, channel_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Handle incoming messages
            if data.get("type") == "message":
                message = Message(
                    channel_id=channel_id,
                    author_id=data.get("author_id"),
                    content=data.get("content")
                )
                store.messages[message.id] = message
                await manager.broadcast(channel_id, {
                    "type": "new_message",
                    "message": message.model_dump(mode='json')
                })
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel_id)

# =============================================================================
# HEALTH
# =============================================================================

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "organizations": len(store.organizations),
        "members": len(store.members),
        "projects": len(store.projects),
        "events": len(store.events),
        "channels": len(store.channels)
    }
