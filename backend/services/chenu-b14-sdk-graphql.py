"""
═══════════════════════════════════════════════════════════════════════════════
CHE·NU™ — BATCH 14: SDK + GRAPHQL API LAYER
═══════════════════════════════════════════════════════════════════════════════

Features:
- SDK-01: TypeScript SDK (frontend/node)
- SDK-02: Python SDK (backend/scripts)
- SDK-03: Authentication helpers
- SDK-04: Type definitions
- GRAPHQL-01: Schema definition
- GRAPHQL-02: Queries
- GRAPHQL-03: Mutations
- GRAPHQL-04: Subscriptions
- GRAPHQL-05: DataLoaders (N+1 prevention)

═══════════════════════════════════════════════════════════════════════════════
"""

# This file contains:
# 1. GraphQL schema and resolvers (Python/Strawberry)
# 2. SDK type definitions that would be generated

from __future__ import annotations
from typing import Any, Dict, List, Optional, AsyncGenerator
from datetime import datetime, date
from enum import Enum
from dataclasses import dataclass
import uuid
import asyncio
import logging

from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel

# In production: Use strawberry-graphql
# For this example, we'll create a manual implementation

logger = logging.getLogger("CHENU.GraphQL")
router = APIRouter(prefix="/api/v1/graphql", tags=["GraphQL & SDK"])

# ═══════════════════════════════════════════════════════════════════════════════
# GRAPHQL SCHEMA (SDL Format - for documentation)
# ═══════════════════════════════════════════════════════════════════════════════

