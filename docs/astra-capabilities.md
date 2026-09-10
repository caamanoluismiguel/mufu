# Astra: Capabilities Applied to MUFU

Checked against official OpenAI documentation during this redesign.

## Model capabilities

GPT-6 Astra is designed for complex reasoning, software engineering, research,
computer use, science and professional document work. It accepts text and image
input and produces text, including code and structured data. Its API context
window is 1,050,000 tokens, with up to 128,000 output tokens. Reasoning effort
supports low, medium, high, xhigh and max.

Supported features include streaming, function calling and structured outputs.
Through the Responses API, supported tools include web search, file search,
image generation, code interpreter, hosted shell, apply patch, skills, computer
use, MCP and tool search. Fine-tuning is not supported. These are model/API
capabilities; actual tool availability depends on the application and account.
Image generation is a tool capability, not a claim that ordinary text output
is a generated image.

Source: [GPT-6 Astra model](https://developers.openai.com/api/docs/models/gpt-6-astra).

## Workflow capabilities

The API supports asynchronous tool calls, instructions arriving during a task,
and changing reasoning effort during a conversation while preserving cache.
Other supported capabilities include programmatic tool calling, multi-agent
orchestration, prompt caching, persisted reasoning, compaction and pro mode.
It does not support the `none` reasoning setting. These features do not imply
that every task automatically uses every feature or that model output is
error-free.

Source: [Official capability guide](https://developers.openai.com/api/docs/guides/latest-model).

## This redesign

- Read the site's source, content model, historical records and interactions.
- Captured 1,306 written passages before changing the presentation.
- Built a coherent visual system across 20 HTML pages.
- Added a shared museum index and accessible image zoom, panning and downloads.
- Preserved the supplied hero image, original object photos, dates and sources.
- Reviewed desktop and mobile screenshots and refined the result.
- Tested content retention, original image integrity, filters, keyboard focus,
  responsive layouts, reduced motion, offline assets and no-JavaScript reading.
- Published through the existing GitHub Pages workflow.

The improvement loop is bounded to the requested work: inspect, implement,
validate and refine. No unattended process rewrites the museum or invents new
historical claims. This document records capabilities and work performed; it
does not assert that the selected model was changed by the agent.
