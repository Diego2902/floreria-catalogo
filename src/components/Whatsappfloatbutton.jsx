import { shopConfig, whatsappLink } from '../config'

export default function WhatsAppFloatButton() {
  if (!shopConfig.whatsappNumber) return null

  return (
    <a
      href={whatsappLink(`Hola! Quisiera más información sobre sus flores, arreglos y servicios.`)}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="Escribir por WhatsApp"
      title="Escribir por WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="white" aria-hidden="true">
        <path d="M12.02 2C6.5 2 2.03 6.47 2.03 12c0 1.86.5 3.6 1.38 5.1L2 22l5.06-1.33A9.94 9.94 0 0 0 12.02 22C17.55 22 22 17.53 22 12S17.55 2 12.02 2zm0 18.1c-1.68 0-3.24-.47-4.57-1.28l-.33-.2-3 .79.8-2.92-.21-.3A8.07 8.07 0 0 1 3.93 12c0-4.47 3.63-8.1 8.09-8.1S20.1 7.53 20.1 12s-3.63 8.1-8.08 8.1zm4.44-6.06c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35 1 2.51c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.15.2-.56.2-1.04.14-1.15-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  )
}