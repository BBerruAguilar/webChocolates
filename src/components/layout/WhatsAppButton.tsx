import { WhatsAppIcon } from '@/components/icons/Icons'
import { WHATSAPP_CONTACT_URL } from '@/services/whatsapp'
import './WhatsAppButton.css'

/** Contacto directo: círculo verde que al pasar el mouse se abre en una píldora con texto. */
export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={WHATSAPP_CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <span className="whatsapp-label" aria-hidden="true">
        <strong>Escríbenos</strong>
        <small>Te respondemos al toque</small>
      </span>
      <span className="whatsapp-badge" aria-hidden="true">
        <WhatsAppIcon />
      </span>
    </a>
  )
}
