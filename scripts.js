document.addEventListener('DOMContentLoaded', () => {
  // FAQ Data (English)
  const faqs = [
    {
      q: "What is UniFAQ and how does it work?",
      a: "UniFAQ is a smart FAQ management platform. You add questions and answers to our system, then embed a simple code snippet on your website to display them beautifully and with searchable AI."
    },
    {
      q: "Can I customize the design?",
      a: "Absolutely! UniFAQ offers flexible customization options so you can change colors, fonts, and layout to perfectly match your brand."
    },
    {
      q: "How does the AI-powered search work?",
      a: "Our AI search understands user intent, delivering accurate answers even with typos or different phrasing — drastically reducing search time."
    },
    {
      q: "Does UniFAQ support multiple languages?",
      a: "Yes! UniFAQ supports over 30 languages, automatically detecting the user’s language and showing relevant content."
    },
    {
      q: "Can I integrate UniFAQ with my CMS?",
      a: "Definitely! UniFAQ integrates seamlessly with WordPress, Shopify, Webflow, and any platform that supports HTML embedding."
    }
  ];

  const faqList = document.getElementById('faq-list');
  const searchInput = document.getElementById('faq-search');
  const suggestionsBox = document.getElementById('suggestions');

  // Render FAQs
  function renderFAQs(items) {
    faqList.innerHTML = items.map((faq, i) => `
      <div class="faq-item" data-index="${i}">
        <button class="faq-item__question">
          <span>${faq.q}</span>
          <i class="faq-item__icon fas fa-plus"></i>
        </button>
        <div class="faq-item__answer">
          <p>${faq.a}</p>
        </div>
      </div>
    `).join('');

    // Add click events - **UPDATED SELECTORS FOR BEM**
    document.querySelectorAll('.faq-item__question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        const answer = item.querySelector('.faq-item__answer'); // Updated
        const icon = item.querySelector('.faq-item__icon'); // Updated

        // Close others
        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
            other.querySelector('.faq-item__answer').style.maxHeight = null; // Updated
            other.querySelector('.faq-item__icon').classList.replace('fa-minus', 'fa-plus'); // Updated
          }
        });

        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          icon.classList.replace('fa-minus', 'fa-plus');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.classList.replace('fa-plus', 'fa-minus');
        }
      });
    });
  }

  // Initial render
  renderFAQs(faqs);

  // Search with suggestions
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';

    if (!query) {
      renderFAQs(faqs);
      return;
    }

    const matches = faqs
      .map((faq, i) => ({ ...faq, index: i }))
      .filter(faq => faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query));

    if (matches.length > 0) {
      suggestionsBox.style.display = 'block';
      matches.slice(0, 5).forEach((match, idx) => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = match.q;
        div.onclick = () => {
          searchInput.value = match.q;
          suggestionsBox.style.display = 'none';
          scrollToFAQ(match.index);
        };
        suggestionsBox.appendChild(div);
      });
    }

    renderFAQs(matches.length > 0 ? matches : faqs);
  });

  function scrollToFAQ(index) {
    const item = document.querySelector(`.faq-item[data-index="${index}"]`);
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        // **UPDATED SELECTOR FOR BEM**
        item.querySelector('.faq-item__question').click(); // Updated
      }, 500);
    }
  }

  // Close suggestions on click outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
      suggestionsBox.style.display = 'none';
    }
  });

  // Theme toggle
  const themeSwitch = document.getElementById('theme-switch');
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
});