export function parseMarkdown(text, { title } = {}) {
    if (!text) return '';

    text = text.replace(/\r\n/g, '\n');
    const firstHeading = text.match(/^\s*#\s+([^\n]+)\n?/);
    if (title && firstHeading && firstHeading[1].trim() === title.trim()) {
        text = text.slice(firstHeading[0].length);
    }
    text = renderTables(text);

    // Pre-process text to ensure headers are on their own lines
    // This handles cases where user writes "Previous line\n## Header" without double newline
    let processedText = text
        .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2') // Ensure headers have empty line before
        .replace(/(#{1,6}\s.*)\n([^\n])/g, '$1\n\n$2'); // Ensure headers have empty line after

    // Split by double newlines to identify paragraphs/blocks
    const blocks = processedText.split(/\n\n+/);

    const processedBlocks = blocks.map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';

        // Check if it's already HTML (heuristic)
        if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
            return trimmed;
        }

        // Header 2 (## Title)
        if (trimmed.startsWith('## ')) {
            return `<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800">${parseInline(trimmed.substring(3))}</h2>`;
        }
        // Header 1 (# Title) - though usually title is separate
        if (trimmed.startsWith('# ')) {
            return `<h2 class="text-3xl font-bold mt-8 mb-4 text-gray-900">${parseInline(trimmed.substring(2))}</h2>`;
        }
        // Header 3 (### Title)
        if (trimmed.startsWith('### ')) {
            return `<h3 class="text-xl font-bold mt-6 mb-3 text-gray-800">${parseInline(trimmed.substring(4))}</h3>`;
        }

        // YouTube Embed (standalone link)
        // Matches: https://www.youtube.com/watch?v=ID or https://youtu.be/ID
        const ytMatch = trimmed.match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/);
        if (ytMatch) {
            const videoId = ytMatch[4];
            return `
            <div class="relative w-full pb-[56.25%] h-0 my-8 rounded-lg overflow-hidden shadow-lg">
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    class="absolute top-0 left-0 w-full h-full"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>`;
        }

        // Images: ![alt](url) - Standalone block
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
            const alt = imgMatch[1];
            const src = imgMatch[2];
            return `
            <div class="my-8">
                <img src="${src}" alt="${alt}" class="w-full h-auto rounded-lg shadow-md" />
                ${alt ? `<p class="text-center text-gray-500 text-sm mt-2">${alt}</p>` : ''}
            </div>`;
        }

        // List items (bullet points starting with "- ")
        const lines = trimmed.split('\n');
        if (lines.length > 0 && lines.every(line => line.trim().startsWith('- '))) {
            const items = lines.map(line => `<li class="ml-4">${parseInline(line.trim().substring(2))}</li>`).join('');
            return `<ul class="list-disc pl-5 space-y-2 my-4 text-gray-700">${items}</ul>`;
        }

        // Paragraph (default)
        // Replace single newlines with <br/> for better UX
        return `<p class="mb-4 text-gray-700 leading-relaxed">${parseInline(trimmed).replace(/\n/g, '<br/>')}</p>`;
    });

    return processedBlocks.join('\n');
}

function tableCells(line) {
    return line.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(cell => cell.trim().replace(/\\\|/g, '|'));
}

function renderTables(text) {
    const lines = text.split('\n');
    const result = [];
    for (let i = 0; i < lines.length; i++) {
        const header = tableCells(lines[i]);
        const separator = i + 1 < lines.length ? tableCells(lines[i + 1]) : [];
        if (header.length < 2 || header.length !== separator.length || !separator.every(cell => /^:?-{3,}:?$/.test(cell))) {
            result.push(lines[i]);
            continue;
        }
        const rows = [];
        i += 2;
        while (i < lines.length && lines[i].includes('|') && tableCells(lines[i]).length === header.length) {
            rows.push(tableCells(lines[i]));
            i++;
        }
        i--;
        const alignment = separator.map(cell => cell.startsWith(':') && cell.endsWith(':') ? 'center' : cell.endsWith(':') ? 'right' : 'left');
        const head = header.map((cell, j) => `<th scope="col" style="text-align:${alignment[j]}">${parseInline(cell)}</th>`).join('');
        const body = rows.map(row => `<tr>${row.map((cell, j) => `<td style="text-align:${alignment[j]}">${parseInline(cell)}</td>`).join('')}</tr>`).join('');
        result.push(`\n<div class="markdown-table" role="region" aria-label="Tabela do artigo" tabindex="0"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>\n`);
    }
    return result.join('\n');
}

function parseInline(text) {
    // Images inline: ![alt](url)
    let parsed = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="inline-block max-w-full h-auto rounded-lg shadow-sm" />');

    // Bold: **text**
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Italic: *text*
    parsed = parsed.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // Links: [text](url)
    parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return parsed;
}
