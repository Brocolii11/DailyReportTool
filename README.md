# Daily Report Tool
**VibeCodedApp**

Local tool for daily **policy renewal follow-ups** at Mavic Plus, plus a report you can copy to a supervisor.

Open `index.html` in a browser. No install, no server.

## What it does

| View | Purpose |
|------|---------|
| **Dashboard** | Target dates for the four daily follow-up windows |
| **Renewal Report** | Log today’s renewal outcomes and copy a formatted summary |
| **Dealers Report** | Log policies sold at dealerships and copy a summary |

Data stays in this browser (`localStorage`). Clearing site data wipes the day’s reports.

## Follow-up windows

Dashboard dates are computed from **today** (same calendar day, local time):

| Label | Policies due | Offset in the app |
|-------|----------------|-------------------|
| **Today** | Due today | `today` |
| **S3** | Due in ~24–48 hours | `today + 2 days` |
| **S2** | Due in 15 days | `today + 15 days` |
| **S1** | Due in 30 days | `today + 30 days` |

The dashboard shows **dates only**. Pull the matching policies from Riskman; this app does not connect to the CRM.

## Daily report buckets

| Bucket | What to log |
|--------|-------------|
| Policies renewed today | Scheduled renewals for today |
| Renewed (past / future date) | Renewed, but expiration is not today |
| Confirmed non-renewals | Client confirmed they will not renew |
| Expired (no response) | Lapsed after follow-ups with no reply |

**Copy Summary** puts the generated text on the clipboard. There is no email/submit yet. You can also screenshot the summary panel.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Shell and three views |
| `style.css` | Layout, glass UI, themes |
| `script.js` | Dates, reports, `localStorage` |

## Local preview

Open `index.html` (double-click, or “Open with Live Server” in the editor).

## Notes

- Colors use the Mavic Plus **OKLCH** palette in `style.css`. Ink and cream are the text/paper pair; olive, gold, and aqua are ready on `--olive`, `--gold`, and `--aqua`.
- The circle in the top bar switches light and dark. Choice is saved in this browser.
- Do not put real client data in git. Reports are local to the machine.