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
  const aDate = new Date(a.updated_at || a.created_at || 0).getTime();
  const bDate = new Date(b.updated_at || b.created_at || 0).getTime();
  return bDate - aDate;
});

const showStatus = (message, type = 'secondary') => {
  projectsStatusElement.className = `alert alert-${type} text-center`;
  projectsStatusElement.textContent = message;
};

const renderProjects = (repos) => {
  projectsListElement.innerHTML = repos.map((repo) => {
    const updatedOn = formatDate(repo.updated_at);
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

  projectsStatusElement.classList.add('d-none');
};

const fetchProjects = async () => {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const repos = await response.json();
    const sortedRepos = sortRepos(repos);

    if (!sortedRepos.length) {
      showStatus('No projects found right now. Please check back later.', 'warning');
      projectsListElement.innerHTML = '';
      return;
    }

    renderProjects(sortedRepos);
  } catch (error) {
    projectsListElement.innerHTML = '';
    showStatus('Unable to load projects at the moment. Please try again later.', 'danger');
  }
};

fetchProjects();
