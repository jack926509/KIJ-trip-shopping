/* 註冊離線快取。三頁共用同一支，避免同一段註冊碼手抄三份後各自漂移。
 *
 * 相對路徑 './sw.js' 是刻意的：它相對目前頁面解析，
 * 因此部署在網域根目錄或 GitHub Pages 的子路徑底下都能正確取得 scope。
 *
 * 註冊失敗一律靜靜略過：service worker 只是加分項，
 * 沒有它網站照常運作（無痕模式、舊瀏覽器、非 HTTPS 都可能沒有）。
 * 為了一個加分項在主控台噴錯或中斷頁面並不值得。 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* 沒有離線能力而已，頁面本身不受影響。 */
    });
  });
}
