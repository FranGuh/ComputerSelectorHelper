/**
 * Centralized utility to detect the Operating System from laptop model names or GPU names.
 */

/**
 * Returns true if the model name or GPU indicates an Apple ecosystem device (macOS).
 * @param {string} name - Laptop model name
 * @param {string} [gpu=''] - Laptop GPU name
 * @returns {boolean}
 */
export const isMac = (name = '', gpu = '') => {
  const n = name.toLowerCase();
  const g = gpu.toLowerCase();
  
  if (n.includes('macbook') || n.includes('mac mini') || n.includes('imac') || n.includes('mac studio')) return true;
  if (g.includes('apple') || g.startsWith('m1') || g.startsWith('m2') || g.startsWith('m3') || g.startsWith('m4')) return true;
  
  return false;
};

/**
 * Returns true if the model name indicates a ChromeOS device.
 * @param {string} name - Laptop model name
 * @returns {boolean}
 */
export const isChromeOS = (name = '') => {
  return name.toLowerCase().includes('chromebook');
};

/**
 * Returns true if the device is a Windows PC (fallback if not Mac or ChromeOS).
 * @param {string} name - Laptop model name
 * @param {string} [gpu=''] - Laptop GPU name
 * @returns {boolean}
 */
export const isWindows = (name = '', gpu = '') => {
  return !isMac(name, gpu) && !isChromeOS(name);
};
