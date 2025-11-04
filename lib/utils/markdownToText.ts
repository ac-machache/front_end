/**
 * Converts markdown text to plain text, removing markdown syntax
 */
export function markdownToText(markdown: string): string {
  if (!markdown) return '';
  
  let text = markdown;
  
  // Remove any placeholder text that might exist
  text = text.replace(/PLACEHOLDER\d+/gi, '');
  
  // Remove code blocks (multiline)
  text = text.replace(/```[\s\S]*?```/g, '');
  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove images but keep alt text
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1');
  
  // Remove links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
  
  // Remove bold+italic markers (handle triple asterisks first)
  text = text.replace(/\*\*\*([^*]+?)\*\*\*/g, '$1');
  // Remove bold markers (double asterisks)
  text = text.replace(/\*\*([^*]+?)\*\*/g, '$1');
  // Remove italic markers (single asterisks) - but not if part of list
  text = text.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '$1');
  
  // Remove underscore formatting
  text = text.replace(/___([^_]+?)___/g, '$1'); // bold+italic underscore
  text = text.replace(/__([^_]+?)__/g, '$1'); // bold underscore
  text = text.replace(/(?<!_)_([^_\n]+?)_(?!_)/g, '$1'); // italic underscore
  
  // Remove headers but keep text
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1');
  
  // Convert unordered list items to bullet points
  text = text.replace(/^[\*\-\+]\s+(.+)$/gm, '• $1');
  
  // Convert ordered list items (remove numbers)
  text = text.replace(/^\d+\.\s+(.+)$/gm, '$1');
  
  // Remove horizontal rules
  text = text.replace(/^---+$/gm, '');
  text = text.replace(/^\*\*\*+$/gm, '');
  
  // Remove blockquotes
  text = text.replace(/^>\s+(.+)$/gm, '$1');
  
  // Clean up multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n');
  
  // Remove any remaining standalone markdown characters
  text = text.replace(/\*\*/g, '');
  text = text.replace(/(?<!\*)\*(?!\*)/g, '');
  
  // Remove any remaining placeholder text (in case it was added during processing)
  text = text.replace(/PLACEHOLDER\d+/gi, '');
  
  // Trim whitespace
  text = text.trim();
  
  return text;
}

/**
 * Converts markdown to structured format for PDF rendering
 * Returns an array of text segments with formatting hints
 */
export interface TextSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export function markdownToSegments(markdown: string): TextSegment[] {
  if (!markdown) return [];
  
  // First, clean up any literal placeholder text that might exist in the markdown
  // This prevents placeholders from appearing in the final output
  let text = markdown.replace(/PLACEHOLDER\d+/gi, '');
  
  const segments: TextSegment[] = [];
  const replacements: Map<string, TextSegment> = new Map();
  let placeholderIndex = 0;
  
  // Generate a unique placeholder prefix that won't conflict with actual text
  const PLACEHOLDER_PREFIX = `\u0001PLACEHOLDER_${Date.now()}_`;
  
  // Handle bold+italic first (***text***) - must be triple asterisks
  text = text.replace(/\*\*\*([^*]+?)\*\*\*/g, (match, content) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex}\u0001`;
    replacements.set(placeholder, { text: content.trim(), bold: true, italic: true });
    placeholderIndex++;
    return placeholder;
  });
  
  // Handle bold (**text**) - double asterisks
  text = text.replace(/\*\*([^*]+?)\*\*/g, (match, content) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex}\u0001`;
    replacements.set(placeholder, { text: content.trim(), bold: true });
    placeholderIndex++;
    return placeholder;
  });
  
  // Handle italic (*text*) - single asterisks, but not if it's part of a list marker
  text = text.replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, (match, before, content, after) => {
    // Skip if it looks like a list item or other markdown structure
    if (content.trim().match(/^\d+\./) || content.trim().startsWith('-') || content.trim().startsWith('+')) {
      return match;
    }
    const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex}\u0001`;
    replacements.set(placeholder, { text: content.trim(), italic: true });
    placeholderIndex++;
    return before + placeholder + after;
  });
  
  // Handle underscore formatting
  text = text.replace(/___([^_]+?)___/g, (match, content) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex}\u0001`;
    replacements.set(placeholder, { text: content.trim(), bold: true, italic: true });
    placeholderIndex++;
    return placeholder;
  });
  
  text = text.replace(/__([^_]+?)__/g, (match, content) => {
    const placeholder = `${PLACEHOLDER_PREFIX}${placeholderIndex}\u0001`;
    replacements.set(placeholder, { text: content.trim(), bold: true });
    placeholderIndex++;
    return placeholder;
  });
  
  // Remove any remaining markdown syntax that wasn't caught by placeholders
  // This ensures no ** or * characters are left behind
  text = text.replace(/\*\*\*/g, '');
  text = text.replace(/\*\*/g, '');
  text = text.replace(/(?<!\*)\*(?!\*)/g, '');
  text = text.replace(/___/g, '');
  text = text.replace(/__/g, '');
  text = text.replace(/(?<!_)_(?!_)/g, '');
  
  // Split by placeholders using the unique prefix
  const placeholderRegex = new RegExp(`(${PLACEHOLDER_PREFIX}\\d+\u0001)`, 'g');
  const parts = text.split(placeholderRegex);
  
  for (const part of parts) {
    if (!part) continue;
    
    if (part.startsWith(PLACEHOLDER_PREFIX) && part.endsWith('\u0001')) {
      const replacement = replacements.get(part);
      if (replacement) {
        segments.push(replacement);
      }
      // If placeholder not found, skip it - don't add placeholder text to output
    } else {
      // This is plain text - clean it further and add it
      // Remove any remaining placeholder-like text
      const cleaned = part.replace(/PLACEHOLDER\d+/gi, '').trim();
      if (cleaned) {
        segments.push({ text: cleaned });
      }
    }
  }
  
  // If no segments were created, fall back to plain text conversion
  if (segments.length === 0) {
    const cleaned = markdownToText(markdown);
    if (cleaned) {
      segments.push({ text: cleaned });
    }
  }
  
  // Merge adjacent plain text segments to avoid fragmentation
  const mergedSegments: TextSegment[] = [];
  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    const last = mergedSegments[mergedSegments.length - 1];
    
    if (last && !last.bold && !last.italic && !current.bold && !current.italic) {
      // Merge consecutive plain text segments
      last.text += (last.text && !last.text.endsWith(' ') ? ' ' : '') + current.text;
    } else {
      mergedSegments.push({ ...current });
    }
  }
  
  return mergedSegments.length > 0 ? mergedSegments : segments;
}

