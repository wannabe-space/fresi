import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
// import { xai } from '@ai-sdk/xai'

// https://sdk.vercel.ai/docs/foundations/providers-and-models#model-capabilities
export const models = {
  // https://sdk.vercel.ai/docs/ai-sdk-core/embeddings#embedding-providers--models
  embedding: openai.embedding('text-embedding-3-small'),
  answer: {
    // for docs we should use AI with huge context window due to the size of the docs
    docs: anthropic('claude-3-5-sonnet-latest'),
    // noDocs: xai('grok-beta'),
    noDocs: anthropic('claude-3-5-sonnet-latest'),
  },
  sources: google('gemini-1.5-flash-latest'),
  question: google('gemini-1.5-pro-latest'),
  title: google('gemini-1.5-pro-latest'),
}
