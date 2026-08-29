# AgroQuiz 🌱

Quiz web en vivo para clases de Agricultura Regenerativa. El docente controla la sesión y los estudiantes participan desde cualquier navegador mediante PIN o QR.

## MVP

- Vista docente y estudiante.
- Sala de espera en tiempo real.
- PIN de 6 dígitos y QR.
- Banco de preguntas por sesiones/temas.
- Preguntas de opción múltiple.
- Puntaje por acierto + rapidez.
- Revelado controlado por el docente con explicación pedagógica.
- Conteo de respuestas y distribución por opción.
- Ranking/podio final.
- Responsive para teléfono, tablet y computadora.

## 1. Crear backend en Supabase

Crea un proyecto en Supabase. En **SQL Editor**, copia y ejecuta todo el contenido de `supabase_schema.sql`.

Después abre la configuración/API de tu proyecto y copia únicamente:

- Project URL
- anon/public o publishable key

Nunca uses `service_role` en el frontend.

## 2. Configurar el frontend

Edita `config.js`:

```js
window.AGROQUIZ_CONFIG = {
  supabaseUrl: "https://TU-PROYECTO.supabase.co",
  supabaseAnonKey: "TU-CLAVE-PUBLICA"
};
```

## 3. Publicar

Importa este repositorio en Vercel como proyecto web estático. No requiere comando de build. La raíz del proyecto contiene `index.html`.

## Flujo de clase

1. Docente abre AgroQuiz y elige **Soy docente**.
2. Selecciona temas y número de preguntas.
3. AgroQuiz genera PIN + QR.
4. Estudiantes escanean QR o ingresan PIN y nombre.
5. Docente inicia.
6. Estudiantes responden desde sus dispositivos.
7. Docente revela la respuesta y explicación.
8. Docente avanza a la siguiente pregunta.
9. Al terminar se muestra el podio.

## Seguridad del MVP

El esquema utiliza acceso anónimo deliberadamente abierto para facilitar pruebas de aula. Antes de utilizar AgroQuiz como servicio público de larga duración se recomienda agregar autenticación docente, políticas RLS más restrictivas y funciones servidoras para validar puntajes.
