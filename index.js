import Schema from '@deepseek-ai/schemastery';
import { QUADRANTS, createOperations } from './operations.js';

export const Config = Schema.object({
  marks: Schema.dict(Schema.union([...QUADRANTS])).default({}).volatile(),
});
export const inject = ['settings', 'tools'];

export function apply(ctx) {
  ctx.effect(() => ctx.settings.configure({ auto: false }));
  const operations = createOperations(ctx.settings);
  ctx.effect(() => ctx.tools.register({
    name: 'session_quadrant',
    description: 'Read, set, or clear a workspace session color label. Only change labels when the user requests it. The four values are important-urgent (red), important-not-urgent (amber), urgent-not-important (blue), and neither (gray). The UI uses the same durable settings operation. Omit session_id for the current session.',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['get', 'set', 'clear'] },
        session_id: { type: 'string', description: 'Exact session ID; defaults to the requesting session.' },
        quadrant: { type: 'string', enum: [...QUADRANTS], description: 'Required for set.' },
      },
      required: ['action'],
      additionalProperties: false,
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          session_id: { type: 'string' },
          quadrant: { oneOf: [{ type: 'string', enum: [...QUADRANTS] }, { type: 'null' }] },
        },
        required: ['session_id', 'quadrant'],
        additionalProperties: false,
      },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
    },
    isConcurrencySafe: args => args?.action === 'get',
    execute: (args, exec) => operations.execute(args, exec.agent?.id),
  }));
}
