const FALLBACK_REPOS = [
  {
    name: 'praveen_portfolio',
    description: 'Personal portfolio website built with HTML, CSS, and JavaScript.',
    language: 'JavaScript',
    html_url: 'https://github.com/apraveen1412/praveen_portfolio',
    created_at: '2024-06-01T09:30:00Z',
    pushed_at: '2025-01-10T14:00:00Z'
  },
  {
    name: 'todo-app',
    description: 'Simple to-do app with local storage support.',
    language: 'JavaScript',
    html_url: 'https://github.com/apraveen1412/todo-app',
    created_at: '2024-05-11T08:00:00Z',
    pushed_at: '2024-11-21T11:22:00Z'
  },
  {
    name: 'bootstrap-landing-page',
    description: 'Responsive landing page using Bootstrap components.',
    language: 'HTML',
    html_url: 'https://github.com/apraveen1412/bootstrap-landing-page',
    created_at: '2024-03-05T10:15:00Z',
    pushed_at: '2024-07-09T18:40:00Z'
  }
];

const projectsListElement = document.getElementById('projects-list');
const projectsStatusElement = document.getElementById('projects-status');

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const sortRepos = (repos) => [...repos].sort((a, b) => {
  const aDate = new Date(a.pushed_at || a.created_at || 0).getTime();
  const bDate = new Date(b.pushed_at || b.created_at || 0).getTime();
  return bDate - aDate;
});

const showStatus = (message, type = 'secondary') => {
  projectsStatusElement.className = `alert alert-${type} text-center`;
  projectsStatusElement.textContent = message;
};

const renderEmptyState = (message) => {
  projectsListElement.innerHTML = '';
  showStatus(message, 'warning');
};

const renderProjects = (repos, hideStatus = true) => {
  projectsListElement.innerHTML = repos.map((repo) => {
    const updatedOn = formatDate(repo.pushed_at || repo.updated_at);
    const publishedOn = formatDate(repo.created_at);

    return `
      <article class="col-12 col-md-6 col-lg-4">
        <div class="card project-card">
          <div class="card-body d-flex flex-column">
            <h2 class="h5 card-title">${repo.name}</h2>
            <p class="card-text flex-grow-1">${repo.description || 'No description available.'}</p>
            <p class="project-meta mb-1"><strong>Language:</strong> ${repo.language || 'Not specified'}</p>
            <p class="project-meta mb-1"><strong>Updated:</strong> ${updatedOn}</p>
            <p class="project-meta mb-3"><strong>Published:</strong> ${publishedOn}</p>
            <a class="project-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  if (hideStatus) {
    projectsStatusElement.classList.add('d-none');
  }
};

const fetchProjects = async () => {
  try {
    const response = await fetch('https://api.github.com/users/apraveen1412/repos');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const repos = await response.json();
    const sortedRepos = sortRepos(repos);

    if (!sortedRepos.length) {
      renderEmptyState('No repositories found right now. Please check back later.');
      return;
    }

    renderProjects(sortedRepos);
  } catch (error) {
    const fallbackRepos = sortRepos(FALLBACK_REPOS);

    if (!fallbackRepos.length) {
      renderEmptyState('Unable to load projects at the moment. Please try again later.');
      return;
    }

    showStatus('GitHub API is unavailable, showing fallback project data.', 'warning');
    renderProjects(fallbackRepos, false);
  }
};

fetchProjects();
