export const ROW_ID = 'local-session-quadrants';
export const QUADRANTS = Object.freeze(['important-urgent', 'important-not-urgent', 'urgent-not-important', 'neither']);
export const SESSION_ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function validateSessionId(value) {
  if (typeof value !== 'string' || !SESSION_ID.test(value) || UNSAFE_KEYS.has(value)) {
    throw new TypeError('A valid session_id is required.');
  }
  return value;
}

export function namespaceOf(rows) {
  const matches = rows.filter(row => row.ns === ROW_ID || row.ns.endsWith(':' + ROW_ID));
  if (matches.length !== 1) throw new Error('Session quadrant settings are unavailable or ambiguous.');
  return matches[0];
}

/** Both the UI and tool use settings.mutate: one Host-owned, path-addressed write. */
export function createOperations(settings) {
  function read(sessionId) {
    validateSessionId(sessionId);
    const row = namespaceOf(settings.describe());
    const raw = Object.hasOwn(row.value?.marks ?? {}, sessionId) ? row.value.marks[sessionId] : null;
    return { session_id: sessionId, quadrant: QUADRANTS.includes(raw) ? raw : null };
  }
  async function execute(args, defaultSessionId) {
    if (!args || typeof args !== 'object' || !['get', 'set', 'clear'].includes(args.action)) {
      throw new TypeError('action must be get, set, or clear.');
    }
    const sessionId = validateSessionId(args.session_id ?? defaultSessionId);
    if (args.action === 'get') return read(sessionId);
    if (args.action === 'set' && !QUADRANTS.includes(args.quadrant)) {
      throw new TypeError('quadrant must be one of the four supported values.');
    }
    const row = namespaceOf(settings.describe());
    const path = ['marks', sessionId];
    const op = args.action === 'clear' ? { op: 'unset', path } : { op: 'set', path, value: args.quadrant };
    // Path updates merge against the stored document, preserving other sessions' marks.
    await settings.mutate(row.ns, [op], undefined);
    return read(sessionId);
  }
  return { read, execute };
}