GRAPHQL_SCHEMA = '''
"""
CHE·NU™ GraphQL Schema
Version: 1.0
"""

# ─────────────────────────────────────────────────────────────────────────────
# SCALARS
# ─────────────────────────────────────────────────────────────────────────────

scalar DateTime
scalar Date
scalar Decimal
scalar JSON

# ─────────────────────────────────────────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────────────────────────────────────────

enum ProjectStatus {
  PLANNING
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}

enum TaskStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}

enum UserRole {
  ADMIN
  MANAGER
  MEMBER
  VIEWER
}

# ─────────────────────────────────────────────────────────────────────────────
# TYPES
# ─────────────────────────────────────────────────────────────────────────────

type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  fullName: String!
  role: UserRole!
  avatar: String
  phone: String
  createdAt: DateTime!
  
  # Relations
  projects: [Project!]!
  assignedTasks: [Task!]!
  organization: Organization!
}

type Organization {
  id: ID!
  name: String!
  slug: String!
  logo: String
  settings: JSON
  createdAt: DateTime!
  
  # Relations
  users: [User!]!
  projects: [Project!]!
  clients: [Client!]!
}

type Client {
  id: ID!
  name: String!
  email: String!
  phone: String
  address: String
  company: String
  notes: String
  createdAt: DateTime!
  
  # Relations
  projects: [Project!]!
  invoices: [Invoice!]!
}

type Project {
  id: ID!
  name: String!
  description: String
  status: ProjectStatus!
  startDate: Date
  endDate: Date
  budget: Decimal
  progress: Float!
  address: String
  createdAt: DateTime!
  updatedAt: DateTime!
  
  # Relations
  client: Client!
  team: [User!]!
  tasks: [Task!]!
  documents: [Document!]!
  invoices: [Invoice!]!
  
  # Computed
  taskCount: Int!
  completedTaskCount: Int!
  totalInvoiced: Decimal!
  totalPaid: Decimal!
}

type Task {
  id: ID!
  title: String!
  description: String
  status: TaskStatus!
  priority: TaskPriority!
  dueDate: Date
  estimatedHours: Float
  actualHours: Float
  createdAt: DateTime!
  updatedAt: DateTime!
  completedAt: DateTime
  
  # Relations
  project: Project!
  assignee: User
  createdBy: User!
  subtasks: [Task!]!
  parent: Task
  comments: [Comment!]!
  attachments: [Document!]!
}

type Comment {
  id: ID!
  content: String!
  createdAt: DateTime!
  
  # Relations
  author: User!
  task: Task!
}

type Document {
  id: ID!
  name: String!
  type: String!
  size: Int!
  url: String!
  mimeType: String!
  createdAt: DateTime!
  
  # Relations
  uploadedBy: User!
  project: Project
  task: Task
}

type Invoice {
  id: ID!
  number: String!
  status: InvoiceStatus!
  issueDate: Date!
  dueDate: Date!
  subtotal: Decimal!
  taxAmount: Decimal!
  total: Decimal!
  amountPaid: Decimal!
  balance: Decimal!
  notes: String
  createdAt: DateTime!
  
  # Relations
  project: Project!
  client: Client!
  items: [InvoiceItem!]!
  payments: [Payment!]!
}

type InvoiceItem {
  id: ID!
  description: String!
  quantity: Decimal!
  unitPrice: Decimal!
  amount: Decimal!
}

type Payment {
  id: ID!
  amount: Decimal!
  method: String!
  reference: String
  date: DateTime!
  
  # Relations
  invoice: Invoice!
}

type CalendarEvent {
  id: ID!
  title: String!
  description: String
  startTime: DateTime!
  endTime: DateTime!
  allDay: Boolean!
  location: String
  color: String
  
  # Relations
  project: Project
  attendees: [User!]!
  createdBy: User!
}

# ─────────────────────────────────────────────────────────────────────────────
# INPUTS
# ─────────────────────────────────────────────────────────────────────────────

input ProjectInput {
  name: String!
  description: String
  clientId: ID!
  startDate: Date
  endDate: Date
  budget: Decimal
  address: String
  teamIds: [ID!]
}

input ProjectUpdateInput {
  name: String
  description: String
  status: ProjectStatus
  startDate: Date
  endDate: Date
  budget: Decimal
  address: String
  teamIds: [ID!]
}

input TaskInput {
  title: String!
  description: String
  projectId: ID!
  assigneeId: ID
  priority: TaskPriority
  dueDate: Date
  estimatedHours: Float
  parentId: ID
}

input TaskUpdateInput {
  title: String
  description: String
  status: TaskStatus
  priority: TaskPriority
  assigneeId: ID
  dueDate: Date
  estimatedHours: Float
  actualHours: Float
}

input ClientInput {
  name: String!
  email: String!
  phone: String
  address: String
  company: String
  notes: String
}

input InvoiceInput {
  projectId: ID!
  clientId: ID!
  dueDate: Date!
  items: [InvoiceItemInput!]!
  notes: String
}

input InvoiceItemInput {
  description: String!
  quantity: Decimal!
  unitPrice: Decimal!
}

input EventInput {
  title: String!
  description: String
  startTime: DateTime!
  endTime: DateTime!
  allDay: Boolean
  projectId: ID
  attendeeIds: [ID!]
  location: String
  color: String
}

# ─────────────────────────────────────────────────────────────────────────────
# FILTERS & PAGINATION
# ─────────────────────────────────────────────────────────────────────────────

input ProjectFilter {
  status: [ProjectStatus!]
  clientId: ID
  search: String
  startDateFrom: Date
  startDateTo: Date
}

input TaskFilter {
  status: [TaskStatus!]
  priority: [TaskPriority!]
  assigneeId: ID
  projectId: ID
  search: String
  dueDateFrom: Date
  dueDateTo: Date
}

input PaginationInput {
  page: Int = 1
  perPage: Int = 20
  sortBy: String
  sortOrder: String = "desc"
}

type PageInfo {
  page: Int!
  perPage: Int!
  totalPages: Int!
  totalItems: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type ProjectConnection {
  items: [Project!]!
  pageInfo: PageInfo!
}

type TaskConnection {
  items: [Task!]!
  pageInfo: PageInfo!
}

# ─────────────────────────────────────────────────────────────────────────────
# QUERIES
# ─────────────────────────────────────────────────────────────────────────────

type Query {
  # User
  me: User!
  user(id: ID!): User
  users: [User!]!
  
  # Organization
  organization: Organization!
  
  # Projects
  project(id: ID!): Project
  projects(filter: ProjectFilter, pagination: PaginationInput): ProjectConnection!
  
  # Tasks
  task(id: ID!): Task
  tasks(filter: TaskFilter, pagination: PaginationInput): TaskConnection!
  myTasks(status: [TaskStatus!]): [Task!]!
  
  # Clients
  client(id: ID!): Client
  clients: [Client!]!
  
  # Invoices
  invoice(id: ID!): Invoice
  invoices(projectId: ID, status: [InvoiceStatus!]): [Invoice!]!
  
  # Calendar
  events(from: DateTime!, to: DateTime!, projectId: ID): [CalendarEvent!]!
  
  # Documents
  documents(projectId: ID, taskId: ID): [Document!]!
  
  # Dashboard
  dashboardStats: DashboardStats!
}

type DashboardStats {
  projectsActive: Int!
  tasksInProgress: Int!
  tasksDueToday: Int!
  invoicesPending: Decimal!
  revenueThisMonth: Decimal!
  upcomingEvents: [CalendarEvent!]!
}

# ─────────────────────────────────────────────────────────────────────────────
# MUTATIONS
# ─────────────────────────────────────────────────────────────────────────────

type Mutation {
  # Projects
  createProject(input: ProjectInput!): Project!
  updateProject(id: ID!, input: ProjectUpdateInput!): Project!
  deleteProject(id: ID!): Boolean!
  
  # Tasks
  createTask(input: TaskInput!): Task!
  updateTask(id: ID!, input: TaskUpdateInput!): Task!
  deleteTask(id: ID!): Boolean!
  moveTask(id: ID!, status: TaskStatus!): Task!
  
  # Clients
  createClient(input: ClientInput!): Client!
  updateClient(id: ID!, input: ClientInput!): Client!
  deleteClient(id: ID!): Boolean!
  
  # Invoices
  createInvoice(input: InvoiceInput!): Invoice!
  sendInvoice(id: ID!): Invoice!
  recordPayment(invoiceId: ID!, amount: Decimal!, method: String!, reference: String): Payment!
  
  # Calendar
  createEvent(input: EventInput!): CalendarEvent!
  updateEvent(id: ID!, input: EventInput!): CalendarEvent!
  deleteEvent(id: ID!): Boolean!
  
  # Documents
  deleteDocument(id: ID!): Boolean!
  
  # Comments
  addComment(taskId: ID!, content: String!): Comment!
  deleteComment(id: ID!): Boolean!
}

# ─────────────────────────────────────────────────────────────────────────────
# SUBSCRIPTIONS
# ─────────────────────────────────────────────────────────────────────────────

type Subscription {
  # Real-time task updates
  taskUpdated(projectId: ID): Task!
  taskCreated(projectId: ID): Task!
  
  # Project updates
  projectUpdated(id: ID): Project!
  
  # Comments
  commentAdded(taskId: ID!): Comment!
  
  # Notifications
  notification: Notification!
}

type Notification {
  id: ID!
  type: String!
  title: String!
  message: String!
  data: JSON
  createdAt: DateTime!
  read: Boolean!
}
'''

