"""
Genera una copia .webp optimizada al lado de cada imagen de src/resources.
En imágenes sin fondo también recorta el margen transparente sobrante.
Las imágenes originales NO se modifican; el código importa las versiones .webp.

Uso (desde la raíz del proyecto):
    python scripts/optimize-images.py

Requiere Pillow:  pip install pillow
Solo procesa imágenes nuevas o modificadas (compara fechas), así que se puede correr siempre.
"""

from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent / "src" / "resources"
SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg"}
MAX_SIDE = 1400  # px: suficiente para pantallas retina sin pesar de más
QUALITY = 82


def optimize(source: Path) -> None:
    target = source.with_suffix(".webp")
    if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
        return

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)  # respeta la rotación de fotos de celular
        has_alpha = image.mode in ("RGBA", "LA") or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        if has_alpha:
            # Quita el espacio transparente alrededor del producto para que se vea a su tamaño real.
            bounds = image.getchannel("A").getbbox()
            if bounds:
                image = image.crop(bounds)
        image.thumbnail((MAX_SIDE, MAX_SIDE), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=QUALITY, method=6)

    before = source.stat().st_size / 1024
    after = target.stat().st_size / 1024
    print(f"{source.relative_to(ROOT)}: {before:,.0f} KB -> {after:,.0f} KB")


def main() -> None:
    sources = [p for p in ROOT.rglob("*") if p.suffix.lower() in SOURCE_EXTENSIONS]
    for source in sorted(sources):
        optimize(source)
    print(f"Listo: {len(sources)} imágenes revisadas en {ROOT}")


if __name__ == "__main__":
    main()
