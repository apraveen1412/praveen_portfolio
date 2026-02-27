let BLOG_POSTS = [];

function getSortedPosts() {
  return [...BLOG_POSTS].sort((firstPost, secondPost) => new Date(secondPost.date) - new Date(firstPost.date));
}

function formatPostDate(dateValue) {
  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function createTagBadges(tags = []) {
  return tags
    .map((tag) => `<span class="tag-badge">${tag}</span>`)
    .join('');
}

function renderFeaturedPost(post) {
  const featuredContainer = document.getElementById('featured-post');

  if (!featuredContainer || !post) {
    return;
  }

  featuredContainer.innerHTML = `
    <h2>Latest Post</h2>
    <article class="featured-post-card">
      <p class="post-date">${formatPostDate(post.date)}</p>
      <h3>${post.title}</h3>
      <p>${post.summary}</p>
      <div class="tag-group">${createTagBadges(post.tags)}</div>
      <a href="${post.url}" class="read-post-link">Read post</a>
    </article>
  `;
}

function renderBlogList(posts) {
  const listContainer = document.getElementById('blog-posts-list');

  if (!listContainer) {
    return;
  }

  listContainer.innerHTML = posts
    .map(
      (post) => `
        <article class="blog-post-card">
          <p class="post-date">${formatPostDate(post.date)}</p>
          <h3>${post.title}</h3>
          <p>${post.summary}</p>
          <div class="tag-group">${createTagBadges(post.tags)}</div>
          <a href="${post.url}" class="read-post-link">Read post</a>
        </article>
      `
    )
    .join('');
}

function renderRecentPosts(posts, count = 4) {
  const recentContainer = document.getElementById('recent-blog-list');

  if (!recentContainer) {
    return;
  }

  recentContainer.innerHTML = posts
    .slice(0, count)
    .map(
      (post) => `
        <article class="RB-item">
          <p class="post-date">${formatPostDate(post.date)}</p>
          <h3>${post.title}</h3>
          <p>${post.summary}</p>
          <a href="${post.url}" class="read-post-link">Read post</a>
        </article>
      `
    )
    .join('');
}

async function loadPosts() {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Failed to load posts');
  }

  BLOG_POSTS = await response.json();
  const sortedPosts = getSortedPosts();
  renderFeaturedPost(sortedPosts[0]);
  renderBlogList(sortedPosts);
  renderRecentPosts(sortedPosts, 4);
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts().catch(() => {
    console.error('Unable to load blog posts');
  });
});
