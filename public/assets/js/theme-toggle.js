/**
 * Theme Toggle - respects system preference by default, allows manual override
 */

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          color: var(--text1);
          font-size: 1.25rem;
          line-height: 1;
          display: flex;
          align-items: center;
          transition: transform 0.2s ease;
        }
        
        button:hover {
          transform: scale(1.1);
        }
        
        button:focus-visible {
          outline: 2px solid var(--brand);
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        .sun { display: ${currentTheme === 'light' ? 'none' : 'block'}; }
        .moon { display: ${currentTheme === 'light' ? 'block' : 'none'}; }
      </style>
      
      <button aria-label="Toggle theme" title="Toggle dark/light mode">
        <span class="sun" aria-hidden="true">☀️</span>
        <span class="moon" aria-hidden="true">🌙</span>
      </button>
    `;

    this.shadowRoot.querySelector('button').addEventListener('click', () => {
      this.toggleTheme();
    });
  }

  toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button display
    const sun = this.shadowRoot.querySelector('.sun');
    const moon = this.shadowRoot.querySelector('.moon');
    
    if (newTheme === 'light') {
      sun.style.display = 'none';
      moon.style.display = 'block';
    } else {
      sun.style.display = 'block';
      moon.style.display = 'none';
    }
  }
}

customElements.define('theme-toggle', ThemeToggle);
