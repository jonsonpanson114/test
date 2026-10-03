#!/usr/bin/env bash
# Usage: merge_pdfs.sh out.pdf  a.pdf:1,2,3  b.pdf:all  a.pdf:4-6 ...
# Reorders/merges pages from several PDFs (needs poppler: pdfseparate/pdfunite). Handy when a deck is built from several HTML files.
set -euo pipefail
OUT="$1"; shift; T=$(mktemp -d); list=()
for spec in "$@"; do
  f="${spec%%:*}"; sel="${spec#*:}"; n=$(pdfinfo "$f" | awk '/Pages/{print $2}'); base=$(basename "$f" .pdf)
  pdfseparate "$f" "$T/${base}-%d.pdf"
  if [ "$sel" = "all" ]; then sel="1-$n"; fi
  IFS=',' read -ra parts <<< "$sel"
  for part in "${parts[@]}"; do
    if [[ "$part" == *-* ]]; then for i in $(seq "${part%-*}" "${part#*-}"); do list+=("$T/${base}-$i.pdf"); done
    else list+=("$T/${base}-$part.pdf"); fi
  done
done
pdfunite "${list[@]}" "$OUT"; echo "merged ${#list[@]} pages -> $OUT"
