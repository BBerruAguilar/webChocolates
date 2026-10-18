const CLOUDINARY_BASE = 'https://res.cloudinary.com/ytmafyip/image/upload/'

/** Widths offered in srcSet. Cloudinary resizes on the fly and caches each variant. */
const RESPONSIVE_WIDTHS = [480, 800, 1200, 1600]

/** URLs completas o assets importados por Vite se usan tal cual, sin pasar por Cloudinary. */
const isExternal = (path: string) => /^(https?:|data:|blob:|\/)/.test(path)

/** Agrega formato y calidad automáticos y limita el ancho para que las imágenes carguen rápido. */
export function cloudinaryUrl(path: string, width = 1200) {
  if (isExternal(path)) return path
  return `${CLOUDINARY_BASE}f_auto,q_auto,w_${width}/${path}`
}

export function cloudinarySrcSet(path: string, widths = RESPONSIVE_WIDTHS) {
  if (isExternal(path)) return undefined
  return widths.map(width => `${cloudinaryUrl(path, width)} ${width}w`).join(', ')
}
