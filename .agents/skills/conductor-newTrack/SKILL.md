# Conductor New Track

Create a new feature/bugfix/refactor track with spec, plan, tasks, risks, and acceptance criteria.

## When to Use
- Before implementing any new feature or significant change
- When requirements are ambiguous and need clarification
- For bug fixes that require architectural changes

## Steps
1. Recover Engram memory for `computerselectorhelper` using `mem_context` then `mem_search`
2. Treat recovered memories as constraints
3. Create a track in `conductor/tracks/` with:
   - `spec.md` — What needs to be built and why
   - `plan.md` — How it will be built, step by step
   - `tasks.md` — Granular implementation tasks
   - `risks.md` — Potential issues and mitigations
   - `acceptance.md` — Criteria to consider the track done
4. Present the track for review before implementation

## Output
- New track directory under `conductor/tracks/<track-name>/`
- All spec documents filled out
