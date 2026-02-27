const BLOG_POSTS = [
  {
    title: 'Building a Portfolio with HTML, CSS, and JavaScript',
    date: '2025-01-12',
    summary: 'A practical walkthrough of how I structured and shipped my personal portfolio website.',
    tags: ['Web Development', 'Portfolio'],
    url: '#'
  },
  {
    title: 'Bootstrap Tips for Faster Frontend Prototyping',
    date: '2024-12-28',
    summary: 'Useful Bootstrap classes and layout techniques that help me move from idea to UI quickly.',
    tags: ['Bootstrap', 'Frontend'],
    url: '#'
  },
  {
    title: 'JavaScript DOM Patterns I Use in Small Projects',
    date: '2024-11-17',
    summary: 'Simple DOM manipulation patterns that keep code readable when building static-site interactions.',
    tags: ['JavaScript', 'DOM'],
    url: '#'
  },
  {
    title: 'Learning in Public: My Developer Growth Plan',
    date: '2024-10-09',
    summary: 'How documenting progress, sharing notes, and writing posts can accelerate developer growth.',
    tags: ['Career', 'Learning'],
    url: '#'
  },
  {
    title: 'Making UI Content Reusable Across Pages',
    date: '2024-09-22',
    summary: 'How a single shared data source can power both a full blog page and a homepage preview section.',
    tags: ['Architecture', 'Frontend'],
    url: '#'
  }
];

window.BLOG_POSTS = BLOG_POSTS;

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

document.addEventListener('DOMContentLoaded', () => {
  const sortedPosts = getSortedPosts();
  renderFeaturedPost(sortedPosts[0]);
  renderBlogList(sortedPosts);
  renderRecentPosts(sortedPosts, 4);
});
