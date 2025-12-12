/**
 * CHE·NU LLM Router
 * Routes tasks to LLM with CHE·NU ULTRA PACK system prompt
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

export class LLMRouter {
  constructor(config) {
    this.config = config;
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Load CHE·NU ULTRA PACK system prompt
    const promptPath = config.system_prompt_file || 
      path.join(__dirname, '../system_prompts/chenu_ultra_system_prompt.txt');
    this.systemPrompt = fs.readFileSync(promptPath, 'utf8');
  }

  /**
   * Dispatch a task to the LLM
   */
  async dispatch(task) {
    const model = task.priority === 'high' 
      ? this.config.models?.main || 'gpt-4-turbo'
      : this.config.models?.fast || 'gpt-4o-mini';

    const response = await this.client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: JSON.stringify(task) }
      ],
      temperature: 0.7,
      max_tokens: 4096
    });

    return {
      content: response.choices[0].message.content,
      model_used: model,
      usage: response.usage
    };
  }

  /**
   * Execute with specific agent context
   */
  async executeWithAgent(agentId, task) {
    const agentContext = this.getAgentContext(agentId);
    
    const response = await this.client.chat.completions.create({
      model: this.config.models?.main || 'gpt-4-turbo',
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'system', content: `Active Agent: ${agentId}\n${agentContext}` },
        { role: 'user', content: JSON.stringify(task) }
      ]
    });

    return response.choices[0].message.content;
  }

  getAgentContext(agentId) {
    const contexts = {
      nova_prime: 'Focus on: Intent interpretation, task planning, delegation',
      architect_omega: 'Focus on: Structure, schemas, workflows, DB design',
      thread_weaver: 'Focus on: Timeline, history, temporal coherence',
      echo_mind: 'Focus on: Tone, clarity, emotional neutrality',
      reality_synthesizer: 'Focus on: XR scenes, spatial logic, universe view',
      csf_simulator: 'Focus on: Conceptual simulation, scenarios, branches',
      pxr_engine: 'Focus on: Personas, avatars, group dynamics'
    };
    return contexts[agentId] || '';
  }
}

/**
 * Route task to appropriate agent
 */
export function routeTask(task) {
  if (task.type === 'workflow') return 'architect_omega';
  if (task.type === 'timeline') return 'thread_weaver';
  if (task.type === 'simulation') return 'csf_simulator';
  if (task.type === 'xr') return 'reality_synthesizer';
  if (task.type === 'tone') return 'echo_mind';
  if (task.type === 'persona') return 'pxr_engine';
  return 'nova_prime';
}

export default LLMRouter;
