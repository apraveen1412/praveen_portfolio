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

function createTagBadges(tags) {
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

document.addEventListener('DOMContentLoaded', () => {
  const sortedPosts = getSortedPosts();
  renderFeaturedPost(sortedPosts[0]);
  renderBlogList(sortedPosts);
  renderRecentPosts(sortedPosts, 4);
});
