<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## TypeScript & Recharts Notes
- **Recharts Tooltip formatter**: When using `<Tooltip formatter={(value) => ...} />` in Recharts, `value` type can be `ValueType | undefined` (or `number | string | undefined`). DO NOT explicitly type it as `(value: number)`, as this will cause `Type 'ValueType | undefined' is not assignable to type 'number'` errors during `next build`. Instead, use `(value: any)` or `(value: number | string | undefined)` and explicitly convert it to `Number(value)` before calling `.toLocaleString()` or `.toFixed()`.
