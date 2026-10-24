# Bantay Proyekto — Ghost Project Detector (HTML MVP)

*If we paid for it, space can see it.*

A clickable demonstration of the proposed Bantay Proyekto workflow: **Match → Look → Score → Verify** for flood-control projects (2022–2025), starting with a Bulacan pilot.

> **DEMO DATA.** All 18 projects (`BP-DEMO-001`…`018`), contractors, Ghost Scores, satellite-style images and verification records are fictional and simulated. Nothing here is an official government finding. The system flags; people verify. A Ghost Score is not a finding of fraud.

## Run it

No build step and no dependencies to install.

- **Quickest:** double-click `index.html` to open it in a modern browser (Chrome, Edge, Firefox, Safari).
- **Local server (recommended):** run this from the project folder, then open <http://localhost:8080>:

  ```bash
  python -m http.server 8080
  ```

The interactive map uses Leaflet 1.9.4 (from unpkg) and Esri Light/Dark Gray Canvas basemap tiles matching the color scheme (no API key), so it needs internet access. Roboto and Material Symbols load from Google Fonts; offline, text falls back to system fonts and icons show as their names (e.g. "map"). When offline, the Map view shows a clickable list of project locations, and every other feature still works.

## Files

| File | Purpose |
|---|---|
| `index.html` | Layout, the six views, the static About content, and the verification dialog |
| `styles.css` | Material 3 design in plain CSS (color roles, shape, type scale, state layers): light and dark schemes (follows the system until you use the top-bar toggle, which is remembered per browser), navigation rail ≥600px, bottom navigation bar on phones |
| `app.js` | Demo dataset, filtering, sorting, rendering, verification workflow, persistence and CSV export |

## What works

- **Overview:** KPI cards, the Ghost Score histogram, a status breakdown, the top-risk list, a regional summary, a mini map and an activity feed. All of them follow the active filters.
- **Project Map:** risk-coloured markers with a ✓ ring once a project is verified, popups and a results list. Filters cover search, province, municipality, risk, reported or verification status, and showing or hiding risk bands, plus a reset. A fallback list appears if Leaflet can't load, and a notice appears if the map tiles fail.
- **Risk Assessment:** a sortable table (ID, name, amount, contract date, target date, status, score) with paging at 10 rows and CSV export of the filtered, sorted records.
- **Project Details:** the project overview, a score gauge, the recommended next action, and before/after illustrations (side-by-side or swipe). Three separate panels show simulated signals, the model-generated assessment with evidence quality, and human verification history.
- **Verification Queue:** projects ranked by score, with the reason for the flag, evidence quality and the recommended action. There are five status actions plus notes. Each action opens a dialog asking for a date, an inspector and notes. Final decisions require an extra confirmation checkbox.
- **Persistence:** verification changes, notes, activity and risk thresholds are saved in `localStorage` (`bp-demo-v1`). To clear them, use **About → Reset demo data**.
- **Configurable thresholds:** the defaults are High ≥ 70 and Medium ≥ 40. You can change them under About → Prototype settings.

## What is simulated / not built

- No AI change-detection model. Each score is the sum of hand-written illustrative signal weights.
- No satellite data. The before/after images are SVGs generated in code from each project ID and are watermarked *Illustrative*.
- No connections to DPWH, PhilGEPS, Sumbong sa Pangulo, Sentinel-1 or Sentinel-2. The About page lists them as "Not connected".
- No backend, accounts, real inspector dispatch or shared database. State lives only in the current browser.

## Manual test checklist

1. Visit all six views from the navigation rail. Below 600px wide the rail becomes a bottom navigation bar.
2. Search for `Hagonoy`. The map list, the table, the KPI counts and the queue should all narrow, and a "Filtered" chip appears in the header. Click **Clear**.
3. Set Province to Pampanga and Risk to High, and untick the Low band. Click **Reset filters**.
4. Sort the table by Ghost Score, Amount and Target completion in both directions, then page through the results.
5. Click a map marker, then **View full details**. Try both **Side by side** and **Swipe**.
6. In the Queue, mark a project **Verified — Discrepancy Found**. The checkbox must be ticked before Save works. Then check that the detail history, the table badge, the map ✓ marker, the KPIs and the activity feed all updated. Reload the page: the change should still be there.
7. Click **Export CSV** with a filter active and open the downloaded file.
8. Block `unpkg.com` (or go offline) and reload. The Map view should show the fallback list.
