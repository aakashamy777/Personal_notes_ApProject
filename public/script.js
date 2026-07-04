let token = null;

function showTab(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('auth-error').textContent = '';
}

async function handleRegister(e) {
  e.preventDefault();
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Registration failed');
    token = data.token;
    showDashboard();
  } catch (err) {
    document.getElementById('auth-error').textContent = err.message;
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    token = data.token;
    showDashboard();
  } catch (err) {
    document.getElementById('auth-error').textContent = err.message;
  }
}

function showDashboard() {
  document.getElementById('auth-section').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  loadNotes();
}

function logout() {
  token = null;
  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('auth-section').classList.remove('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('register-form').reset();
  document.getElementById('auth-error').textContent = '';
}

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, ...options.headers }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadNotes() {
  const search = document.getElementById('search-input').value;
  const archived = document.getElementById('filter-archive').value;
  let url = `/api/notes?archived=${archived}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  try {
    const data = await apiFetch(url);
    renderNotes(data.notes);
  } catch (err) {
    document.getElementById('notes-list').innerHTML = `<p class="error">${err.message}</p>`;
  }
}

function renderNotes(notes) {
  const container = document.getElementById('notes-list');
  if (!notes.length) {
    container.innerHTML = '<div class="empty-state">No notes yet. Create one above!</div>';
    return;
  }
  container.innerHTML = notes.map(n => {
    const classes = ['note-card', n.pinned ? 'pinned' : '', n.archived ? 'archived' : ''].filter(Boolean).join(' ');
    const tagsHtml = n.tags.map(t => `<span class="tag">${t}</span>`).join('');
    const date = new Date(n.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return `
      <div class="${classes}">
        <h3>${n.pinned ? '📌 ' : ''}${escapeHtml(n.title)}</h3>
        <p class="note-meta">${date}</p>
        <p>${escapeHtml(n.content)}</p>
        ${tagsHtml ? `<div class="note-tags">${tagsHtml}</div>` : ''}
        <div class="note-actions">
          <button onclick="togglePin('${n.id}')">${n.pinned ? 'Unpin' : 'Pin'}</button>
          <button onclick="toggleArchive('${n.id}')">${n.archived ? 'Unarchive' : 'Archive'}</button>
          <button onclick="deleteNote('${n.id}')">Delete</button>
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function handleCreate(e) {
  e.preventDefault();
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;
  const tagsRaw = document.getElementById('note-tags').value;
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  try {
    await apiFetch('/api/notes', { method: 'POST', body: JSON.stringify({ title, content, tags }) });
    document.getElementById('note-title').value = '';
    document.getElementById('note-content').value = '';
    document.getElementById('note-tags').value = '';
    loadNotes();
  } catch (err) {
    alert(err.message);
  }
}

async function togglePin(id) {
  try { await apiFetch(`/api/notes/${id}/pin`, { method: 'PATCH' }); loadNotes(); }
  catch (err) { alert(err.message); }
}

async function toggleArchive(id) {
  try { await apiFetch(`/api/notes/${id}/archive`, { method: 'PATCH' }); loadNotes(); }
  catch (err) { alert(err.message); }
}

async function deleteNote(id) {
  if (!confirm('Delete this note?')) return;
  try { await apiFetch(`/api/notes/${id}`, { method: 'DELETE' }); loadNotes(); }
  catch (err) { alert(err.message); }
}
