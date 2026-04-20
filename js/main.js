document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts-container');

    fetch('data/posts.json')
        .then(response => response.json())
        .then(posts => {
            if (posts && posts.length > 0) {
                postsContainer.innerHTML = '';
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <div class="date">${post.date} | By ${post.author}</div>
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
