// Main JavaScript functionality
class BookmarkManager {
  constructor() {
    this.searchInput = null;
    this.bookmarkCards = [];
    this.bookmarkLinks = [];
    this.recentlyUsed = this.getRecentlyUsed();
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupSearch();
    this.setupCollapse();
    this.setupKeyboardShortcuts();
    this.trackRecentlyUsed();
    this.initializeElements();
  }

  initializeElements() {
    this.searchInput = document.querySelector('.search-input');
    this.bookmarkCards = Array.from(document.querySelectorAll('.category-card'));
    this.bookmarkLinks = Array.from(document.querySelectorAll('.bookmark-link'));
  }

  // Theme Management
  setupTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    this.setTheme(savedTheme);
    
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
      themeToggle.title = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;
    }
  }

  // Search Functionality
  setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);
    });

    // Clear search on escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.target.value = '';
        this.performSearch('');
      }
    });
  }

  performSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    this.bookmarkCards.forEach(card => {
      const categoryTitle = card.querySelector('.category-title').textContent.toLowerCase();
      const bookmarkLinks = card.querySelectorAll('.bookmark-link');
      
      let hasMatch = false;
      
      // Check category title
      if (categoryTitle.includes(normalizedQuery)) {
        hasMatch = true;
      }
      
      // Check individual bookmarks
      bookmarkLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        const linkHref = link.href.toLowerCase();
        
        if (linkText.includes(normalizedQuery) || linkHref.includes(normalizedQuery)) {
          link.classList.remove('hidden');
          hasMatch = true;
        } else {
          link.classList.add('hidden');
        }
      });
      
      // Show/hide entire category
      if (hasMatch || normalizedQuery === '') {
        card.classList.remove('hidden');
        // Expand category if search matches
        if (normalizedQuery && hasMatch) {
          const bookmarkList = card.querySelector('.bookmark-list');
          const collapseBtn = card.querySelector('.collapse-btn');
          if (bookmarkList && bookmarkList.classList.contains('collapsed')) {
            bookmarkList.classList.remove('collapsed');
            if (collapseBtn) collapseBtn.textContent = '−';
          }
        }
      } else {
        card.classList.add('hidden');
      }
    });

    // Reset all links visibility if search is empty
    if (normalizedQuery === '') {
      this.bookmarkLinks.forEach(link => link.classList.remove('hidden'));
    }
  }

  // Collapse/Expand Functionality
  setupCollapse() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('collapse-btn')) {
        const bookmarkList = e.target.closest('.category-card').querySelector('.bookmark-list');
        const isCollapsed = bookmarkList.classList.contains('collapsed');
        
        bookmarkList.classList.toggle('collapsed');
        e.target.textContent = isCollapsed ? '−' : '+';
        
        // Save state
        const categoryTitle = e.target.closest('.category-card').querySelector('.category-title').textContent;
        this.saveCollapseState(categoryTitle, !isCollapsed);
      }
    });

    // Restore collapse states
    this.restoreCollapseStates();
  }

  saveCollapseState(category, isCollapsed) {
    const states = JSON.parse(localStorage.getItem('collapseStates') || '{}');
    states[category] = isCollapsed;
    localStorage.setItem('collapseStates', JSON.stringify(states));
  }

  restoreCollapseStates() {
    const states = JSON.parse(localStorage.getItem('collapseStates') || '{}');
    
    Object.entries(states).forEach(([category, isCollapsed]) => {
      const categoryCard = Array.from(document.querySelectorAll('.category-title'))
        .find(title => title.textContent === category)?.closest('.category-card');
      
      if (categoryCard && isCollapsed) {
        const bookmarkList = categoryCard.querySelector('.bookmark-list');
        const collapseBtn = categoryCard.querySelector('.collapse-btn');
        
        if (bookmarkList) bookmarkList.classList.add('collapsed');
        if (collapseBtn) collapseBtn.textContent = '+';
      }
    });
  }

  // Keyboard Shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      
      // Ctrl/Cmd + D for theme toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) themeToggle.click();
      }
    });
  }

  // Recently Used Tracking
  trackRecentlyUsed() {
    this.bookmarkLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.addToRecentlyUsed({
          title: link.textContent.trim(),
          url: link.href,
          timestamp: Date.now()
        });
      });
    });
  }

  addToRecentlyUsed(bookmark) {
    // Remove existing entry if present
    this.recentlyUsed = this.recentlyUsed.filter(item => item.url !== bookmark.url);
    
    // Add to beginning
    this.recentlyUsed.unshift(bookmark);
    
    // Keep only last 10
    this.recentlyUsed = this.recentlyUsed.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('recentlyUsed', JSON.stringify(this.recentlyUsed));
  }

  getRecentlyUsed() {
    return JSON.parse(localStorage.getItem('recentlyUsed') || '[]');
  }

  // Export Functionality
  exportBookmarks(format = 'json') {
    const bookmarks = {};
    
    this.bookmarkCards.forEach(card => {
      const category = card.querySelector('.category-title').textContent.trim();
      const links = Array.from(card.querySelectorAll('.bookmark-link')).map(link => ({
        title: link.textContent.trim(),
        url: link.href
      }));
      
      bookmarks[category] = links;
    });

    if (format === 'json') {
      this.downloadJSON(bookmarks, 'bookmarks.json');
    } else if (format === 'csv') {
      this.downloadCSV(bookmarks, 'bookmarks.csv');
    }
  }

  downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  }

  downloadCSV(data, filename) {
    let csv = 'Category,Title,URL\n';
    
    Object.entries(data).forEach(([category, links]) => {
      links.forEach(link => {
        csv += `"${category}","${link.title}","${link.url}"\n`;
      });
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    this.downloadBlob(blob, filename);
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Utility Functions
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Service Worker Registration for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookmarkManager();
});

// Add fade-in animation to bookmark cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.category-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
  });
});

// Handle external links
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('bookmark-link')) {
    // Add visual feedback
    e.target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      e.target.style.transform = '';
    }, 150);
  }
});