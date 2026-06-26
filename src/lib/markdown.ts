/** Inline markdown text segment rendered by Vue instead of raw HTML. */
export type MarkdownInline =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'link'; text: string; href: string }

/** Block-level markdown nodes supported by the about page copy parser. */
export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; content: MarkdownInline[] }
  | { type: 'paragraph'; content: MarkdownInline[] }

/** Parses a small markdown subset for editable page copy. */
export function parseMarkdownCopy(markdown: string): MarkdownBlock[] {
  const blocks: MarkdownBlock[] = []
  let paragraph: string[] = []
  for (const line of markdown.split(/\r?\n/)) {
    const trimmed = line.trim()
    const heading = /^(#{1,3})\s+(.+)$/.exec(trimmed)

    if (!trimmed) {
      flushParagraph(blocks, paragraph)
      paragraph = []
    } else if (heading) {
      flushParagraph(blocks, paragraph)
      paragraph = []
      blocks.push({ type: 'heading', level: heading[1].length as 1 | 2 | 3, content: parseInlineMarkdown(heading[2]) })
    } else {
      paragraph.push(trimmed)
    }
  }

  flushParagraph(blocks, paragraph)
  return blocks
}

function flushParagraph(blocks: MarkdownBlock[], paragraph: string[]): void {
  if (paragraph.length === 0) return
  blocks.push({ type: 'paragraph', content: parseInlineMarkdown(paragraph.join(' ')) })
}

function parseInlineMarkdown(value: string): MarkdownInline[] {
  const parts: MarkdownInline[] = []
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g
  const codePattern = /`([^`]+)`/g
  let i = 0

  while (i < value.length) {
    linkPattern.lastIndex = i
    codePattern.lastIndex = i

    const link = linkPattern.exec(value)
    const code = codePattern.exec(value)
    const match = earliest(link, code)

    if (!match) break
    if (match.index > i) parts.push({ type: 'text', text: value.slice(i, match.index) })

    if (match === link) {
      parts.push({ type: 'link', text: match[1], href: match[2] })
    } else {
      parts.push({ type: 'code', text: match[1] })
    }

    i = match.index + match[0].length
  }

  if (i < value.length) {
    parts.push({ type: 'text', text: value.slice(i) })
  }

  return parts
}

function earliest(first: RegExpExecArray | null, second: RegExpExecArray | null): RegExpExecArray | null {
  if (!first) return second
  if (!second) return first
  return first.index <= second.index ? first : second
}
