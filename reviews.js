/* Shukrani Business — avis des clients : défilement automatique + formulaire pour laisser un avis.
   Les avis sont validés avant publication. Aucune adresse e-mail n'est demandée. */
(function () {
  var host = document.getElementById('sb-reviews');
  if (!host) return;
  var API = 'https://ayksjvdyjrdytriybdgk.supabase.co/functions/v1/reviews';
  var BOOKS = {
    'deconnecte-productif': 'Déconnecté, productif',
    'petit-budget-grand-depart': 'Petit budget, grand départ',
    'side-business-5h-semaine': 'Le side-business en 5h/semaine',
    'de-zero-a-entrepreneur': 'De zéro à entrepreneur',
    'pack-complet': 'Pack Complet',
    '50-opportunites-ia': '50 Opportunités de Business avec l’IA',
    'la-verite-cachee': 'La Vérité cachée derrière la porte',
    'leadership-ventes-performance': 'Leadership, Ventes & Performance',
    'confiance-solide': 'Construire une confiance solide'
  };
  var FALLBACK = [
    { name: 'Ruth', rating: null, body: 'Très bon outil vraiment 🙏. Alors si je les mets en pratique, je pense que mon quotidien va s’améliorer.' },
    { name: 'Doris', rating: null, body: 'Merci beaucoup, j’ai reçu mon ebook, un super ebook pour me lancer dans le business avec l’IA à moindre coût 🤝👌' },
    { name: 'Patience', rating: null, body: 'C’est vraiment productif, je recommande de le lire. J’ai enfin pu reproduire et j’ai obtenu un résultat positif 👌' }
  ];
  var COLORS = ['#FF6153', '#1FA98F', '#FFB238', '#3D1E52'];
  var T = function (s) { return (window.SB && SB.t) ? SB.t(s) : s; };
  var lang = function () { return (window.SB && SB.lang) ? SB.lang() : 'fr'; };

  var css = '' +
    '.sbr-marquee{overflow:hidden;margin:0 -16px;padding:6px 0 14px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent);mask-image:linear-gradient(90deg,transparent,#000 4%,#000 96%,transparent)}' +
    '.sbr-track{display:flex;gap:18px;width:max-content;animation:sbr-scroll var(--sbr-dur,40s) linear infinite}' +
    '.sbr-marquee:hover .sbr-track,.sbr-marquee:focus-within .sbr-track,.sbr-marquee.touch .sbr-track{animation-play-state:paused}' +
    '@keyframes sbr-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}' +
    '.sbr-marquee.static{-webkit-mask-image:none;mask-image:none;margin:0}.sbr-marquee.static .sbr-track{animation:none;width:auto;flex-wrap:wrap;justify-content:center}' +
    '@media (prefers-reduced-motion:reduce){.sbr-marquee{overflow-x:auto;-webkit-mask-image:none;mask-image:none;scroll-snap-type:x proximity}.sbr-track{animation:none;width:max-content}.sbr-card{scroll-snap-align:start}}' +
    '.sbr-card{flex:0 0 300px;width:300px;background:#fff;border:1px solid var(--line,rgba(28,27,58,.1));border-radius:18px;padding:22px;box-shadow:0 8px 24px rgba(28,27,58,.05);display:flex;flex-direction:column;gap:10px;box-sizing:border-box}' +
    '.sbr-card .sbr-st{color:var(--amber,#FFB238);letter-spacing:2px;font-size:1rem}' +
    '.sbr-card p{margin:0;font-size:.95rem;line-height:1.55;color:var(--ink,#1C1B3A);display:-webkit-box;-webkit-line-clamp:7;-webkit-box-orient:vertical;overflow:hidden}' +
    '.sbr-card .sbr-who{display:flex;align-items:center;gap:10px;margin-top:auto;font-size:.88rem;font-weight:800;color:var(--ink,#1C1B3A)}' +
    '.sbr-card .sbr-av{width:34px;height:34px;border-radius:50%;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:.82rem;flex:none}' +
    '.sbr-card small{display:block;font-weight:600;color:var(--soft,rgba(28,27,58,.66));font-size:.78rem}' +
    '.sbr-cta{text-align:center;margin-top:8px}' +
    '.sbr-btn{display:inline-flex;align-items:center;gap:8px;background:var(--amber,#FFB238);color:var(--ink,#1C1B3A);font-weight:800;border:0;border-radius:100px;padding:13px 24px;cursor:pointer;font:inherit;font-weight:800}' +
    '.sbr-btn:hover{box-shadow:0 12px 24px rgba(255,178,56,.4)}.sbr-btn[disabled]{opacity:.6;cursor:default}' +
    '.sbr-form{max-width:560px;margin:18px auto 0;background:#fff;border:1px solid var(--line,rgba(28,27,58,.1));border-radius:18px;padding:22px;text-align:left;display:none}' +
    '.sbr-form.open{display:block}' +
    '.sbr-form label{display:block;font-weight:700;font-size:.86rem;margin:12px 0 5px;color:var(--ink,#1C1B3A)}' +
    '.sbr-form input[type=text],.sbr-form select,.sbr-form textarea{width:100%;box-sizing:border-box;padding:12px 14px;border:1.5px solid var(--line,rgba(28,27,58,.14));border-radius:12px;font:inherit;background:#fff;color:var(--ink,#1C1B3A)}' +
    '.sbr-form textarea{min-height:110px;resize:vertical}' +
    '.sbr-form input:focus,.sbr-form select:focus,.sbr-form textarea:focus{outline:none;border-color:var(--amber,#FFB238);box-shadow:0 0 0 3px rgba(255,178,56,.25)}' +
    '.sbr-stars{display:flex;gap:4px}.sbr-stars button{border:0;background:none;font-size:2rem;line-height:1;cursor:pointer;color:#D9D5CB;padding:2px}.sbr-stars button.on{color:var(--amber,#FFB238)}' +
    '.sbr-radio{display:flex!important;gap:10px;align-items:center;font-weight:600!important;margin:6px 0!important}.sbr-radio input{margin:0}.sbr-help{margin:6px 0 0;font-size:.78rem;color:var(--soft,#777);line-height:1.4}.sbr-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}' +
    '.sbr-chk{display:flex;gap:10px;align-items:flex-start;margin-top:14px;font-size:.84rem;line-height:1.4;color:var(--soft,rgba(28,27,58,.7))}.sbr-chk input{margin-top:3px}' +
    '.sbr-err{color:#C0392B;font-size:.86rem;margin:10px 0 0;min-height:1.2em}.sbr-ok{color:#14806B;font-weight:700;margin:10px 0 0}' +
    '.sbr-count{float:right;font-weight:600;color:var(--soft,#888);font-size:.76rem}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var reviews = FALLBACK, formOpen = false, rating = 0, sent = false;

  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  function card(r, i) {
    var c = el('div', 'sbr-card');
    if (r.rating) { var s = el('div', 'sbr-st', '★★★★★'.slice(0, r.rating) + '☆☆☆☆☆'.slice(0, 5 - r.rating)); s.setAttribute('aria-label', r.rating + '/5'); c.appendChild(s); }
    c.appendChild(el('p', null, '« ' + r.body + ' »'));
    var who = el('div', 'sbr-who'), av = el('span', 'sbr-av', (r.name || '?').trim().charAt(0).toUpperCase());
    av.style.background = COLORS[i % COLORS.length]; if (COLORS[i % COLORS.length] === '#FFB238') av.style.color = '#1C1B3A';
    var nm = el('div', 'sbr-nm'); nm.appendChild(document.createTextNode(r.name));
    if (r.book_slug && BOOKS[r.book_slug]) nm.appendChild(el('small', null, BOOKS[r.book_slug]));
    who.appendChild(av); who.appendChild(nm); c.appendChild(who);
    return c;
  }

  function buildMarquee() {
    var wrap = el('div', 'sbr-marquee'), track = el('div', 'sbr-track');
    wrap.setAttribute('aria-label', T('Avis des clients'));
    wrap.appendChild(track);
    wrap.addEventListener('touchstart', function () { wrap.classList.add('touch'); }, { passive: true });
    wrap.addEventListener('touchend', function () { setTimeout(function () { wrap.classList.remove('touch'); }, 2500); }, { passive: true });
    return { wrap: wrap, track: track };
  }

  function fill(m) {
    var track = m.track, wrap = m.wrap;
    track.innerHTML = '';
    var base = document.createDocumentFragment();
    reviews.forEach(function (r, i) { base.appendChild(card(r, i)); });
    var W = (host.clientWidth || 360);
    var one = reviews.length * 318;
    if (reviews.length < 3 && one < W) { wrap.classList.add('static'); track.appendChild(base); return; }
    wrap.classList.remove('static');
    var k = Math.max(1, Math.ceil((W + 40) / one));
    for (var g = 0; g < 2; g++) for (var j = 0; j < k; j++) {
      reviews.forEach(function (r, i) { var c = card(r, i); if (g === 1) c.setAttribute('aria-hidden', 'true'); track.appendChild(c); });
    }
    track.style.setProperty('--sbr-dur', Math.max(24, Math.round(one * k / 38)) + 's');
  }

  function render() {
    host.innerHTML = '';
    var m = buildMarquee(); host.appendChild(m.wrap); fill(m);

    var cta = el('div', 'sbr-cta'), btn = el('button', 'sbr-btn', T('Laisser un avis'));
    btn.type = 'button'; btn.setAttribute('aria-expanded', formOpen ? 'true' : 'false');
    cta.appendChild(btn); host.appendChild(cta);

    var f = el('form', 'sbr-form' + (formOpen ? ' open' : '')); f.noValidate = true; f.id = 'sbr-form';
    f.innerHTML =
      '<label for="sbr-name" id="l-name"></label><input type="text" id="sbr-name" maxlength="60" autocomplete="given-name">' +
      '<label id="l-kind"></label>' +
      '<label class="sbr-radio"><input type="radio" name="sbr-kind" value="download" checked><span id="l-kd"></span></label>' +
      '<label class="sbr-radio"><input type="radio" name="sbr-kind" value="purchase"><span id="l-kp"></span></label>' +
      '<label for="sbr-proof" id="l-proof"></label><input type="text" id="sbr-proof" maxlength="80" autocomplete="off" inputmode="email">' +
      '<p class="sbr-help" id="l-help"></p>' +
      '<label id="l-rate"></label><div class="sbr-stars" role="radiogroup" aria-labelledby="l-rate"></div>' +
      '<label for="sbr-book" id="l-book"></label><select id="sbr-book"></select>' +
      '<label for="sbr-text" id="l-text"><span class="sbr-count" id="sbr-count">0/600</span></label><textarea id="sbr-text" maxlength="600"></textarea>' +
      '<input class="sbr-hp" type="text" id="sbr-web" tabindex="-1" autocomplete="off" aria-hidden="true">' +
      '<label class="sbr-chk"><input type="checkbox" id="sbr-consent"><span id="l-chk"></span></label>' +
      '<p class="sbr-err" id="sbr-err" role="alert"></p>' +
      '<button type="submit" class="sbr-btn" id="sbr-go" style="width:100%;justify-content:center"></button>';
    var Q = function (id) { return f.querySelector('#' + id); };
    Q('l-name').textContent = T('Votre prénom'); Q('l-rate').textContent = T('Votre note'); Q('l-book').textContent = T('Livre concerné (facultatif)');
    Q('l-text').insertBefore(document.createTextNode(T('Votre avis')), Q('l-text').firstChild);
    Q('l-kind').textContent = T('Comment avez-vous eu ce livre ?');
    Q('l-kd').textContent = T('J’ai téléchargé un livre gratuit'); Q('l-kp').textContent = T('J’ai acheté sur Chariow');
    Q('l-chk').textContent = T('J’accepte que mon prénom et mon avis soient publiés sur ce site.');
    Q('sbr-go').textContent = T('Envoyer mon avis');
    var kindNow = function () { return f.querySelector('input[name=sbr-kind]:checked').value; };
    var setKind = function () {
      var d = kindNow() === 'download';
      Q('l-proof').textContent = T(d ? 'E-mail utilisé pour le téléchargement' : 'Numéro de commande Chariow');
      Q('l-help').textContent = T(d ? 'Il sert uniquement à vérifier votre téléchargement. Il n’est ni publié ni conservé avec votre avis.' : 'Vous le trouvez dans l’e-mail de confirmation de Chariow. Il est vérifié avant la publication.');
      Q('sbr-proof').setAttribute('inputmode', d ? 'email' : 'text');
    };
    f.querySelectorAll('input[name=sbr-kind]').forEach(function (x) { x.addEventListener('change', setKind); });
    setKind();
    var sel = f.querySelector('#sbr-book');
    var o0 = el('option', null, T('Choisir un livre')); o0.value = ''; sel.appendChild(o0);
    Object.keys(BOOKS).forEach(function (k) { var o = el('option', null, BOOKS[k]); o.value = k; sel.appendChild(o); });
    var stars = f.querySelector('.sbr-stars');
    for (var n = 1; n <= 5; n++) (function (n) {
      var b = el('button', rating >= n ? 'on' : '', '★'); b.type = 'button'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', rating === n ? 'true' : 'false'); b.setAttribute('aria-label', n + '/5');
      b.addEventListener('click', function () { rating = n; stars.querySelectorAll('button').forEach(function (x, i) { x.classList.toggle('on', i < n); x.setAttribute('aria-checked', i === n - 1 ? 'true' : 'false'); }); });
      stars.appendChild(b);
    })(n);
    host.appendChild(f);
    if (sent) { f.innerHTML = ''; f.appendChild(el('p', 'sbr-ok', T('Merci ! Votre avis a bien été reçu. Il sera publié après vérification.'))); return; }

    var err = f.querySelector('#sbr-err'), go = f.querySelector('#sbr-go'), txt = f.querySelector('#sbr-text');
    txt.addEventListener('input', function () { f.querySelector('#sbr-count').textContent = txt.value.length + '/600'; });
    btn.addEventListener('click', function () {
      formOpen = !formOpen; f.classList.toggle('open', formOpen); btn.setAttribute('aria-expanded', formOpen ? 'true' : 'false');
      if (formOpen) f.querySelector('#sbr-name').focus();
    });
    f.addEventListener('submit', async function (e) {
      e.preventDefault(); err.textContent = '';
      var name = f.querySelector('#sbr-name').value.trim(), text = txt.value.trim(), proof = f.querySelector('#sbr-proof').value.trim();
      if (!name) return err.textContent = T('Veuillez entrer votre prénom.');
      if (kindNow() === 'download' ? !/^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(proof) : proof.length < 3) return err.textContent = T(kindNow() === 'download' ? 'Veuillez entrer l’e-mail utilisé pour le téléchargement.' : 'Veuillez entrer votre numéro de commande Chariow.');
      if (!rating) return err.textContent = T('Veuillez choisir une note.');
      if (text.length < 10 || text.length > 600) return err.textContent = T('Votre avis doit contenir entre 10 et 600 caractères.');
      if (!f.querySelector('#sbr-consent').checked) return err.textContent = T('Veuillez accepter pour continuer.');
      go.disabled = true; go.textContent = T('Envoi en cours…');
      try {
        var r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
          action: 'submit', name: name, rating: rating, text: text, book: sel.value || null, lang: lang(), consent: true, kind: kindNow(), proof: proof, website: f.querySelector('#sbr-web').value }) });
        var j = await r.json().catch(function () { return {}; });
        if (r.status === 429) { err.textContent = T('Trop d’avis envoyés. Réessayez demain.'); }
        else if (j && j.error === 'proof') { err.textContent = T('Veuillez vérifier votre e-mail ou votre numéro de commande.'); }
        else if (j && j.error === 'links') { err.textContent = T('Les liens ne sont pas acceptés dans un avis.'); }
        else if (!r.ok || !j.ok) { err.textContent = T('Une erreur est survenue. Réessayez.'); }
        else {
          var ok = el('p', 'sbr-ok', T('Merci ! Votre avis a bien été reçu. Il sera publié après vérification.'));
          f.innerHTML = ''; f.appendChild(ok); rating = 0; formOpen = true; sent = true; return;
        }
      } catch (x) { err.textContent = T('Une erreur est survenue. Réessayez.'); }
      go.disabled = false; go.textContent = T('Envoyer mon avis');
    });
  }

  render();
  fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }) })
    .then(function (r) { return r.json(); })
    .then(function (j) { if (j && j.ok && Array.isArray(j.reviews) && j.reviews.length) { reviews = j.reviews; var keep = formOpen; render(); formOpen = keep; } })
    .catch(function () {});
  document.addEventListener('sblang', render);
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { var m = host.querySelector('.sbr-marquee'); if (m) fill({ wrap: m, track: m.querySelector('.sbr-track') }); }, 250); });
})();