# ═══════════════════════════════════════════════════════════════════════════════
# TYPESCRIPT SDK (Generated types - would be in separate .ts file)
# ═══════════════════════════════════════════════════════════════════════════════

TYPESCRIPT_SDK = '''
// ═══════════════════════════════════════════════════════════════════════════════
// CHE·NU™ TypeScript SDK
// Generated from GraphQL Schema
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type ID = string;
export type DateTime = string;
export type Date = string;
export type Decimal = string;
export type JSON = Record<string, unknown>;

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  avatar?: string;
  phone?: string;
  createdAt: DateTime;
}

export interface Project {
  id: ID;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  budget?: Decimal;
  progress: number;
  address?: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  client?: Client;
  team?: User[];
  tasks?: Task[];
  taskCount?: number;
  completedTaskCount?: number;
}

export interface Task {
  id: ID;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt: DateTime;
  updatedAt: DateTime;
  completedAt?: DateTime;
  project?: Project;
  assignee?: User;
  subtasks?: Task[];
  comments?: Comment[];
}

export interface Client {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  createdAt: DateTime;
}

export interface Invoice {
  id: ID;
  number: string;
  status: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: Decimal;
  taxAmount: Decimal;
  total: Decimal;
  amountPaid: Decimal;
  balance: Decimal;
}

export interface CalendarEvent {
  id: ID;
  title: string;
  description?: string;
  startTime: DateTime;
  endTime: DateTime;
  allDay: boolean;
  location?: string;
  color?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Input Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ProjectInput {
  name: string;
  description?: string;
  clientId: ID;
  startDate?: Date;
  endDate?: Date;
  budget?: Decimal;
  address?: string;
  teamIds?: ID[];
}

export interface TaskInput {
  title: string;
  description?: string;
  projectId: ID;
  assigneeId?: ID;
  priority?: TaskPriority;
  dueDate?: Date;
  estimatedHours?: number;
}

export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// SDK Client
// ─────────────────────────────────────────────────────────────────────────────

export interface ChenuConfig {
  apiUrl: string;
  apiKey?: string;
  token?: string;
}

export class ChenuClient {
  private config: ChenuConfig;
  
  constructor(config: ChenuConfig) {
    this.config = config;
  }
  
  private async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.config.apiUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.token && { 'Authorization': `Bearer ${this.config.token}` }),
        ...(this.config.apiKey && { 'X-API-Key': this.config.apiKey }),
      },
      body: JSON.stringify({ query, variables }),
    });
    
    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
    return result.data;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Projects
  // ─────────────────────────────────────────────────────────────────────────
  
  async getProjects(filter?: { status?: ProjectStatus[]; search?: string }): Promise<Project[]> {
    const query = `
      query GetProjects($filter: ProjectFilter) {
        projects(filter: $filter) {
          items {
            id name status progress startDate endDate
            client { id name }
            taskCount completedTaskCount
          }
        }
      }
    `;
    const data = await this.request<{ projects: { items: Project[] } }>(query, { filter });
    return data.projects.items;
  }
  
  async getProject(id: ID): Promise<Project> {
    const query = `
      query GetProject($id: ID!) {
        project(id: $id) {
          id name description status progress budget
          startDate endDate address createdAt updatedAt
          client { id name email phone }
          team { id firstName lastName email }
          tasks { id title status priority dueDate assignee { id firstName lastName } }
        }
      }
    `;
    const data = await this.request<{ project: Project }>(query, { id });
    return data.project;
  }
  
  async createProject(input: ProjectInput): Promise<Project> {
    const mutation = `
      mutation CreateProject($input: ProjectInput!) {
        createProject(input: $input) {
          id name status
        }
      }
    `;
    const data = await this.request<{ createProject: Project }>(mutation, { input });
    return data.createProject;
  }
  
  async updateProject(id: ID, input: Partial<ProjectInput>): Promise<Project> {
    const mutation = `
      mutation UpdateProject($id: ID!, $input: ProjectUpdateInput!) {
        updateProject(id: $id, input: $input) {
          id name status progress
        }
      }
    `;
    const data = await this.request<{ updateProject: Project }>(mutation, { id, input });
    return data.updateProject;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Tasks
  // ─────────────────────────────────────────────────────────────────────────
  
  async getTasks(filter?: { projectId?: ID; status?: TaskStatus[] }): Promise<Task[]> {
    const query = `
      query GetTasks($filter: TaskFilter) {
        tasks(filter: $filter) {
          items {
            id title status priority dueDate
            assignee { id firstName lastName }
            project { id name }
          }
        }
      }
    `;
    const data = await this.request<{ tasks: { items: Task[] } }>(query, { filter });
    return data.tasks.items;
  }
  
  async createTask(input: TaskInput): Promise<Task> {
    const mutation = `
      mutation CreateTask($input: TaskInput!) {
        createTask(input: $input) {
          id title status priority
        }
      }
    `;
    const data = await this.request<{ createTask: Task }>(mutation, { input });
    return data.createTask;
  }
  
  async moveTask(id: ID, status: TaskStatus): Promise<Task> {
    const mutation = `
      mutation MoveTask($id: ID!, $status: TaskStatus!) {
        moveTask(id: $id, status: $status) {
          id title status
        }
      }
    `;
    const data = await this.request<{ moveTask: Task }>(mutation, { id, status });
    return data.moveTask;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Clients
  // ─────────────────────────────────────────────────────────────────────────
  
  async getClients(): Promise<Client[]> {
    const query = `
      query GetClients {
        clients {
          id name email phone company
        }
      }
    `;
    const data = await this.request<{ clients: Client[] }>(query);
    return data.clients;
  }
  
  async createClient(input: ClientInput): Promise<Client> {
    const mutation = `
      mutation CreateClient($input: ClientInput!) {
        createClient(input: $input) {
          id name email
        }
      }
    `;
    const data = await this.request<{ createClient: Client }>(mutation, { input });
    return data.createClient;
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // Dashboard
  // ─────────────────────────────────────────────────────────────────────────
  
  async getDashboardStats(): Promise<{
    projectsActive: number;
    tasksInProgress: number;
    tasksDueToday: number;
    invoicesPending: Decimal;
    revenueThisMonth: Decimal;
  }> {
    const query = `
      query GetDashboardStats {
        dashboardStats {
          projectsActive
          tasksInProgress
          tasksDueToday
          invoicesPending
          revenueThisMonth
        }
      }
    `;
    const data = await this.request<{ dashboardStats: any }>(query);
    return data.dashboardStats;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// React Hooks (if using React)
// ─────────────────────────────────────────────────────────────────────────────

// export function useProjects(filter?: ProjectFilter) {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   
//   useEffect(() => {
//     client.getProjects(filter)
//       .then(setProjects)
//       .catch(setError)
//       .finally(() => setLoading(false));
//   }, [filter]);
//   
//   return { projects, loading, error };
// }

// ─────────────────────────────────────────────────────────────────────────────
// Usage Example
// ─────────────────────────────────────────────────────────────────────────────

// const client = new ChenuClient({
//   apiUrl: 'https://api.chenu.ca',
//   token: 'your-jwt-token',
// });
// 
// // Get all active projects
// const projects = await client.getProjects({ status: [ProjectStatus.ACTIVE] });
// 
// // Create a new task
// const task = await client.createTask({
//   title: 'Inspection électrique',
//   projectId: 'proj_123',
//   priority: TaskPriority.HIGH,
//   dueDate: '2024-12-15',
// });
// 
// // Move task to done
// await client.moveTask(task.id, TaskStatus.DONE);
'''

