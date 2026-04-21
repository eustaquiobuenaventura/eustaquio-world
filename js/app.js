/**
 * Eustaquio | App Engine
 * Lightweight routing and content management.
 */

const routes = {
    'home': () => {
        return `
            <section id="home">
                <div class="hero-content">
                    <h1 class="hero-title">Designing the Future, <br>one pixel at a time.</h1>
                    <p class="hero-subtitle">Exploring the intersection of human intuition and artificial intelligence.</p>
                    <div class="hero-actions">
                        <a href="#blog" class="btn btn-primary">Read Logs</a>
                        <a href="#about" class="btn btn-secondary">About Me</a>
                    </div>
                </div>
            </section>
        `;
    },
    'about': () => {
        return `
            <section id="about">
                <h2 class="title">About</h2>
                <div class="content-block">
                    <p>I am an explorer of digital landscapes, building experiences that bridge the gap between utility and art.</p>
                    <p>My mission is to create tools and spaces that are as intuitive as they are impactful.</p>
                </div>
            </section>
        `;
    },
    'blog': async () => {
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

    const routeHandler = routes[route];
    if (routeHandler) {
        const content = await routeHandler();
        contentArea.innerHTML = content;
    } else {
        contentArea.innerHTML = `<h2 class="title">404 - Not Found</h2>`;
    }
};

const loadPost = async (postId) => {
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) throw new Error('Could not fetch posts');
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
        console.error('Error loading post:', error);
        const detailArea = document.getElementById('post-content');
        if (detailArea) detailArea.innerHTML = '<p>Error loading post.</p>';
    }
};

// Theme Management
const toggleTheme = () => {
    const body = document.body;
    const icon = document.getElementById('theme-icon');
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    icon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
};

// --- DAILY GIF LOGIC ---
const showDailyGif = async () => {
    const modal = document.getElementById('gif-modal');
    const gifImg = document.getElementById('gif-image');
    const closeBtn = document.getElementById('close-gif');

    // Check if we've already shown a GIF today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastGifDate = localStorage.getItem('last_gif_date');

    if (lastGifDate !== today) {
        // Fetch a random funny/trending GIF using Giphy (safe search)
        // Using a public endpoint for demo simplicity
        const query = 'funny-trending'; 
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOuKGih&tag=${query}&rating=g`);
        const data = await response.json();

        if (data.data && data.data.images) {
            gifImg.src = data.data.images.original.url;
            modal.style.display = 'flex';
            localStorage.setItem('last_gif_date', today);
        }
    }

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
};

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    handleRouting();
    showDailyGif(); // Trigger GIF check on load
});

const handleRouting = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
};

// Listen for hash changes (navigation via links)
window.addEventListener('hashchange', handleRouting);

// Attach theme toggle event
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
