import { WhatsAppIcon } from '@/components/icons/Icons'
import { WHATSAPP_CONTACT_URL } from '@/services/whatsapp'
import './WhatsAppButton.css'

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={WHATSAPP_CONTACT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Comunicarse directamente con el vendedor por WhatsApp"
    >
      <WhatsAppIcon />
      <span className="whatsapp-tooltip" role="tooltip">
        Comunícate directamente con el vendedor
      </span>
    </a>
  )
}
