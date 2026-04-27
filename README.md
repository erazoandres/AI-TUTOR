# 🎓 TutorIA — Tutor Inteligente para Bachillerato

> App educativa con IA que explica temas, genera ejercicios, evalúa con quizzes y lleva un mapa de progreso personalizado para estudiantes de bachillerato.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Prerrequisitos](#-prerrequisitos)
- [Instalación paso a paso](#-instalación-paso-a-paso)
- [Fase 1 — Chat con IA](#fase-1--chat-con-ia)
- [Fase 2 — Selector de Materia y Nivel](#fase-2--selector-de-materia-y-nivel)
- [Fase 3 — Ejercicios y Quiz](#fase-3--ejercicios-y-quiz)
- [Fase 4 — Mapa de Progreso](#fase-4--mapa-de-progreso)
- [Fase 5 — Deploy en Vercel](#fase-5--deploy-en-vercel)
- [Variables de Entorno](#-variables-de-entorno)
- [Recursos y Referencias](#-recursos-y-referencias)

---

## 🧠 Descripción del Proyecto

**TutorIA** es una aplicación web que actúa como tutor personalizado para estudiantes de bachillerato. Usa la API de Claude (Anthropic) para adaptar las explicaciones al nivel del estudiante, generar ejercicios prácticos, crear quizzes de evaluación y registrar el progreso del aprendizaje.

Este proyecto es ideal para portafolio porque:
- Demuestra integración real con una API de IA
- Tiene un caso de uso con impacto social
- Combina React, manejo de estado, diseño responsive y lógica de negocio
- Es extensible y escalable

---

## ✨ Características

| Módulo | Descripción |
|---|---|
| 💬 Chat Explicador | Pregunta cualquier tema y la IA lo explica a tu nivel |
| ✏️ Generador de Ejercicios | Crea ejercicios prácticos después de cada explicación |
| 🧪 Quiz Evaluador | Evalúa lo aprendido con retroalimentación inmediata |
| 📊 Mapa de Progreso | Registra temas vistos, dominados y pendientes de repaso |

---

## 🛠 Tech Stack

| Tecnología | Uso |
|---|---|
| **React 18** | Framework principal del frontend |
| **Vite** | Bundler y servidor de desarrollo |
| **Tailwind CSS** | Estilos utilitarios |
| **Claude API (Sonnet 4.6)** | Motor de IA para explicaciones y evaluaciones |
| **localStorage** | Persistencia del progreso del usuario |
| **Vercel** | Deploy gratuito y automático |

---

## 📁 Arquitectura del Proyecto

```
tutoria/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Chat.jsx              # Componente principal del chat
│   │   ├── MessageBubble.jsx     # Burbuja de mensaje individual
│   │   ├── QuizCard.jsx          # Tarjeta de pregunta del quiz
│   │   ├── ExerciseCard.jsx      # Tarjeta de ejercicio práctico
│   │   ├── ProgressMap.jsx       # Mapa visual del progreso
│   │   ├── SubjectSelector.jsx   # Selector de materia y nivel
│   │   └── Navbar.jsx            # Navegación principal
│   ├── hooks/
│   │   ├── useClaudeAPI.js       # Hook para llamadas a la API
│   │   └── useProgress.js        # Hook para manejo del progreso
│   ├── pages/
│   │   ├── Home.jsx              # Pantalla de bienvenida
│   │   ├── Session.jsx           # Sesión de estudio activa
│   │   └── Progress.jsx          # Página del mapa de progreso
│   ├── utils/
│   │   ├── prompts.js            # Prompts del sistema para Claude
│   │   └── subjects.js           # Listado de materias y temas
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                          # Variables de entorno (NO subir a GitHub)
├── .env.example                  # Plantilla de variables (SÍ subir)
├── .gitignore
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 📦 Prerrequisitos

Antes de empezar asegúrate de tener instalado:

- **Node.js** v18 o superior → [nodejs.org](https://nodejs.org)
- **npm** v9+ (viene con Node.js)
- **Git** → [git-scm.com](https://git-scm.com)
- Una **API Key de Anthropic** → [console.anthropic.com](https://console.anthropic.com)
- Cuenta en **Vercel** (para el deploy) → [vercel.com](https://vercel.com)

Verifica tu instalación:

```bash
node --version   # debe mostrar v18.x.x o superior
npm --version    # debe mostrar v9.x.x o superior
git --version
```

---

## 🚀 Instalación paso a paso

### Paso 1 — Crear el proyecto con Vite

```bash
npm create vite@latest tutoria -- --template react
cd tutoria
npm install
```

### Paso 2 — Instalar dependencias

```bash
# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# React Router (para navegación entre páginas)
npm install react-router-dom

# Lucide React (íconos)
npm install lucide-react
```

### Paso 3 — Configurar Tailwind CSS

Edita `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edita `src/index.css` y reemplaza todo el contenido con:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Paso 4 — Crear el archivo `.env`

En la raíz del proyecto crea un archivo `.env`:

```
VITE_ANTHROPIC_API_KEY=tu_api_key_aqui
```

> ⚠️ **Nunca subas este archivo a GitHub.** El `.gitignore` generado por Vite ya lo excluye.

Crea también `.env.example` para documentar qué variables se necesitan:

```
VITE_ANTHROPIC_API_KEY=
```

### Paso 5 — Configurar `.gitignore`

Verifica que `.gitignore` incluya:

```
.env
.env.local
node_modules/
dist/
```

---

## Fase 1 — Chat con IA

Esta es la base de toda la app. Un chat que se comunica con Claude.

### Crear el hook `useClaudeAPI.js`

```js
// src/hooks/useClaudeAPI.js
import { useState } from "react";

export function useClaudeAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (messages, systemPrompt) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
          system: systemPrompt,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
```

### Crear los prompts del sistema

```js
// src/utils/prompts.js
export const getTutorPrompt = (subject, level) => `
Eres TutorIA, un tutor amigable y paciente para estudiantes de bachillerato colombianos.

Tu materia es: ${subject}
Nivel del estudiante: ${level}

Reglas de comportamiento:
- Explica siempre con ejemplos cotidianos y del contexto latinoamericano
- Usa lenguaje simple y cercano, como un amigo que sabe mucho
- Cuando expliques un tema, ofrece al final generar ejercicios prácticos
- Si el estudiante se equivoca, corrige con amabilidad y explica por qué
- Usa emojis con moderación para hacer las respuestas más amigables
- Adapta la complejidad al nivel indicado: básico, intermedio o avanzado
- Responde siempre en español
`;

export const getExercisePrompt = (subject, topic, level) => `
Genera 3 ejercicios prácticos sobre "${topic}" en ${subject} para nivel ${level}.

Formato de respuesta (JSON):
{
  "ejercicios": [
    {
      "enunciado": "...",
      "pistas": ["pista1", "pista2"],
      "respuesta": "..."
    }
  ]
}

Los ejercicios deben ser progresivos: fácil, medio, difícil.
`;

export const getQuizPrompt = (subject, topic) => `
Genera un quiz de 5 preguntas de opción múltiple sobre "${topic}" en ${subject}.

Formato de respuesta (JSON):
{
  "preguntas": [
    {
      "pregunta": "...",
      "opciones": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "respuesta_correcta": "A",
      "explicacion": "..."
    }
  ]
}

Las preguntas deben evaluar comprensión real, no solo memorización.
`;
```

### Crear el componente `Chat.jsx`

```jsx
// src/components/Chat.jsx
import { useState } from "react";
import { useClaudeAPI } from "../hooks/useClaudeAPI";
import { getTutorPrompt } from "../utils/prompts";
import MessageBubble from "./MessageBubble";
import { Send, Loader2 } from "lucide-react";

export default function Chat({ subject, level }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { sendMessage, loading } = useClaudeAPI();

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    const systemPrompt = getTutorPrompt(subject, level);
    const response = await sendMessage(newMessages, systemPrompt);

    if (response) {
      setMessages([...newMessages, { role: "assistant", content: response }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-4xl mb-4">🎓</p>
            <p className="text-lg font-medium">¡Hola! Soy TutorIA</p>
            <p className="text-sm">Pregúntame cualquier tema de {subject}</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-gray-400">
            <Loader2 className="animate-spin w-4 h-4" />
            <span className="text-sm">TutorIA está pensando...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Pregúntame algo de ${subject}...`}
          rows={2}
          className="flex-1 resize-none border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 text-white rounded-xl px-4 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### Crear `MessageBubble.jsx`

```jsx
// src/components/MessageBubble.jsx
export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-100 text-gray-800 rounded-bl-sm"
        }`}
      >
        {!isUser && <span className="font-semibold text-blue-600">TutorIA 🎓</span>}
        {!isUser && <br />}
        {content}
      </div>
    </div>
  );
}
```

### Actualizar `App.jsx` para probar

```jsx
// src/App.jsx
import Chat from "./components/Chat";

export default function App() {
  return (
    <div className="h-screen flex flex-col max-w-2xl mx-auto">
      <header className="bg-blue-600 text-white px-6 py-4">
        <h1 className="text-xl font-bold">🎓 TutorIA</h1>
        <p className="text-sm text-blue-100">Tu tutor inteligente de bachillerato</p>
      </header>
      <main className="flex-1 overflow-hidden">
        <Chat subject="Matemáticas" level="intermedio" />
      </main>
    </div>
  );
}
```

**Ejecuta el proyecto:**

```bash
npm run dev
```

Abre `http://localhost:5173` y prueba el chat. ✅

---

## Fase 2 — Selector de Materia y Nivel

### Crear `subjects.js`

```js
// src/utils/subjects.js
export const SUBJECTS = [
  {
    id: "matematicas",
    name: "Matemáticas",
    emoji: "📐",
    topics: ["Álgebra", "Geometría", "Trigonometría", "Cálculo básico", "Estadística"],
  },
  {
    id: "fisica",
    name: "Física",
    emoji: "⚡",
    topics: ["Cinemática", "Dinámica", "Termodinámica", "Electricidad", "Óptica"],
  },
  {
    id: "quimica",
    name: "Química",
    emoji: "🧪",
    topics: ["Tabla periódica", "Enlace químico", "Reacciones", "Estequiometría", "Orgánica"],
  },
  {
    id: "biologia",
    name: "Biología",
    emoji: "🧬",
    topics: ["Célula", "Genética", "Ecosistemas", "Cuerpo humano", "Evolución"],
  },
  {
    id: "historia",
    name: "Historia",
    emoji: "🏛️",
    topics: ["Historia de Colombia", "América precolombina", "Independencias", "Guerras mundiales", "Colombia siglo XX"],
  },
  {
    id: "lengua",
    name: "Lengua Castellana",
    emoji: "📚",
    topics: ["Comprensión lectora", "Gramática", "Ortografía", "Literatura", "Redacción"],
  },
];

export const LEVELS = [
  { id: "basico", name: "Básico", description: "Acabo de ver el tema" },
  { id: "intermedio", name: "Intermedio", description: "Lo entiendo un poco" },
  { id: "avanzado", name: "Avanzado", description: "Quiero profundizar" },
];
```

### Crear `SubjectSelector.jsx`

```jsx
// src/components/SubjectSelector.jsx
import { SUBJECTS, LEVELS } from "../utils/subjects";

export default function SubjectSelector({ onStart }) {
  const handleSelect = (subject, level) => {
    onStart({ subject, level });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">¿Qué quieres aprender hoy?</h2>
      <p className="text-gray-500 mb-6">Elige una materia y tu nivel actual</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {SUBJECTS.map((subject) => (
          <div key={subject.id} className="border rounded-xl p-4">
            <p className="text-2xl mb-1">{subject.emoji}</p>
            <p className="font-semibold text-gray-800">{subject.name}</p>
            <div className="mt-3 space-y-1">
              {LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => handleSelect(subject.name, level.name)}
                  className="w-full text-left text-xs px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-gray-600"
                >
                  {level.name} — {level.description}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Actualizar `App.jsx`

```jsx
// src/App.jsx
import { useState } from "react";
import Chat from "./components/Chat";
import SubjectSelector from "./components/SubjectSelector";

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <div className="h-screen flex flex-col max-w-2xl mx-auto">
      <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">🎓 TutorIA</h1>
          {session && (
            <p className="text-xs text-blue-100">
              {session.subject} · Nivel {session.level}
            </p>
          )}
        </div>
        {session && (
          <button
            onClick={() => setSession(null)}
            className="text-sm text-blue-100 hover:text-white underline"
          >
            Cambiar materia
          </button>
        )}
      </header>

      <main className="flex-1 overflow-hidden">
        {!session ? (
          <SubjectSelector onStart={setSession} />
        ) : (
          <Chat subject={session.subject} level={session.level} />
        )}
      </main>
    </div>
  );
}
```

---

## Fase 3 — Ejercicios y Quiz

### Crear `ExerciseCard.jsx`

```jsx
// src/components/ExerciseCard.jsx
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ExerciseCard({ ejercicio, numero }) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="border rounded-xl p-4 mb-3 bg-white shadow-sm">
      <p className="font-semibold text-gray-700 mb-2">
        Ejercicio {numero}: {ejercicio.enunciado}
      </p>

      <button
        onClick={() => setShowHint(!showHint)}
        className="text-sm text-blue-500 hover:underline flex items-center gap-1 mb-2"
      >
        {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showHint ? "Ocultar pista" : "Ver pista"}
      </button>

      {showHint && (
        <ul className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 mb-2 list-disc list-inside">
          {ejercicio.pistas.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      )}

      <button
        onClick={() => setShowAnswer(!showAnswer)}
        className="text-sm text-green-600 hover:underline flex items-center gap-1"
      >
        {showAnswer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAnswer ? "Ocultar respuesta" : "Ver respuesta"}
      </button>

      {showAnswer && (
        <div className="text-sm text-green-700 bg-green-50 rounded-lg p-3 mt-2">
          ✅ {ejercicio.respuesta}
        </div>
      )}
    </div>
  );
}
```

### Crear `QuizCard.jsx`

```jsx
// src/components/QuizCard.jsx
import { useState } from "react";

export default function QuizCard({ pregunta, numero, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (opcion) => {
    if (submitted) return;
    setSelected(opcion);
    setSubmitted(true);
    const correct = opcion[0] === pregunta.respuesta_correcta;
    onAnswer(correct);
  };

  return (
    <div className="border rounded-xl p-4 mb-4 bg-white shadow-sm">
      <p className="font-semibold text-gray-800 mb-3">
        {numero}. {pregunta.pregunta}
      </p>
      <div className="space-y-2">
        {pregunta.opciones.map((opcion, i) => {
          const letra = opcion[0];
          const isCorrect = letra === pregunta.respuesta_correcta;
          const isSelected = selected === opcion;

          let style = "border rounded-lg px-4 py-2 text-sm text-left w-full transition-colors ";
          if (!submitted) style += "hover:bg-blue-50 hover:border-blue-300";
          else if (isCorrect) style += "bg-green-100 border-green-400 text-green-700 font-semibold";
          else if (isSelected) style += "bg-red-100 border-red-400 text-red-700";
          else style += "bg-gray-50 text-gray-400";

          return (
            <button key={i} className={style} onClick={() => handleSubmit(opcion)}>
              {opcion}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`mt-3 text-sm p-3 rounded-lg ${
          selected[0] === pregunta.respuesta_correcta
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        }`}>
          {selected[0] === pregunta.respuesta_correcta ? "✅ ¡Correcto!" : "❌ Incorrecto."}{" "}
          {pregunta.explicacion}
        </div>
      )}
    </div>
  );
}
```

---

## Fase 4 — Mapa de Progreso

### Crear `useProgress.js`

```js
// src/hooks/useProgress.js
import { useState } from "react";

const STORAGE_KEY = "tutoria_progress";

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const updateTopic = (subject, topic, status) => {
    const updated = {
      ...progress,
      [subject]: {
        ...(progress[subject] || {}),
        [topic]: { status, updatedAt: new Date().toISOString() },
      },
    };
    setProgress(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getTopicStatus = (subject, topic) => {
    return progress[subject]?.[topic]?.status || "pendiente";
  };

  const clearProgress = () => {
    setProgress({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return { progress, updateTopic, getTopicStatus, clearProgress };
}
```

### Crear `ProgressMap.jsx`

```jsx
// src/components/ProgressMap.jsx
import { SUBJECTS } from "../utils/subjects";
import { useProgress } from "../hooks/useProgress";

const STATUS_STYLES = {
  pendiente: "bg-gray-100 text-gray-500",
  visto: "bg-blue-100 text-blue-600",
  dominado: "bg-green-100 text-green-700",
  repasar: "bg-yellow-100 text-yellow-700",
};

const STATUS_LABELS = {
  pendiente: "⬜ Pendiente",
  visto: "🔵 Visto",
  dominado: "✅ Dominado",
  repasar: "🔁 Repasar",
};

export default function ProgressMap() {
  const { progress, updateTopic, getTopicStatus, clearProgress } = useProgress();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Mi Progreso</h2>
        <button
          onClick={clearProgress}
          className="text-sm text-red-400 hover:text-red-600 underline"
        >
          Reiniciar
        </button>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <span key={key} className={`text-xs px-3 py-1 rounded-full ${STATUS_STYLES[key]}`}>
            {label}
          </span>
        ))}
      </div>

      {SUBJECTS.map((subject) => (
        <div key={subject.id} className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">
            {subject.emoji} {subject.name}
          </h3>
          <div className="space-y-2">
            {subject.topics.map((topic) => {
              const status = getTopicStatus(subject.name, topic);
              return (
                <div
                  key={topic}
                  className="flex items-center justify-between border rounded-lg px-4 py-2"
                >
                  <span className="text-sm text-gray-700">{topic}</span>
                  <select
                    value={status}
                    onChange={(e) => updateTopic(subject.name, topic, e.target.value)}
                    className={`text-xs rounded-full px-3 py-1 border-0 cursor-pointer ${STATUS_STYLES[status]}`}
                  >
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Fase 5 — Deploy en Vercel

### Paso 1 — Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "feat: initial TutorIA setup"
git branch -M main
git remote add origin https://github.com/tu-usuario/tutoria.git
git push -u origin main
```

> ⚠️ Verifica que el archivo `.env` NO esté incluido en el commit.

### Paso 2 — Conectar Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub
2. Haz clic en **"New Project"**
3. Importa el repositorio `tutoria`
4. Vercel detecta automáticamente que es un proyecto Vite

### Paso 3 — Agregar variables de entorno en Vercel

En la pantalla de configuración del proyecto:
1. Ve a **"Environment Variables"**
2. Agrega: `VITE_ANTHROPIC_API_KEY` → tu API key
3. Haz clic en **"Deploy"**

### Paso 4 — ¡Listo! 🎉

Vercel te dará una URL pública como `https://tutoria-xyz.vercel.app`. Cada vez que hagas `git push`, Vercel redespliega automáticamente.

---

## 🔐 Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | API Key de Anthropic | ✅ Sí |

Obtén tu API key en: [console.anthropic.com](https://console.anthropic.com)

> 💡 El prefijo `VITE_` es obligatorio en proyectos Vite para exponer variables al frontend.

---

## 📚 Recursos y Referencias

| Recurso | URL |
|---|---|
| Documentación Claude API | https://docs.anthropic.com |
| Consola Anthropic (API Keys) | https://console.anthropic.com |
| Documentación React | https://react.dev |
| Documentación Tailwind CSS | https://tailwindcss.com/docs |
| Documentación Vite | https://vitejs.dev |
| Deploy en Vercel | https://vercel.com/docs |

---

## 🗺️ Próximos pasos sugeridos

Una vez tengas la app base funcionando, puedes extenderla con:

- 🔐 **Autenticación** con Supabase o Firebase para guardar progreso en la nube
- 🎙️ **Entrada por voz** usando la Web Speech API
- 📱 **PWA** (Progressive Web App) para instalación en móvil
- 🌍 **Multiidioma** para soportar inglés además de español
- 📈 **Analytics** con Vercel Analytics para ver qué temas son más consultados

---

## 👨‍💻 Autor

Proyecto de portafolio — creado con ❤️ y Claude API de Anthropic.

---

*¿Encontraste algún error o quieres contribuir? ¡Abre un issue o un pull request!*
