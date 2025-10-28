// scripts.js
import { renderFAQList, renderStateMessage } from './FaqRenderer.js';

// Biến toàn cục để lưu trữ FAQ
let allFaqs = [];

// === HÀM LẤY DOM ===
function getDOMElements() {
  return {
    faqList: document.getElementById('faq-list'),
    searchInput: document.getElementById('faq-search'),
    suggestionsBox: document.getElementById('suggestions'),
  };
}

// === HÀM XỬ LÝ DỮ LIỆU VÀ GỌI RENDER ===

async function loadFAQs(faqListElement) {
  // 1. Loading state
  faqListElement.innerHTML = renderStateMessage('Loading questions...');
  
  try {
    const response = await fetch('faqs.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!data || data.length === 0) {
      // 2. Empty state
      faqListElement.innerHTML = renderStateMessage('No questions found at this time.');
    } else {
      // 3. Success state
      allFaqs = data;
      faqListElement.innerHTML = renderFAQList(allFaqs);
      addAccordionEvents(); // Gắn sự kiện sau khi render
    }
  } catch (error) {
    // 4. Error state
    console.error("Failed to fetch FAQs:", error);
    faqListElement.innerHTML = renderStateMessage('Could not load questions. Please try again later.');
  }
}

// === HÀM GẮN SỰ KIỆN (Không đổi) ===

function addAccordionEvents() {
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    const clickHandler = () => {
      const item = btn.closest('.faq-item');
      // ... (logic click handler giữ nguyên)
      const isActive = item.classList.contains('active');
      const answer = item.querySelector('.faq-item__answer');
      const icon = item.querySelector('.faq-item__icon');
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-item__answer').style.maxHeight = null;
          other.querySelector('.faq-item__icon').classList.replace('fa-minus', 'fa-plus');
          other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
        }
      });
      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        icon.classList.replace('fa-minus', 'fa-plus');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.replace('fa-plus', 'fa-minus');
        btn.setAttribute('aria-expanded', 'true');
      }
    };
    btn.removeEventListener('click', clickHandler);
    btn.addEventListener('click', clickHandler);
    
    const keydownHandler = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        clickHandler();
      }
    };
    btn.removeEventListener('keydown', keydownHandler);
    btn.addEventListener('keydown', keydownHandler);
  });
}

function scrollToFAQ(index) {
  const item = document.querySelector(`.faq-item[data-index="${index}"]`);
  if (item) {
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const questionBtn = item.querySelector('.faq-item__question');
      if (!item.classList.contains('active')) {
         questionBtn.click();
      }
      questionBtn.focus();
    }, 500);
  }
}

// === HÀM KHỞI CHẠY (ENTRY POINT) ===

function initializeApp() {
  const { faqList, searchInput, suggestionsBox } = getDOMElements();
  
  // 1. Tải FAQs
  if (faqList) {
    loadFAQs(faqList);
  }

  // 2. Gắn sự kiện Search
  if(searchInput) {
    searchInput.addEventListener('input', () => {
      const { faqList } = getDOMElements(); // Lấy lại faqList
      const query = searchInput.value.toLowerCase().trim();
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';

      if (!query) {
        faqList.innerHTML = renderFAQList(allFaqs);
        addAccordionEvents();
        return;
      }
      const matches = allFaqs
        .map((faq, i) => ({ ...faq, index: i }))
        .filter(faq => faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query));

      if (matches.length > 0) {
        suggestionsBox.style.display = 'block';
        matches.slice(0, 5).forEach((match) => {
          const div = document.createElement('div');
          // ... (logic suggestions giữ nguyên)
          div.className = 'suggestion-item';
          div.textContent = match.q;
          div.setAttribute('tabindex', '0');
          div.onclick = () => {
            searchInput.value = match.q;
            suggestionsBox.style.display = 'none';
            scrollToFAQ(match.index);
          };
          div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') div.click();
          });
          suggestionsBox.appendChild(div);
        });
        
        faqList.innerHTML = renderFAQList(matches);
        addAccordionEvents();
      } else {
        faqList.innerHTML = renderStateMessage('No questions match your search.');
      }
    });
  }

  // 3. Đóng Suggestions (giữ nguyên)
  if(searchInput && suggestionsBox) {
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
        suggestionsBox.style.display = 'none';
      }
    });
  }

  // 4. Theme toggle (giữ nguyên)
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    // ... (logic theme toggle giữ nguyên)
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeSwitch.checked = true;
    }
    themeSwitch.addEventListener('change', () => {
      const theme = themeSwitch.checked ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }
}

// === LẮNG NGHE SỰ KIỆN DOM ===
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}