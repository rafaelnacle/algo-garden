# GitHub Pages — maintainer notes

The project includes a separate, browser-only Vite build for GitHub Pages. It reuses the same React lab and needs no Cloudflare Worker or server. The existing `npm run dev`, `npm run build`, and `npm start` workflow remains available.

Build for a project site such as `https://OWNER.github.io/REPOSITORY/`:

```bash
npm run build:pages -- --base-path /REPOSITORY
npm run preview:pages -- --base /REPOSITORY/
```

Open the URL printed by the preview server, normally `http://localhost:4173/REPOSITORY/`. Replace `REPOSITORY` with the exact, case-sensitive repository name.

For a root site (`OWNER.github.io`) or a custom domain served at its root:

```bash
npm run build:pages
npm run preview:pages
```

The publishable files are in **`dist/pages/`**. The build checks that the HTML references existing JavaScript, CSS, and favicon files under the correct base path. It also creates `.nojekyll`. Do not publish the whole repository or the entire `dist/` directory.

### Publish when ready

The workflow is **manual only**: pushing commits does not publish the site.

1. Push the prepared commits to the repository's default branch when you choose.
2. In the repository, open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source.
3. Open **Actions → Deploy GitHub Pages → Run workflow**, select the default branch, and run it.
4. Wait for the build and deployment jobs to finish. The deployed URL appears in the deployment environment and under **Settings → Pages**.

The workflow reads the base path from GitHub's Pages configuration, so repository sites, root sites, and configured custom domains use the appropriate asset paths automatically. It runs TypeScript, lint, algorithm tests, and C++ compilation checks before uploading only `dist/pages/`. Deployment is restricted to the default branch and uses GitHub's temporary credentials; no personal access token or API key needs to be added.

Future updates follow the same process: push when ready, then manually run **Deploy GitHub Pages**. For custom domains, configure the domain and DNS in GitHub Pages first, then run the workflow again so the build uses the updated base path.

The workflow has been prepared locally; a successful local build does not mean it has already been published. See [GitHub's custom Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for repository settings and deployment requirements.
