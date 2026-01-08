import Micropub from '@benjifs/micropub'
import GitHubStore from '@benjifs/github-store'

const {
	ME,
	TOKEN_ENDPOINT,
	GITHUB_TOKEN,
	GITHUB_USER,
	GITHUB_REPO,
} = process.env

const store = new GitHubStore({
	token: GITHUB_TOKEN,
	user: GITHUB_USER,
	repo: GITHUB_REPO,
})

export const micropub = new Micropub({
	store,
	me: ME,
	tokenEndpoint: TOKEN_ENDPOINT,
	// Content directory relative to repo root (where posts are saved)
	contentDir: 'content',
	// Media directory for uploaded files
	mediaDir: 'content/img',
	// https://micropub.spec.indieweb.org/#configuration
	config: {
		// Uncomment and configure if you have a separate media endpoint
		// 'media-endpoint': 'https://yoursite.com/media',
		// Syndication targets (e.g., Bridgy Fed & Bluesky)
		'syndicate-to': [
			{ uid: 'https://fed.brid.gy/', name: 'w/ Bridgy Fed', checked: true },
			{ uid: 'https://brid.gy/publish/bluesky', name: 'Bridgy Bluesky', checked: true }
		],
		// Supported post types
		'post-types': [
			{ type: 'note', name: 'Note' },
			{ type: 'article', name: 'Article' },
			{ type: 'photo', name: 'Photo' },
			{ type: 'bookmark', name: 'Bookmark' },
			{ type: 'like', name: 'Like' },
			{ type: 'reply', name: 'Reply' },
			{ type: 'repost', name: 'Repost' },
		],
	},
	// Custom slug formatting based on post type
	formatSlug: (type, filename) => {
		const typeToSlug = {
			article: 'articles',
			note: 'notes',
			bookmark: 'bookmarks',
			like: 'likes',
			reply: 'replies',
			repost: 'reposts',
			photo: 'photos',
		}
		return `${typeToSlug[type] || 'notes'}/${filename}`
	},
})
