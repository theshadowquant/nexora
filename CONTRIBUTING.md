# Contributing to Nexora

Thank you for contributing! To preserve software consistency and operational quality, please follow our repository and coding workflows.

---

## 🌿 Branch Layout Guidelines

- `main`: Production release branch. Only updated via approved Pull Requests from `develop`.
- `develop`: Development integration branch. All features must compile and pass tests here.
- `feature/sprint-[id]`: Work folders for sprints and capabilities expansions.

---

## 💬 Commit Message Formats

We enforce semantic commit structures:

- `feat: [description]` for new features.
- `fix: [description]` for bug resolutions.
- `docs: [description]` for updates to manuals or markdown.
- `refactor: [description]` for non-modifying structural optimizations.
- `test: [description]` for adding assertions.

---

## 🚦 Pull Request Process

1. Create a descriptive feature branch (e.g. `feature/academic-predictions`).
2. Run standard lints and build scripts locally before pushing:
   ```bash
   npm run lint
   npm run build
   ```
3. Submit a Pull Request targeting `develop`. The CI automation workflow must report success.
4. Obtain code approval from at least 1 maintainer before merging.
