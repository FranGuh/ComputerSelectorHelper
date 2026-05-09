# Conductor Revert

Revert a track only when explicitly requested by the user.

## When to Use
- ONLY when the user explicitly asks to undo/revert a track
- Never proactively

## Steps
1. Identify the track to revert
2. Undo all changes made during implementation
3. Restore files to their pre-implementation state
4. Update track status to "reverted"
5. Document the revert reason in Engram
