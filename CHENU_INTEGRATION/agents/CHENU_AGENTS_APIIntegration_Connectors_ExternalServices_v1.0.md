# CHE·NU — API INTEGRATION & EXTERNAL CONNECTORS
**VERSION:** INTEGRATIONS.v1.0  
**MODE:** FOUNDATION / CONNECTORS / PRODUCTION

---

## 1) ARCHITECTURE D'INTÉGRATION ⚡

### 1.1 Vue d'Ensemble ⚡

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHE·NU INTEGRATION LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    AGENT LAYER                           │    │
│  │   L0 ─── L1 ─── L2 ─── L3                               │    │
│  └─────────────────────┬───────────────────────────────────┘    │
│                        │                                         │
│  ┌─────────────────────▼───────────────────────────────────┐    │
│  │              API GATEWAY / ORCHESTRATOR                  │    │
│  │   • Rate Limiting  • Auth  • Routing  • Caching         │    │
│  └─────────────────────┬───────────────────────────────────┘    │
│                        │                                         │
│  ┌─────────────────────▼───────────────────────────────────┐    │
│  │                 CONNECTOR LAYER                          │    │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │    │
│  │  │ LLM  │ │ GOV  │ │FINANCE│ │ PROD │ │STORAGE│         │    │
│  │  └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘          │    │
│  └─────┼────────┼────────┼────────┼────────┼───────────────┘    │
│        │        │        │        │        │                     │
│  ┌─────▼────────▼────────▼────────▼────────▼───────────────┐    │
│  │                 EXTERNAL SERVICES                        │    │
│  │  Claude  RBQ  CNESST  QuickBooks  ClickUp  GDrive  ...  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2) CONNECTEURS LLM ⚡

### 2.1 Multi-Provider LLM ⚡

```yaml
llm_connectors:

  providers:
    
    anthropic:
      id: "CONN_LLM_ANTHROPIC"
      name: "Anthropic Claude"
      base_url: "https://api.anthropic.com"
      auth_type: "api_key"
      models:
        - id: "claude-sonnet-4-20250514"
          name: "Claude Sonnet 4"
          context_window: 200000
          max_output: 8192
          cost_input: 0.003  # per 1K tokens
          cost_output: 0.015
          capabilities: ["text", "vision", "tools"]
          recommended_for: ["L0", "L1", "L2"]
          
        - id: "claude-haiku"
          name: "Claude Haiku"
          context_window: 200000
          max_output: 4096
          cost_input: 0.00025
          cost_output: 0.00125
          capabilities: ["text", "tools"]
          recommended_for: ["L3", "simple_tasks"]
          
      rate_limits:
        requests_per_minute: 60
        tokens_per_minute: 100000
        
    openai:
      id: "CONN_LLM_OPENAI"
      name: "OpenAI"
      base_url: "https://api.openai.com/v1"
      auth_type: "api_key"
      models:
        - id: "gpt-4o"
          name: "GPT-4o"
          context_window: 128000
          max_output: 4096
          cost_input: 0.005
          cost_output: 0.015
          capabilities: ["text", "vision", "tools"]
          recommended_for: ["fallback_L1_L2"]
          
        - id: "gpt-4o-mini"
          name: "GPT-4o Mini"
          context_window: 128000
          max_output: 4096
          cost_input: 0.00015
          cost_output: 0.0006
          capabilities: ["text", "tools"]
          recommended_for: ["fallback_L3"]
          
    google:
      id: "CONN_LLM_GOOGLE"
      name: "Google Gemini"
      base_url: "https://generativelanguage.googleapis.com"
      auth_type: "api_key"
      models:
        - id: "gemini-1.5-pro"
          name: "Gemini 1.5 Pro"
          context_window: 1000000
          max_output: 8192
          capabilities: ["text", "vision", "tools"]
          recommended_for: ["long_context_tasks"]
          
    local:
      id: "CONN_LLM_LOCAL"
      name: "Local Ollama"
      base_url: "http://localhost:11434"
      auth_type: "none"
      models:
        - id: "llama-3.1-70b"
          name: "Llama 3.1 70B"
          context_window: 128000
          capabilities: ["text"]
          recommended_for: ["offline", "sensitive_data"]
          cost: 0  # Self-hosted
```

### 2.2 LLM Routing & Fallback ⚡

