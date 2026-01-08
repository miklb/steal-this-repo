# Steal This Repo

## WORK IN PROGRESS

This is an incomplete project, contributions welcome while work is completed to implement the netlify/webmention support.

An IndieWeb-ready blog template powered by [Eleventy](https://www.11ty.dev/) and designed to deploy to Netlify.

Minimalistic, semantic, and easy to customize.

## Features

- ✅ **IndieWeb Compatible** - microformats2, h-card, webmentions
- ✅ **Micropub Ready** - Post from any Micropub client
- ✅ **Syndication** - POSSE to Bluesky and the Fediverse via Bridgy
- ✅ **Webmentions** - Receive and display likes, reposts, and replies
- ✅ **Dark Mode** - Automatic theme switching
- ✅ **Responsive Design** - Mobile-first, accessible layout
- ✅ **RSS Feed** - Standard feed.xml
- ✅ **Easy Theming** - CSS custom properties for quick customization

## Quick Start

### Deploy to Netlify

### Manual Setup

```bash
# Use this template or clone the repository
git clone https://github.com/miklb/steal-this-repo.git my-blog
cd my-blog

# Install dependencies
npm install

# Start development server
npm start
```

Visit `http://localhost:8080`

## Configuration

### Site Settings

Edit `_data/site.js`:

```javascript
export default {
  title: "Your Blog Title",
  tagline: "A short description",
  url: "https://yourdomain.com",

  author: {
    name: "Your Name",
    bio: "A short bio about yourself",
    photo: "/assets/img/avatar.jpg",
    location: "City, Country",
  },

  social: {
    github: "yourusername",
    mastodon: "https://mastodon.social/@yourusername",
    bluesky: "yourdomain.com",
  },
};
```

### Theme Customization

The entire color scheme is generated from a single brand color. Edit `public/assets/css/variables.css`:

```css
:root {
  --brand-hue: 220; /* 0-360: Change to any color */
  --brand-saturation: 60%; /* Color intensity */
  --brand-lightness: 50%; /* Brightness */
}
```

**Quick Color Reference:**

- Red: 0 | Orange: 30 | Yellow: 60 | Green: 120
- Cyan: 180 | Blue: 220 | Purple: 270 | Pink: 330

### Netlify Environment Variables

Set these in your Netlify dashboard under **Site settings → Environment variables**:

| Variable              | Required        | Description                                    |
| --------------------- | --------------- | ---------------------------------------------- |
| `ME`                  | Yes             | Your site URL (e.g., `https://yourdomain.com`) |
| `GITHUB_TOKEN`        | For Micropub    | GitHub Personal Access Token with `repo` scope |
| `GITHUB_USER`         | For Micropub    | Your GitHub username                           |
| `GITHUB_REPO`         | For Micropub    | Repository name                                |
| `TOKEN_ENDPOINT`      | For Micropub    | `https://tokens.indieauth.com/token`           |
| `WEBMENTION_IO_TOKEN` | For Webmentions | Token from webmention.io                       |

## Content Management

### Posting via Micropub

Use any Micropub client to post:

- **Web:** [Quill](https://quill.p3k.io)
- **Mobile:** [Indigenous](https://indigenous.realize.be) (iOS/Android)
- **Desktop:** [iA Writer](https://ia.net/writer) (macOS/iOS)

### Posting via Git

Create a markdown file in `content/notes/` or `content/articles/`:

```markdown
---
title: My First Post
date: 2026-01-08
tags:
  - hello
  - indieweb
---

Your content here. Supports **markdown** formatting.
```

## Project Structure

```
steal-this-repo/
├── _includes/          # Nunjucks templates
│   ├── layouts/        # Page layouts
│   ├── h-card.njk      # Author bio card
│   └── webmentions.njk # Webmention display
├── _data/              # Global data files
│   └── site.js         # Site configuration
├── content/            # Your content
│   ├── articles/       # Long-form posts
│   ├── notes/          # Short posts
│   └── img/            # Images
├── public/assets/      # Static assets
│   └── css/            # Stylesheets
└── eleventy.config.js  # Eleventy configuration
```

## IndieWeb Setup

### 1. Register with Webmention.io

1. Go to [webmention.io](https://webmention.io)
2. Sign in with your domain
3. Add the token to your Netlify environment variables

### 2. Connect to Bridgy

1. Visit [brid.gy](https://brid.gy)
2. Connect your Bluesky and/or Mastodon accounts
3. Enable automatic syndication

### 3. Verify IndieWeb Compatibility

Test your site at [indiewebify.me](https://indiewebify.me)

## Development

```bash
# Development server with live reload
npm start

# Production build
npm run build

# Build CSS
npm run build:css

# Watch CSS changes
npm run watch:css
```

## Stack

- **Static Site Generator:** [Eleventy 3.x](https://www.11ty.dev/)
- **Template Engine:** [Nunjucks](https://mozilla.github.io/nunjucks/)
- **CSS:** Native CSS with PostCSS
- **Hosting:** [Netlify](https://www.netlify.com/)
- **Micropub:** [@benjifs/micropub](https://github.com/benjifs/serverless-micropub)
- **Icons:** [@11ty/eleventy-plugin-bundle](https://github.com/11ty/eleventy-plugin-bundle) with Font Awesome

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [IndieWeb Getting Started](https://indieweb.org/Getting_Started)
- [Microformats2](https://microformats.org/wiki/microformats2)
- [Webmention Spec](https://www.w3.org/TR/webmention/)
