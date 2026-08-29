# AgroQuiz – Contexto de proyecto para Codex

## Objetivo
Construir una aplicación web tipo Kahoot para clases, enfocada inicialmente en Agricultura Regenerativa, con acceso por navegador para estudiantes mediante QR/PIN, sin necesidad de instalar apps.

## Estado actual
El MVP ya está publicado y funcional en GitHub Pages:

- Sitio público: https://danny-deisg.github.io/agroquiz/
- Repositorio: `danny-deisg/agroquiz`
- Backend: Supabase
- Realtime probado entre computadora del docente y teléfonos de estudiantes.

## Arquitectura actual
Frontend estático:
- `index.html`
- `styles.css`
- `app.js`
- `hotfix.js`
- `questions.json`
- `config.js`

Backend Supabase:
- Tabla `sessions`
- Tabla `players`
- Tabla `answers`
- Realtime habilitado para las tres tablas
- RLS abierto de forma deliberada para el MVP de aula

Publicación:
- GitHub Pages
- Workflow: `.github/workflows/pages.yml`

## Supabase
`config.js` ya contiene:
- Project URL público
- Publishable key pública

NO sustituir por `service_role` ni exponer claves privadas.

## Flujo funcional comprobado
1. Docente abre AgroQuiz.
2. Selecciona temas y número de preguntas.
3. Crea una sesión.
4. Se genera PIN de 6 dígitos y QR.
5. Estudiante escanea QR o ingresa PIN.
6. Estudiante escribe nombre.
7. Docente ve participantes aparecer en tiempo real.
8. Docente pulsa `Comenzar`.
9. Se muestra pregunta con temporizador.
10. Estudiantes responden desde sus dispositivos.
11. Docente ve contador de respuestas.
12. Docente revela respuesta correcta y explicación.
13. Se acumula puntaje por acierto + rapidez.
14. Se avanza entre preguntas.
15. Al finalizar se muestra podio/ranking.

## Bugs ya encontrados y corregidos
### GitHub Pages
El primer workflow falló porque Pages todavía no estaba habilitado. Se configuró `Settings > Pages > Source: GitHub Actions` y luego el deployment funcionó.

### Botón `Comenzar`
El botón se generaba como `disabled` cuando la sala tenía 0 participantes. Al entrar estudiantes por Realtime se actualizaba el contador y los nombres, pero no se habilitaba el botón. Esto fue corregido en `hotfix.js` para habilitarlo cuando entra el primer participante.

### Robustez de inicio
`hotfix.js` también valida:
- sesión activa
- errores de Supabase al cambiar status a `question`
- existencia de `question_ids`
- existencia de la pregunta actual

## Banco de preguntas actual
`questions.json` contiene preguntas iniciales de Agricultura Regenerativa basadas en sesiones S1–S5:
- S1 Fundamentos
- S2 Suelo vivo
- S3 Las 3 Emes
- S4 Indicadores de salud del suelo
- S5 Mínima perturbación

Actualmente hay preguntas de opción múltiple con explicación pedagógica.

## UX actual
Estilo visual verde/agronómico, responsive para computadora y móvil.
Pantallas actuales:
- Inicio
- Crear sesión docente
- Lobby con QR/PIN
- Pregunta docente
- Revelar respuesta
- Ranking/podio
- Ingreso estudiante
- Espera estudiante
- Pregunta estudiante
- Resultado estudiante
- Posición final

## Próximas mejoras prioritarias
Codex debería trabajar primero en una V2 manteniendo compatibilidad con el MVP y Supabase actual.

### Prioridad alta
1. Historial de sesiones para docente.
2. Ver detalle de una sesión anterior.
3. Tabla de participantes, puntaje y respuestas por pregunta.
4. Exportar resultados a CSV/Excel.
5. Ranking intermedio entre preguntas.
6. Temporizador configurable al crear sesión.
7. Configurar número de preguntas de forma más flexible.
8. Evitar PIN duplicado comprobando en Supabase antes de crear sesión.
9. Mejor manejo de reconexión/refresco del estudiante.
10. Mantener sesión del estudiante en `localStorage` para que un refresh no lo saque del juego.

### Banco de preguntas
11. Panel docente para ver banco completo.
12. Crear, editar y eliminar preguntas.
13. Filtros por tema/sesión.
14. Permitir Verdadero/Falso.
15. Permitir preguntas con imágenes.
16. Importar preguntas desde JSON/CSV.

### Seguridad / calidad
17. Agregar autenticación docente posteriormente.
18. Endurecer RLS cuando exista autenticación.
19. Evitar que el cliente pueda alterar directamente su propio score; mover validación de puntaje a función/RPC/servidor.
20. Agregar estado `closed` o expiración de sesiones antiguas.
21. Manejo de errores visible y consistente.
22. Evitar dobles clics en `Revelar` / `Siguiente`.

### Experiencia docente
23. Mostrar distribución de respuestas con barras/porcentajes.
24. Botón para cerrar respuestas antes de revelar.
25. Opción `revelar automáticamente al terminar tiempo` configurable.
26. Botón para saltar pregunta.
27. Mostrar quiénes faltan por responder.
28. Descargar resumen final de clase.

### Experiencia estudiante
29. Barra/progreso de preguntas.
30. Estado visual de respuesta enviada.
31. Ranking parcial opcional.
32. Mejor feedback correcto/incorrecto.
33. Diseño móvil con botones grandes y seguros.

## Recomendación técnica para Codex
Antes de agregar grandes funciones, revisar y refactorizar `app.js` + `hotfix.js` para evitar seguir acumulando parches globales. Idealmente:

- Separar estado de sesión, UI docente y UI estudiante.
- Mantener frontend simple sin framework si no aporta valor inmediato.
- Si se migra a módulos JS, conservar despliegue estático por GitHub Pages.
- No romper las URLs existentes ni el flujo QR.
- Cada cambio debe probarse con dos navegadores/dispositivos cuando afecte Realtime.

## Criterios de aceptación para una V2 inicial
- Crear sesión sigue funcionando.
- QR/PIN sigue funcionando.
- 10+ estudiantes pueden entrar.
- Iniciar juego funciona aunque los participantes entren después de abrir el lobby.
- Respuestas se contabilizan en Realtime.
- Score se acumula correctamente.
- Podio final funciona.
- Historial de sesiones disponible para docente.
- Resultados exportables.
- Refresh del teléfono no pierde al participante ni su estado.

## Nota de producto
La intención no es copiar Kahoot visualmente. AgroQuiz debe tener identidad propia enfocada en docencia agrícola: explicaciones después de cada pregunta, capacidad de discusión en clase, estadísticas y reutilización del banco de preguntas.
