import { Marked } from "marked";
import hljs from "highlight.js";

/** Markdown -> safe HTML with syntax-highlighted code blocks. */

const renderer = {
  code(code: string, infostring: string | undefined): string {
    const lang = (infostring || "").split(/\s+/)[0];
    let highlighted: string;
    let language = "";
    if (lang && hljs.getLanguage(lang)) {
      highlighted = hljs.highlight(code, { language: lang }).value;
      language = lang;
    } else {
      highlighted = hljs.highlightAuto(code).value;
    }
    const cls = language ? ` class="hljs language-${language}"` : ' class="hljs"';
    return `<pre><code${cls}>${highlighted}</code></pre>`;
  },
};

const marked = new Marked({ renderer, gfm: true, breaks: false });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
