const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const postForm = document.getElementById('post-form');
const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('project-admin-list');
const logoutButton = document.getElementById('logout-button');
const adminMessage = document.getElementById('admin-message');

const showMessage = (message, type = 'info') => {
  adminMessage.className = `alert alert-${type}`;
  adminMessage.textContent = message;
};

const handleUnauthorized = () => {
  adminPanel.classList.remove('active');
  loginSection.classList.remove('d-none');
  showMessage('Session expired. Please login again.', 'warning');
};

const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const renderProjectAdminList = async () => {
  const projects = await apiRequest('/api/admin/projects');

  projectList.innerHTML = projects
    .map(
      (project) => `
        <div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
          <div>
            <strong>${project.name}</strong>
            <div class="small text-muted">${project.html_url}</div>
          </div>
          <button data-project-id="${project.id}" data-hidden="${project.hidden}" class="btn btn-sm ${project.hidden ? 'btn-outline-success' : 'btn-outline-warning'}">
            ${project.hidden ? 'Show' : 'Hide'}
          </button>
        </div>
      `
    )
    .join('');
};

const setAuthenticatedView = async () => {
  loginSection.classList.add('d-none');
  adminPanel.classList.add('active');
  showMessage('Authenticated successfully.', 'success');
  await renderProjectAdminList();
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const payload = {
    username: formData.get('username'),
    password: formData.get('password')
  };

  try {
    await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    loginForm.reset();
    await setAuthenticatedView();
  } catch (error) {
    showMessage(error.message, 'danger');
  }
});

postForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const payload = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    url: formData.get('url'),
    tags: (formData.get('tags') || '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  };

  try {
    await apiRequest('/api/admin/posts', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    postForm.reset();
    showMessage('Post created.', 'success');
  } catch (error) {
    showMessage(error.message, 'danger');
  }
});

projectForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(projectForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    await apiRequest('/api/admin/projects', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    projectForm.reset();
    showMessage('Project added.', 'success');
    await renderProjectAdminList();
  } catch (error) {
    showMessage(error.message, 'danger');
  }
});

projectList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-project-id]');
  if (!button) {
    return;
  }

  const projectId = button.getAttribute('data-project-id');
  const currentlyHidden = button.getAttribute('data-hidden') === 'true';

  try {
    await apiRequest(`/api/admin/projects/${projectId}/visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ hidden: !currentlyHidden })
    });
    showMessage('Project visibility updated.', 'success');
    await renderProjectAdminList();
  } catch (error) {
    showMessage(error.message, 'danger');
  }
});

logoutButton.addEventListener('click', async () => {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } finally {
    adminPanel.classList.remove('active');
    loginSection.classList.remove('d-none');
    showMessage('Logged out.', 'info');
  }
});

const bootstrapAuth = async () => {
  try {
    await apiRequest('/api/auth/session');
    await setAuthenticatedView();
  } catch (error) {
    loginSection.classList.remove('d-none');
    adminPanel.classList.remove('active');
    if (error.message !== 'Unauthorized') {
      showMessage('Please sign in to continue.', 'secondary');
    }
  }
};

bootstrapAuth();
