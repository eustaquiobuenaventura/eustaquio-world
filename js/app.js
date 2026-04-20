/**
 * Eustaquio | App Engine
 * Lightweight routing and content management.
 */

const routes = {
    'home': () => {
        return `
            <section id="home">
                <h2 class="title">Welcome</h2>
                <p>This is the beginning of my digital evolution.</p>
            </section>
        `;
    },
    'blog': async () => {
        const postsContainer = document.getElementById('posts-container');
        if (!postsContainer) return '';

        try {
            const response = await fetch('data/posts.json');
            if (!response.ok) throw new Error('Could not fetch posts');
            const posts = await response.json();

            if (posts.length === 0) {
                return `<section id="blog"><h2 class="title">Thoughts & Logs</h2><p>No posts yet.</p></section>`;
            }

            let postsHtml = `
                <section id="blog">
                    <h2 class="title">Thoughts & Logs</h2>
                    <div id="posts-list">
            `;

            posts.forEach(post => {
                postsHtml += `
                    <article class="post">
                        <h3 class="post-title">${post.title}</h3>
                        <small class="post-date">${post.date}</small>
                        <p class="post-excerpt">${post.excerpt}</p>
                        <a href="#post/${post.id}" class="post-link">Read more</a>
                    </article>
                `;
            });

            postsHtml += `</div></section>`;
            return postsHtml;
        } catch (error) {
            console.error('Error loading posts:', error);
            return `<section id="blog"><h2 class="title">Thoughts & Logs</h2><p>Error loading posts.</p></section>`;
        }
    }
};

const navigateTo = async (route) => {
    const contentArea = document.getElementById('app-content');
    if (!contentArea) return;

    // Handle post detail view
    if (route.startsWith('post/')) {
        const postId = route.split('/')[1];
        contentArea.innerHTML = `
            <section id="post-detail">
                <a href="#blog" class="back-link">← Back to Blog</a>
                <div id="post-content">Loading post...</div>
            </section>
        `;
        loadPost(postId);
        return;
    }

    const content = await routes[route] ? await routes[route]() : `<h2 class="title">404 - Not Found</h2>`;
    contentArea.innerHTML = content;
};

const loadPost = async (postId) => {
    try {
        const response = await fetch('data/posts.json');
        const posts = await response.json();
        const post = posts.find(p => p.id === postId);

        const detailArea = document.getElementById('post-content');
        if (post) {
            detailArea.innerHTML = `
                <h2 class="post-title">${post.title}</h2>
                <small class="post-date">${post.date}</small>
                <div class="post-body">
                    ${post.content}
                </div>
            `;
        } else {
            detailArea.innerHTML = '<p>Post not found.</p>';
        }
    } catch (error) {
        const detailArea = document.getElementById('post-content');
        if (detailArea) detailArea.innerHTML = '<p>Error loading post.</p>';
    }
};

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    handleRouting();
});

const handleRouting = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
};

// Listen for hash changes (navigation via links)
window.addEventListener('hashchange', handleRouting);
