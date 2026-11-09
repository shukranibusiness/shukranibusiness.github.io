/* Shukrani Business — mesure de fréquentation respectueuse : aucun cookie, aucune donnée personnelle.
   Envoie seulement : page vue, clics (Chariow, WhatsApp, réseaux), langue, provenance (site d'origine). */
(function () {
  var URL_ = 'https://ayksjvdyjrdytriybdgk.supabase.co/functions/v1/track';
  try { if (localStorage.getItem('sb_notrack') === '1') return; } catch (e) {}
  var h = location.hostname;
  if (h !== 'shukranibusiness.shop' && h !== 'www.shukranibusiness.shop' && h !== 'shukranibusiness.github.io') return;
  var page = location.pathname.replace(/index\.html$/, '') || '/';
  if (/^\/admin\//.test(page)) return;

  function lang() { try { return (window.SB && SB.lang && SB.lang()) || localStorage.getItem('sb_lang') || 'fr'; } catch (e) { return 'fr'; } }
  function send(event, label) {
    try {
      var body = JSON.stringify({ event: event, page: page, label: label || null, lang: lang(), ref: event === 'pageview' ? refer() : null });
      if (navigator.sendBeacon && navigator.sendBeacon(URL_, new Blob([body], { type: 'text/plain' }))) return;
      fetch(URL_, { method: 'POST', body: body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
    } catch (e) {}
  }
  function refer() {
    try {
      var p = new URLSearchParams(location.search), u = p.get('utm_source') || p.get('ref');
      if (u) return u.slice(0, 40).toLowerCase();
      if (!document.referrer) return null;
      var rh = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (rh === 'shukranibusiness.shop' || rh === 'shukranibusiness.github.io') return null;
      return rh;
    } catch (e) { return null; }
  }
  window.SBtrack = send;

  send('pageview');

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href],button.dl[data-book],.lang-sw button[data-lang]');
    if (!a) return;
    if (a.matches('button.dl')) return send('form_open', a.getAttribute('data-book'));
    if (a.matches('.lang-sw button')) return send('lang_switch', a.getAttribute('data-lang'));
    var href = a.getAttribute('href') || '';
    if (/mychariow\.com/.test(href)) {
      var m = href.match(/(prd_[a-z0-9]+)/);
      return send('buy_click', (m ? m[1] : 'boutique') + ' @' + page);
    }
    if (/wa\.me|whatsapp\.com/.test(href) || a.hasAttribute('data-wa')) return send('wa_click', /channel/.test(href) ? 'chaine' : 'message');
    if (/facebook\.com/.test(href)) return send('social_click', 'facebook');
    if (/linkedin\.com|youtube\.com|x\.com|twitter\.com/.test(href)) return send('social_click', (href.match(/(linkedin|youtube|x|twitter)\.com/) || [])[1]);
  }, true);
})();