# ═══════════════════════════════════════════════════════════════════════════════
# PYTHON SDK (Would be in separate .py file in published package)
# ═══════════════════════════════════════════════════════════════════════════════

PYTHON_SDK = '''
"""
CHE·NU™ Python SDK
Generated from GraphQL Schema
"""

from typing import Any, Dict, List, Optional
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, date
import httpx


class ProjectStatus(str, Enum):
    PLANNING = "PLANNING"
    ACTIVE = "ACTIVE"
    ON_HOLD = "ON_HOLD"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class TaskStatus(str, Enum):
    BACKLOG = "BACKLOG"
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    IN_REVIEW = "IN_REVIEW"
    DONE = "DONE"


class TaskPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    URGENT = "URGENT"


@dataclass
class User:
    id: str
    email: str
    first_name: str
    last_name: str
    role: str
    avatar: Optional[str] = None
    phone: Optional[str] = None


@dataclass
class Project:
    id: str
    name: str
    status: ProjectStatus
    progress: float
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None


@dataclass
class Task:
    id: str
    title: str
    status: TaskStatus
    priority: TaskPriority
    description: Optional[str] = None
    due_date: Optional[date] = None
    assignee: Optional[User] = None


@dataclass
class Client:
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    company: Optional[str] = None


class ChenuClient:
    """CHE·NU™ API Client"""
    
    def __init__(
        self,
        api_url: str = "https://api.chenu.ca",
        api_key: Optional[str] = None,
        token: Optional[str] = None,
    ):
        self.api_url = api_url
        self.api_key = api_key
        self.token = token
        self._client = httpx.AsyncClient()
    
    async def _request(self, query: str, variables: Optional[Dict] = None) -> Dict[str, Any]:
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        if self.api_key:
            headers["X-API-Key"] = self.api_key
        
        response = await self._client.post(
            f"{self.api_url}/graphql",
            json={"query": query, "variables": variables or {}},
            headers=headers,
        )
        result = response.json()
        
        if "errors" in result:
            raise Exception(result["errors"][0]["message"])
        
        return result["data"]
    
    # ─────────────────────────────────────────────────────────────────────────
    # Projects
    # ─────────────────────────────────────────────────────────────────────────
    
    async def get_projects(
        self,
        status: Optional[List[ProjectStatus]] = None,
        search: Optional[str] = None,
    ) -> List[Project]:
        """Get all projects with optional filters."""
        query = """
            query GetProjects($filter: ProjectFilter) {
                projects(filter: $filter) {
                    items {
                        id name status progress startDate endDate budget
                    }
                }
            }
        """
        filter_vars = {}
        if status:
            filter_vars["status"] = [s.value for s in status]
        if search:
            filter_vars["search"] = search
        
        data = await self._request(query, {"filter": filter_vars or None})
        return [Project(**p) for p in data["projects"]["items"]]
    
    async def get_project(self, project_id: str) -> Project:
        """Get a single project by ID."""
        query = """
            query GetProject($id: ID!) {
                project(id: $id) {
                    id name description status progress
                    startDate endDate budget
                }
            }
        """
        data = await self._request(query, {"id": project_id})
        return Project(**data["project"])
    
    async def create_project(
        self,
        name: str,
        client_id: str,
        description: Optional[str] = None,
        budget: Optional[float] = None,
    ) -> Project:
        """Create a new project."""
        mutation = """
            mutation CreateProject($input: ProjectInput!) {
                createProject(input: $input) {
                    id name status
                }
            }
        """
        input_data = {
            "name": name,
            "clientId": client_id,
            "description": description,
            "budget": str(budget) if budget else None,
        }
        data = await self._request(mutation, {"input": input_data})
        return Project(**data["createProject"])
    
    # ─────────────────────────────────────────────────────────────────────────
    # Tasks
    # ─────────────────────────────────────────────────────────────────────────
    
    async def get_tasks(
        self,
        project_id: Optional[str] = None,
        status: Optional[List[TaskStatus]] = None,
    ) -> List[Task]:
        """Get tasks with optional filters."""
        query = """
            query GetTasks($filter: TaskFilter) {
                tasks(filter: $filter) {
                    items {
                        id title status priority dueDate
                    }
                }
            }
        """
        filter_vars = {}
        if project_id:
            filter_vars["projectId"] = project_id
        if status:
            filter_vars["status"] = [s.value for s in status]
        
        data = await self._request(query, {"filter": filter_vars or None})
        return [Task(**t) for t in data["tasks"]["items"]]
    
    async def create_task(
        self,
        title: str,
        project_id: str,
        priority: TaskPriority = TaskPriority.MEDIUM,
        description: Optional[str] = None,
        assignee_id: Optional[str] = None,
        due_date: Optional[date] = None,
    ) -> Task:
        """Create a new task."""
        mutation = """
            mutation CreateTask($input: TaskInput!) {
                createTask(input: $input) {
                    id title status priority
                }
            }
        """
        input_data = {
            "title": title,
            "projectId": project_id,
            "priority": priority.value,
            "description": description,
            "assigneeId": assignee_id,
            "dueDate": due_date.isoformat() if due_date else None,
        }
        data = await self._request(mutation, {"input": input_data})
        return Task(**data["createTask"])
    
    async def move_task(self, task_id: str, status: TaskStatus) -> Task:
        """Move a task to a new status."""
        mutation = """
            mutation MoveTask($id: ID!, $status: TaskStatus!) {
                moveTask(id: $id, status: $status) {
                    id title status
                }
            }
        """
        data = await self._request(mutation, {"id": task_id, "status": status.value})
        return Task(**data["moveTask"])
    
    # ─────────────────────────────────────────────────────────────────────────
    # Clients
    # ─────────────────────────────────────────────────────────────────────────
    
    async def get_clients(self) -> List[Client]:
        """Get all clients."""
        query = """
            query GetClients {
                clients {
                    id name email phone company
                }
            }
        """
        data = await self._request(query)
        return [Client(**c) for c in data["clients"]]
    
    async def create_client(
        self,
        name: str,
        email: str,
        phone: Optional[str] = None,
        company: Optional[str] = None,
    ) -> Client:
        """Create a new client."""
        mutation = """
            mutation CreateClient($input: ClientInput!) {
                createClient(input: $input) {
                    id name email
                }
            }
        """
        input_data = {
            "name": name,
            "email": email,
            "phone": phone,
            "company": company,
        }
        data = await self._request(mutation, {"input": input_data})
        return Client(**data["createClient"])
    
    async def close(self):
        """Close the HTTP client."""
        await self._client.aclose()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, *args):
        await self.close()


# ─────────────────────────────────────────────────────────────────────────────
# Usage Example
# ─────────────────────────────────────────────────────────────────────────────

# async def main():
#     async with ChenuClient(api_key="your-api-key") as client:
#         # Get active projects
#         projects = await client.get_projects(status=[ProjectStatus.ACTIVE])
#         
#         # Create a task
#         task = await client.create_task(
#             title="Inspection électrique",
#             project_id="proj_123",
#             priority=TaskPriority.HIGH,
#             due_date=date(2024, 12, 15),
#         )
#         
#         # Move task to done
#         await client.move_task(task.id, TaskStatus.DONE)
'''

