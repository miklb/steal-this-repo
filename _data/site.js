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
  
  social: {
    github: process.env.GITHUB_USERNAME || "",
    mastodon: process.env.MASTODON_URL || "",
    bluesky: process.env.BLUESKY_HANDLE || "",
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
