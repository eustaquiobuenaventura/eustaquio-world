document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');
    const themeToggle = document.querySelector('.theme-toggle');

    // Theme Management
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            const newTheme = theme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Fetch Posts
    fetch('data/posts.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(posts => {
            if (posts && posts.length > 0) {
                postsContainer.innerHTML = '';
                // Sort posts by date (newest first)
                const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
                
                sortedPosts.forEach(post => {
                    const postElement = document.createElement('article');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <div class="date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} | By ${post.author}</div>
                        <div class="content">
                            <p>${post.content}</p>
                        </div>
                    `;
                    postsContainer.appendChild(postElement);
                });
            } else {
                postsContainer.innerHTML = '<p>No posts found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            postsContainer.innerHTML = '<p>Error loading posts. Please check the console.</p>';
        });
});
