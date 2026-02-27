const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const AUTH_COOKIE_NAME = 'admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH || !JWT_SECRET) {
  console.error('Missing required env vars: ADMIN_USERNAME, ADMIN_PASSWORD_HASH, JWT_SECRET');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const parseCookies = (cookieHeader = '') => cookieHeader
  .split(';')
  .map((cookie) => cookie.trim())
  .filter(Boolean)
  .reduce((acc, cookie) => {
    const [key, ...rest] = cookie.split('=');
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});

const readJsonFile = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));
const writeJsonFile = async (filePath, data) => fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`);

const parseBody = async (req) => {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
  }

  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const sendJson = (res, statusCode, payload, extraHeaders = {}) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
};

const sendText = (res, statusCode, message) => {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(message);
};

const createPasswordHash = (password, saltHex) => crypto
  .scryptSync(password, Buffer.from(saltHex, 'hex'), 64)
  .toString('hex');

const verifyPassword = (password, stored) => {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const candidateHash = createPasswordHash(password, saltHex);
  return crypto.timingSafeEqual(Buffer.from(candidateHash, 'hex'), Buffer.from(hashHex, 'hex'));
};

const signToken = (username) => {
  const payload = {
    sub: username,
    role: 'admin',
    exp: Date.now() + SESSION_TTL_MS
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
};

const verifyToken = (token) => {
  const [payloadBase64, signature] = (token || '').split('.');
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
  if (!payload.exp || payload.exp < Date.now()) {
    return null;
  }

  return payload;
};

const getSessionPayload = (req) => {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[AUTH_COOKIE_NAME];
  return verifyToken(token);
};

const authCookie = (token) => `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}`;
const clearAuthCookie = `${AUTH_COOKIE_NAME}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;

const requireAuth = (req, res) => {
  const payload = getSessionPayload(req);
  if (!payload) {
    sendJson(res, 401, { error: 'Unauthorized' }, { 'Set-Cookie': clearAuthCookie });
    return null;
  }
  return payload;
};

const serveStatic = async (res, pathname) => {
  let filePath = path.join(ROOT_DIR, pathname);

  if (pathname === '/') {
    filePath = path.join(ROOT_DIR, 'index.html');
  }

  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(ROOT_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(resolvedPath);
    if (stat.isDirectory()) {
      sendText(res, 404, 'Not Found');
      return;
    }

    const content = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(content);
  } catch (error) {
    sendText(res, 404, 'Not Found');
  }
};

const handleRequest = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  if (pathname === '/api/auth/login' && req.method === 'POST') {
    const body = await parseBody(req);
    if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });

    const { username, password } = body;
    if (!username || !password) {
      return sendJson(res, 400, { error: 'Username and password are required.' });
    }

    if (username !== ADMIN_USERNAME || !verifyPassword(password, ADMIN_PASSWORD_HASH)) {
      return sendJson(res, 401, { error: 'Invalid credentials.' });
    }

    const token = signToken(username);
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': authCookie(token) });
  }

  if (pathname === '/api/auth/logout' && req.method === 'POST') {
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearAuthCookie });
  }

  if (pathname === '/api/auth/session' && req.method === 'GET') {
    const payload = getSessionPayload(req);
    if (!payload) {
      return sendJson(res, 401, { authenticated: false }, { 'Set-Cookie': clearAuthCookie });
    }

    return sendJson(res, 200, { authenticated: true, username: payload.sub });
  }

  if (pathname === '/api/posts' && req.method === 'GET') {
    return sendJson(res, 200, await readJsonFile(POSTS_FILE));
  }

  if (pathname === '/api/projects' && req.method === 'GET') {
    const projects = await readJsonFile(PROJECTS_FILE);
    return sendJson(res, 200, projects.filter((project) => !project.hidden));
  }

  if (pathname === '/api/admin/projects' && req.method === 'GET') {
    if (!requireAuth(req, res)) return;
    return sendJson(res, 200, await readJsonFile(PROJECTS_FILE));
  }

  if (pathname === '/api/admin/posts' && req.method === 'POST') {
    if (!requireAuth(req, res)) return;

    const body = await parseBody(req);
    if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });

    if (!body.title || !body.summary) {
      return sendJson(res, 400, { error: 'Title and summary are required.' });
    }

    const posts = await readJsonFile(POSTS_FILE);
    const newPost = {
      id: `post-${Date.now()}`,
      title: body.title,
      summary: body.summary,
      url: body.url || '#',
      tags: Array.isArray(body.tags) ? body.tags : [],
      date: body.date || new Date().toISOString().slice(0, 10)
    };

    posts.unshift(newPost);
    await writeJsonFile(POSTS_FILE, posts);
    return sendJson(res, 201, newPost);
  }

  if (pathname === '/api/admin/projects' && req.method === 'POST') {
    if (!requireAuth(req, res)) return;

    const body = await parseBody(req);
    if (!body) return sendJson(res, 400, { error: 'Invalid JSON body.' });

    if (!body.name || !body.html_url) {
      return sendJson(res, 400, { error: 'Project name and URL are required.' });
    }

    const projects = await readJsonFile(PROJECTS_FILE);
    const nowIso = new Date().toISOString();
    const newProject = {
      id: `project-${Date.now()}`,
      name: body.name,
      description: body.description || '',
      language: body.language || 'Not specified',
      html_url: body.html_url,
      created_at: body.created_at || nowIso,
      updated_at: body.updated_at || nowIso,
      hidden: false
    };

    projects.unshift(newProject);
    await writeJsonFile(PROJECTS_FILE, projects);
    return sendJson(res, 201, newProject);
  }

  if (pathname.startsWith('/api/admin/projects/') && pathname.endsWith('/visibility') && req.method === 'PATCH') {
    if (!requireAuth(req, res)) return;

    const body = await parseBody(req);
    if (!body || typeof body.hidden !== 'boolean') {
      return sendJson(res, 400, { error: 'hidden must be a boolean.' });
    }

    const projectId = pathname.split('/')[4];
    const projects = await readJsonFile(PROJECTS_FILE);
    const project = projects.find((item) => item.id === projectId);

    if (!project) {
      return sendJson(res, 404, { error: 'Project not found.' });
    }

    project.hidden = body.hidden;
    project.updated_at = new Date().toISOString();
    await writeJsonFile(PROJECTS_FILE, projects);
    return sendJson(res, 200, project);
  }

  if (pathname.startsWith('/api/')) {
    return sendJson(res, 404, { error: 'API route not found.' });
  }

  return serveStatic(res, pathname);
};

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    console.error(error);
    sendJson(res, 500, { error: 'Internal Server Error' });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
