// Copyright 2026 SpinalCom - www.spinalcom.com
// Maquettes : icônes, barre supérieure, navigation entre écrans, annotations UX, thème. Aucune donnée réelle.
(function () {
  const svg = (n, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${(window.ICONS || {})[n] || ''}</svg>`;
  window.icon = svg;
  const hydrate = (root = document) => root.querySelectorAll('[data-i]').forEach((el) => {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    el.insertAdjacentHTML('afterbegin', svg(el.dataset.i, el.dataset.icls || ''));
  });
  window.hydrate = hydrate;

  const ECRANS = [
    ['index.html', 'Accueil', 'house'],
    ['explorateur.html', 'Explorateur', 'folder'],
    ['fichier.html', 'Détails & versions', 'history'],
    ['depot.html', 'Dépôt & tâches', 'upload'],
    ['nouveau-jumeau.html', 'Nouveau jumeau', 'sparkles'],
    ['jumeau.html', 'Jumeau', 'boxes'],
    ['admin.html', 'Admin hub', 'server'],
    ['connexion.html', 'Connexion', 'key-round'],
  ];

  function topbar(section) {
    return `<header class="topbar">
      <div class="brand"><span class="mark"></span>SpinalCore</div>
      <nav class="sections">
        <a href="index.html" class="${section === 'drive' ? 'on' : ''}">Drive</a>
        <a class="off" title="Ouvrez un jumeau pour accéder au Studio">Studio</a>
        <a href="admin.html" class="${section === 'admin' ? 'on' : ''}">Admin</a>
      </nav>
      <div class="cmdk" role="button" tabindex="0" onclick="openCmdk()">${svg('search')}<span>Rechercher un fichier, un jumeau, une action…</span><span class="kbd">Ctrl K</span></div>
      <div class="top-actions">
        <button class="tb-btn" title="Tâches en cours" onclick="location.href='depot.html'">${svg('loader-2', 'spin')}<span class="count">2</span></button>
        <button class="tb-btn" title="Thème" onclick="toggleTheme()">${svg('circle-dot')}</button>
        <button class="tb-btn" title="Compte : admin">${'<span class="avatar">AD</span>'}</button>
      </div>
    </header>`;
  }

  function mockNav(current) {
    return `<nav class="mock-nav" aria-label="Écrans de la maquette">${ECRANS.map(([f, l, i]) =>
      `<a href="${f}" class="${f === current ? 'on' : ''}" title="${l}">${svg(i)} <span class="lbl">${l}</span></a>`).join('')}</nav>`;
  }

  window.toggleTheme = () => {
    const r = document.documentElement;
    r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('mq-theme', r.dataset.theme); } catch {}
  };
  window.toggleUx = () => {
    document.body.classList.toggle('show-ux');
    try { localStorage.setItem('mq-ux', document.body.classList.contains('show-ux') ? '1' : '0'); } catch {}
  };

  window.openCmdk = () => {
    if (document.getElementById('cmdk')) return;
    const d = document.createElement('div');
    d.id = 'cmdk';
    d.className = 'scrim';
    d.style.placeItems = 'start center';
    d.style.paddingTop = '12vh';
    d.innerHTML = `<div class="dialog" style="width:min(620px,100%)">
      <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid var(--line)">${svg('search', 'lg')}
        <input autofocus class="input" style="border:0;box-shadow:none;height:28px;font-size:15px;padding:0" placeholder="Rechercher un fichier, un jumeau, une action…" value="tour">
        <span class="kbd l">Échap</span></div>
      <div style="padding:8px;max-height:52vh;overflow:auto">
        <div class="group-title" style="padding:8px 10px 6px">Jumeaux</div>
        ${row('boxes', 'Tour Horizon — jumeau', 'Mes fichiers › Projets › Tour Horizon', '<span class="badge ok">Prêt</span>', true)}
        ${row('boxes', 'Tour Horizon — v1 (archive)', 'Mes fichiers › Archives', '')}
        <div class="group-title" style="padding:12px 10px 6px">Fichiers</div>
        ${row('file-box', 'TOUR_HORIZON_ARC.rvt', 'Mes fichiers › Projets › Tour Horizon › Maquettes', '<span class="caption">v4</span>')}
        ${row('file-box', 'TOUR_HORIZON_CVC.ifc', 'Mes fichiers › Projets › Tour Horizon › Maquettes', '<span class="caption">v2</span>')}
        <div class="group-title" style="padding:12px 10px 6px">Actions</div>
        ${row('sparkles', 'Nouveau jumeau…', 'Assistant de création', '<span class="kbd l">N J</span>')}
        ${row('upload', 'Déposer des fichiers…', 'Dans le dossier courant', '<span class="kbd l">U</span>')}
      </div></div>`;
    d.addEventListener('click', (e) => { if (e.target === d) d.remove(); });
    document.body.appendChild(d);
    function row(i, t, s, r, on) {
      return `<div style="display:flex;align-items:center;gap:12px;padding:8px 10px;border-radius:8px;${on ? 'background:var(--accent-soft)' : ''}">
        <span style="color:${on ? 'var(--accent-ink)' : 'var(--text-2)'}">${svg(i)}</span>
        <div style="flex:1;min-width:0"><div style="font-weight:500">${t}</div><div class="caption" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s}</div></div>${r}</div>`;
    }
  };
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(); }
    if (e.key === 'Escape') document.getElementById('cmdk')?.remove();
  });

  window.mount = ({ section = 'drive', page }) => {
    try { const t = localStorage.getItem('mq-theme'); if (t) document.documentElement.dataset.theme = t; } catch {}
    document.body.insertAdjacentHTML('afterbegin', topbar(section));
    document.body.insertAdjacentHTML('beforeend', mockNav(page) +
      `<div class="ux-toggle"><button onclick="toggleUx()">${svg('sparkles')} Notes UX</button></div>`);
    try { if (localStorage.getItem('mq-ux') !== '0') document.body.classList.add('show-ux'); } catch { document.body.classList.add('show-ux'); }
    hydrate();
  };
})();
