import { describe, expect, it } from 'vitest'
import { parseMarkdownCopy } from '../markdown'

describe('parseMarkdownCopy', () => {
  it('parses headings, paragraphs, and inline links', () => {
    expect(parseMarkdownCopy('# About\n\nRead [source](https://example.com) and `token`.\nnext line.')).toEqual([
      { type: 'heading', level: 1, content: [{ type: 'text', text: 'About' }] },
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Read ' },
          { type: 'link', text: 'source', href: 'https://example.com' },
          { type: 'text', text: ' and ' },
          { type: 'code', text: 'token' },
          { type: 'text', text: '. next line.' },
        ],
      },
    ])
  })
})
