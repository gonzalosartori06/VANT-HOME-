#!/usr/bin/env python3
"""
extend_banner.py

Extiende una imagen para que encaje en un tamaño objetivo (ancho/alto) SIN recortar el contenido.
Rellena los “huecos” duplicando/estirando los bordes (edge-stretch) y aplica un feather muy suave
solo en la zona extendida para que no se note el corte.

Uso:
  python3 extend_banner.py input.png output.png --w 1920 --h 520
  python3 extend_banner.py input.png output.png --ratio 16:9 --w 1920

Notas:
- No hace blur sobre la imagen principal; solo sobre las bandas extendidas.
- Ideal para banners de carrusel donde usás background-size: cover y querés cero zoom/crop.
"""

from __future__ import annotations
import argparse
from PIL import Image, ImageFilter

def _feather_mask(size: tuple[int,int], inner_rect: tuple[int,int,int,int], feather: int) -> Image.Image:
    """Máscara (L) con 255 dentro de inner_rect, y degradado a 0 hacia afuera."""
    w, h = size
    mask = Image.new("L", (w, h), 0)
    x0, y0, x1, y1 = inner_rect
    # base sólida
    solid = Image.new("L", (max(1, x1-x0), max(1, y1-y0)), 255)
    mask.paste(solid, (x0, y0))
    if feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(radius=feather))
    return mask

def extend_image_to_size(
    img: Image.Image,
    target_w: int,
    target_h: int,
    *,
    feather: int = 18,
    bg_fallback=(243,243,243)
) -> Image.Image:
    """
    Escala la imagen con 'contain' (sin recorte) y rellena el resto extendiendo bordes.
    """
    img = img.convert("RGBA")
    ow, oh = img.size
    tw, th = int(target_w), int(target_h)

    # 1) Resize tipo contain
    scale = min(tw / ow, th / oh)
    rw, rh = max(1, int(round(ow * scale))), max(1, int(round(oh * scale)))
    main = img.resize((rw, rh), Image.LANCZOS)

    # 2) Canvas
    canvas = Image.new("RGBA", (tw, th), (*bg_fallback, 255))
    px = (tw - rw) // 2
    py = (th - rh) // 2
    canvas.paste(main, (px, py), main)

    # 3) Extender bordes (edge-stretch)
    # Left band
    if px > 0:
        strip = main.crop((0, 0, 1, rh)).resize((px, rh), Image.NEAREST)
        canvas.paste(strip, (0, py), strip)
    # Right band
    rx = px + rw
    if rx < tw:
        strip = main.crop((rw-1, 0, rw, rh)).resize((tw-rx, rh), Image.NEAREST)
        canvas.paste(strip, (rx, py), strip)

    # Top band (incluye laterales ya extendidos)
    if py > 0:
        top_row = canvas.crop((0, py, tw, py+1)).resize((tw, py), Image.NEAREST)
        canvas.paste(top_row, (0, 0), top_row)
    # Bottom band
    by = py + rh
    if by < th:
        bottom_row = canvas.crop((0, by-1, tw, by)).resize((tw, th-by), Image.NEAREST)
        canvas.paste(bottom_row, (0, by), bottom_row)

    # 4) Feather suave SOLO fuera del área principal (para disimular seams)
    if feather > 0:
        blurred = canvas.filter(ImageFilter.GaussianBlur(radius=feather))
        # máscara: 255 dentro del main, 0 fuera (con feather para transición)
        mask = _feather_mask((tw, th), (px, py, px+rw, py+rh), feather)
        # Queremos: main nítida, fuera ligeramente suavizado
        # Usamos invert mask para aplicar blur fuera
        inv = Image.eval(mask, lambda v: 255 - v)
        out = Image.composite(blurred, canvas, inv)
        return out

    return canvas

def parse_ratio(s: str) -> tuple[int,int]:
    s = s.strip().lower().replace(" ", "")
    if ":" not in s:
        raise ValueError("ratio debe ser como 16:9 o 21:9")
    a, b = s.split(":")
    return int(a), int(b)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp")
    ap.add_argument("out")
    ap.add_argument("--w", type=int, default=None, help="ancho objetivo")
    ap.add_argument("--h", type=int, default=None, help="alto objetivo")
    ap.add_argument("--ratio", type=str, default=None, help="ratio objetivo ej 16:9")
    ap.add_argument("--feather", type=int, default=18, help="suavizado de unión (solo bordes extendidos)")
    args = ap.parse_args()

    img = Image.open(args.inp)

    if args.w and args.h:
        tw, th = args.w, args.h
    elif args.w and args.ratio:
        ra, rb = parse_ratio(args.ratio)
        tw = args.w
        th = int(round(tw * rb / ra))
    elif args.h and args.ratio:
        ra, rb = parse_ratio(args.ratio)
        th = args.h
        tw = int(round(th * ra / rb))
    else:
        raise SystemExit("Tenés que pasar --w y --h, o --w + --ratio, o --h + --ratio")

    out = extend_image_to_size(img, tw, th, feather=args.feather)
    out = out.convert("RGB") if args.out.lower().endswith((".jpg", ".jpeg")) else out
    out.save(args.out)
    print(f"OK: {args.out} ({tw}x{th})")

if __name__ == "__main__":
    main()
