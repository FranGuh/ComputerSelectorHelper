# SDD / Skills Usage

This project has Conductor SDD skills installed in:

```text
.agents/skills/
```

## Required Memory Step

Before any SDD work, recover project memory from Engram:

```text
Use Engram memory for project computerselectorhelper. First call mem_context, then mem_search if needed, and treat the recovered memories as constraints.
```

## Available Conductor Skills

- `conductor-setup`: initialize the Conductor project structure.
- `conductor-newTrack`: create a new feature/bugfix/refactor track.
- `conductor-implement`: implement a selected track after the spec and tasks are clear.
- `conductor-status`: inspect current tracks and progress.
- `conductor-review`: review a track before closing it.
- `conductor-revert`: revert a track only when explicitly requested.

## Recommended Flow

```text
Recover Engram context for computerselectorhelper, then use conductor-newTrack to create the spec, plan, tasks, risks, and acceptance criteria before coding.
```

```text
Use conductor-implement to implement the approved track one task at a time.
```

```text
Use conductor-review to verify the implementation against the spec, acceptance criteria, Engram memory, and project rules.
```

## Terminal Engram Examples

```powershell
E:\Job\bin\engram.exe context computerselectorhelper
E:\Job\bin\engram.exe search "consulta" --project computerselectorhelper
E:\Job\bin\engram.exe save "ComputerSelectorHelper decision" "Decision/details here." --type decision --project computerselectorhelper
```

## Dream Team Agents

This project uses a multi-agent orchestration model. Agents are defined in `.opencode/agents/` and can be invoked with `@mention` in OpenCode.

### Available Agents

| Agent | Model | Use When |
|-------|-------|----------|
| `@ui-ux-advisor` | openai/gpt-5.5 | Reviewing React UI/UX, SEO optimization, accessibility, modern design patterns |

### How to Use Agents

**Manual invocation:**
```
@ui-ux-advisor Review the Landing page for accessibility and SEO issues
```

**Automatic invocation:**
Primary agents will automatically invoke subagents when the task matches their description.

**Agent configuration:**
- Location: `.opencode/agents/ui-ux-advisor.md`
- Mode: `subagent`
- Permissions: read/glob/grep/webfetch allowed, edit requires approval, bash denied
- Temperature: 0.3 (focused, deterministic)
