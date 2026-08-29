// AgroQuiz runtime fixes.
// 1) Re-enable the teacher's Start button when the first student joins.
// 2) Make the start flow robust and surface Supabase errors.

subscribeTeacherLobby = function () {
  if (channel) db.removeChannel(channel);
  channel = db
    .channel('teacher-' + session.id)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'players', filter: `session_id=eq.${session.id}` },
      async () => {
        const ps = await refreshPlayers();
        const countEl = document.querySelector('#pc');
        const playersEl = document.querySelector('#players');
        const startBtn = document.querySelector('button[onclick="startQuiz()"]');

        if (countEl) countEl.textContent = ps.length;
        if (playersEl) playersEl.innerHTML = ps.map(p => `<span class="chip">${esc(p.name)}</span>`).join('');
        if (startBtn) startBtn.disabled = ps.length === 0;
      }
    )
    .subscribe();
};

startQuiz = async function () {
  const btn = document.querySelector('button[onclick="startQuiz()"]');
  const originalText = btn?.textContent || 'Comenzar';

  try {
    if (!session?.id) {
      alert('No hay una sesión activa. Vuelve a crear la sala.');
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Iniciando…';
    }

    const startedAt = new Date().toISOString();
    const { data, error } = await db
      .from('sessions')
      .update({
        status: 'question',
        current_index: 0,
        question_started_at: startedAt
      })
      .eq('id', session.id)
      .select('*')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Supabase no devolvió la sesión actualizada.');

    session = data;
    if (typeof session.question_ids === 'string') {
      try { session.question_ids = JSON.parse(session.question_ids); } catch (_) {}
    }

    if (!Array.isArray(session.question_ids) || session.question_ids.length === 0) {
      throw new Error('La sesión no contiene preguntas. Crea una nueva sala e intenta otra vez.');
    }

    const q = QUESTIONS.find(x => x.id === session.question_ids[0]);
    if (!q) {
      throw new Error('No pude encontrar la primera pregunta del banco. Recarga la página y crea una nueva sala.');
    }

    await teacherQuestion();
  } catch (err) {
    console.error('AgroQuiz startQuiz error:', err);
    if (btn) {
      btn.disabled = false;
      btn.textContent = originalText;
    }
    const msg = err?.message || String(err);
    alert('No se pudo iniciar la sesión:\n\n' + msg);
  }
};

loadSession = async function () {
  const { data, error } = await db
    .from('sessions')
    .select('*')
    .eq('id', session.id)
    .single();
  if (error) throw error;
  session = data;
  if (typeof session.question_ids === 'string') {
    try { session.question_ids = JSON.parse(session.question_ids); } catch (_) {}
  }
  return session;
};

currentQ = function () {
  if (!session || !Array.isArray(session.question_ids)) return null;
  const id = session.question_ids[session.current_index];
  return QUESTIONS.find(q => q.id === id) || null;
};

const originalTeacherQuestion = teacherQuestion;
teacherQuestion = async function () {
  const q = currentQ();
  if (!q) {
    alert('No pude cargar la pregunta actual. Recarga la página y crea una nueva sala.');
    return;
  }
  return originalTeacherQuestion();
};
