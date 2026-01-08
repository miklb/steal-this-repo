// Background function triggered after Netlify deploy
// Sends webmentions to Bridgy and commits syndication URLs back to repo

const {
    ME,
    GITHUB_TOKEN,
    GITHUB_USER,
    GITHUB_REPO,
} = process.env;

// Remove trailing slash from site URL
const SITE_URL = (ME || 'https://example.com').replace(/\/$/, '');

export async function handler(event, context) {
    console.log('Post-deploy triggered');
    console.log('Headers:', JSON.stringify(event.headers));
    
    // Netlify deploy notifications: deploy_created, deploy_building, deploy_succeeded, etc.
    const netlifyEvent = event.headers['x-netlify-event'];
    const validEvents = ['deploy_created', 'deploy-succeeded', 'deploy_succeeded'];
    
    if (netlifyEvent && !validEvents.includes(netlifyEvent)) {
        console.log('Not a deploy event we handle, got:', netlifyEvent);
        return { statusCode: 200, body: 'Not a deploy event' };
    }

    if (!GITHUB_TOKEN) {
        console.log('No GITHUB_TOKEN, skipping webmention automation');
        return { statusCode: 200, body: 'No GitHub token configured' };
    }

    const repoPath = `${GITHUB_USER}/${GITHUB_REPO}`;
    console.log('Repo path:', repoPath);

    try {
        // Get list of recent content files from GitHub
        const files = await getRecentContentFiles(repoPath);
        console.log('Found files:', files);
        const results = [];

        for (const file of files) {
            const result = await processFile(file, repoPath);
            if (result) results.push(result);
        }

        console.log('Results:', JSON.stringify(results));
        return {
            statusCode: 200,
            body: JSON.stringify({ processed: results.length, results })
        };
    } catch (error) {
        console.error('Post-deploy error:', error);
        return { statusCode: 500, body: error.message };
    }
}

async function getRecentContentFiles(repoPath) {
    // Get commits from the last hour
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const response = await fetch(
        `https://api.github.com/repos/${repoPath}/commits?since=${since}`,
        {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch commits: ${response.statusText}`);
    }

    const commits = await response.json();
    console.log(`Found ${commits.length} commits in the last hour`);

    const files = new Set();

    for (const commit of commits) {
        const commitResponse = await fetch(commit.url, {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (commitResponse.ok) {
            const commitData = await commitResponse.json();
            for (const file of commitData.files || []) {
                if (file.filename.startsWith('content/') && 
                    file.filename.endsWith('.md') &&
                    file.status !== 'removed') {
                    files.add(file.filename);
                }
            }
        }
    }

    return Array.from(files);
}

async function processFile(filePath, repoPath) {
    // Get file content from GitHub
    const response = await fetch(
        `https://api.github.com/repos/${repoPath}/contents/${filePath}`,
        {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }
    );

    if (!response.ok) return null;

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');

    // Parse frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const frontmatter = match[1];
    const body = match[2];

    // Skip if already has syndication
    if (frontmatter.includes('syndication:')) {
        return { file: filePath, status: 'skipped', reason: 'already syndicated' };
    }

    // Check for syndicate-to targets (support both single value and array)
    const singleValueMatch = frontmatter.match(/mp-syndicate-to:\s*['"]?([^\n'"]+)['"]?/);
    const arrayMatch = frontmatter.match(/mp-syndicate-to:\s*\n((?:\s+-\s+.+\n?)*)/);
    
    if (!singleValueMatch && !arrayMatch) {
        return { file: filePath, status: 'skipped', reason: 'no syndication targets' };
    }

    // Determine post URL from file path
    const postUrl = getPostUrl(filePath);
    if (!postUrl) return null;

    // Send webmentions and collect syndication URLs
    const syndicationUrls = [];
    let targets = [];
    
    if (singleValueMatch && !arrayMatch) {
        // Single value format: mp-syndicate-to: 'https://...'
        targets = [singleValueMatch[1].trim()];
    } else if (arrayMatch) {
        // Array format: mp-syndicate-to:\n  - 'https://...'
        targets = arrayMatch[1].match(/-\s+(.+)/g)?.map(t => 
            t.replace(/^-\s+/, '').replace(/^['"]|['"]$/g, '').trim()
        ) || [];
    }

    for (const targetUrl of targets) {
        const syndicationUrl = await sendWebmention(postUrl, targetUrl);
        if (syndicationUrl) {
            syndicationUrls.push(syndicationUrl);
        }
    }

    if (syndicationUrls.length === 0) {
        return { file: filePath, status: 'no-syndication-urls' };
    }

    // Update file with syndication URLs
    const syndicationYaml = syndicationUrls.length === 1
        ? `syndication: "${syndicationUrls[0]}"`
        : `syndication:\n${syndicationUrls.map(u => `  - "${u}"`).join('\n')}`;

    const newFrontmatter = frontmatter + '\n' + syndicationYaml;
    const newContent = `---\n${newFrontmatter}\n---\n${body}`;

    // Commit updated file
    await updateFile(filePath, newContent, fileData.sha, repoPath);

    return { file: filePath, status: 'syndicated', urls: syndicationUrls };
}

function getPostUrl(filePath) {
    // content/notes/1234.md -> /notes/1234/
    // content/articles/foo.md -> /article/foo/
    const match = filePath.match(/content\/(notes|articles)\/(.+)\.md$/);
    if (!match) return null;

    const type = match[1] === 'notes' ? 'notes' : 'article';
    const slug = match[2];
    return `${SITE_URL}/${type}/${slug}/`;
}

async function sendWebmention(source, target) {
    // Determine Bridgy endpoint
    let endpoint;
    if (target.includes('fed.brid.gy')) {
        endpoint = 'https://fed.brid.gy/webmention';
    } else if (target.includes('brid.gy/publish/bluesky')) {
        endpoint = 'https://brid.gy/publish/webmention';
    } else {
        console.log('Unknown target:', target);
        return null;
    }

    console.log(`Sending webmention: source=${source}, target=${target}, endpoint=${endpoint}`);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ source, target })
        });

        console.log(`Webmention response: status=${response.status}`);
        
        // Bridgy returns Location header with syndication URL
        const location = response.headers.get('location');
        console.log('Location header:', location);
        
        if (location && !location.includes('brid.gy')) {
            return location;
        }

        // For 201 responses, try to get URL from response body
        if (response.status === 201) {
            try {
                const text = await response.text();
                console.log('Response body:', text);
                const data = JSON.parse(text);
                if (data.url) return data.url;
            } catch (e) {
                console.log('Could not parse response as JSON');
            }
        }

        return null;
    } catch (error) {
        console.error(`Webmention failed for ${source}:`, error.message);
        return null;
    }
}

async function updateFile(filePath, content, sha, repoPath) {
    const response = await fetch(
        `https://api.github.com/repos/${repoPath}/contents/${filePath}`,
        {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `Add syndication URLs to ${filePath.split('/').pop()}`,
                content: Buffer.from(content).toString('base64'),
                sha: sha
            })
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update ${filePath}: ${error}`);
    }
}
