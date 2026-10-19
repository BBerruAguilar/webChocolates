import { useEffect, useRef, useState, type CSSProperties, type TouchEvent } from 'react'
import HeroCanvas from './components/3D/HeroCanvas'
import { 
  products, 
  heroSlides, 
  fondoFormas,
  imgMiniTabletasWayu,
  imgCascarillaMikhuna,
  imgCacaoPolvo,
  type Product, 
  type Filter, 
  type FondoForma 
} from './data/products'



const WHATSAPP_NUMBER = '51923400158'
const WHATSAPP_CONTACT_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hola, quisiera recibir información sobre sus chocolates artesanales.',
)}`

function parsePrice(price: string) {
  const amount = price.match(/\d+(?:[.,]\d+)?/)?.[0]
  return amount ? Number(amount.replace(',', '.')) : 0
}

function getProductWeight(product: Product) {
  return [...product.tags, product.subtitle]
    .map(value => value.match(/\b\d+\s*(?:gr|g)\b/i)?.[0])
    .find(Boolean)
}

function productCategoryOrder(product: Product) {
  if (product.name.startsWith('Grageas')) return 1
  if (product.name === 'Cacao en Polvo' || product.name === 'Cascarilla de Cacao') return 2
  return 0
}


function FormaFondo({ forma }: { forma: FondoForma }) {
  const estilo = {
    left: forma.left,
    top: forma.top,
    width: forma.width,
    '--dx': forma.dx,
    '--dy': forma.dy,
    '--r0': forma.r0,
    '--r1': forma.r1,
    animationDuration: forma.duracion,
    animationDelay: forma.retraso,
  } as CSSProperties
  const clase = `site-bg-shape ${forma.tipo}${forma.ocultarEnCelular ? ' hide-mobile' : ''}`

  if (forma.tipo === 'leaf') {
    return (
      <svg className={clase} style={estilo} viewBox="-50 -100 100 200" aria-hidden="true">
        <path d="M0 -92 C 42 -52 42 52 0 92 C -42 52 -42 -52 0 -92 Z" fill="currentColor" />
        <path d="M0 -80 L0 84 M0 -40 L18 -58 M0 -10 L24 -30 M0 22 L22 4 M0 -40 L-18 -58 M0 -10 L-24 -30 M0 22 L-22 4" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (forma.tipo === 'pod') {
    return (
      <svg className={clase} style={estilo} viewBox="-50 -105 100 210" aria-hidden="true">
        <path d="M0 -98 C 34 -72 46 -10 31 50 C 23 80 8 96 0 102 C -8 96 -23 80 -31 50 C -46 -10 -34 -72 0 -98 Z" fill="currentColor" />
        <path d="M0 -92 C 11 -30 11 40 0 96 M-19 -72 C -28 -10 -22 50 -11 86 M19 -72 C 28 -10 22 50 11 86" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className={clase} style={estilo} viewBox="-40 -60 80 120" aria-hidden="true">
      <ellipse cx="0" cy="0" rx="30" ry="48" fill="currentColor" />
      <path d="M-6 -40 C 9 -14 9 14 -6 40" stroke="#fff" strokeOpacity="0.3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function FondoAnimado() {
  return (
    <div className="site-bg" aria-hidden="true">
      <div className="site-bg-layer site-bg-b" />
      <div className="site-bg-layer site-bg-c" />
      <div className="site-bg-glow" />
      {fondoFormas.map((forma, indice) => (
        <FormaFondo key={indice} forma={forma} />
      ))}
    </div>
  )
}

function CartIcon() {
  return (
    <svg
      className="cart-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

export default function App() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [cart, setCart] = useState<Record<number, number>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('Todos')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartFloating, setCartFloating] = useState(false)

  useEffect(() => {
    if (!selectedProduct && !cartOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (selectedProduct) setSelectedProduct(null)
      else setCartOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedProduct, cartOpen])

  useEffect(() => {
    const updateCartPosition = () => {
      const scrollTop = Math.max(
        window.scrollY,
        document.documentElement.scrollTop,
        document.body.scrollTop,
      )
      setCartFloating(scrollTop > 120)
    }

    updateCartPosition()
    window.addEventListener('scroll', updateCartPosition, { passive: true, capture: true })
    document.addEventListener('scroll', updateCartPosition, { passive: true, capture: true })

    return () => {
      window.removeEventListener('scroll', updateCartPosition, true)
      document.removeEventListener('scroll', updateCartPosition, true)
    }
  }, [])

  function addToCart(id: number) {
    setCart(previous => ({ ...previous, [id]: (previous[id] ?? 0) + 1 }))
  }
  
  function updateQuantity(id: number, change: number) {
    setCart(previous => {
      const nextQuantity = (previous[id] ?? 0) + change
      const nextCart = { ...previous }

      if (nextQuantity <= 0) delete nextCart[id]
      else nextCart[id] = nextQuantity

      return nextCart
    })
  }

  function sendWhatsAppOrder() {
    if (cartItems.length === 0) return

    const productLines = cartItems.map(({ product, quantity }) => {
      const subtotal = parsePrice(product.price) * quantity
      return `- ${quantity} x ${product.name} (${product.subtitle}) — S/. ${subtotal.toFixed(2)}`
    })
    const message = [
      'Hola, quisiera realizar el siguiente pedido:',
      '',
      ...productLines,
      '',
      `Total: S/. ${cartTotal.toFixed(2)}`,
      '',
      '¿Podrían confirmarme la disponibilidad, por favor?',
    ].join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const filtered = (filter === 'Todos' ? [...products] : products.filter(p => p.brand === filter))
    .sort((a, b) => productCategoryOrder(a) - productCategoryOrder(b))
  const cartItems = products
    .filter(product => cart[product.id])
    .map(product => ({ product, quantity: cart[product.id] }))
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, { product, quantity }) => {
    return total + parsePrice(product.price) * quantity
  }, 0)

  function showCollection(nextFilter: Filter = 'Todos') {
    setFilter(nextFilter)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(() => document.querySelector('#catalogo')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }), 0)
  }

  return (
    <div className="app-shell" style={{ minHeight: '100vh', backgroundColor: 'transparent', fontFamily: "'DM Sans', sans-serif" }}>
      <FondoAnimado />

      {/* Nav */}
      <nav className="site-nav" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2.5rem',
        borderBottom: '1px solid var(--c-linea)',
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: 'rgba(207,184,148,0.9)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}>
        <div className="site-brand">
          <div className="site-brand-title" style={{ fontFamily: "'Fraunces', serif", fontSize: '1.4rem', fontWeight: 400, color: 'var(--c-cacao)', letterSpacing: '0.02em' }}>
            Wayu & Mikhuna
          </div>
          <div className="site-brand-subtitle" style={{ fontSize: '0.6rem', color: 'var(--c-texto-suave)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1px' }}>
            Chocolates Artesanales · Perú
          </div>
        </div>
        <div className="site-nav-actions">
          <div className="site-nav-links" style={{ display: 'flex', gap: '2rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--c-texto-suave)' }}>
            {(['Colección', 'Nosotros', 'Contacto'] as const).map(item => (
              <a key={item} href="#" style={{ textDecoration: 'none', color: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-cacao)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-texto-suave)')}>
                {item}
              </a>
            ))}
          </div>
          <button
            type="button"
            className={`cart-summary cart-summary-nav${cartFloating ? ' is-hidden' : ''}`}
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito con ${cartCount} productos`}
            title="Ver carrito"
            aria-hidden={cartFloating}
            tabIndex={cartFloating ? -1 : undefined}
          >
            <CartIcon />
            {cartCount > 0 && <span className="cart-count" aria-live="polite">{cartCount}</span>}
          </button>
        </div>
      </nav>

      {cartFloating && (
        <button
          type="button"
          className="cart-summary is-floating"
          onClick={() => setCartOpen(true)}
          aria-label={`Abrir carrito con ${cartCount} productos`}
          title="Ver carrito"
        >
          <CartIcon />
          {cartCount > 0 && <span className="cart-count" aria-live="polite">{cartCount}</span>}
        </button>
      )}

      <a
        className="whatsapp-float"
        href={WHATSAPP_CONTACT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Comunicarse directamente con el vendedor por WhatsApp"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.93L2.2 22l5.19-1.36A9.98 9.98 0 1 0 12.04 2Zm0 17.96a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.08.81.82-3-.2-.31a8.13 8.13 0 1 1 6.89 3.81Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.23-.08-.39-.12-.56.12-.16.25-.63.79-.77.95-.14.17-.29.19-.53.07-.24-.12-1.03-.38-1.96-1.21a7.37 7.37 0 0 1-1.35-1.68c-.14-.24-.01-.37.11-.49.11-.11.24-.29.36-.43.12-.14.16-.24.24-.41.08-.16.04-.3-.02-.43-.06-.12-.55-1.34-.76-1.83-.2-.48-.41-.41-.56-.42h-.47a.9.9 0 0 0-.65.3c-.22.24-.85.83-.85 2.03 0 1.19.88 2.35 1 2.51.12.16 1.72 2.63 4.17 3.69.58.25 1.04.4 1.39.51.59.18 1.12.16 1.54.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
        </svg>
        <span className="whatsapp-tooltip" role="tooltip">
          Comunícate directamente con el vendedor
        </span>
      </a>

      {/* Hero */}
      <section className="hero-layout">
        <div className="hero-copy">
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--c-verde-texto)', marginBottom: '1.5rem' }}>
            Cacao Fino de Aroma · Tingo María, Perú
          </p>
          <h1 className="hero-title" style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 300, lineHeight: 1.06,
            color: 'var(--c-cacao)', marginBottom: '1.5rem', letterSpacing: '-0.02em',
          }}>
            El sabor que nace<br />
            <em style={{ fontStyle: 'italic', color: 'var(--c-verde-texto)' }}>de la selva</em>
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--c-texto-suave)', maxWidth: '460px', lineHeight: 1.75, marginBottom: '2rem' }}>
            Chocolates artesanales elaborados del grano a la barra con cacao fino de aroma
            de Tingo María. Naturaleza convertida en placer.
          </p>
          <button className="hero-button" onClick={() => showCollection()}>
            Explorar la colección
          </button>
        </div>
        
        {/* Aquí es donde vive la magia 3D ahora */}
        <div className="hero-image" style={{ background: 'transparent' }}>
          <HeroCanvas />
        </div>
      </section>

      {/* Featured collections */}
      <section className="collection-showcase">
        <div className="section-heading">
          <p>Descubre por colección</p>
          <h2>Una expresión distinta del cacao</h2>
        </div>
        <div className="collection-grid">
          {[
            {
              title: 'Mini tabletas',
              eyebrow: 'Wayu · 9 sabores',
              image: imgMiniTabletasWayu,
              position: 'center 45%',
              action: () => showCollection('Wayu Chocolates'),
            },
            {
              title: 'Del cacao a la taza',
              eyebrow: 'Choco Mikhuna · Cascarilla',
              image: imgCascarillaMikhuna,
              position: 'center 48%',
              action: () => showCollection('Choco Mikhuna'),
            },
            {
              title: 'Cacao en polvo',
              eyebrow: 'Wayu · Cacao puro',
              image: imgCacaoPolvo,
              position: 'center 48%',
              action: () => showCollection('Wayu Chocolates'),
            },
          ].map(collection => (
            <button key={collection.title} className="collection-card" onClick={collection.action}>
              <img src={collection.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: collection.position }} />
              <span className="collection-shade" />
              <span className="collection-text">
                <small>{collection.eyebrow}</small>
                <strong>{collection.title}</strong>
                <span>Ver productos →</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="catalog-divider" style={{ margin: '0 2.5rem 0', height: '1px', background: 'linear-gradient(to right, var(--c-linea), transparent)' }} />

      {/* Filter tabs */}
      <div id="catalogo" className="catalog-filters" style={{ padding: '2rem 2.5rem 0', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', scrollMarginTop: '6rem' }}>
        {(['Todos', 'Wayu Chocolates', 'Choco Mikhuna'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.5rem 1.4rem',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              border: filter === f ? '1px solid var(--c-verde)' : '1px solid var(--c-linea-fuerte)',
              backgroundColor: filter === f ? 'var(--c-verde)' : 'transparent',
              color: filter === f ? 'var(--c-hueso)' : 'var(--c-texto-suave)',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f} {f !== 'Todos' && `(${products.filter(p => p.brand === f).length})`}
          </button>
        ))}
        <span className="product-count" style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--c-texto-suave)', alignSelf: 'center', letterSpacing: '0.05em' }}>
          {filtered.length} productos
        </span>
      </div>

      {/* Grid */}
      <section className="catalog-section" style={{ padding: '2.5rem 1.5rem 6rem' }}>
        <div className="product-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
          gap: '1.25rem',
          maxWidth: '1360px',
          margin: '0 auto',
        }}>
          {filtered.map(p => (
            <article
              className="product-card"
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: '3px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid var(--c-linea)',
                backgroundColor: 'var(--c-hueso)',
                cursor: 'pointer',
                transition: 'transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.45s ease',
                transform: hovered === p.id ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hovered === p.id
                  ? '0 18px 40px rgba(58,37,24,0.18)'
                  : '0 2px 12px rgba(58,37,24,0.08)',
              }}
            >
              {/* Image panel */}
              <button
                className="product-image-panel"
                type="button"
                aria-label={`Ampliar foto de ${p.name}`}
                onClick={() => setSelectedProduct(p)}
                style={{
                  position: 'relative', display: 'block', flexShrink: 0, width: '100%', height: '360px',
                  padding: 0, border: 0, background: 'var(--c-linea)', overflow: 'hidden',
                  cursor: 'zoom-in', textAlign: 'left',
                }}
              >

                {/* Product image */}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover',
                    objectPosition: p.imgPosition,
                    transform: hovered === p.id ? 'scale(1.06)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                    zIndex: 2,
                  }}
                />

                {/* Hover description overlay */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 8,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: '1.5rem',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 52%)',
                  opacity: hovered === p.id ? 1 : 0,
                  transition: 'opacity 0.35s ease',
                }}>
                  <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.65 }}>
                    {p.description}
                  </p>
                </div>

                {/* Brand badge */}
                <div style={{
                  position: 'absolute', top: '1rem', left: '1rem', zIndex: 10,
                  padding: '0.28rem 0.7rem',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '2px',
                  fontSize: '0.58rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#fffaf2',
                }}>
                  {p.brand}
                </div>

                {getProductWeight(p) && (
                  <div
                    className="product-weight"
                    style={{
                      borderColor: 'rgba(255,250,242,0.55)',
                      color: '#fffaf2',
                    }}
                  >
                    {getProductWeight(p)}
                  </div>
                )}
              </button>

              {/* Info panel */}
              <div className="product-info" style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                padding: '1.25rem 1.4rem 1.5rem',
                backgroundColor: 'var(--c-hueso)',
                borderTop: '1px solid var(--c-linea)',
              }}>
                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '0.22rem 0.55rem',
                      border: '1px solid rgba(79,107,58,0.4)',
                      color: 'var(--c-verde)',
                      borderRadius: '1px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="product-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                  <h2 style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '1.15rem', fontWeight: 400,
                    color: 'var(--c-cacao)', lineHeight: 1.25, flex: 1,
                  }}>
                    {p.name}
                  </h2>
                  <span style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: '1.1rem', fontWeight: 400,
                    color: 'var(--c-terracota)',
                    whiteSpace: 'nowrap', marginLeft: '1rem', marginTop: '2px',
                  }}>
                    {p.price}
                  </span>
                </div>

                <p style={{ fontSize: '0.73rem', color: 'var(--c-texto-suave)', marginBottom: '1.1rem', letterSpacing: '0.04em', lineHeight: 1.5 }}>
                  {p.subtitle} · {p.origin}
                </p>

                <button
                  onClick={() => addToCart(p.id)}
                  style={{
                    marginTop: 'auto',
                    width: '100%', padding: '0.7rem',
                    fontSize: '0.68rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '2px',
                    border: '1px solid var(--c-verde)',
                    backgroundColor: cart[p.id] ? 'var(--c-verde)' : 'transparent',
                    color: cart[p.id] ? 'var(--c-hueso)' : 'var(--c-verde)',
                    fontWeight: cart[p.id] ? 600 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {cart[p.id] ? `Agregar otro · ${cart[p.id]} en carrito` : 'Agregar al carrito'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Origin strip */}
      <section className="origin-strip" style={{
        padding: '3.5rem 2.5rem',
        borderTop: '1px solid var(--c-linea)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '2rem',
        maxWidth: '1100px', margin: '0 auto',
      }}>
        {[
          { label: 'Origen', value: 'Tingo María, Perú' },
          { label: 'Proceso', value: 'Del grano a la barra' },
          { label: 'Cacao', value: 'Fino de Aroma' },
          { label: 'Productos', value: `${products.length} variedades` },
        ].map(item => (
          <div key={item.label}>
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--c-verde-texto)', marginBottom: '0.5rem' }}>
              {item.label}
            </p>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: '1.05rem', fontWeight: 300, color: 'var(--c-cacao)' }}>
              {item.value}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="site-footer" style={{
        borderTop: '1px solid var(--c-linea)',
        padding: '2rem 2.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <span style={{ fontFamily: "'Fraunces', serif", fontSize: '0.9rem', fontWeight: 300, color: 'var(--c-texto-suave)' }}>
          Wayu Chocolates & Choco Mikhuna © 2026
        </span>
        <p style={{ fontSize: '0.65rem', color: 'var(--c-texto-suave)', letterSpacing: '0.1em' }}>
          Un Placer Natural · Tingo María · Huánuco · Perú
        </p>
      </footer>

      {selectedProduct && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada de ${selectedProduct.name}`}
          onClick={() => setSelectedProduct(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(1rem, 4vw, 3rem)',
            backgroundColor: 'rgba(40,26,17,0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor: 'zoom-out',
          }}
        >
          <div
            onClick={event => event.stopPropagation()}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column',
              maxWidth: 'min(92vw, 1100px)', maxHeight: '92vh',
              cursor: 'default',
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Cerrar imagen ampliada"
              style={{
                alignSelf: 'flex-end', marginBottom: '0.75rem',
                padding: '0.55rem 0.9rem',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: '2px',
                background: 'rgba(10,6,2,0.7)',
                color: '#f5ede0',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Cerrar
            </button>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{
                display: 'block',
                maxWidth: '100%', maxHeight: 'calc(92vh - 5rem)',
                objectFit: 'contain',
                borderRadius: '3px',
                boxShadow: '0 30px 90px rgba(0,0,0,0.7)',
              }}
            />
            <p style={{
              marginTop: '0.8rem',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'Fraunces', serif",
              fontSize: '1rem', fontWeight: 300, textAlign: 'center',
            }}>
              {selectedProduct.name}
            </p>
          </div>
        </div>
      )}

      {cartOpen && (
        <div
          className="cart-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Carrito de compras"
          onClick={() => setCartOpen(false)}
        >
          <aside className="cart-panel" onClick={event => event.stopPropagation()}>
            <div className="cart-header">
              <div>
                <p>Tu pedido</p>
                <h2>Carrito</h2>
              </div>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">
                Cerrar
              </button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="cart-empty">
                  <p>Tu carrito está vacío.</p>
                  <button type="button" onClick={() => setCartOpen(false)}>
                    Ver productos
                  </button>
                </div>
              ) : (
                cartItems.map(({ product, quantity }) => (
                  <article className="cart-item" key={product.id}>
                    <img src={product.image} alt="" loading="lazy" decoding="async" />
                    <div className="cart-item-info">
                      <h3>{product.name}</h3>
                      <p>{product.subtitle}</p>
                      <strong>{product.price}</strong>
                      <div className="quantity-controls" aria-label={`Cantidad de ${product.name}`}>
                        <button type="button" onClick={() => updateQuantity(product.id, -1)} aria-label={`Restar una unidad de ${product.name}`}>
                          −
                        </button>
                        <span aria-live="polite">{quantity}</span>
                        <button type="button" onClick={() => updateQuantity(product.id, 1)} aria-label={`Agregar una unidad de ${product.name}`}>
                          +
                        </button>
                        <button className="remove-item" type="button" onClick={() => updateQuantity(product.id, -quantity)}>
                          Quitar
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div>
                  <span>Total estimado</span>
                  <strong>S/. {cartTotal.toFixed(2)}</strong>
                </div>
                <button type="button" onClick={sendWhatsAppOrder}>
                  Pedir por WhatsApp
                </button>
                <small>Se abrirá WhatsApp con el detalle y las cantidades de tu pedido.</small>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}