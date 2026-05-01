"""Convert Booksy yearly xlsx exports to CSV for Obsidian.

Reads:  ~/Downloads/appointments_{2024,2025,2026}.xlsx
Writes: HunterBrain/10-Projects/Clients/Siedels/booksy-appointments-{year}.csv
        + booksy-appointments-all.csv (concatenated)
        + Siedels-Booksy-Export.md (Obsidian index)
"""
import os
from pathlib import Path
import pandas as pd

SRC = Path("C:/Users/Mark/Downloads")
DST = Path("C:/Users/Mark/Documents/HunterBrain/10-Projects/Clients/Siedels")
DST.mkdir(parents=True, exist_ok=True)

YEARS = [2024, 2025, 2026]
frames = []
summary = []

for year in YEARS:
    src = SRC / f"appointments_{year}.xlsx"
    dst = DST / f"booksy-appointments-{year}.csv"
    # Booksy xlsx has 7 metadata rows above the real header; first column is empty padding,
    # second column is a 1-based row index Booksy adds to its own export.
    df = pd.read_excel(src, engine="openpyxl", header=7)
    df = df.dropna(axis=1, how="all")  # drops the empty leading column
    df = df.drop(columns=[c for c in df.columns if str(c).startswith("Unnamed")])
    df.to_csv(dst, index=False)
    frames.append(df)
    summary.append((year, len(df), dst.stat().st_size))
    print(f"{year}: {len(df):>6} rows -> {dst.name} ({dst.stat().st_size:,} bytes)")

combined = pd.concat(frames, ignore_index=True)
combined_path = DST / "booksy-appointments-all.csv"
combined.to_csv(combined_path, index=False)
print(f"all : {len(combined):>6} rows -> {combined_path.name} ({combined_path.stat().st_size:,} bytes)")

# Column inventory for the index
cols = list(combined.columns)
date_min = combined.iloc[:, 0].min() if len(combined) else "n/a"
date_max = combined.iloc[:, 0].max() if len(combined) else "n/a"

index_md = DST / "Siedels-Booksy-Export.md"
index_md.write_text(f"""# Siedel's Booksy Appointment Export

Full appointment history pulled from Booksy admin (Stats & Reports → Appointments list → Year export).

## Files

| File | Year | Rows | Size |
|---|---|---|---|
""" + "\n".join(f"| `booksy-appointments-{y}.csv` | {y} | {n:,} | {s:,} bytes |" for y, n, s in summary) + f"""
| `booksy-appointments-all.csv` | combined | {len(combined):,} | {combined_path.stat().st_size:,} bytes |

## Schema

Columns ({len(cols)}): {", ".join(cols)}

## Range

- Earliest date: {date_min}
- Latest date: {date_max}
- Pulled: 2026-05-01

## Notes

- 2024 covers May 6 (Booksy launch) through Dec 31.
- 2026 includes both completed and *future* (already-booked) appointments through July 16.
- Status column distinguishes Confirmed / Completed / Cancelled / No-show.
- Source xlsx files retained at `~/Downloads/appointments_{{year}}.xlsx`.
""", encoding="utf-8")
print(f"index: {index_md.name}")
