// FaqRenderer.js

/**
 * Render danh sách các mục FAQ.
 * @param {Array} items - Mảng các đối tượng FAQ.
 * @returns {string} - Chuỗi HTML của danh sách FAQ.
 */
export function renderFAQList(items) {
  return items.map((faq, i) => {
    const answerId = `faq-answer-${i}`;
    return `
    <div class="faq-item" data-index="${i}">
      <button class="faq-item__question" 
              aria-expanded="false" 
              aria-controls="${answerId}">
        <span>${faq.q}</span>
        <i class="faq-item__icon fas fa-plus"></i>
      </button>
      <div class="faq-item__answer" 
           id="${answerId}" 
           role="region">
        <p>${faq.a}</p>
      </div>
    </div>
  `;
  }).join('');
}

/**
 * Render thông báo trạng thái (Loading, Error, Empty).
 * @param {string} message - Thông báo cần hiển thị.
 * @returns {string} - Chuỗi HTML của thông báo.
 */
export function renderStateMessage(message) {
  return `<p class="faq-state">${message}</p>`;
}