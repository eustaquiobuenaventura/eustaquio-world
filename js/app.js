/**
 * Eustaquio | App Engine
 * Lightweight routing and content management.
 */

const routes = {
    'home': () => {
        return `
            <section id="home">
                <h2>Welcome</h2>
                <p>This is the beginning of my digital evolution.</p>
            </section>
        `;
    },
    'blog': () => {
        return `
            <section id="blog">
                <h2>Thoughts & Logs</h2>
                <div id="posts-container">
                    <p>Loading posts...</p>
                </div>
            </section>
        `;
    }
};

const navigateTo = (route) => {
    const contentArea = document.getElementById('app-content');
    if (routes[route]) {
        contentArea.innerHTML = routes[route]();
    } else {
        contentArea.innerHTML = '<h2>404 - Not Found</h2><p>The requested section does not exist.</p>';
    }
    // Update hash for browser history support
    window.location.hash = route;
};

const handleRouting = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash);
};

// Initialize the app
window.addEventListener('DOMContentLoaded', () => {
    handleRouting();
});

// Listen for hash changes (navigation via links)
window.addEventListener('hashchange', handleRouting);

// Global setup for the app content area
document.getElementById('app-content').addEventListener('click', (e) => {
    // This is a simple way to handle navigation if we use hash-based links.
    // In a more complex app, we would handle this via the event delegation or specific router logic.
});
