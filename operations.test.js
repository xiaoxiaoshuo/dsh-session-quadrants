import test from 'node:test';
import assert from 'node:assert/strict';
import { QUADRANTS, namespaceOf, createOperations } from './operations.js';

function fixture(marks = {}) {
  let row = { ns: 'include:local-session-quadrants', value: { marks: { ...marks } }, revision: 1 };
  const calls = [];
  const settings = {
    describe: () => [row],
    async mutate(ns, ops, revision) {
      calls.push({ ns, ops, revision });
      const next = { ...row.value.marks };
      for (const op of ops) {
        assert.equal(op.path[0], 'marks');
        if (op.op === 'unset') delete next[op.path[1]];
        else next[op.path[1]] = op.value;
      }
      row = { ...row, value: { marks: next }, revision: row.revision + 1 };
    },
  };
  return { operations: createOperations(settings), settings, calls, row: () => row };
}

test('unmarked sessions are distinct from the gray quadrant', async () => {
  const { operations } = fixture();
  assert.deepEqual(await operations.execute({ action: 'get' }, 'session-a'), { session_id: 'session-a', quadrant: null });
  assert.equal((await operations.execute({ action: 'set', quadrant: 'neither' }, 'session-a')).quadrant, 'neither');
});
test('all four quadrants are stored through the same path-addressed Host operation', async () => {
  const { operations, calls } = fixture();
  for (const quadrant of QUADRANTS) {
    assert.equal((await operations.execute({ action: 'set', session_id: 'session-a', quadrant })).quadrant, quadrant);
    assert.deepEqual(calls.at(-1), { ns: 'include:local-session-quadrants', ops: [{ op: 'set', path: ['marks', 'session-a'], value: quadrant }], revision: undefined });
  }
});
test('edits preserve other sessions and clearing is idempotent', async () => {
  const { operations, row } = fixture({ 'session-b': 'neither' });
  await operations.execute({ action: 'set', quadrant: 'important-urgent' }, 'session-a');
  assert.equal(row().value.marks['session-b'], 'neither');
  await operations.execute({ action: 'clear' }, 'session-a');
  assert.equal((await operations.execute({ action: 'clear' }, 'session-a')).quadrant, null);
  assert.deepEqual(row().value.marks, { 'session-b': 'neither' });
});
test('concurrent changes to different sessions do not replace the whole map', async () => {
  const { operations, row } = fixture();
  await Promise.all([
    operations.execute({ action: 'set', session_id: 'session-a', quadrant: QUADRANTS[0] }),
    operations.execute({ action: 'set', session_id: 'session-b', quadrant: QUADRANTS[1] }),
  ]);
  assert.deepEqual(row().value.marks, { 'session-a': QUADRANTS[0], 'session-b': QUADRANTS[1] });
});
test('invalid inputs cannot write settings', async () => {
  const { operations, calls } = fixture();
  for (const session_id of ['__proto__', 'constructor', 'prototype', '', 'a.b', 'a/b', 'a"{}', null]) {
    await assert.rejects(operations.execute({ action: 'set', session_id, quadrant: QUADRANTS[0] }));
  }
  await assert.rejects(operations.execute({ action: 'set', session_id: 'session-a', quadrant: 'blue' }));
  await assert.rejects(operations.execute({ action: 'oops', session_id: 'session-a' }));
  assert.equal(calls.length, 0);
});
test('read does not write or activate a session', async () => {
  const { operations, calls } = fixture({ 'session-a': QUADRANTS[2] });
  assert.equal((await operations.execute({ action: 'get' }, 'session-a')).quadrant, QUADRANTS[2]);
  assert.equal(calls.length, 0);
});
test('invalid persisted values do not become UI categories', () => {
  const { operations } = fixture({ 'session-a': 'bad' });
  assert.equal(operations.read('session-a').quadrant, null);
});
test('write failures propagate and preserve the previous value', async () => {
  const { settings, row } = fixture({ 'session-a': QUADRANTS[1] });
  settings.mutate = async () => { throw new Error('Disk is read-only'); };
  await assert.rejects(createOperations(settings).execute({ action: 'clear' }, 'session-a'), /Disk is read-only/);
  assert.equal(row().value.marks['session-a'], QUADRANTS[1]);
});
test('missing and ambiguous namespaces fail closed', () => {
  assert.throws(() => namespaceOf([]), /unavailable/);
  assert.throws(() => namespaceOf([{ ns: 'a:local-session-quadrants' }, { ns: 'b:local-session-quadrants' }]), /ambiguous/);
  assert.equal(namespaceOf([{ ns: 'local-session-quadrants' }]).ns, 'local-session-quadrants');
});
test('recreating the operation facade reads persisted settings', async () => {
  const { operations, settings } = fixture();
  await operations.execute({ action: 'set', quadrant: QUADRANTS[1] }, 'session-a');
  assert.equal(createOperations(settings).read('session-a').quadrant, QUADRANTS[1]);
});
