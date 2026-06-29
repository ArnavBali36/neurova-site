# Neurova Labs — website

A minimal, single-page marketing site for **Neurova Labs**.

> Neurova is a wearable that captures your ideas the instant they form — and turns them into action.

It's a plain static site (HTML + CSS + a little vanilla JavaScript). **No build step, no
dependencies** — which means it can't fail to build and deploys to Vercel in one click.

```
.
├── index.html            # all the page content
├── styles.css            # styling (dark, minimal, Apple-quiet)
├── main.js               # nav scroll state, scroll reveals, hero particle field
├── favicon.svg           # browser tab icon
├── assets/
│   └── neurova-logo.svg  # standalone logo mark
└── README.md
```

---

## Run it locally

Just open `index.html` in a browser. Or serve it (so paths behave exactly like production):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Deploy free on Vercel

### 1. Put it on GitHub
From this folder:

```bash
git init
git add .
git commit -m "Neurova Labs site"
git branch -M main
```

Create an empty repo at <https://github.com/new> (e.g. `neurova-site`), then:

```bash
git remote add origin https://github.com/<your-username>/neurova-site.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to <https://vercel.com> and sign in with GitHub (free).
2. **Add New → Project**, then import the `neurova-site` repo.
3. Framework Preset: **Other** (it's a static site). Leave Build Command and
   Output Directory **empty**.
4. Click **Deploy**.

You'll get a live URL like `neurova-site.vercel.app`. Every `git push` redeploys
automatically. You can add a custom domain later in the Vercel project settings.

> Prefer the command line? Run `npx vercel` in this folder and follow the prompts.

---

## Editing

- **Words:** edit the text directly in `index.html`.
- **Colors / spacing / fonts:** the variables at the top of `styles.css` (`:root`).
- **Contact email:** the site uses `abali@andrew.cmu.edu` in a few `mailto:` links in
  `index.html` — search-and-replace it with your real address.
- **Logo:** the mark is drawn inline as SVG (the `#neurova-mark` symbol near the bottom
  of `index.html`) so it's always crisp and never breaks. To use your own image instead,
  drop it in `assets/` and swap the `<svg ...><use .../></svg>` blocks for
  `<img src="assets/your-logo.png" alt="Neurova Labs" height="26" />`.
