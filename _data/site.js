export default {
  title: "Steal This Repo",
  tagline: "An IndieWeb-ready Eleventy starter with micropub support",
  url: process.env.URL || "http://localhost:8080",
  domain: process.env.DOMAIN || "localhost:8080",
  
  author: {
    name: process.env.AUTHOR_NAME || "Your Name",
    email: process.env.AUTHOR_EMAIL || "you@example.com",
    url: process.env.URL || "http://localhost:8080",
    photo: "/steal-this-repo.png",
    bio: "Building with the IndieWeb",
    location: process.env.AUTHOR_LOCATION || "",
  },
  
  // Social profiles - all optional, only configure what you want to display
  // To add a new platform:
  // 1. Add a new property here (e.g., newplatform: process.env.NEWPLATFORM_URL || "")
  // 2. Add environment variable prompt to netlify.toml [template.environment]
  // 3. Update _includes/h-card.njk template with link and icon
  // 4. Icons use Font Awesome - check https://fontawesome.com/search for icon names
  social: {
    twitter: process.env.TWITTER_USERNAME || "",
    github: process.env.GITHUB_USERNAME || "",
    instagram: process.env.INSTAGRAM_USERNAME || "",
    mastodon: process.env.MASTODON_URL || "",
    bluesky: process.env.BLUESKY_HANDLE || "",
    facebook: process.env.FACEBOOK_URL || "",
    linkedin: process.env.LINKEDIN_URL || "",
    tumblr: process.env.TUMBLR_URL || "",
    flickr: process.env.FLICKR_USERNAME || "",
    foursquare: process.env.FOURSQUARE_USERNAME || "",
  },
  
  // Feature flags
  features: {
    webmentions: process.env.WEBMENTION_IO_TOKEN ? true : false,
    micropub: process.env.GITHUB_TOKEN ? true : false,
  },
  
  // IndieAuth endpoints (Netlify Functions)
  indieauth: {
    authorization_endpoint: "/api/auth",
    token_endpoint: "/api/token",
    micropub_endpoint: "/api/micropub",
  },
};
