#!/usr/bin/env bash
# Usage: extract_images.sh <file.pdf> <out-dir>
# Pulls every embedded image out of a PDF, drops tiny ones (icons/masks), and builds a labelled contact sheet
# (<out-dir>/_sheet.jpg) so you can SEE which image is which before picking. Needs poppler-utils + ImageMagick.
set -euo pipefail
PDF="${1:?pdf}"; OUT="${2:?out dir}"; mkdir -p "$OUT/raw"
pdfimages -list "$PDF" | head -40 >&2 || true
pdfimages -png "$PDF" "$OUT/raw/img"
# page-wise render too: useful for vector figures that are not embedded images
mkdir -p "$OUT/pages"; pdftoppm -r 60 -png "$PDF" "$OUT/pages/p"
cd "$OUT/raw"
for f in *.png; do
  w=$(identify -format %w "$f"); h=$(identify -format %h "$f")
  if [ "$w" -lt 160 ] || [ "$h" -lt 120 ]; then rm -f "$f"; fi   # soft masks / icons
done
montage -label '%f' *.png -tile 5x -geometry 320x240+6+6 -background '#eee' ../_sheet.jpg
echo "kept $(ls *.png | wc -l) images. Open $OUT/_sheet.jpg, then copy the ones you want into assets/ with meaningful names."
