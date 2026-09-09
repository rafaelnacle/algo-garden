# GitHub Pages deployment

AlgoGarden is built as a static Vite application and published with the workflow in `.github/workflows/pages.yml`.

## Preview a repository site locally

For a project URL such as `https://OWNER.github.io/REPOSITORY/`, build with the repository name as the base path:

```bash
npm run build -- --base-path /REPOSITORY
npm run preview -- --base /REPOSITORY/
```

Open the URL printed by Vite, normally `http://localhost:4173/REPOSITORY/`.

For a root Pages site or a custom domain served from its root:

```bash
npm run build
npm run preview
```

The publishable files are generated in `dist/pages/`. The build verifies asset paths and adds `.nojekyll`.

## Publish

1. Push the desired commit to the repository's default branch.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions**.
3. Open **Actions → Deploy GitHub Pages → Run workflow**.
4. Run the workflow from the default branch.

The workflow checks types, lint, algorithms, C++ examples, and Python examples before publishing the static build. Pushing a commit alone does not deploy the site.
