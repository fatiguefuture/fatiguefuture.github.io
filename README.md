# fatigue future — Website

Statische Bandseite (HTML/CSS) für GitHub Pages.

## Lokal ansehen

`index.html` im Browser öffnen.

## Auf GitHub veröffentlichen

1. Auf [github.com/new](https://github.com/new) ein neues Repository anlegen:
   - Repository name: `fatiguefuture.github.io` **oder** `website`
   - Public
   - **ohne** README / .gitignore (Repo leer lassen)
2. Im Terminal in diesem Ordner:

```bash
git add .
git commit -m "Initial band website"
git branch -M main
git remote add origin https://github.com/fatiguefuture/REPO-NAME.git
git push -u origin main
```

3. GitHub → Repo → **Settings** → **Pages**
   - Source: Deploy from a branch
   - Branch: `main` / `/ (root)`
   - Save

URL danach:

- Repo `fatiguefuture.github.io` → https://fatiguefuture.github.io/
- anderes Repo → https://fatiguefuture.github.io/REPO-NAME/
