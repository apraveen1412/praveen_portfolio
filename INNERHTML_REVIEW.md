# `.innerHTML` Review and Trust Classification

## Scope reviewed
- `blog.js`
- `projects.js`
- `post.js` (not present in this repository)
- `admin.js` (not present in this repository)

## Findings
The codebase previously used `.innerHTML` assignments in `blog.js` and `projects.js` for rendering post and repository cards. All such assignments have been removed and replaced with safe DOM creation (`createElement`, `textContent`, `appendChild`).

## Field trust classification

| File | Field(s) | Trust level | Rationale | Mitigation |
|---|---|---|---|---|
| `blog.js` | `post.title`, `post.summary`, `post.tags[]`, `post.url` | Untrusted | Content may later come from CMS/API/user inputs. | Rendered via `textContent`; URLs validated with `sanitizeUrl`. |
| `blog.js` | Static heading text (`Latest Post`, `Read post`) | Trusted | Authored in source code. | Still rendered as text nodes for consistency. |
| `projects.js` | `repo.name`, `repo.description`, `repo.language`, `repo.html_url`, `repo.created_at`, `repo.pushed_at` | Untrusted | Directly sourced from GitHub API/fallback data, potentially user-controlled at origin. | Rendered via `textContent`; link URLs validated with `sanitizeUrl`. |
| `projects.js` | Static labels (`Language`, `Updated`, `Published`, `View Repository ↗`) | Trusted | Authored in source code. | Rendered via text nodes. |

## Current status
- `rg "innerHTML\s*=" -n` returns no matches.
- No templated user/data fields are inserted as raw HTML.