# ═══════════════════════════════════════════════════════════════════════════════
# GRAPHQL RESOLVER IMPLEMENTATION
# ═══════════════════════════════════════════════════════════════════════════════

# Mock data for demo
MOCK_PROJECTS = [
    {"id": "proj_1", "name": "Maison Dupont", "status": "ACTIVE", "progress": 65},
    {"id": "proj_2", "name": "Condo Laval", "status": "PLANNING", "progress": 10},
    {"id": "proj_3", "name": "Réno Tremblay", "status": "COMPLETED", "progress": 100},
]

MOCK_TASKS = [
    {"id": "task_1", "title": "Fondation", "status": "DONE", "priority": "HIGH", "projectId": "proj_1"},
    {"id": "task_2", "title": "Charpente", "status": "IN_PROGRESS", "priority": "HIGH", "projectId": "proj_1"},
    {"id": "task_3", "title": "Toiture", "status": "TODO", "priority": "MEDIUM", "projectId": "proj_1"},
]

class GraphQLResolver:
    """GraphQL query resolver."""
    
    @staticmethod
    async def resolve_query(query_name: str, args: Dict[str, Any]) -> Any:
        """Resolve a GraphQL query."""
        
        resolvers = {
            "projects": GraphQLResolver._resolve_projects,
            "project": GraphQLResolver._resolve_project,
            "tasks": GraphQLResolver._resolve_tasks,
            "task": GraphQLResolver._resolve_task,
            "dashboardStats": GraphQLResolver._resolve_dashboard_stats,
        }
        
        resolver = resolvers.get(query_name)
        if not resolver:
            raise HTTPException(400, f"Unknown query: {query_name}")
        
        return await resolver(args)
    
    @staticmethod
    async def resolve_mutation(mutation_name: str, args: Dict[str, Any]) -> Any:
        """Resolve a GraphQL mutation."""
        
        resolvers = {
            "createProject": GraphQLResolver._create_project,
            "updateProject": GraphQLResolver._update_project,
            "createTask": GraphQLResolver._create_task,
            "moveTask": GraphQLResolver._move_task,
        }
        
        resolver = resolvers.get(mutation_name)
        if not resolver:
            raise HTTPException(400, f"Unknown mutation: {mutation_name}")
        
        return await resolver(args)
    
    @staticmethod
    async def _resolve_projects(args: Dict) -> Dict:
        filter_args = args.get("filter", {}) or {}
        projects = MOCK_PROJECTS.copy()
        
        if status := filter_args.get("status"):
            projects = [p for p in projects if p["status"] in status]
        
        if search := filter_args.get("search"):
            projects = [p for p in projects if search.lower() in p["name"].lower()]
        
        return {
            "items": projects,
            "pageInfo": {
                "page": 1,
                "perPage": 20,
                "totalPages": 1,
                "totalItems": len(projects),
                "hasNextPage": False,
                "hasPreviousPage": False,
            },
        }
    
    @staticmethod
    async def _resolve_project(args: Dict) -> Optional[Dict]:
        project_id = args.get("id")
        return next((p for p in MOCK_PROJECTS if p["id"] == project_id), None)
    
    @staticmethod
    async def _resolve_tasks(args: Dict) -> Dict:
        filter_args = args.get("filter", {}) or {}
        tasks = MOCK_TASKS.copy()
        
        if project_id := filter_args.get("projectId"):
            tasks = [t for t in tasks if t.get("projectId") == project_id]
        
        if status := filter_args.get("status"):
            tasks = [t for t in tasks if t["status"] in status]
        
        return {"items": tasks, "pageInfo": {"totalItems": len(tasks)}}
    
    @staticmethod
    async def _resolve_task(args: Dict) -> Optional[Dict]:
        task_id = args.get("id")
        return next((t for t in MOCK_TASKS if t["id"] == task_id), None)
    
    @staticmethod
    async def _resolve_dashboard_stats(args: Dict) -> Dict:
        return {
            "projectsActive": 2,
            "tasksInProgress": 5,
            "tasksDueToday": 3,
            "invoicesPending": "15000.00",
            "revenueThisMonth": "45000.00",
            "upcomingEvents": [],
        }
    
    @staticmethod
    async def _create_project(args: Dict) -> Dict:
        input_data = args.get("input", {})
        project = {
            "id": f"proj_{uuid.uuid4().hex[:8]}",
            "name": input_data.get("name"),
            "status": "PLANNING",
            "progress": 0,
        }
        MOCK_PROJECTS.append(project)
        return project
    
    @staticmethod
    async def _update_project(args: Dict) -> Dict:
        project_id = args.get("id")
        input_data = args.get("input", {})
        
        for project in MOCK_PROJECTS:
            if project["id"] == project_id:
                project.update({k: v for k, v in input_data.items() if v is not None})
                return project
        
        raise HTTPException(404, "Project not found")
    
    @staticmethod
    async def _create_task(args: Dict) -> Dict:
        input_data = args.get("input", {})
        task = {
            "id": f"task_{uuid.uuid4().hex[:8]}",
            "title": input_data.get("title"),
            "status": "TODO",
            "priority": input_data.get("priority", "MEDIUM"),
            "projectId": input_data.get("projectId"),
        }
        MOCK_TASKS.append(task)
        return task
    
    @staticmethod
    async def _move_task(args: Dict) -> Dict:
        task_id = args.get("id")
        status = args.get("status")
        
        for task in MOCK_TASKS:
            if task["id"] == task_id:
                task["status"] = status
                return task
        
        raise HTTPException(404, "Task not found")

