// Hotfix: make the teacher start flow robust and surface Supabase errors.
startQuiz = async function () {
  try {
    if (!session?.id) {
      alert('No hay una sesión activa. Vuelve a crear la sala.');
      return;
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

    if (error) {
      console.error('AgroQuiz startQuiz update error:', error);
      alert('No pude iniciar la sesión: ' + error.message);
      return;
    }

    session = data;
    if (typeof session.question_ids === 'string') {
      try { session.question_ids = JSON.parse(session.question_ids); } catch (_) {}
    }

    if (!Array.isArray(session.question_ids) || session.question_ids.length === 0) {
      alert('La sesión no contiene preguntas. Crea una nueva sala e intenta otra vez.');
      return;
    }

    const q = QUESTIONS.find(x => x.id === session.question_ids[0]);
    if (!q) {
      console.error('Question not found:', session.question_ids[0], QUESTIONS);
      alert('No pude encontrar la primera pregunta del banco. Recarga la página y crea una nueva sala.');
      return;
    }

    teacherQuestion();
  } catch (err) {
    console.error('AgroQuiz startQuiz unexpected error:', err);
    alert('Ocurrió un error al iniciar: ' + (err?.message || String(err)));
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
