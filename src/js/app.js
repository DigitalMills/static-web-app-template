const CURRENT_PAGE = document.body.dataset.page ?? 'home';

async function fetchJSON(url) {
  const response = await fetch(url, { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Request for ${url} failed with status ${response.status}`);
  }
  return response.json();
}

async function fetchMarkdown(slug) {
  const url = `/content/pages/${slug}.md`;
  const response = await fetch(url, { cache: 'no-cache' });
  if (response.ok) {
    return response.text();
  }

  if (response.status === 404) {
    return `# Coming soon\nWe don't have content for the **${slug}** page yet.`;
  }

  throw new Error(`Unable to load ${url} (${response.status})`);
}

function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

function updateSiteBrand(site) {
  if (!site) return;
  const { name } = site;
  if (name) {
    document.title = `${name}${CURRENT_PAGE === 'home' ? '' : ` · ${capitalize(CURRENT_PAGE)}`}`;
    document.querySelectorAll('[data-site-name]').forEach((el) => {
      el.textContent = name;
    });
  }
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildNavigation(items = []) {
  const list = document.querySelector('[data-nav-list]');
  const nav = document.querySelector('[data-nav]');
  if (!list || !nav) return;

  list.innerHTML = '';
  const currentPath = normalizePath(window.location.pathname);

  items.forEach((item) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'nav-link';
    link.href = item.href;
    link.textContent = item.label;
    if (item.target) {
      link.target = item.target;
      link.rel = 'noopener noreferrer';
    }

    const linkPath = isAbsoluteUrl(item.href) ? null : normalizePath(new URL(item.href, window.location.origin).pathname);
    if (linkPath && (currentPath === linkPath || (linkPath === '/' && currentPath === '/'))) {
      link.classList.add('active');
    }

    link.addEventListener('click', () => {
      const toggle = document.querySelector('[data-menu-toggle]');
      const navEl = document.querySelector('[data-nav]');
      if (toggle && navEl) {
        navEl.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    li.appendChild(link);
    list.appendChild(li);
  });
}

function normalizePath(path) {
  if (!path) return '/';
  return path.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(value ?? '');
}

function populateHero(config = {}) {
  const kickerEl = document.querySelector('[data-hero-kicker]');
  const titleEl = document.querySelector('[data-hero-title]');
  const subtitleEl = document.querySelector('[data-hero-subtitle]');
  const imageEl = document.querySelector('[data-hero-image]');
  const primaryCta = document.querySelector('[data-primary-cta]');
  const secondaryCta = document.querySelector('[data-secondary-cta]');

  if (kickerEl) {
    kickerEl.textContent = config.kicker ?? '';
    kickerEl.classList.toggle('hidden', !config.kicker);
  }

  if (titleEl && config.headline) {
    titleEl.textContent = config.headline;
  }

  if (subtitleEl) {
    subtitleEl.textContent = config.subheading ?? '';
    subtitleEl.classList.toggle('hidden', !config.subheading);
  }

  if (imageEl) {
    if (config.image) {
      imageEl.src = config.image;
      imageEl.alt = config.imageAlt ?? config.headline ?? 'Hero media';
      imageEl.classList.remove('hidden');
    } else {
      imageEl.classList.add('hidden');
    }
  }

  if (primaryCta) {
    if (config.primaryCta?.label && config.primaryCta?.href) {
      primaryCta.textContent = config.primaryCta.label;
      primaryCta.href = config.primaryCta.href;
      primaryCta.classList.remove('hidden');
    } else {
      primaryCta.classList.add('hidden');
    }
  }

  if (secondaryCta) {
    if (config.secondaryCta?.label && config.secondaryCta?.href) {
      secondaryCta.textContent = config.secondaryCta.label;
      secondaryCta.href = config.secondaryCta.href;
      secondaryCta.classList.remove('hidden');
    } else {
      secondaryCta.classList.add('hidden');
    }
  }
}

function renderFeatures(features = []) {
  const container = document.querySelector('[data-features-list]');
  if (!container) return;

  container.innerHTML = '';
  if (!features.length) {
    const empty = document.createElement('p');
    empty.textContent = 'Add entries to content/site.json to highlight product differentiators.';
    empty.className = 'feature-empty';
    container.appendChild(empty);
    return;
  }

  features.forEach((feature) => {
    const card = document.createElement('article');
    card.className = 'feature-card';
    card.innerHTML = `
      <div class="feature-icon">${feature.icon ?? ''}</div>
      <h3>${feature.title ?? ''}</h3>
      <p>${feature.description ?? ''}</p>
    `;
    container.appendChild(card);
  });
}

function renderFooter(footer = {}) {
  const copyEl = document.querySelector('[data-footer-copy]');
  const linksEl = document.querySelector('[data-footer-links]');

  if (copyEl) {
    copyEl.textContent = footer.copy ?? '© LaunchPad Sites';
  }

  if (linksEl) {
    linksEl.innerHTML = '';
    (footer.links ?? []).forEach((link) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label;
      if (link.target) {
        anchor.target = link.target;
        anchor.rel = 'noopener noreferrer';
      }
      li.appendChild(anchor);
      linksEl.appendChild(li);
    });
  }
}

function renderMarkdown(markdown) {
  const container = document.querySelector('[data-page-content]');
  if (!container) return;

  try {
    const renderer = window.marked ?? null;
    if (renderer?.parse) {
      container.innerHTML = renderer.parse(markdown);
    } else {
      container.textContent = markdown;
    }
  } catch (error) {
    container.textContent = markdown;
  }
}

function configureContact(contact = {}) {
  const section = document.querySelector('[data-contact]');
  if (!section) return;

  const headline = section.querySelector('[data-contact-headline]');
  const subheading = section.querySelector('[data-contact-subheading]');
  const form = section.querySelector('[data-contact-form]');
  const status = section.querySelector('[data-contact-status]');

  if (headline) {
    headline.textContent = contact.headline ?? 'Book a call';
  }

  if (subheading) {
    subheading.textContent = contact.subheading ?? '';
  }

  if (status) {
    status.textContent = '';
    status.className = 'contact-status';
  }

  if (!form) return;

  form.dataset.endpoint = contact.endpoint ?? '';
  form.dataset.success = contact.successMessage ?? 'Thanks! We will be in touch shortly.';
  form.dataset.error = contact.errorMessage ?? 'We could not send your request. Please try again later.';
  form.dataset.pending = contact.pendingMessage ?? 'Sending…';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.dataset.endpoint) {
      if (status) {
        status.textContent = 'Set contact.endpoint in content/site.json to enable submissions.';
        status.classList.add('error');
      }
      return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      if (status) {
        status.textContent = form.dataset.pending;
        status.className = 'contact-status';
      }

      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      form.reset();
      if (status) {
        status.textContent = form.dataset.success;
        status.classList.add('success');
      }
    } catch (error) {
      if (status) {
        status.textContent = form.dataset.error;
        status.classList.add('error');
      }
      console.error(error);
    }
  });
}

