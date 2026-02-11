#!/usr/bin/env python3
"""
extend_banner.py

Genera banners con tamaño fijo SIN estirar la imagen (contain),
rellenando lo que sobra con el color detectado del fondo.

MEJORA CLAVE:
- Detecta el color de fondo por "color dominante" en bordes/esquinas (con cuantización),
  mucho más preciso que la mediana simple.

- Borra el archivo de salida si ya existe.
- No usa blur.
"""

from __future__ import annotations

import os
import argparse
from collections import defaultdict
from PIL import Image


def detect_background_color(
    img: Image.Image,
    alpha_min: int = 220,
    edge_frac: float = 0.10,
    max_edge_px: int = 70,
    quant_step: int = 12,
) -> tuple[int, int, int]:
    """
    Detecta el color de fondo probable desde bordes/esquinas usando:
    - muestreo de tiras en los 4 bordes + 4 esquinas
    - cuantización (bucket) y elección del color dominante (modo)
    - promedio real dentro del bucket ganador para más precisión

    Params:
      alpha_min  : ignora píxeles con alpha < alpha_min (para PNG con transparencias)
      edge_frac  : porcentaje del ancho/alto a muestrear (0.10 = 10%)
      max_edge_px: límite absoluto en px para no muestrear demasiado
      quant_step : tamaño del bucket por canal (más chico = más preciso, más grande = más robusto)
    """
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()

    # grosor de muestreo
    ew = max(6, min(max_edge_px, int(w * edge_frac)))
    eh = max(6, min(max_edge_px, int(h * edge_frac)))

    # recolecta samples
    samples: list[tuple[int, int, int]] = []

    def add_rect(x0: int, y0: int, x1: int, y1: int):
        # recorta por seguridad
        x0 = max(0, x0); y0 = max(0, y0)
        x1 = min(w, x1); y1 = min(h, y1)
        for y in range(y0, y1):
            for x in range(x0, x1):
                r, g, b, a = px[x, y]
                if a >= alpha_min:
                    samples.append((r, g, b))

    # 4 esquinas
    add_rect(0, 0, ew, eh)
    add_rect(w - ew, 0, w, eh)
    add_rect(0, h - eh, ew, h)
    add_rect(w - ew, h - eh, w, h)

    # 4 bordes (tiras)
    add_rect(0, 0, w, eh)         # top
    add_rect(0, h - eh, w, h)     # bottom
    add_rect(0, 0, ew, h)         # left
    add_rect(w - ew, 0, w, h)     # right

    if not samples:
        return (243, 243, 243)

    # bucket por cuantización: (r//step, g//step, b//step)
    buckets_count = defaultdict(int)
    buckets_sum = defaultdict(lambda: [0, 0, 0])

    def q(v: int) -> int:
        return v // quant_step

    for r, g, b in samples:
        key = (q(r), q(g), q(b))
        buckets_count[key] += 1
        s = buckets_sum[key]
        s[0] += r; s[1] += g; s[2] += b

    # bucket dominante (modo)
    best_key = max(buckets_count.items(), key=lambda kv: kv[1])[0]
    cnt = buckets_count[best_key]
    sr, sg, sb = buckets_sum[best_key]
    return (int(sr / cnt), int(sg / cnt), int(sb / cnt))


def extend_image(img: Image.Image, tw: int, th: int) -> Image.Image:
    img = img.convert("RGBA")
    ow, oh = img.size

    scale = min(tw / ow, th / oh)
    rw, rh = max(1, int(round(ow * scale))), max(1, int(round(oh * scale)))
    main = img.resize((rw, rh), Image.LANCZOS)

    bg = detect_background_color(img)
    canvas = Image.new("RGBA", (tw, th), (*bg, 255))

    px = (tw - rw) // 2
    py = (th - rh) // 2
    canvas.paste(main, (px, py), main)
    return canvas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("inp")
    ap.add_argument("out")
    ap.add_argument("--w", type=int, required=True)
    ap.add_argument("--h", type=int, required=True)
    args = ap.parse_args()

    img = Image.open(args.inp)
    out_img = extend_image(img, args.w, args.h)

    # 🧹 borrar salida previa si existe
    if os.path.exists(args.out):
        os.remove(args.out)

    if args.out.lower().endswith((".jpg", ".jpeg")):
        out_img = out_img.convert("RGB")

    out_img.save(args.out)
    print(f"OK: {args.out} ({args.w}x{args.h}) generado")


if __name__ == "__main__":
    main()

#py -3 extend_banner.py media\promocion1.png media\promocion1_final.png --w 2600 --h 600
#py -3 extend_banner.py media\promocion2.png media\promocion2_final.png --w 2950 --h 755
#py -3 extend_banner.py media\promocion3.png media\promocion3_final.png --w 2950 --h 755
#py -3 extend_banner.py media\promocion4.png media\promocion4_final.png --w 2950 --h 755
