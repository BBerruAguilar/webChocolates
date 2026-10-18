import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { GiftBox3D, giftThumbnail, type GiftSlot } from '@/components/gift/GiftBox3D'
import { MonkeyCourier } from '@/components/gift/MonkeyCourier'
import { ChevronIcon, CloseIcon, SearchIcon, WhatsAppIcon } from '@/components/icons/Icons'
import {
  DEDICATION_MAX_LENGTH,
  GIFT_BOX_PRODUCTS,
  GIFT_BOX_SIZES,
  type GiftBoxSize,
} from '@/data/giftBox'
import { ROUTE_HREF } from '@/hooks/useHashRoute'
import { prefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { cartTotal, formatPrice } from '@/services/pricing'
import { searchProducts } from '@/services/search'
import { throwImage } from '@/services/throwAnimation'
import { sendWhatsAppGift } from '@/services/whatsapp'
import type { CartLine, Product } from '@/types/product'
import './GiftBoxPage.css'

type Slot = GiftSlot
const thumbnail = giftThumbnail

/**
 * Pasos del regalo:
 * - elegir: la caja (izquierda) se llena con las tabletas elegidas (derecha).
 * - dedicatoria: la caja empaquetada viaja a la derecha y el formulario aparece a la izquierda.
 * - pago: resumen del pedido; el pago se coordina por WhatsApp. Al enviar, un mono llega
 *   balanceándose y se lleva la caja.
 * - enviado: queda la confirmación.
 */
type Step = 'elegir' | 'dedicatoria' | 'pago' | 'enviado'

/** Atajos del buscador de la caja: sabores y tamaños más pedidos. */
const GIFT_SEARCH_SUGGESTIONS = ['Maní', 'Café', 'Bitter', 'Blanco', '30 gr', '80 gr']

const DEDICATION_FIELDS = ['to', 'from', 'message'] as const
type DedicationField = (typeof DEDICATION_FIELDS)[number]

const STEPS: { id: Exclude<Step, 'enviado'>; label: string }[] = [
  { id: 'elegir', label: 'Elige tus chocolates' },
  { id: 'dedicatoria', label: 'Dedicatoria' },
  { id: 'pago', label: 'Pago' },
]

/** Cuánto se espera, con la caja ya cerrada y con lazo, antes de pasar a la dedicatoria. */
const AUTO_ADVANCE_MS = 2300

/** Agrupa los espacios llenos en líneas "cantidad x producto" para el resumen y el pedido. */
function toLines(slots: Slot[]): CartLine[] {
  const lines = new Map<number, CartLine>()
  for (const slot of slots) {
    if (!slot) continue
    const line = lines.get(slot.product.id)
    if (line) line.quantity += 1
    else lines.set(slot.product.id, { product: slot.product, quantity: 1 })
  }
  return [...lines.values()]
}

export function GiftBoxPage() {
  const [step, setStep] = useState<Step>('elegir')
  const [size, setSize] = useState<GiftBoxSize>(6)
  const [slots, setSlots] = useState<Slot[]>(() => Array(6).fill(null))
  // Copia sincrónica del estado: dos toques rápidos no deben caer en el mismo espacio.
  const slotsRef = useRef(slots)
  const boxRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const vehicleRef = useRef<HTMLDivElement>(null)
  const vehicleBefore = useRef<DOMRect | null>(null)
  const [effect, setEffect] = useState<'none' | 'bump' | 'shake'>('none')
  // La tapa empieza cerrada y se abre al entrar; al completar la caja se cierra sola.
  const [introDone, setIntroDone] = useState(false)
  const [peeking, setPeeking] = useState(false)
  // El mono mensajero está llevándose la caja.
  const [delivering, setDelivering] = useState(false)
  // Pedido enviado: evita un segundo clic mientras la página sube hasta la caja.
  const [sending, setSending] = useState(false)
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  // Buscador de tabletas del primer paso.
  const [productQuery, setProductQuery] = useState('')
  // Los errores de la dedicatoria se muestran recién al intentar continuar.
  const [showErrors, setShowErrors] = useState(false)

  const commit = (next: Slot[]) => {
    slotsRef.current = next
    setSlots(next)
  }

  const filled = slots.filter(Boolean).length
  const lines = toLines(slots)
  const chocolatesTotal = cartTotal(lines)
  const complete = filled === size
  const allLanded = slots.every(slot => slot?.landed)
  const packed = complete && allLanded && (step !== 'elegir' || !peeking)
  const closed = !introDone || packed
  const order = { size, lines, to, from, message }
  const searchingProducts = productQuery.trim().length > 0
  const shownProducts = searchingProducts
    ? searchProducts(GIFT_BOX_PRODUCTS, productQuery, GIFT_BOX_PRODUCTS.length)
    : GIFT_BOX_PRODUCTS
  const dedicationErrors: Record<DedicationField, string> = {
    to: to.trim() ? '' : 'Escribe para quién es el regalo',
    from: from.trim() ? '' : 'Escribe tu nombre',
    message: message.trim() ? '' : 'Escribe unas palabras para la tarjeta',
  }
  const errorOf = (field: DedicationField) => (showErrors ? dedicationErrors[field] : '')

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), 450)
    return () => window.clearTimeout(timer)
  }, [])

  // Si cambia el contenido, la caja vuelve a su comportamiento normal (se cierra al completarse).
  useEffect(() => setPeeking(false), [filled])

  /** Cambia de paso recordando dónde estaba la caja, para animar su viaje hasta el nuevo lugar. */
  function goTo(next: Step) {
    // En pantallas angostas los pasos se apilan: si la caja quedó tapada por el menú, se sube
    // al inicio del escenario antes de medir (scroll-margin-top deja libre el alto del menú).
    const stage = stageRef.current
    const navHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height ?? 0
    if (stage && stage.getBoundingClientRect().top < navHeight) stage.scrollIntoView({ block: 'start' })
    vehicleBefore.current = vehicleRef.current?.getBoundingClientRect() ?? null
    if (next === 'elegir') setPeeking(true) // al volver, la caja se abre para poder cambiar algo
    setStep(next)
  }

  // Viaje de la caja (técnica FLIP): se dibuja en su nuevo lugar y se anima desde el anterior.
  useLayoutEffect(() => {
    const vehicle = vehicleRef.current
    const before = vehicleBefore.current
    vehicleBefore.current = null
    if (!vehicle || !before || prefersReducedMotion()) return

    const after = vehicle.getBoundingClientRect()
    const dx = before.left - after.left
    const dy = before.top - after.top
    if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return

    const direction = dx < 0 ? 1 : -1 // hacia dónde viaja: se inclina un poco en esa dirección
    vehicle.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 14}px) rotate(${direction * 3}deg)`, offset: 0.4 },
        { transform: `translate(0, 4px) rotate(${-direction * 1.2}deg)`, offset: 0.85 },
        { transform: 'none' },
      ],
      { duration: 1000, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
    )
  }, [step])

  // Caja completa y con lazo: tras un momento viaja sola a la dedicatoria.
  useEffect(() => {
    if (step !== 'elegir' || !packed || !introDone) return
    const timer = window.setTimeout(() => goTo('dedicatoria'), AUTO_ADVANCE_MS)
    return () => window.clearTimeout(timer)
  }, [step, packed, introDone])

  function changeSize(next: GiftBoxSize) {
    setSize(next)
    commit(Array.from({ length: next }, (_, index) => slotsRef.current[index] ?? null))
  }

  function addProduct(product: Product, source: HTMLElement) {
    const index = slotsRef.current.findIndex(slot => slot === null)
    if (index === -1) {
      setEffect('shake') // caja llena: se sacude
      return
    }

    commit(slotsRef.current.map((slot, i) => (i === index ? { product, landed: false } : slot)))
    const land = () => {
      commit(slotsRef.current.map((slot, i) => (i === index && slot?.product.id === product.id ? { ...slot, landed: true } : slot)))
      setEffect('bump') // la caja se hunde un poco al recibir la tableta
    }

    const target = boxRef.current?.querySelector(`[data-gift-slot="${index}"]`)
    if (!target) return land()

    const slotRect = target.getBoundingClientRect()
    void throwImage({
      src: thumbnail(product),
      from: source.getBoundingClientRect(),
      // Llega sobre la caja y la tableta real termina de caer adentro (animación "drop").
      to: { x: slotRect.x, y: slotRect.y - slotRect.height * 0.45, width: slotRect.width, height: slotRect.height },
      peak: 160,
      duration: 750,
      tilt: index % 2 === 0 ? -18 : 18,
      fit: 'cover',
      objectPosition: product.imgPosition,
      radius: '3px',
      className: 'is-gift',
    }).then(land)
  }

  function removeAt(index: number) {
    commit(slotsRef.current.map((slot, i) => (i === index ? null : slot)))
  }

  function sendOrder() {
    // WhatsApp se abre en el mismo clic (si no, el navegador puede bloquear la ventana).
    sendWhatsAppGift(order)
    if (prefersReducedMotion()) return setStep('enviado')

    setSending(true)
    // En pantallas angostas la caja puede quedar fuera de vista: primero se sube hasta ella.
    const vehicle = vehicleRef.current
    const rect = vehicle?.getBoundingClientRect()
    const navHeight = document.querySelector('.site-nav')?.getBoundingClientRect().height ?? 0
    if (vehicle && rect && (rect.top < navHeight || rect.bottom > window.innerHeight)) {
      // El mono se ubica según dónde está la caja: se espera a que el desplazamiento termine.
      let started = false
      const start = () => {
        if (started) return
        started = true
        document.removeEventListener('scrollend', start)
        setDelivering(true)
      }
      document.addEventListener('scrollend', start)
      window.setTimeout(start, 1200) // por si el navegador no emite "scrollend"
      vehicle.scrollIntoView({ behavior: 'smooth', block: 'center' })
    } else {
      setDelivering(true)
    }
  }

  function finishDelivery() {
    setDelivering(false)
    setSending(false)
    setStep('enviado')
  }

  function startOver() {
    commit(Array(size).fill(null))
    setTo('')
    setFrom('')
    setMessage('')
    setShowErrors(false)
    setPeeking(false)
    setStep('elegir')
  }

  /** La dedicatoria es obligatoria: sin los tres campos no se pasa al pago. */
  function submitDedication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const invalid = DEDICATION_FIELDS.find(field => dedicationErrors[field])
    if (!invalid) return goTo('pago')
    setShowErrors(true)
    const input = event.currentTarget.elements.namedItem(invalid)
    if (input instanceof HTMLElement) input.focus()
  }

  const stepIndex = STEPS.findIndex(item => item.id === step)

  return (
    <main className="gift-page">
      <header className="gift-header">
        <a className="gift-back" href={ROUTE_HREF.home}>
          <ChevronIcon direction="left" className="icon" />
          Volver a la tienda
        </a>
        <h1>Arma tu caja de regalo</h1>
        <ol className="gift-stepper" aria-label="Pasos">
          {STEPS.map((item, index) => {
            const done = step === 'enviado' || index < stepIndex
            return (
              <li key={item.id} className={item.id === step ? 'is-current' : done ? 'is-done' : ''}>
                <button
                  type="button"
                  disabled={!done || step === 'enviado'}
                  onClick={() => goTo(item.id)}
                  aria-current={item.id === step ? 'step' : undefined}
                >
                  <span className="gift-stepper-dot" aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ol>
      </header>

      <div ref={stageRef} className="gift-stage" data-step={step}>
        {/* ===== La caja (y el carrito en el pago). Siempre es el mismo elemento: así puede viajar. ===== */}
        {step !== 'enviado' && (
          <section className="gift-box-column" aria-label="Tu caja">
            {step === 'elegir' && (
              <div className="gift-sizes" role="radiogroup" aria-label="Tamaño de la caja">
                {GIFT_BOX_SIZES.map(option => (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={size === option}
                    className={size === option ? 'is-active' : ''}
                    onClick={() => changeSize(option)}
                  >
                    <strong>{option}</strong> tabletas
                  </button>
                ))}
              </div>
            )}

            <div ref={vehicleRef} className="gift-vehicle">
              <GiftBox3D
                ref={boxRef}
                slots={slots}
                closed={closed}
                ribbon={closed && introDone}
                recipient={step === 'elegir' ? '' : to}
                effect={effect}
                onEffectEnd={() => setEffect('none')}
                onRemove={removeAt}
                onLidClick={() => step === 'elegir' && setPeeking(true)}
              />
            </div>

            {step === 'elegir' && (
              <p className="gift-count">
                {packed ? (
                  <>
                    <strong className="gift-ready">¡Lista para regalar!</strong>
                    <span>Empaquetando tu caja</span>
                  </>
                ) : (
                  <>
                    {filled} de {size} tabletas
                    {filled > 0 && <span>Toca una tableta de la caja para quitarla</span>}
                  </>
                )}
              </p>
            )}

            {step === 'elegir' && complete && allLanded && peeking && (
              <button type="button" className="gift-primary" onClick={() => setPeeking(false)}>
                Cerrar la caja y continuar
              </button>
            )}
          </section>
        )}

        {/* ===== Panel del paso actual ===== */}
        <div key={step} className="gift-panel">
          {step === 'elegir' && (
            <section aria-labelledby="gift-title-elegir">
              <h2 id="gift-title-elegir">Elige tus chocolates</h2>
              <p className="gift-panel-text">Toca una tableta y se lanzará a la caja. Cuando la llenes, la empaquetamos.</p>
              <div className="gift-search">
                <label className="gift-search-box">
                  <SearchIcon className="icon" />
                  <input
                    type="search"
                    value={productQuery}
                    onChange={event => setProductQuery(event.target.value)}
                    placeholder="Busca por sabor o tamaño"
                    aria-label="Buscar tabletas para la caja"
                    aria-controls="gift-products"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {searchingProducts && (
                    <button type="button" onClick={() => setProductQuery('')} aria-label="Borrar búsqueda" title="Borrar">
                      <CloseIcon className="icon" />
                    </button>
                  )}
                </label>
                <div className="gift-search-chips" aria-label="Búsquedas sugeridas">
                  {GIFT_SEARCH_SUGGESTIONS.map(word => (
                    <button
                      key={word}
                      type="button"
                      className={productQuery === word ? 'is-active' : ''}
                      aria-pressed={productQuery === word}
                      onClick={() => setProductQuery(productQuery === word ? '' : word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {shownProducts.length === 0 && (
                <p className="gift-search-empty" role="status">
                  No hay tabletas con "{productQuery.trim()}". Prueba con maní, café o bitter.
                </p>
              )}

              <div id="gift-products" className="gift-products">
                {shownProducts.map(product => {
                  const count = slots.filter(slot => slot?.product.id === product.id).length
                  return (
                    <button
                      key={product.id}
                      type="button"
                      className="gift-product"
                      onClick={event => addProduct(product, event.currentTarget.querySelector('img') ?? event.currentTarget)}
                      aria-label={`Agregar ${product.name} a la caja`}
                    >
                      <img src={thumbnail(product)} alt="" loading="lazy" style={{ objectPosition: product.imgPosition }} />
                      <span className="gift-product-name">{product.name}</span>
                      <span className="gift-product-detail">
                        {product.weight} <strong>{formatPrice(product.price)}</strong>
                      </span>
                      {count > 0 && <span className="gift-product-count">{count}</span>}
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {step === 'dedicatoria' && (
            <section aria-labelledby="gift-title-dedicatoria">
              <h2 id="gift-title-dedicatoria">Dedicatoria</h2>
              <p className="gift-panel-text">Escribe para quién es tu regalo. La tarjeta viaja junto con la caja.</p>
              <form id="gift-dedication" className="gift-fields" noValidate onSubmit={submitDedication}>
                <label className={errorOf('to') ? 'is-invalid' : ''}>
                  Para
                  <input
                    name="to"
                    value={to}
                    onChange={event => setTo(event.target.value)}
                    maxLength={40}
                    placeholder="Nombre"
                    required
                    aria-invalid={Boolean(errorOf('to'))}
                    aria-describedby="gift-error-to"
                  />
                  <small id="gift-error-to" className="gift-field-error">{errorOf('to')}</small>
                </label>
                <label className={errorOf('from') ? 'is-invalid' : ''}>
                  De
                  <input
                    name="from"
                    value={from}
                    onChange={event => setFrom(event.target.value)}
                    maxLength={40}
                    placeholder="Tu nombre"
                    required
                    aria-invalid={Boolean(errorOf('from'))}
                    aria-describedby="gift-error-from"
                  />
                  <small id="gift-error-from" className="gift-field-error">{errorOf('from')}</small>
                </label>
                <label className={`gift-field-wide${errorOf('message') ? ' is-invalid' : ''}`}>
                  Mensaje
                  <textarea
                    name="message"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    maxLength={DEDICATION_MAX_LENGTH}
                    rows={4}
                    placeholder="Escribe unas palabras para acompañar tu regalo"
                    required
                    aria-invalid={Boolean(errorOf('message'))}
                    aria-describedby="gift-error-message"
                  />
                  <span className="gift-field-foot">
                    <small id="gift-error-message" className="gift-field-error">{errorOf('message')}</small>
                    <small>
                      {message.length}/{DEDICATION_MAX_LENGTH}
                    </small>
                  </span>
                </label>
              </form>

              {(to || message || from) && (
                <div className="gift-card" aria-label="Vista previa de la dedicatoria">
                  {to && <p className="gift-card-to">Para {to}</p>}
                  {message && <p className="gift-card-message">{message}</p>}
                  {from && <p className="gift-card-from">De {from}</p>}
                </div>
              )}

              <div className="gift-actions">
                <button type="button" className="gift-secondary" onClick={() => goTo('elegir')}>
                  <ChevronIcon direction="left" className="icon" />
                  Cambiar chocolates
                </button>
                <button type="submit" form="gift-dedication" className="gift-primary">
                  Continuar al pago
                  <ChevronIcon direction="right" className="icon" />
                </button>
              </div>
            </section>
          )}

          {step === 'pago' && (
            <section aria-labelledby="gift-title-pago">
              <h2 id="gift-title-pago">Pago</h2>
              <ul className="gift-summary">
                {lines.map(({ product, quantity }) => (
                  <li key={product.id}>
                    <span>
                      {quantity} x {product.name}
                    </span>
                    <span>{formatPrice(product.price * quantity)}</span>
                  </li>
                ))}
                {/* El precio de la caja lo confirma el dueño por WhatsApp. */}
                <li>
                  <span>Caja de regalo de {size}</span>
                  <span className="gift-summary-note">Se coordina por WhatsApp</span>
                </li>
                <li className="gift-summary-total">
                  <span>Total chocolates</span>
                  <strong>{formatPrice(chocolatesTotal)}</strong>
                </li>
              </ul>

              <p className="gift-panel-text gift-pay-note">
                Al enviar tu pedido por WhatsApp te confirmamos el precio de la caja, te pasamos los datos de pago y
                coordinamos la entrega. Un mensajero de la selva se encargará de tu caja.
              </p>

              <button type="button" className="gift-order" disabled={sending} onClick={sendOrder}>
                <WhatsAppIcon className="icon" />
                Enviar pedido por WhatsApp
              </button>
              <button type="button" className="gift-secondary gift-back-step" onClick={() => goTo('dedicatoria')}>
                <ChevronIcon direction="left" className="icon" />
                Volver a la dedicatoria
              </button>
            </section>
          )}

          {step === 'enviado' && (
            <section className="gift-done" aria-live="polite">
              <h2>¡Tu caja va en camino!</h2>
              <p className="gift-panel-text">
                Abrimos WhatsApp con tu pedido. Allí te confirmamos el pago y coordinamos la entrega.
              </p>
              <div className="gift-actions">
                <button type="button" className="gift-secondary" onClick={() => sendWhatsAppGift(order)}>
                  <WhatsAppIcon className="icon" />
                  ¿No se abrió? Enviar de nuevo
                </button>
                <button type="button" className="gift-primary" onClick={startOver}>
                  Armar otra caja
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <MonkeyCourier active={delivering} boxRef={boxRef} onDone={finishDelivery} />
    </main>
  )
}
