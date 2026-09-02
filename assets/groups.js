/* 商品分頁（group）的唯一來源。
 *
 * 這份清單先前散在四個地方：index.html 的分頁按鈕、index-app.js 的
 * GROUPS 與 GROUP_META、validate-products.mjs 的 VALID_GROUP。
 * 新增一個分類要同步改四處，漏掉任何一處都不會有錯誤訊息——
 * 只是那個分頁在畫面上不存在，或是驗證器擋下合法的資料。
 *
 * index.html 的分頁按鈕刻意仍寫在 HTML 裡而不是由 JS 產生：
 * 靜態標記在 JS 載入前就看得到，現場開頁不會先閃一排空白。
 * 「不得漂移」這個約束改由測試檢查 HTML 與本檔逐項相符來保證。 */

export const GROUPS = ['shopping', 'convenience', 'powerbank', 'dryer', 'mouse', 'shoes'];

export const GROUP_META = {
  shopping: { label: '藥妝日用', icon: '🛍️' },
  convenience: { label: '便利商店', icon: '🏪' },
  powerbank: { label: '行動電源', icon: '🔋' },
  dryer: { label: '吹風機', icon: '💨' },
  mouse: { label: '滑鼠', icon: '🖱️' },
  shoes: { label: '鞋款試穿', icon: '👟' },
};

/* 這三個群組是「選一／選幾個參考」而非每項都要買，tracking 一律是 'try'
 * （已試穿／已選定），不計入「已買 X / N」的購買進度。
 * 狀態列與分區計數要跟著這份清單走，否則改了 tracking 卻漏改顯示邏輯，
 * 就會變成滑鼠／行動電源分頁永遠顯示「已買 0 項」。
 * 測試會比對它與商品資料的 tracking 欄位是否一致。 */
export const TRY_ONLY_GROUPS = new Set(['shoes', 'mouse', 'powerbank']);