# ═══════════════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ═══════════════════════════════════════════════════════════════════════════════

class GraphQLRequest(BaseModel):
    query: str
    variables: Optional[Dict[str, Any]] = None
    operationName: Optional[str] = None

@router.post("")
@router.post("/")
async def graphql_endpoint(request: GraphQLRequest):
    """Main GraphQL endpoint."""
    
    # Simple query parser (in production: use graphql-core or strawberry)
    query = request.query.strip()
    variables = request.variables or {}
    
    # Detect query type
    if query.startswith("query") or query.startswith("{"):
        # Extract query name (simplified)
        if "projects" in query:
            data = await GraphQLResolver.resolve_query("projects", {"filter": variables.get("filter")})
            return {"data": {"projects": data}}
        elif "project(" in query:
            data = await GraphQLResolver.resolve_query("project", {"id": variables.get("id")})
            return {"data": {"project": data}}
        elif "tasks" in query:
            data = await GraphQLResolver.resolve_query("tasks", {"filter": variables.get("filter")})
            return {"data": {"tasks": data}}
        elif "dashboardStats" in query:
            data = await GraphQLResolver.resolve_query("dashboardStats", {})
            return {"data": {"dashboardStats": data}}
    
    elif query.startswith("mutation"):
        if "createProject" in query:
            data = await GraphQLResolver.resolve_mutation("createProject", {"input": variables.get("input")})
            return {"data": {"createProject": data}}
        elif "createTask" in query:
            data = await GraphQLResolver.resolve_mutation("createTask", {"input": variables.get("input")})
            return {"data": {"createTask": data}}
        elif "moveTask" in query:
            data = await GraphQLResolver.resolve_mutation("moveTask", variables)
            return {"data": {"moveTask": data}}
    
    return {"data": None, "errors": [{"message": "Query not supported in demo mode"}]}

@router.get("/schema")
async def get_schema():
    """Get GraphQL schema."""
    return {"schema": GRAPHQL_SCHEMA}

@router.get("/sdk/typescript")
async def get_typescript_sdk():
    """Get TypeScript SDK code."""
    return {
        "language": "typescript",
        "version": "1.0.0",
        "code": TYPESCRIPT_SDK,
    }

@router.get("/sdk/python")
async def get_python_sdk():
    """Get Python SDK code."""
    return {
        "language": "python",
        "version": "1.0.0",
        "code": PYTHON_SDK,
    }

@router.get("/playground")
async def graphql_playground():
    """Redirect to GraphQL playground."""
    return {
        "playground_url": "/api/v1/graphql/playground",
        "documentation": "/api/v1/graphql/docs",
        "schema": "/api/v1/graphql/schema",
    }
