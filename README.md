# Daily Report Tool

**Daily Report Tool** is a follow-up report tool for **renewal** and **retention** teams. Track daily follow-up windows, log renewal outcomes, and copy a summary to share.

Open `index.html` in a browser. No install, no server.

## What it does

| View | Purpose |
|------|---------|
| **Dashboard** | Target dates for the four daily follow-up windows, plus report totals |
| **Renewal Report** | Type a policy once, assign it to a category, and copy a formatted summary |
| **Dealers Report** | Log policies sold at partner locations and copy a summary |

Data stays in this browser (`localStorage`). Clearing site data wipes the day’s reports.

## Follow-up windows

Dashboard dates are computed from **today** (same calendar day, local time):

| Label | Policies due | Offset in the app |
|-------|----------------|-------------------|
| **Today** | Due today | `today` |
| **S3** | Due in ~24–48 hours | `today + 2 days` |
| **S2** | Due in 15 days | `today + 15 days` |
| **S1** | Due in 30 days | `today + 30 days` |

The dashboard shows **dates only**. Pull matching policies from your own system; this app does not connect to a CRM.

## Renewal report buckets

Type the policy in one field, then press the category button. Enter repeats the last category used.

**Daily** (today’s activity):

| Bucket | What to log |
|--------|-------------|
| Renewed | Policies renewed today |
| Expired | Policies that expired today |
| Will not renew | Confirmed non-renewals for today |

**General** (activity after today):

| Bucket | What to log |
|--------|-------------|
| Renewed | Renewals that take effect after today |
| Will not renew | Confirmed non-renewals after today |

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

- Colors use an **OKLCH** palette in `style.css`. Ink and cream are the text/paper pair; olive, gold, and aqua are ready on `--olive`, `--gold`, and `--aqua`.
- The circle in the top bar switches light and dark. Choice is saved in this browser.
- Do not put real client data in git. Reports are local to the machine.

## VibeCodedApp

This is a **VibeCodedApp**. It exists because reports still have to go out, and there is not enough time to research and build a full custom tool from scratch. The goal is a working follow-up report, not a polished product.
