// Redimensiona y comprime una imagen en el navegador antes de subirla,
// usando Canvas (sin librerías externas).
export async function comprimirImagen(file, opciones = {}) {
  const { maxWidth = 1600, maxHeight = 1600, calidad = 0.8 } = opciones

  const bitmap = await createImageBitmap(file)
  let { width, height } = bitmap
  const ratio = Math.min(1, maxWidth / width, maxHeight / height)
  width = Math.round(width * ratio)
  height = Math.round(height * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(bitmap, 0, 0, width, height)

  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', calidad))
  const nombre = file.name.replace(/\.[^.]+$/, '') + '.webp'
  return new File([blob], nombre, { type: 'image/webp' })
}