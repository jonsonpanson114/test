#!/usr/bin/env bash
# Usage: setup_fonts.sh <project-dir>
# Downloads the deck fonts (Google Fonts, TTF) into <project-dir>/fonts and writes <project-dir>/fonts.css
# Families: ZMG = Zen Maru Gothic (headlines), HAND = Zen Kurenaido (handwriting), OUT = Outfit (Latin/numerals), NJP = Noto Sans JP (body, editorial styles)
set -euo pipefail
DIR="${1:?usage: setup_fonts.sh <project-dir>}"
mkdir -p "$DIR/fonts"
CSS="$DIR/fonts.css"; : > "$CSS"
get() { # alias  Google+Family  weight
  local alias="$1" fam="$2" w="$3" f="$DIR/fonts/${1}-${3}.ttf"
  if [ ! -s "$f" ]; then
    # a non-browser User-Agent makes Google Fonts answer with plain TTF urls
    url=$(curl -fsS "https://fonts.googleapis.com/css2?family=${fam}:wght@${w}" -A curl | grep -o 'https://[^)]*\.ttf' | head -1)
    [ -n "$url" ] || { echo "no font url for $fam $w" >&2; exit 1; }
    curl -fsS -o "$f" "$url"
  fi
  printf '@font-face{font-family:"%s";font-weight:%s;src:url("fonts/%s-%s.ttf")}\n' "$alias" "$w" "$alias" "$w" >> "$CSS"
}
for w in 500 700 900; do get ZMG Zen+Maru+Gothic $w; done
get HAND Zen+Kurenaido 400
for w in 300 400 500 600 700; do get OUT Outfit $w; done
for w in 300 400 500 700 900; do get NJP Noto+Sans+JP $w; done
echo "fonts ready: $DIR/fonts  ->  $CSS"
