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

const renderEmptyState = (message) => {
  SafeRender.clearChildren(projectsListElement);
  showStatus(message, 'warning');
};

const createProjectMeta = (label, value) => {
  const paragraph = SafeRender.createElement('p', { className: 'project-meta mb-1' });
  const strongText = SafeRender.createElement('strong', { text: `${label}:` });
  paragraph.appendChild(strongText);
  paragraph.append(` ${value}`);
  return paragraph;
};

const createProjectCard = (repo) => {
  const updatedOn = formatDate(repo.pushed_at || repo.updated_at);
  const publishedOn = formatDate(repo.created_at);

  const article = SafeRender.createElement('article', { className: 'col-12 col-md-6 col-lg-4' });
  const card = SafeRender.createElement('div', { className: 'card project-card' });
  const cardBody = SafeRender.createElement('div', { className: 'card-body d-flex flex-column' });

  const title = SafeRender.createElement('h2', { className: 'h5 card-title', text: repo.name || 'Unnamed project' });
  const description = SafeRender.createElement('p', {
    className: 'card-text flex-grow-1',
    text: repo.description || 'No description available.'
  });
  const language = createProjectMeta('Language', repo.language || 'Not specified');
  const updated = createProjectMeta('Updated', updatedOn);
  const published = createProjectMeta('Published', publishedOn);
  published.classList.remove('mb-1');
  published.classList.add('mb-3');

  const link = SafeRender.createElement('a', {
    className: 'project-link',
    text: 'View Repository ↗',
    attributes: {
      href: SafeRender.sanitizeUrl(repo.html_url),
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  });

  SafeRender.appendChildren(cardBody, [title, description, language, updated, published, link]);
  card.appendChild(cardBody);
  article.appendChild(card);

  return article;
};

const renderProjects = (repos, hideStatus = true) => {
  SafeRender.clearChildren(projectsListElement);
  repos.forEach((repo) => {
    projectsListElement.appendChild(createProjectCard(repo));
  });

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