function setupMenuToggle() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const nextState = !nav.classList.contains('open');
    nav.classList.toggle('open', nextState);
    toggle.setAttribute('aria-expanded', String(nextState));
  });
}

function displayError(error) {
  const container = document.querySelector('[data-page-section]') ?? document.querySelector('main');
  if (container) {
    container.innerHTML = `
      <section class="page-content">
        <div class="container">
          <article class="prose">
            <h1>Configuration error</h1>
            <p>${error.message}</p>
          </article>
        </div>
      </section>
    `;
  }
  console.error(error);
}

async function initialise() {
  try {
    const config = await fetchJSON('/content/site.json');
    const pageConfig = config.pages?.[CURRENT_PAGE] ?? {};

    applyTheme(config.theme);
    updateSiteBrand(config.site);
    buildNavigation(config.navigation);
    populateHero(pageConfig.hero ?? config.site?.hero ?? {});
    renderFeatures(pageConfig.features ?? config.features);
    renderFooter(config.footer);
    setupMenuToggle();

    const markdown = await fetchMarkdown(pageConfig.contentSlug ?? CURRENT_PAGE);
    renderMarkdown(markdown);
    configureContact(config.contact);
  } catch (error) {
    displayError(error);
  }
}

document.addEventListener('DOMContentLoaded', initialise);
