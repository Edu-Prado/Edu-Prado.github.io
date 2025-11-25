export function parseMarkdown(text) {
    if (!text) return '';

    // Split by double newlines to identify paragraphs/blocks
    const blocks = text.split(/\n\n+/);

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
            return `<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">${parseInline(trimmed.substring(2))}</h1>`;
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

function parseInline(text) {
    // Bold: **text**
    let parsed = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Italic: *text*
    parsed = parsed.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // Links: [text](url)
    parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

    return parsed;
}
