---
title: "Markdown Syntax: A Quick Reference"
date: "2026-11-12"
tags: ["markdown", "tutorial"]
draft: false
---

A cheat sheet of the Markdown features this blog renders, with live examples.

## Headings & emphasis

# H1 through #### H4 are supported, as are **bold**, *italic*, ~~strikethrough~~ and `inline code`.

## Lists

1. Ordered lists
2. Work great for steps
3. Like this one

- Unordered lists
- Are good for options

## Code blocks

Fenced code blocks get syntax highlighting for dozens of languages:

```python
def fib(n: int) -> int:
    """Return the n-th Fibonacci number."""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])
```

```javascript
const debounce = (fn, ms) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};
```

## Blockquotes

> Simplicity is a great virtue but it requires hard work to achieve it.
> — Edsger W. Dijkstra

## Tables

| Feature      | Supported |
| ------------ | --------- |
| Tables       | ✅        |
| Task lists   | ✅        |
| Footnotes    | ❌        |

## Task lists

- [x] Write the post
- [x] Add syntax highlighting
- [ ] Take a screenshot for the README

## Links & images

![Placeholder](https://via.placeholder.com/600x200?text=Markdown+Blog)

See [the GitHub project](https://github.com/your-org/markdown-blog) for the source code.
