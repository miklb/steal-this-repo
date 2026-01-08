import EleventyFetch from "@11ty/eleventy-fetch";
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.WEBMENTION_IO_TOKEN;
const DOMAIN = process.env.ME?.replace('https://', '').replace('/', '') || 'example.com';

export default async function() {
    if (!API_KEY) {
        console.log('No WEBMENTION_IO_TOKEN configured, skipping webmentions fetch');
        return { children: [] };
    }

    const url = `https://webmention.io/api/mentions.jf2?token=${API_KEY}&domain=${DOMAIN}&per-page=100`;

    try {
        return await EleventyFetch(url, {
            duration: "1h", // save for 1 hour
            type: "json" // we'll parse JSON for you
        });
    } catch (error) {
        console.error('Failed to fetch webmentions:', error);
        return { children: [] };
    }
};
