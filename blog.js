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

function createTagBadgeElements(tags) {
  return tags.map((tag) => SafeRender.createElement('span', { className: 'tag-badge', text: tag }));
}

function createPostArticle(post, className, options = {}) {
  const { includeTags = true } = options;
  const article = SafeRender.createElement('article', { className });
  const dateElement = SafeRender.createElement('p', { className: 'post-date', text: formatPostDate(post.date) });
  const titleElement = SafeRender.createElement('h3', { text: post.title });
  const summaryElement = SafeRender.createElement('p', { text: post.summary });
  const linkElement = SafeRender.createElement('a', {
    className: 'read-post-link',
    text: 'Read post',
    attributes: { href: SafeRender.sanitizeUrl(post.url) }
  });

  SafeRender.appendChildren(article, [dateElement, titleElement, summaryElement]);

  if (includeTags && post.tags) {
    const tagGroup = SafeRender.createElement('div', { className: 'tag-group' });
    SafeRender.appendChildren(tagGroup, createTagBadgeElements(post.tags));
    article.appendChild(tagGroup);
  }

  article.appendChild(linkElement);
  return article;
}

function renderFeaturedPost(post) {
  const featuredContainer = document.getElementById('featured-post');

  if (!featuredContainer || !post) {
    return;
  }

  SafeRender.clearChildren(featuredContainer);
  const sectionHeading = SafeRender.createElement('h2', { text: 'Latest Post' });
  const article = createPostArticle(post, 'featured-post-card');
  SafeRender.appendChildren(featuredContainer, [sectionHeading, article]);
}

function renderBlogList(posts) {
  const listContainer = document.getElementById('blog-posts-list');

  if (!listContainer) {
    return;
  }

  SafeRender.clearChildren(listContainer);
  posts.forEach((post) => {
    listContainer.appendChild(createPostArticle(post, 'blog-post-card'));
  });
}

function renderRecentPosts(posts, count = 4) {
  const recentContainer = document.getElementById('recent-blog-list');

  if (!recentContainer) {
    return;
  }

  SafeRender.clearChildren(recentContainer);
  posts.slice(0, count).forEach((post) => {
    recentContainer.appendChild(createPostArticle(post, 'RB-item', { includeTags: false }));
  });
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