```yaml
llm_routing:

  strategy: "primary_with_fallback"
  
  routing_rules:
    
    by_level:
      L0:
        primary: "claude-sonnet-4-20250514"
        fallback: ["claude-sonnet-4-20250514"]  # NO fallback to weaker
        local_allowed: false
        
      L1:
        primary: "claude-sonnet-4-20250514"
        fallback: ["gpt-4o", "gemini-1.5-pro"]
        local_allowed: false
        
      L2:
        primary: "claude-sonnet-4-20250514"
        fallback: ["gpt-4o", "claude-haiku"]
        local_allowed: true
        local_model: "llama-3.1-70b"
        
      L3:
        primary: "claude-haiku"
        fallback: ["gpt-4o-mini", "llama-3.1-8b"]
        local_allowed: true
        
    by_task_type:
      code_generation:
        preferred: "claude-sonnet-4-20250514"
        
      document_analysis:
        preferred: "gemini-1.5-pro"  # Long context
        
      simple_classification:
        preferred: "claude-haiku"
        
      offline_required:
        required: "local"
        
  fallback_triggers:
    - "api_error_5xx"
    - "rate_limit_exceeded"
    - "timeout > 30s"
    - "model_unavailable"
    
  fallback_behavior:
    max_retries: 3
    retry_delay: "exponential"
    log_fallback: true
    alert_on_repeated_fallback: true
```

### 2.3 LLM Request Template ⚡

```yaml
llm_request:

  standard_request:
    model: "{{selected_model}}"
    messages:
      - role: "system"
        content: "{{system_prompt_with_context}}"
      - role: "user"
        content: "{{user_message}}"
    temperature: "{{agent_temperature}}"
    max_tokens: "{{agent_max_tokens}}"
    tools: "{{agent_tools}}"
    
  with_memory:
    model: "{{selected_model}}"
    messages:
      - role: "system"
        content: |
          {{system_prompt}}
          
          ## Memory Context
          {{relevant_memory}}
          
          ## User Context
          {{user_context}}
      - role: "user"
        content: "{{user_message}}"
```

---

## 3) CONNECTEURS GOUVERNEMENTAUX QUÉBEC ⚡

### 3.1 RBQ (Régie du Bâtiment) ⚡

```yaml
connector:
  id: "CONN_GOV_RBQ"
  name: "Régie du Bâtiment du Québec"
  type: "government"
  region: "QC"
  
  endpoints:
    
    verify_license:
      url: "https://www.rbq.gouv.qc.ca/services-en-ligne/verification-licence"
      method: "GET"
      auth: "none"  # Public service
      params:
        licence: "string"  # Format: ####-####-##
      response:
        valid: "boolean"
        status: "active|suspended|expired|cancelled"
        holder_name: "string"
        categories: ["string"]
        restrictions: ["string"]
        expiry_date: "date"
      cache:
        enabled: true
        ttl: "24h"
        
    search_license:
      url: "https://www.rbq.gouv.qc.ca/services-en-ligne/recherche"
      method: "GET"
      params:
        name: "string"
        region: "string"
        category: "string"
      response:
        results: [
          {
            licence: "string",
            name: "string",
            categories: ["string"],
            status: "string"
          }
        ]
        
  error_handling:
    on_unavailable: "cache_fallback"
    on_invalid_license: "return_invalid_status"
    
  rate_limit:
    requests_per_minute: 30
    
  agents_using:
    - "L2_PERMITS_SPECIALIST"
    - "L2_SUBCONTRACTOR_MANAGER"
    - "L3_RBQ_VERIFIER"
```

### 3.2 CNESST ⚡

```yaml
connector:
  id: "CONN_GOV_CNESST"
  name: "CNESST"
  type: "government"
  region: "QC"
  
  endpoints:
    
    verify_employer:
      url: "https://www.cnesst.gouv.qc.ca/api/verification"
      method: "GET"
      auth: "api_key"
      params:
        employer_id: "string"
      response:
        valid: "boolean"
        status: "active|suspended"
        contributions_current: "boolean"
        last_payment_date: "date"
        
    get_attestation:
      url: "https://www.cnesst.gouv.qc.ca/api/attestation"
      method: "GET"
      auth: "oauth2"
      params:
        employer_id: "string"
      response:
        attestation_number: "string"
        valid_until: "date"
        pdf_url: "string"
        
    report_accident:
      url: "https://www.cnesst.gouv.qc.ca/api/declaration"
      method: "POST"
      auth: "oauth2"
      body:
        employer_id: "string"
        accident_date: "date"
        description: "string"
        worker_info: "object"
      response:
        declaration_id: "string"
        status: "submitted"
        
  rate_limit:
    requests_per_minute: 20
    
  agents_using:
    - "L2_SAFETY_OFFICER"
    - "L1_CHIEF_CONSTRUCTION"
```

### 3.3 CCQ (Commission de la Construction) ⚡

