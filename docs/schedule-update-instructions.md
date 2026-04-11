# How to Update the Siedel's Schedule

**Jim — this sheet drives the live website.** When you edit it, the website updates within 30 minutes. No code, no deploy, nothing to install.

**Sheet:** [Barbershop schedule Template copy 11](https://docs.google.com/spreadsheets/d/1fyeoscOea4Xa2H-LIoFv96F-ILoBhnvL0KKzS3eC83Q/edit)

---

## Weekly Update Checklist

Every **Sunday evening or Monday morning**, do the following:

### 1. Update the dates row (row 2)
Change the dates to the **current week** — Monday through Saturday. Example for the week of April 13:

| Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
|---|---|---|---|---|---|
| 4/13/2026 | 4/14/2026 | 4/15/2026 | 4/16/2026 | 4/17/2026 | 4/18/2026 |

**Important:** The dates must be the CURRENT week (the week that includes today). If the sheet shows a future week, the homepage "Working Today" widget will go dark until those dates arrive.

### 2. Update the shop hours row (row 3)
Most weeks this won't change — but if you're running special hours for a holiday, adjust it here.

### 3. Update each barber's shifts
For each barber row, enter their shift for each day. Valid entries:

| You type | What shows on the website |
|---|---|
| `8am-6pm` | "8A–6P" with a red "IN" badge on their card |
| `noon-8pm` | "NOON–8P" |
| `Off` or `off` | "OFF TODAY" badge, card dimmed |
| `r/o` | Same as off |
| `Ledgewood` | "LEDGEWOOD" badge, card dimmed |
| (blank) | Nothing shown — treated like off |

Any time-range pattern works: `8:30am-5pm`, `10am-noon`, `5pm-8pm`, etc.

### 4. Save
Google Sheets saves automatically. You're done.

---

## How it works on the website

- **Homepage "IN THE CHAIR TODAY" widget** — pulls from today's column, shows who's working with their hours, red pulsing dot
- **Team grid** — each barber's card gets a live "IN · 8A–6P" badge, or "OFF TODAY" if they're not in
- **`/schedule` page** — shows the full week in a table, today's column highlighted in red

Changes sync within **30 minutes**. If you need it faster, just ping Mark and he can force-refresh.

---

## Don't do these things

- ❌ Don't rename the columns or reorder the days
- ❌ Don't delete any barber rows (if someone leaves, leave the row but mark every day "Off" until the website is updated to remove them)
- ❌ Don't change the sheet's sharing settings — it needs to stay "Anyone with the link · Viewer"
- ❌ Don't put next week's dates in early unless you want the website to stop showing "today" info

---

## If something looks wrong on the website

1. Wait 30 minutes — the cache refreshes on that interval
2. Still wrong? Double-check the dates row matches this week
3. Still wrong? Text Mark — (your number here) — he can force a refresh or investigate

---

## Quick reference — who's on the sheet

The website matches these first names to the team page:

- JIM → Jim LaMarca
- BILLY → Billy Rodriguez
- MATT → Matt Hayes
- PATRICK → Patrick Muranko
- KRISTA → Krista Foecking
- TICIA → Ticia Husak
- Pierre → Pierre Wright
- Chris → Chris Hodge
- Sam → Sam Sickle
- Shannon → Shannon Hadick
- Will → Will Dillon

**Don't change the first names** or the matching breaks.
