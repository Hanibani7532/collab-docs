import test from 'node:test'
import assert from 'node:assert/strict'
import { validateEmail, validateRole, validateTitle } from '../lib/validation'
import { canEdit, canView } from '../lib/permissions'

test('validateTitle falls back to Untitled document when empty', () => {
  assert.equal(validateTitle('   '), 'Untitled document')
  assert.equal(validateTitle(null), 'Untitled document')
  assert.equal(validateTitle('  My Spec  '), 'My Spec')
})

test('validateRole accepts only VIEW and EDIT', () => {
  assert.equal(validateRole('VIEW'), 'VIEW')
  assert.equal(validateRole('EDIT'), 'EDIT')
  assert.equal(validateRole('ADMIN'), null)
})

test('validateEmail normalizes and validates email addresses', () => {
  assert.equal(validateEmail('  Reviewer@Example.com '), 'reviewer@example.com')
  assert.equal(validateEmail('invalid-email'), null)
})

test('RBAC permission helpers enforce view vs edit access', () => {
  assert.equal(canEdit('OWNER'), true)
  assert.equal(canEdit('EDIT'), true)
  assert.equal(canEdit('VIEW'), false)
  assert.equal(canEdit(null), false)

  assert.equal(canView('OWNER'), true)
  assert.equal(canView('EDIT'), true)
  assert.equal(canView('VIEW'), true)
  assert.equal(canView(null), false)
})