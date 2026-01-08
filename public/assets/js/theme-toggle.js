/**
 * Theme Toggle - respects system preference by default, allows manual override
 */

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    // Don't use shadow DOM so we can access Font Awesome icons
  }

  connectedCallback() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    this.innerHTML = `
      <button aria-label="Toggle theme" title="Toggle dark/light mode" class="theme-toggle-btn">
        <svg class="sun" aria-hidden="true" style="display: ${currentTheme === 'light' ? 'none' : 'block'}; width: 1.25em; height: 1.25em;"><use href="#fas-fa-sun"></use></svg>
        <svg class="moon" aria-hidden="true" style="display: ${currentTheme === 'light' ? 'block' : 'none'}; width: 1.25em; height: 1.25em;"><use href="#fas-fa-moon"></use></svg>
      </button>
    `;

    this.querySelector('button').addEventListener('click', () => {
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
    const sun = this.querySelector('.sun');
    const moon = this.querySelector('.moon');
    
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