```yaml
connector:
  id: "CONN_GOV_CCQ"
  name: "Commission de la Construction du Québec"
  type: "government"
  region: "QC"
  
  endpoints:
    
    verify_worker:
      url: "https://www.ccq.org/api/verification"
      method: "GET"
      auth: "api_key"
      params:
        worker_id: "string"
        trade: "string"
      response:
        valid: "boolean"
        certificate_type: "apprenti|compagnon"
        trade: "string"
        region: "string"
        expiry_date: "date"
        
    get_wage_rates:
      url: "https://www.ccq.org/api/salaires"
      method: "GET"
      auth: "api_key"
      params:
        trade: "string"
        region: "string"
        date: "date"
      response:
        base_rate: "number"
        vacation_rate: "number"
        benefits_rate: "number"
        total_rate: "number"
        effective_date: "date"
        
    report_hours:
      url: "https://www.ccq.org/api/heures"
      method: "POST"
      auth: "oauth2"
      body:
        employer_id: "string"
        period: "string"
        workers: [
          {
            worker_id: "string",
            hours: "number",
            trade: "string"
          }
        ]
        
  cache:
    wage_rates:
      enabled: true
      ttl: "7d"
      
  agents_using:
    - "L2_PAYROLL"
    - "L3_LABOR_RATES"
```

---

## 4) CONNECTEURS FINANCE ⚡

### 4.1 QuickBooks ⚡

```yaml
connector:
  id: "CONN_FIN_QUICKBOOKS"
  name: "QuickBooks Online"
  type: "finance"
  
  auth:
    type: "oauth2"
    authorization_url: "https://appcenter.intuit.com/connect/oauth2"
    token_url: "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
    scopes: ["com.intuit.quickbooks.accounting"]
    
  endpoints:
    
    # INVOICES
    create_invoice:
      url: "/v3/company/{realmId}/invoice"
      method: "POST"
      body:
        CustomerRef: { value: "string" }
        Line: [
          {
            Amount: "number",
            Description: "string",
            DetailType: "SalesItemLineDetail",
            SalesItemLineDetail: {
              ItemRef: { value: "string" }
            }
          }
        ]
        DueDate: "date"
      response:
        Invoice: { Id: "string", ... }
        
    get_invoices:
      url: "/v3/company/{realmId}/query"
      method: "GET"
      params:
        query: "SELECT * FROM Invoice WHERE ..."
        
    # CUSTOMERS
    create_customer:
      url: "/v3/company/{realmId}/customer"
      method: "POST"
      
    get_customers:
      url: "/v3/company/{realmId}/query"
      method: "GET"
      
    # EXPENSES
    create_expense:
      url: "/v3/company/{realmId}/purchase"
      method: "POST"
      
    # REPORTS
    get_profit_loss:
      url: "/v3/company/{realmId}/reports/ProfitAndLoss"
      method: "GET"
      params:
        start_date: "date"
        end_date: "date"
        
    get_balance_sheet:
      url: "/v3/company/{realmId}/reports/BalanceSheet"
      method: "GET"
      
  webhooks:
    - event: "invoice.created"
      handler: "on_invoice_created"
    - event: "payment.created"
      handler: "on_payment_received"
      
  rate_limit:
    requests_per_minute: 500
    
  agents_using:
    - "L1_CHIEF_FINANCE"
    - "L2_BOOKKEEPER"
    - "L2_INVOICING"
    - "L3_INVOICE_GENERATOR"
```

### 4.2 Stripe ⚡

```yaml
connector:
  id: "CONN_FIN_STRIPE"
  name: "Stripe"
  type: "payments"
  
  auth:
    type: "api_key"
    header: "Authorization: Bearer {api_key}"
    
  endpoints:
    
    create_payment_intent:
      url: "https://api.stripe.com/v1/payment_intents"
      method: "POST"
      body:
        amount: "integer"  # In cents
        currency: "cad"
        customer: "string"
        
    create_invoice:
      url: "https://api.stripe.com/v1/invoices"
      method: "POST"
      
    get_balance:
      url: "https://api.stripe.com/v1/balance"
      method: "GET"
      
  webhooks:
    - event: "payment_intent.succeeded"
      handler: "on_payment_success"
    - event: "invoice.paid"
      handler: "on_invoice_paid"
    - event: "charge.failed"
      handler: "on_charge_failed"
      
  agents_using:
    - "L2_INVOICING"
    - "L3_PAYMENT_PROCESSOR"
```

---

## 5) CONNECTEURS PRODUCTIVITÉ ⚡

### 5.1 Google Workspace ⚡

