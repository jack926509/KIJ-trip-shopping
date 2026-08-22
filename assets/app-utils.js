export function readStoredBool(key, fallback = false) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return value === '1' || value === 'true';
  } catch {
    return fallback;
  }
}

export function writeStoredBool(key, value) {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    /* 無痕模式或儲存空間不可用時，畫面仍可正常操作。 */
  }
}

export function makeImageFallback(letter) {
  const element = document.createElement('div');
  element.className = 'kij-img-fallback';
  element.textContent = letter;
  return element;
}
