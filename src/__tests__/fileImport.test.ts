import test from 'node:test'
import assert from 'node:assert/strict'
import { parseUploadedFile, sanitizeHtml } from '../lib/fileImport'

test('sanitizeHtml strips malicious script tags and event handlers', () => {
  const dirty = '<p onclick="alert(1)">Hello</p><script>evil()</script><strong>World</strong>'
  const clean = sanitizeHtml(dirty)
  assert.equal(clean.includes('<script>'), false)
  assert.equal(clean.includes('onclick'), false)
  assert.equal(clean.includes('<strong>World</strong>'), true)
})

test('parseUploadedFile converts Markdown (.md) to sanitized HTML and extracts title', async () => {
  const md = '# Project Plan\n\nThis is **important** text.'
  const result = await parseUploadedFile('project-plan.md', md)
  assert.equal(result.title, 'project-plan')
  assert.equal(result.content.includes('<h1>Project Plan</h1>'), true)
  assert.equal(result.content.includes('<strong>important</strong>'), true)
})

test('parseUploadedFile converts Plain Text (.txt) paragraphs into HTML', async () => {
  const txt = 'First paragraph\nline two\n\nSecond paragraph'
  const result = await parseUploadedFile('notes.txt', txt)
  assert.equal(result.title, 'notes')
  assert.equal(result.content.includes('<p>First paragraph<br>line two</p>'), true)
  assert.equal(result.content.includes('<p>Second paragraph</p>'), true)
})