```yaml
connector:
  id: "CONN_PROD_GOOGLE"
  name: "Google Workspace"
  type: "productivity"
  
  auth:
    type: "oauth2"
    scopes:
      - "https://www.googleapis.com/auth/drive"
      - "https://www.googleapis.com/auth/calendar"
      - "https://www.googleapis.com/auth/gmail.send"
      - "https://www.googleapis.com/auth/spreadsheets"
      
  services:
    
    drive:
      endpoints:
        list_files:
          url: "https://www.googleapis.com/drive/v3/files"
          method: "GET"
        upload_file:
          url: "https://www.googleapis.com/upload/drive/v3/files"
          method: "POST"
        create_folder:
          url: "https://www.googleapis.com/drive/v3/files"
          method: "POST"
          
    calendar:
      endpoints:
        list_events:
          url: "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events"
          method: "GET"
        create_event:
          url: "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events"
          method: "POST"
          
    gmail:
      endpoints:
        send_email:
          url: "https://www.googleapis.com/gmail/v1/users/me/messages/send"
          method: "POST"
          
    sheets:
      endpoints:
        read_range:
          url: "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}"
          method: "GET"
        write_range:
          url: "https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}"
          method: "PUT"
          
  agents_using:
    - "L2_DOCUMENT_CONTROLLER"
    - "L3_FILE_ORGANIZER"
    - "L3_EMAIL_SENDER"
```

### 5.2 ClickUp ⚡

```yaml
connector:
  id: "CONN_PROD_CLICKUP"
  name: "ClickUp"
  type: "project_management"
  
  auth:
    type: "api_key"
    header: "Authorization: {api_key}"
    
  base_url: "https://api.clickup.com/api/v2"
  
  endpoints:
    
    # TASKS
    create_task:
      url: "/list/{list_id}/task"
      method: "POST"
      body:
        name: "string"
        description: "string"
        assignees: ["integer"]
        due_date: "timestamp"
        priority: "1|2|3|4"
        
    get_tasks:
      url: "/list/{list_id}/task"
      method: "GET"
      
    update_task:
      url: "/task/{task_id}"
      method: "PUT"
      
    # TIME TRACKING
    start_timer:
      url: "/task/{task_id}/time"
      method: "POST"
      
    get_time_entries:
      url: "/team/{team_id}/time_entries"
      method: "GET"
      
    # COMMENTS
    add_comment:
      url: "/task/{task_id}/comment"
      method: "POST"
      
  webhooks:
    - event: "taskCreated"
    - event: "taskUpdated"
    - event: "taskDeleted"
    - event: "taskTimeTrackedUpdated"
    
  agents_using:
    - "L1_CHIEF_OPERATIONS"
    - "L2_PROJECT_MANAGER"
    - "L3_TASK_CREATOR"
```

---

## 6) CONNECTEURS CONSTRUCTION SPÉCIALISÉS ⚡

### 6.1 Material Pricing API ⚡

```yaml
connector:
  id: "CONN_CONST_PRICING"
  name: "Construction Material Pricing"
  type: "construction"
  
  sources:
    
    rs_means:
      name: "RSMeans Data"
      url: "https://api.rsmeans.com"
      auth: "api_key"
      data_types:
        - labor_rates
        - material_costs
        - equipment_rates
      regions: ["Quebec", "Montreal", "Quebec_City"]
      
    supplier_direct:
      name: "Direct Supplier APIs"
      suppliers:
        - name: "BMR"
          type: "manual_import"
        - name: "Canac"
          type: "manual_import"
        - name: "Patrick Morin"
          type: "manual_import"
          
  endpoints:
    
    get_material_price:
      params:
        material_code: "string"
        quantity: "number"
        region: "string"
      response:
        unit_price: "number"
        unit: "string"
        supplier: "string"
        valid_until: "date"
        
    get_labor_rate:
      params:
        trade: "string"
        region: "string"
      response:
        hourly_rate: "number"
        burden_rate: "number"
        total_rate: "number"
        source: "ccq|rsmeans"
        
  cache:
    enabled: true
    ttl: "7d"
    refresh: "weekly"
    
  agents_using:
    - "L2_ESTIMATOR"
    - "L3_PRICING_MATERIALS"
    - "L3_PRICING_LABOR"
```

### 6.2 Plan Reading / BIM ⚡

