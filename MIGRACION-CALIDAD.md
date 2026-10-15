# PM Amco Editorial | Repository quality upgrade

This ZIP is a **non-destructive overlay**, not a complete copy of the application. It contains only files that must be created or updated. Keep the existing `src/` code, real assets, documentation, `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, and `eslint.config.mjs` in place.

## Installation (run from the actual repository root)

```sh
# Recommended: save changes first or begin from a clean branch.
git switch -c chore/astro-quality

unzip -o "$HOME/Downloads/pmamco_astro_quality_es.zip" -d .
node scripts/setup-repository.mjs
pnpm install
pnpm format
pnpm check

git status --short
git diff --check
```

The installer preserves existing `package.json` fields and existing dependency versions, but updates relevant scripts. `pnpm install` is required to regenerate the real lockfile before the CI job can pass with `--frozen-lockfile`. `pnpm format` deliberately formats source before Prettier becomes a required quality gate. Review its diff before committing. If previously tracked generated files (such as `dist/`) are reported, untrack them with `git rm -r --cached -- dist/` (the local build files remain intact).

## Then create the commit

```sh
git add -A
git diff --cached --check
git diff --cached --stat
git commit -m "chore: prepare Spanish-only Astro quality pipeline"
git push -u origin chore/astro-quality
```

Open a pull request against `main`. The pre-push hook intentionally rejects direct pushes from `main`. If `pnpm` is not available on your machine, install/enable it using Corepack before running the commands.

## Canonical content and language policy

- Only `src/content/tutorials/es/` and `src/content/lessons/es/` contain published Markdown.
- `src/content/tutorials/en/` and `src/content/lessons/en/` contain only `.gitkeep`, so Git can preserve these otherwise empty directories.
- The redundant English Markdown under `translations/registrar-tiempo/en/` and `translations/time-tracking/en/` is removed by the installer. Unrelated translation material is not deleted automatically.
- `src/config/locales.ts` retains future `en` support while publishing only `es`. The existing UI English dictionary remains as a future-ready interface scaffold, not a published English page. The language switcher is hidden while only one locale is published, and becomes available automatically when multiple locales are published.
- The Spanish lesson slug for step 02 is aligned with its filename.

## Environment policy

- Versioned templates: `envs/.env.example`, `envs/.env.local.example`, `envs/.env.development.example`, `envs/.env.production.example`.
- Private runtime files created safely: `envs/.env.local`, `envs/.env.development`, `envs/.env.production`.
- `scripts/with-env.mjs` reads `envs/.env`, `envs/.env.local`, `envs/.env.<mode>`, and `envs/.env.<mode>.local` in that order. Inherited process environment always takes priority.
- The installer **moves** existing root `.env` files into `envs/` when no destination exists; it stops on conflicts rather than overwriting either file. A root `.env.example` is migrated to the new template path.
- Do not put secrets in `PUBLIC_` variables. Astro exposes those variables to the browser.

## Validation policy

`pnpm check` runs the content/locale invariants, Prettier check, ESLint, Astro typechecking, all `tests/*.test.mjs`, production build and generated HTML/sitemap assertions. `pnpm test` runs all repository `.test.mjs` tests, including existing tests. The old `scripts/validate-content.mjs` is replaced by `scripts/check-content.mjs` and removed by the installer.

The GitHub workflow mirrors the same `pnpm check` gate, validates conventional commits in pull requests, and uses a single Node/pnpm configuration. Husky v9 hooks are committed directly in `.husky/`. Husky-generated `.husky/_/` files must remain untracked.

## Important limits

The ZIP cannot replace unavailable original files: real PNG images, the current `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, existing tests, and ESLint configuration were not included in the supplied source snapshot. As a result, passing `pnpm check` **inside the actual repository after `pnpm install` is the release requirement**; a full dependency-backed Astro build cannot be certified from this ZIP alone.
