(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* Reveal sections as they scroll into view */
  const reveals = document.querySelectorAll('.reveal');
  document.querySelectorAll('.bento').forEach((b) => b.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${i * 0.07}s`)));
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* Spotlight follows the cursor across tiles */
  document.querySelectorAll('.tile').forEach((tile) => {
    tile.addEventListener('pointermove', (e) => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  if (reduce) return;

  /* Team feed: what teammates and their agents are doing */
  const events = document.getElementById('events');
  const FEED = [
    ['warn', 'Heads-up', 'Leo\'s agent is already editing <code>cart.vi</code>'],
    ['note', 'Note', 'Maya pinned "prices are stored in cents" on <code>cart.vi</code>'],
    ['hand', 'Handoff', 'Sam passed "finish the menu page" to Maya\'s agent'],
    ['', 'Taken over', 'Maya\'s agent picked up "finish the menu page"'],
    ['warn', 'Heads-up', 'Sam is working on the same page, <code>index.html</code>'],
    ['', 'Message', 'Leo: "checkout totals are fixed, take a look"'],
  ];
  if (events) {
    (async () => {
      let i = 1;
      for (;;) {
        await wait(2600);
        const [kind, title, text] = FEED[i % FEED.length];
        const el = document.createElement('div');
        el.className = `event ${kind}`;
        el.innerHTML = `<b>${title}</b>${text}`;
        events.prepend(el);
        const items = events.querySelectorAll('.event:not(.out)');
        if (items.length > 2) {
          const last = items[items.length - 1];
          last.classList.add('out');
          setTimeout(() => last.remove(), 400);
        }
        i++;
      }
    })();
  }

  /* Graph ↔ code: light up each block and the line it becomes */
  const first = document.querySelector('.compare:not(.link)');
  const nodes = first ? first.querySelectorAll('.node[data-step]') : [];
  const lines = first ? first.querySelectorAll('.ln[data-step]') : [];
  if (nodes.length && lines.length) {
    (async () => {
      for (let step = 0; ; step = (step + 1) % 4) {
        nodes.forEach((n) => n.classList.toggle('on', n.dataset.step === String(step)));
        lines.forEach((l) => l.classList.toggle('on', l.dataset.step === String(step)));
        await wait(1500);
      }
    })();
  }


  /* Page editor ↔ .vi: each part of the page lights up the logic it points at */
  const link = document.querySelector('.compare.link');
  const cap = document.getElementById('linkCaption');
  if (link) {
    const els = link.querySelectorAll('.ui-el[data-step]');
    const gnodes = link.querySelectorAll('.node[data-step]');
    const CAPS = [
      'The email field fills the <b>email</b> input of <b>addMember</b>.',
      'The Sign up button runs <b>addMember</b>, which adds the email to the list.',
      'The list repeats once for each item in <b>members</b>.',
    ];
    (async () => {
      for (let step = 0; ; step = (step + 1) % 3) {
        els.forEach((n) => n.classList.toggle('on', n.dataset.step === String(step)));
        gnodes.forEach((n) => n.classList.toggle('on', n.dataset.step.split(' ').includes(String(step))));
        if (cap) cap.innerHTML = CAPS[step];
        await wait(2200);
      }
    })();
  }

  /* Plain-words explanations, one after another */
  const bubble = document.getElementById('bubble');
  const bTitle = document.getElementById('bTitle');
  const bText = document.getElementById('bText');
  const EXPLAIN = [
    ['Button “Add to cart”', 'When clicked, it adds this item to the cart and updates the total on the page.'],
    ['Link “Our story”', 'Opens the story page. It is in the navigation on every page.'],
    ['Form “Sign up”', 'Sends the name and email typed here to the signup action.'],
    ['Text “Total”', 'Shows the cart total. The number comes from the cart logic.'],
  ];
  if (bubble) {
    (async () => {
      for (let i = 1; ; i++) {
        await wait(3400);
        bubble.classList.add('swap');
        await wait(350);
        const [t, x] = EXPLAIN[i % EXPLAIN.length];
        bTitle.textContent = t;
        bText.textContent = x;
        bubble.classList.remove('swap');
      }
    })();
  }
})();
