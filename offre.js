/* Shukrani Business — offre spéciale avant paiement (order bump / upsell).
   Quand un client clique sur "Acheter" pour un seul livre (lien avec data-bump),
   on lui propose le Pack Complet avant de l'envoyer sur Chariow. */
(function () {
  var PACK_URL = 'https://jjahbngp.mychariow.com/prd_r2alyn55';
  var BASE = (document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/offre\.js.*$/, '') : '';
  var PACK_IMG = BASE + 'images/couvertures/pack-complet.jpg';

  var css = '' +
    '.sb-ov{position:fixed;inset:0;background:rgba(18,17,40,.72);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000;opacity:0;pointer-events:none;transition:opacity .25s}' +
    '.sb-ov.open{opacity:1;pointer-events:auto}' +
    '.sb-box{background:#FFFDF8;color:#1C1B3A;border-radius:22px;max-width:460px;width:100%;max-height:calc(100vh - 32px);overflow:auto;padding:26px 24px 22px;box-shadow:0 30px 80px rgba(0,0,0,.45);font-family:Manrope,sans-serif;position:relative;transform:translateY(16px);transition:transform .25s}' +
    '.sb-ov.open .sb-box{transform:none}' +
    '.sb-x{position:absolute;top:10px;right:12px;border:0;background:none;font-size:1.6rem;line-height:1;color:rgba(28,27,58,.5);cursor:pointer;padding:6px}' +
    '.sb-tag{display:inline-block;background:#FF6153;color:#fff;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:5px 12px;border-radius:100px}' +
    '.sb-box h3{font-family:Fraunces,serif;font-weight:600;font-size:1.45rem;line-height:1.2;margin:12px 0 8px}' +
    '.sb-box p{margin:0;line-height:1.55;color:rgba(28,27,58,.72);font-size:.95rem}' +
    '.sb-row{display:flex;gap:16px;align-items:center;margin:18px 0}' +
    '.sb-row img{width:96px;border-radius:10px;box-shadow:0 10px 24px rgba(0,0,0,.18);flex:none}' +
    '.sb-row ul{margin:0;padding:0;list-style:none;font-size:.88rem}' +
    '.sb-row li{padding:2px 0}' +
    '.sb-row li:before{content:"✓ ";color:#1FA98F;font-weight:800}' +
    '.sb-price{display:flex;align-items:baseline;gap:10px;margin:4px 0 16px;flex-wrap:wrap}' +
    '.sb-price b{font-family:Fraunces,serif;font-size:2.1rem;color:#1C1B3A}' +
    '.sb-price s{color:rgba(28,27,58,.5)}' +
    '.sb-price span{background:#1FA98F;color:#fff;font-weight:800;font-size:.76rem;padding:5px 10px;border-radius:100px}' +
    '.sb-yes{display:block;width:100%;text-align:center;background:#FFB238;color:#1C1B3A;font-weight:800;font-size:1rem;padding:15px 18px;border-radius:100px;text-decoration:none;border:0;cursor:pointer}' +
    '.sb-yes:hover{box-shadow:0 12px 24px rgba(255,178,56,.4)}' +
    '.sb-no{display:block;width:100%;text-align:center;background:none;border:0;color:rgba(28,27,58,.6);font-size:.88rem;padding:12px 8px 2px;cursor:pointer;text-decoration:underline}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var ov = document.createElement('div');
  ov.className = 'sb-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-labelledby', 'sb-title');
  ov.innerHTML =
    '<div class="sb-box">' +
      '<button class="sb-x" type="button" aria-label="Fermer">×</button>' +
      '<span class="sb-tag"></span>' +
      '<h3 id="sb-title"></h3>' +
      '<p class="sb-p"></p>' +
      '<div class="sb-row">' +
        '<img src="' + PACK_IMG + '" alt="Pack Complet Shukrani">' +
        '<ul><li>50 Opportunités de Business avec l’IA</li><li>La Vérité cachée derrière la porte</li><li>Leadership, Ventes &amp; Performance</li><li>Construire une confiance solide</li></ul>' +
      '</div>' +
      '<div class="sb-price"><span class="sb-badge"></span></div>' +
      '<a class="sb-yes" href="' + PACK_URL + '" target="_blank" rel="noopener"></a>' +
      '<button class="sb-no" type="button"></button>' +
    '</div>';
  document.body.appendChild(ov);

  // Textes de la fenêtre dans les trois langues (le titre des livres reste en français)
  var L = {
    fr: { tag: 'Attendez ! Offre spéciale', h: 'Prenez les 4 guides au lieu d’un seul',
          p: 'Le <strong>Pack Complet Shukrani</strong> contient <strong>{book}</strong> + 3 autres guides.',
          badge: 'Plus avantageux que les livres séparés', yes: 'Oui, je préfère le pack →',
          no: 'Non merci, je veux seulement ce livre', close: 'Fermer', alt: 'Pack Complet Shukrani', book: 'ce livre' },
    en: { tag: 'Wait! Special offer', h: 'Get all 4 guides instead of just one',
          p: 'The <strong>Shukrani Complete Pack</strong> includes <strong>{book}</strong> + 3 other guides.',
          badge: 'Better value than buying the books separately', yes: 'Yes, I prefer the pack →',
          no: 'No thanks, I only want this book', close: 'Close', alt: 'Shukrani Complete Pack', book: 'this book' },
    pt: { tag: 'Espere! Oferta especial', h: 'Leve os 4 guias em vez de apenas um',
          p: 'O <strong>Pack Completo Shukrani</strong> inclui <strong>{book}</strong> + 3 outros guias.',
          badge: 'Mais vantajoso do que comprar os livros em separado', yes: 'Sim, prefiro o pack →',
          no: 'Não, obrigado, quero apenas este livro', close: 'Fechar', alt: 'Pack Completo Shukrani', book: 'este livro' }
  };
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function render(book) {
    var lg = (window.SB && SB.lang && SB.lang()) || 'fr';
    var t = L[lg] || L.fr;
    ov.querySelector('.sb-tag').textContent = t.tag;
    ov.querySelector('#sb-title').textContent = t.h;
    ov.querySelector('.sb-p').innerHTML = t.p.replace('{book}', esc(book || t.book));
    ov.querySelector('.sb-badge').textContent = t.badge;
    ov.querySelector('.sb-yes').textContent = t.yes;
    ov.querySelector('.sb-no').textContent = t.no;
    ov.querySelector('.sb-x').setAttribute('aria-label', t.close);
    ov.querySelector('.sb-row img').setAttribute('alt', t.alt);
    ov.setAttribute('lang', lg);
  }
  var curBook = '';
  render('');
  document.addEventListener('sblang', function () { render(curBook); });

  var target = null, lastFocus = null;
  function close() { ov.classList.remove('open'); if (lastFocus) lastFocus.focus(); }
  function open(link) {
    target = link.href;
    var parts = (link.getAttribute('data-bump') || '').split('|');
    curBook = parts[0];
    render(curBook);
    lastFocus = link;
    ov.classList.add('open');
    ov.querySelector('.sb-yes').focus();
    if (window.SBtrack) SBtrack('bump_shown', parts[0] || null);
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-bump]');
    if (!a) return;
    e.preventDefault();
    open(a);
  });
  ov.querySelector('.sb-yes').addEventListener('click', function () { if (window.SBtrack) SBtrack('bump_accept', 'pack'); setTimeout(close, 50); });
  ov.querySelector('.sb-no').addEventListener('click', function () {
    if (window.SBtrack) SBtrack('bump_decline', (ov.querySelector('.sb-book').textContent || '').slice(0, 60));
    if (target) window.open(target, '_blank', 'noopener');
    close();
  });
  ov.querySelector('.sb-x').addEventListener('click', close);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) close(); });
})();
