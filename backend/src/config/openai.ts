import OpenAI from 'openai';
import { config } from './index';

let client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!client) {
    const baseURL = config.ai.providerUrl.length > 0 ? config.ai.providerUrl : undefined;
    client = new OpenAI({ apiKey: config.ai.apiKey, baseURL });
  }
  return client;
}