```yaml
connector:
  id: "CONN_CONST_BIM"
  name: "BIM & Plan Reading"
  type: "construction"
  
  services:
    
    autodesk_forge:
      name: "Autodesk Forge"
      url: "https://developer.api.autodesk.com"
      auth: "oauth2"
      capabilities:
        - model_viewing
        - data_extraction
        - clash_detection
        
    bluebeam:
      name: "Bluebeam Studio"
      capabilities:
        - markup_collaboration
        - measurement_extraction
        
  endpoints:
    
    extract_quantities:
      description: "Extract quantities from BIM model"
      params:
        model_urn: "string"
        category: "string"  # walls, floors, doors, etc.
      response:
        items: [
          {
            element_id: "string",
            category: "string",
            quantity: "number",
            unit: "string",
            properties: "object"
          }
        ]
        
    detect_clashes:
      description: "Run clash detection"
      params:
        model_urn: "string"
        disciplines: ["string"]
      response:
        clashes: [
          {
            id: "string",
            element_a: "string",
            element_b: "string",
            location: "object",
            severity: "string"
          }
        ]
        
  agents_using:
    - "L2_BIM_SPECIALIST"
    - "L3_TAKEOFF_*"
```

---

## 7) GESTION DES CONNEXIONS ⚡

### 7.1 Connection Pool ⚡

```yaml
connection_pool:

  config:
    max_connections_per_service: 10
    connection_timeout: 30s
    idle_timeout: 60s
    max_retries: 3
    
  health_check:
    interval: 60s
    timeout: 5s
    unhealthy_threshold: 3
    healthy_threshold: 2
    
  circuit_breaker:
    enabled: true
    failure_threshold: 5
    reset_timeout: 60s
```

### 7.2 Rate Limiting ⚡

```yaml
rate_limiting:

  global:
    requests_per_second: 100
    burst: 200
    
  per_connector:
    inherit_global: true
    override_allowed: true
    
  per_user:
    enabled: true
    default_limit: 60/min
    premium_limit: 300/min
    
  strategies:
    sliding_window:
      window_size: 60s
      precision: 1s
      
    token_bucket:
      capacity: 100
      refill_rate: 10/s
      
  on_limit_exceeded:
    action: "queue_or_reject"
    queue_timeout: 30s
    response_code: 429
    retry_after_header: true
```

### 7.3 Caching ⚡

```yaml
caching:

  layers:
    
    l1_memory:
      type: "in_memory"
      max_size: "100MB"
      ttl_default: "5m"
      
    l2_redis:
      type: "redis"
      connection: "redis://localhost:6379"
      ttl_default: "1h"
      
  strategies:
    
    by_data_type:
      static_reference:
        ttl: "24h"
        examples: ["rbq_categories", "ccq_regions"]
        
      semi_static:
        ttl: "1h"
        examples: ["labor_rates", "exchange_rates"]
        
      dynamic:
        ttl: "5m"
        examples: ["license_status", "project_status"]
        
      no_cache:
        examples: ["payments", "time_entries"]
        
  invalidation:
    on_webhook: true
    on_write: true
    manual: true
```

---

## 8) SÉCURITÉ DES INTÉGRATIONS ⚡

### 8.1 Credentials Management ⚡

```yaml
credentials:

  storage:
    type: "vault"
    provider: "hashicorp_vault"
    encryption: "aes256"
    
  rotation:
    api_keys:
      frequency: "90d"
      auto_rotate: true
      
    oauth_tokens:
      refresh_before_expiry: "5m"
      
  access_control:
    by_agent_level:
      L0: ["all_credentials"]
      L1: ["department_credentials"]
      L2: ["assigned_service_credentials"]
      L3: ["minimal_credentials"]
      
  audit:
    log_access: true
    log_usage: true
    alert_on_anomaly: true
```

### 8.2 Data Security ⚡

```yaml
data_security:

  in_transit:
    protocol: "TLS 1.3"
    certificate_validation: true
    
  at_rest:
    encryption: "AES-256-GCM"
    key_management: "vault"
    
  pii_handling:
    detection: true
    masking: true
    logging: "masked_only"
    
  data_residency:
    requirement: "Canada"
    verification: true
```

---

## 9) MONITORING INTÉGRATIONS ⚡

```yaml
integration_monitoring:

  metrics:
    - "request_count_by_connector"
    - "request_latency_by_connector"
    - "error_rate_by_connector"
    - "cache_hit_rate"
    - "rate_limit_hits"
    
  alerts:
    - name: "Connector Down"
      condition: "health_check_failed"
      severity: "high"
      
    - name: "High Error Rate"
      condition: "error_rate > 5%"
      severity: "medium"
      
    - name: "Rate Limit Warning"
      condition: "rate_limit_usage > 80%"
      severity: "low"
      
  dashboard:
    widgets:
      - connector_status_grid
      - request_volume_chart
      - latency_heatmap
      - error_breakdown
```

---

**END — API INTEGRATION & EXTERNAL CONNECTORS v1.0**
