/**
 * shareUtils.js — Encode/decode quiz answers as base64 URL params.
 * Zero dependencies, no backend required.
 * Usage: /quiz?plan=<encoded>
 */

/**
 * Encodes quiz answers object into a URL-safe base64 string.
 * @param {Object} answers
 * @returns {string}
 */
export const encodeAnswers = (answers) => {
  try {
    return btoa(encodeURIComponent(JSON.stringify(answers)))
  } catch {
    return ''
  }
}

/**
 * Decodes a base64 plan string back into answers object.
 * Returns null if decoding fails.
 * @param {string} encoded
 * @returns {Object|null}
 */
export const decodeAnswers = (encoded) => {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
  }
}

/**
 * Builds the full shareable URL for the current result.
 * @param {Object} answers
 * @returns {string}
 */
export const buildShareUrl = (answers) => {
  const encoded = encodeAnswers(answers)
  return encoded ? `${window.location.origin}/quiz?plan=${encoded}` : window.location.href
}

/**
 * Generates a WhatsApp-friendly text summary of the result.
 * @param {Object} result - computed specs object
 * @param {string} shareUrl
 * @returns {string}
 */
export const buildWhatsAppText = (result, shareUrl) => {
  if (!result) return shareUrl
  return encodeURIComponent(
    `💻 *Mi recomendación de laptop (Computer Selector Helper)*\n\n` +
    `🔧 Procesador: ${result.processor}\n` +
    `🧠 RAM: ${result.ram}\n` +
    `💾 Almacenamiento: ${result.storage}\n` +
    `🎮 GPU: ${result.gpu}\n` +
    `🖥️ SO: ${result.os}\n\n` +
    `🔗 Ver mi recomendación completa: ${shareUrl}`
  )
}
