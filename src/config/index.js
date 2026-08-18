export const shopConfig = {
  name: import.meta.env.VITE_SHOP_NAME || 'Florería',
  tagline: import.meta.env.VITE_SHOP_TAGLINE || 'Flores frescas para cada ocasión',
  address: import.meta.env.VITE_SHOP_ADDRESS || '',
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  instagram: import.meta.env.VITE_SHOP_INSTAGRAM || '',
}

export function whatsappLink(message) {
  const base = `https://wa.me/${shopConfig.whatsappNumber}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export const CATEGORIES = ['Flores', 'Arreglos', 'Servicios']