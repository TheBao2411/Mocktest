/* eslint-disable no-undef */

// Import các hàm cần test từ renderer
import { renderFAQList, renderStateMessage } from './FaqRenderer.js';

// Dữ liệu mock
const mockFaqs = [
  { q: 'Question 1', a: 'Answer 1' },
  { q: 'Question 2', a: 'Answer 2' }
];

describe('FaqRenderer', () => {

  // Test 1: Render danh sách FAQ thành công
  test('should render FAQ list correctly', () => {
    const html = renderFAQList(mockFaqs);
    
    // Kiểm tra xem chuỗi HTML có chứa nội dung mong đợi không
    expect(html).toContain('Question 1');
    expect(html).toContain('Answer 2');
    expect(html).toContain('class="faq-item"');
    expect(html).toContain('aria-controls="faq-answer-1"');
  });

  // Test 2: Render danh sách rỗng
  test('should return empty string for empty array', () => {
    const html = renderFAQList([]);
    expect(html).toBe('');
  });

  // Test 3: Render thông báo trạng thái
  test('should render state message correctly', () => {
    const loadingHtml = renderStateMessage('Loading...');
    expect(loadingHtml).toBe('<p class="faq-state">Loading...</p>');
    
    const errorHtml = renderStateMessage('An error occurred');
    expect(errorHtml).toBe('<p class="faq-state">An error occurred</p>');
  });

});