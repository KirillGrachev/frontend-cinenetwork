# Vendored patch: braces 3.0.4

Registry mirror available to this project stops at braces 3.0.3, which is
vulnerable to stack-exhaustion DoS via deeply nested brace patterns
(GHSA-vfj7-8cjw-p6xm, CVSS 7.5). The whole tailwindcss dev-toolchain
(chokidar → braces, fast-glob → micromatch → braces) inherits it, which is
why `npm audit` reported 5 high-severity findings.

This vendored copy = braces 3.0.3 + the upstream-style fix: a `MAX_DEPTH`
(512) guard in `lib/parse.js` that throws `RangeError` on excessive nesting.
Wired in via `package.json#overrides.braces = "file:vendor/braces"`.
When the public registry gains a patched release, delete `vendor/` and the
override.
