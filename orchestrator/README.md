# CHE·NU Orchestrator

LLM Router with CHE·NU ULTRA PACK system prompt.

## Features

- ULTRA PACK system prompt injection
- Agent-based routing
- Multiplex reasoning (OS 6.0)
- Self-healing (OS 5.5)

## Agents

- Nova Prime
- Architect Omega
- Thread Weaver
- EchoMind
- Reality Synthesizer
- CSF Simulator
- PXR Engine

## Usage

```javascript
import { LLMRouter, routeTask } from './router/LLMRouter.js';

const router = new LLMRouter(config);
const result = await router.dispatch(task);
```
