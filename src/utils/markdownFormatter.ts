// src/utils/markdownFormatter.ts

/**
 * Converts markdown text to formatted HTML
 */
export const formatMarkdown = (text: string): string => {
    if (!text) return '';

    let formatted = text;

    // Headers
    formatted = formatted.replace(/^###### (.*$)/gim, '<h6 class="text-sm font-semibold mt-4 mb-2 text-gray-700 dark:text-gray-300">$1</h6>');
    formatted = formatted.replace(/^##### (.*$)/gim, '<h5 class="text-base font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-200">$1</h5>');
    formatted = formatted.replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">$1</h4>');
    formatted = formatted.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-3 text-gray-900 dark:text-gray-100">$1</h3>');
    formatted = formatted.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">$1</h2>');
    formatted = formatted.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">$1</h1>');

    // Bold and Italic
    formatted = formatted.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
    formatted = formatted.replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900 dark:text-gray-100">$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>');

    // Underline
    formatted = formatted.replace(/__(.*?)__/gim, '<u>$1</u>');

    // Strikethrough
    formatted = formatted.replace(/~~(.*?)~~/gim, '<s>$1</s>');

    // Horizontal Rule
    formatted = formatted.replace(/^\-\-\-$/gim, '<hr class="my-6 border-gray-300 dark:border-gray-600">');

    // Lists
    formatted = formatted.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');
    formatted = formatted.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');
    formatted = formatted.replace(/^\+ (.*$)/gim, '<li class="ml-4 list-disc">$1</li>');

    // Numbered lists
    formatted = formatted.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');

    // Wrap lists in ul/ol
    formatted = formatted.replace(/(<li class="ml-4 list-disc">[\\s\\S]*?)(?=\\n\\n|<h|<p|$)/g, '<ul class="my-3 space-y-1">$1</ul>');
    formatted = formatted.replace(/(<li class="ml-4 list-decimal">[\\s\\S]*?)(?=\\n\\n|<h|<p|$)/g, '<ol class="my-3 space-y-1 ml-4">$1</ol>');

    // Blockquotes
    formatted = formatted.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-1 my-3 bg-blue-50 dark:bg-blue-900/20 italic">$1</blockquote>');

    // Code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg my-3 overflow-x-auto border border-gray-200 dark:border-gray-600"><code class="text-sm text-gray-900 dark:text-white">$1</code></pre>');
formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white">$1</code>');
    formatted = formatted.replace(/\[([^\[]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // If URL doesn't start with http://, https://, or /, add https://
        let finalUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/') && !url.startsWith('#')) {
            finalUrl = 'https://' + url;
        }
        return `<a href="${finalUrl}" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    // Images - Add protocol if missing
    formatted = formatted.replace(/!\[([^\[]+)\]\(([^)]+)\)/g, (match, alt, src) => {
        // If image source doesn't start with http://, https://, or /, add https://
        let finalSrc = src;
        if (!src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('/') && !src.startsWith('data:')) {
            finalSrc = 'https://' + src;
        }
        return `<img src="${finalSrc}" alt="${alt}" class="rounded-lg max-w-full h-auto my-3" />`;
    });

    // Line breaks
    formatted = formatted.replace(/\\n/g, '<br>');

    // Paragraphs (handle multiple line breaks)
    formatted = formatted.replace(/(<br>){2,}/g, '</p><p class="my-3">');

    // Wrap everything in paragraphs where needed
    formatted = formatted.replace(/^(?!<[a-z])(.*)$/gim, '<p class="my-3 leading-relaxed">$1</p>');

    return formatted;
};

export const formatMarkdownPreview = (text: string, maxLines: number = 4): string => {
    if (!text) return '';

    let formatted = text.trim();

    // If empty after trimming, return empty string
    if (!formatted) return '';

    // Convert headers to plain text (remove # but keep the text)
    formatted = formatted.replace(/^#{1,6}\s+(.*)$/gim, '$1');

    // Simple bold/italic for preview (keep the content)
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Handle underline and strikethrough
    formatted = formatted.replace(/__(.*?)__/g, '<u>$1</u>');
    formatted = formatted.replace(/~~(.*?)~~/g, '<s>$1</s>');

    // Remove code blocks but show the content
    formatted = formatted.replace(/```([\s\S]*?)```/g, '$1');
    formatted = formatted.replace(/`(.*?)`/g, '$1');

    // Remove images but keep alt text
    formatted = formatted.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');

    // Remove links but keep link text
    formatted = formatted.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Remove horizontal rules
    formatted = formatted.replace(/^---$/gim, '');

    // Handle lists - convert to plain text with bullets
    formatted = formatted.replace(/^[-*+]\s+(.*)$/gim, '• $1');
    formatted = formatted.replace(/^\d+\.\s+(.*)$/gim, '$1');

    // Handle blockquotes
    formatted = formatted.replace(/^>\s+(.*)$/gim, '$1');

    // Split into lines and filter out empty lines
    const lines = formatted.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, maxLines);

    // If all content was stripped (e.g., only markdown syntax), show a fallback message
    if (lines.length === 0) {
        return '<em class="text-gray-400">Formatted content</em>';
    }

    formatted = lines.join('<br>');

    return formatted;
};

/**
 * Check if text contains markdown formatting
 */
export const hasMarkdownFormatting = (text: string): boolean => {
    const markdownPatterns = [
        /^#{1,6}\s/,
        /\*\*.*\*\*/,
        /\*.*\*/,
        /__.*__/,
        /~~.*~~/,
        /^[-*+]\s/,
        /^\d+\.\s/,
        /^>\s/,
        /```/,
        /`.*`/,
        /\[.*\]\(.*\)/,
        /!\[.*\]\(.*\)/,
        /^---$/
    ];

    return markdownPatterns.some(pattern => pattern.test(text));
};