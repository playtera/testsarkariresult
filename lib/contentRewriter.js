export async function rewriteContent(originalTitle, sourceHtml) {
    const p = `You are an expert SEO content rewriter.
    STRICT RULES:
    1. SITE BRAND: SarkariResultCorner.com (REPLACE all other site names).
    2. TONE: Human-written, professional guide style. 
    3. EXTREME UNIQUENESS & ZERO PLAGIARISM (CRITICAL): 
       - You MUST completely change the sentence structures. Explain the details from scratch using entirely different vocabulary.
       - You MUST NOT use common AI boilerplate phrases. BAN the following phrases from your output: "delve into", "comprehensive guide", "Unlock Opportunities", "fantastic chance", "stable and rewarding career", "in this article, we will explore", "crucial deadlines", "significant recruitment opportunity".
       - Write in a direct, highly specific, journalistic news style. Avoid generic filler words.
       - Your output must pass plagiarism checkers with 100% Unique score.
    4. TITLE: Completely rephrase the title to be catchy and highly unique. Never use "A Comprehensive Guide" or "Unlock Opportunities".
    5. STRUCTURE: Use H2, H3 tags for headings.
       - IMPORTANT FOR DESIGN: You MUST preserve all original HTML tables EXACTLY as they are. However, you MUST WRAP every table in a semantic div class based on its content topic. 
         Examples: Application Fee table -> <div class="table-fee">...</div>, Important Dates -> <div class="table-dates">...</div>, Vacancy Details -> <div class="table-vacancy">...</div>, Important Links -> <div class="table-links">...</div>. For any other topic, use a sensible name like <div class="table-[topic]">...</div>.
       - IMPORTANT FOR DESIGN: You MUST preserve the original list structure (<ul>/<li>) but WRAP all lists in a semantic div class based on its topic. Examples: Eligibility criteria -> <div class="list-eligibility">...</div>, Document requirements -> <div class="list-documents">...</div>.
       - Do NOT use Markdown (**) for formatting any elements. Return pure HTML inside the xml tags.
    6. Content: Expand creatively on the details to ensure 1200+ words. Naturally include Keywords "${originalTitle}", "Sarkari Result".
    
    You MUST return the output EXACTLY in this format, with NO Markdown wrappers like \`\`\`html:
    <rewritten_title>
    [Your new title here]
    </rewritten_title>
    <rewritten_html>
    [Your new html here]
    </rewritten_html>
    
    Original Title: ${originalTitle}
    Source HTML: ${sourceHtml}
    `;

    const models = ["gemini-3.1-flash-lite", "gemini-3.0-flash", "gemini-3-flash", "gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash-lite-preview-02-05", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
    for (const m of models) {
        try {
            const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
            });
            const data = await aiRes.json();
            if (data.error) {
                console.error(`[AI ERROR ${m}]: ${data.error.message}`);
                continue;
            }
            let textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            
            // Clean up possible markdown fences natively
            textOutput = textOutput.replace(/```html/gi, '').replace(/```/gi, '').trim();
            
            let title = originalTitle;
            const titleMatch = textOutput.match(/<rewritten_title>([\s\S]*?)<\/rewritten_title>/i);
            if (titleMatch) {
                title = titleMatch[1].trim();
            }

            let html = "";
            const htmlMatch = textOutput.match(/<rewritten_html>([\s\S]*?)(?:<\/rewritten_html>|$)/i);
            if (htmlMatch) {
                html = htmlMatch[1].trim();
            } else if (textOutput.length > 500 && !textOutput.trim().startsWith('{')) {
                // If tag is completely missing but we have text, strip title block and use rest
                html = textOutput.replace(/<rewritten_title>[\s\S]*?<\/rewritten_title>/gi, '').trim();
                html = html.replace(/<rewritten_html>|<\/rewritten_html>/gi, '').trim();
            }

            if (html.length > 0) {
                html = html.replace(/### (.*?)(\n|$)/g, '<h2>$1</h2>');
                html = html.replace(/\*\* (.*?)(\n|$)/g, '<h3>$1</h3>');
                html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                return { html, title };
            }
        } catch (e) {
            console.error("AI Model error in rewriteContent:", e);
        }
    }

    if (process.env.GROQ_API_KEY) {
        try {
            console.log("[AI] Falling back to Groq Llama 3...");
            const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "system", content: p }],
                    temperature: 0.7
                })
            });
            const groqData = await groqRes.json();
            if (groqData.error) {
                console.error("[AI ERROR Groq]:", groqData.error.message);
            } else {
                let textOutput = groqData.choices?.[0]?.message?.content || "";
                textOutput = textOutput.replace(/```html/gi, '').replace(/```/gi, '').trim();
                
                let title = originalTitle;
                const titleMatch = textOutput.match(/<rewritten_title>([\s\S]*?)<\/rewritten_title>/i);
                if (titleMatch) title = titleMatch[1].trim();

                let html = "";
                const htmlMatch = textOutput.match(/<rewritten_html>([\s\S]*?)(?:<\/rewritten_html>|$)/i);
                if (htmlMatch) {
                    html = htmlMatch[1].trim();
                } else if (textOutput.length > 500 && !textOutput.trim().startsWith('{')) {
                    html = textOutput.replace(/<rewritten_title>[\s\S]*?<\/rewritten_title>/gi, '').trim();
                    html = html.replace(/<rewritten_html>|<\/rewritten_html>/gi, '').trim();
                }

                if (html.length > 0) {
                    html = html.replace(/### (.*?)(\n|$)/g, '<h2>$1</h2>');
                    html = html.replace(/\*\* (.*?)(\n|$)/g, '<h3>$1</h3>');
                    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    return { html, title };
                }
            }
        } catch (e) {
            console.error("Groq Model error in rewriteContent:", e);
        }
    }

    return null;
}
