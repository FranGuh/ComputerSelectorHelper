# ComputerSelectorHelper Agent Guide

## Memory First

- Before planning or coding, recover Engram context for project `computerselectorhelper` with `mem_context` first, then `mem_search` when needed.
- Treat recovered memories and local docs as constraints.
- Save meaningful decisions, discoveries, bug fixes, and completed-track summaries back to Engram with `mem_save` or `mem_session_summary`.

## Project Context

ComputerSelectorHelper is a React + Vite web app that helps users choose the right laptop based on their needs, budget, and usage patterns. Users answer a quiz and receive personalized spec recommendations with suggested laptop models.

### Stack
- React 19 with JSX
- Vite 6 (bundler)
- React Router DOM 7
- React Icons
- Vercel Analytics
- ESLint 9

### Product Goals
- Help non-technical users make informed laptop purchase decisions
- Provide clear technical explanations in plain language
- Suggest real laptop models with approximate prices (MXN)

### Non-Goals
- Not an e-commerce platform
- Not a real-time price tracker
- Not a professional review site

### Important Local Docs
- `E:\Job\ENGRAM_LOCAL_COMANDOS.md` — Engram CLI commands
- `E:\Job\NUEVO_PROYECTO_SDD_ENGRAM.md` — New project setup guide
- `E:\Job\SDD_ENGRAM_WORKFLOW.md` — SDD workflow patterns
- `docs/SDD_SKILLS_USAGE.md` — SDD skills usage for this project

## SDD / Skills Workflow

- Use Conductor skills in `.agents/skills/` for spec-driven work.
- For new features or ambiguous changes, start with `conductor-setup` if the Conductor structure is missing, then use `conductor-newTrack` before implementation.
- Use `conductor-implement` only after the track/spec/tasks are clear.
- Use `conductor-status` to inspect active tracks, `conductor-review` before closing work, and `conductor-revert` only when the user explicitly asks to undo a track.
- Keep tiny fixes direct when a full SDD track would add unnecessary process.

## Dream Team Architecture

This project uses a multi-agent orchestration model:

| Role | Agent | Model | Responsibility |
|------|-------|-------|----------------|
| Principal (Orchestrator/Auditor) | AgentPrincipal | qwen3.6-plus | Delegates, supervises, manages branches/tickets, reports to user |
| Architecture & Security | AgentArquitecto | deepseek-v4-pro | Architecture decisions, security audits, code quality |
| QA & Product | AgentQA | GLM-5 | Testing, edge cases, UX, acceptance criteria |
| Performance & Resilience | AgentPerformance | minimax-m2.7 | Performance optimization, memory, resilience, idempotency |
| Research & Traceability | AgentResearch | gemini-2.5-pro (Google provider) | Research, precedents, consistency with prior decisions |
| Build Worker | KimiBuildWorker | kimi-k2.6 | Builds, compilation, CI execution |
| Build Fixer | JuniorQwen | MiMo 2.5V Pro | Build fixes, regression diagnosis, hotfixes |
| UI/UX Advisor | UIUXAdvisor | openai/gpt-5.5 | React UI/UX review, SEO optimization, accessibility, modern design patterns |

### Agent Workflow
1. **Plan**: Auditor presents quick questions, consults agents, agrees on requirements, edge cases
2. **Confirm**: User confirms requirements and expected cases
3. **Delegate**: Auditor assigns tickets to agents for documentation and implementation
4. **Implement**: Agents code according to specs
5. **Cross-Review**: All agents review each other's work, document issues
6. **Report**: Auditor presents results, waits for user feedback

## Worktree Safety

- Do not revert or overwrite existing changes unless explicitly requested.
- Do not commit unless the user explicitly asks.
- Do not expose or commit secrets, `.env`, tokens, or credentials.

## Known Issues to Address

- Missing SEO (meta tags, Open Graph, structured data, sitemap)
- Inference engine has bugs and needs more complex logic
- UI needs polish and refinement
- Project is ~1 year old and needs updates
