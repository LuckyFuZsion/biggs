(function () {
  'use strict';

  // Confirm and unsubscribe pages. The change only happens when the person presses the button
  // (so email link scanners that merely open the link cannot confirm or unsubscribe anyone).
  var mode = document.currentScript.getAttribute('data-mode');
  var apiBase = ((window.BIGGS_CONFIG || {}).apiBase || '').replace(/\/+$/, '');
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || '';
  var secret = mode === 'confirm' ? params.get('t') || '' : params.get('s') || '';

  var heading = document.getElementById('status-heading');
  var text = document.getElementById('status-text');
  var button = document.getElementById('action');

  var copy = {
    confirm: {
      done: ['You are on the list!', 'Thanks for confirming. We will let you know when the next drop is ready.'],
      already: ['You are already confirmed', 'You are on the list, so there is nothing more to do. We will let you know when the next drop is ready.'],
      gone: ['You are unsubscribed', 'You have unsubscribed from Biggs emails. You can sign up again from the home page.'],
      invalid_link: ['Link not valid', 'This link has already been used or is not right. You can sign up again from the home page.'],
      expired: ['Link expired', 'This link is more than 48 hours old. Please sign up again from the home page.'],
    },
    unsubscribe: {
      done: ['You are unsubscribed', 'You will not get any more emails from Biggs. Sorry to see you go.'],
      invalid_link: ['Link not valid', 'This link is not right. Reply to any Biggs email and we will remove you.'],
    },
  }[mode];

  // Adds a small "Changed your mind? Unsubscribe" link under the message, using the signed link from the Worker.
  function addUnsubscribe(sig) {
    if (mode !== 'confirm' || !sig || !/^[a-f0-9]{64}$/.test(sig)) return;
    var p = document.createElement('p');
    p.className = 'lede';
    var a = document.createElement('a');
    a.href = 'unsubscribe.html?id=' + encodeURIComponent(id) + '&s=' + encodeURIComponent(sig);
    a.textContent = 'Unsubscribe';
    p.appendChild(document.createTextNode('Changed your mind? '));
    p.appendChild(a);
    text.parentNode.insertBefore(p, text.nextSibling);
  }

  function show(key, unsubSig) {
    var pair = copy[key] || ['Something went wrong', 'Please try again in a moment.'];
    heading.textContent = pair[0];
    text.textContent = pair[1];
    button.hidden = true;
    if (key === 'done' || key === 'already') addUnsubscribe(unsubSig);
  }

  if (!/^[a-f0-9]{64}$/.test(id) || !secret) {
    show('invalid_link');
    return;
  }

  // Opening the confirm link again: say so up front if the address is already confirmed. This is read-only,
  // so email link scanners that merely open the link still cannot confirm anyone.
  if (mode === 'confirm') {
    fetch(apiBase + '/api/confirm-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, token: secret }),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        if (!data.ok) return; // unknown, expired or older link: keep the button, it explains on press
        if (data.status === 'confirmed') show('already', data.unsub);
        else if (data.status === 'unsubscribed') show('gone');
      })
      .catch(function () {});
  }

  button.addEventListener('click', function () {
    button.disabled = true;
    var payload = mode === 'confirm' ? { id: id, token: secret } : { id: id, sig: secret };
    fetch(apiBase + '/api/' + mode, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; });
      })
      .then(function (data) {
        show(data.ok ? 'done' : data.error, data.unsub);
      })
      .catch(function () {
        button.disabled = false;
        text.textContent = 'Something went wrong. Please try again in a moment.';
      });
  });
})();
