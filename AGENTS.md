# Project Instructions

## Development

- Prefer simple solutions over unnecessary abstractions.
- Follow the existing project structure and conventions.
- Do not add dependencies unless they provide a clear benefit.
- Do not rewrite or refactor working code unrelated to the current task.
- Keep changes focused on the requested task.
- Run relevant tests, linting, formatting, and type checks after changes when available.
- Write clean, readable, and maintainable code.
- Follow the project's existing formatter and linter configuration. Do not introduce or upgrade tooling unless necessary.
- Prefer free and open-source solutions when they adequately meet the requirements.

## Security

- Never hardcode or expose API keys, tokens, passwords, credentials, or other secrets.
- Never expose the contents of `.env` files.
- Never commit `.env` files containing secrets.
- Use environment variables for secrets and sensitive configuration.
- Only expose environment variables to client-side code when they are explicitly intended to be public.
- Treat API keys as secrets unless the service explicitly documents them as safe for client-side use.
- Follow secure coding practices and avoid introducing known security vulnerabilities.
- Validate and sanitize untrusted input where appropriate.
- Do not weaken existing security controls to make an implementation easier.

## Frontend

- Follow the existing design system and visual language.
- Keep components small and focused, but avoid unnecessary component abstraction.
- Reuse existing components before creating new ones.
- Maintain responsive behavior across common screen sizes.
- Preserve accessibility and semantic HTML.
- Avoid unnecessary client-side JavaScript when a simpler solution works.
- Do not expose server-only logic, credentials, or secrets to client-side code.
- Treat anything shipped to the browser as publicly accessible.
- Do not store sensitive information in localStorage or other client-side storage.
- Avoid introducing dependencies for functionality that can be reasonably implemented with the existing stack.
- Check for obvious console errors, broken interactions, and layout regressions after frontend changes.

## README

- Keep `README.md` concise and user-facing.
- Explain what the project is and what it does.
- List the main technologies used.
- Explain installation, configuration, and how to run the project.
- Document required environment variable names and their purpose, but never include real secret values.
- Include relevant commands when necessary.
- Do not add architecture explanations, implementation details, development history, roadmaps, generic contribution guidelines, or filler unless explicitly requested.
- Only update `README.md` when the change affects information users need to understand, configure, install, or run the project.
