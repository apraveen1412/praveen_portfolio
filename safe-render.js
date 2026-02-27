(function initSafeRender(globalScope) {
  function clearChildren(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function createElement(tagName, options = {}) {
    const element = document.createElement(tagName);

    if (options.className) {
      element.className = options.className;
    }

    if (options.text !== undefined) {
      element.textContent = String(options.text);
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([name, value]) => {
        if (value !== undefined && value !== null) {
          element.setAttribute(name, String(value));
        }
      });
    }

    return element;
  }

  function appendChildren(parent, children) {
    children.filter(Boolean).forEach((child) => parent.appendChild(child));
  }

  function sanitizeUrl(urlValue, fallback = '#') {
    if (!urlValue) return fallback;

    try {
      const parsed = new URL(urlValue, globalScope.location.origin);
      const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
      return allowedProtocols.includes(parsed.protocol) ? parsed.href : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  globalScope.SafeRender = {
    appendChildren,
    clearChildren,
    createElement,
    sanitizeUrl
  };
})(window);
