---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context
- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`

## Your task
- Based on the above changes, create a single git commit. ONLY commit locally, not push to remote.
- Generate a commit message using the Conventional Commits 1.0.0 standard.

Follow this format strictly:

<type>(optional scope): <short, imperative summary>

[optional body explaining what changed and why]

[optional footer with BREAKING CHANGE or issue references]

Allowed types:
feat, fix, docs, style, refactor, perf, test, build, ci, chore

Rules:
- summary must be lower-case
- summary must not end with a period
- body should wrap around ~72 chars
- if breaking change, include: "BREAKING CHANGE: ..."
- Only include body/footer if useful
