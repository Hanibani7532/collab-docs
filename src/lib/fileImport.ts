import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

export function sanitizeHtml(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'a'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })
}

export async function parseUploadedFile(filename: string, rawText: string): Promise<{ title: string; content: string }> {
  const cleanTitle = filename.replace(/\.(md|txt)$/i, '').trim() || 'Imported Document'
  const isMarkdown = filename.toLowerCase().endsWith('.md')

  let htmlContent = ''
  if (isMarkdown) {
    const parsed = await marked.parse(rawText)
    htmlContent = sanitizeHtml(parsed)
  } else {
    const paragraphs = rawText
      .split(/\r?\n\r?\n/)
      .map((para) => `<p>${para.replace(/\r?\n/g, '<br/>')}</p>`)
      .join('')
    htmlContent = sanitizeHtml(paragraphs || '<p></p>')
  }

  return {
    title: cleanTitle,
    content: htmlContent,
  }
}