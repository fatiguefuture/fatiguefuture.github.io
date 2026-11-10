# fatigue future: Website

Statische Bandseite (HTML/CSS) für GitHub Pages.

## Lokal ansehen

```bash
python3 -m http.server 8765
```

Dann http://127.0.0.1:8765/ öffnen (nicht als `file://`, sonst blockieren Browser Scripts/Fetch).

Parser-Tests:

```bash
node --test scripts/parse-gigs.test.mjs
```

## Auftritte (Nextcloud → Site)

Quelle der Wahrheit ist die öffentliche Nextcloud-Datei `Auftritte.txt` (Share-Download).
GitHub Actions (Workflow [`.github/workflows/sync-gigs.yml`](.github/workflows/sync-gigs.yml)) holt sie alle 6 Stunden, parst sie und aktualisiert `gigs.json` nur bei inhaltlicher Änderung. Ein versehentlich leeres File überschreibt bestehende Termine nicht.

Im öffentlichen Repo sind Standard-Actions kostenlos. Der Share-Link ist nur lesend; keine Secrets nötig.

### Dateiformat

```text
# Kommentar oder Überschrift ohne Datum
18.12.2026 Gasteig München
20.03.2027 Some Venue Berlin | https://example.com/tickets
```

- Eine Zeile beginnt mit `TT.MM.JJJJ`
- Rest = Anzeigetext
- Optional am Ende: ` | https://…` für Ticket/Event-Link
- Vergangene Zeilen dürfen stehen bleiben; die Homepage zeigt nur Termine ab heute (Europe/Berlin)

### Manuell syncen

GitHub → Repo → **Actions** → **Sync gigs from Nextcloud** → **Run workflow**

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
