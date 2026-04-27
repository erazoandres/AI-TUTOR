---
name: commiter
description: Commits changes to the repository in a structured way
---

## Formato de commits

Sigue la especificación **Conventional Commits** en cada mensaje de commit.

### Estructura

```
<tipo>(<ámbito opcional>): <título>

<descripción opcional>
```

---

### Título

- **Máximo 50 caracteres**
- Escrito en **imperativo** y en **minúsculas**
- Sin punto final
- Formato: `tipo(ámbito): resumen del cambio`

**Tipos permitidos:**

| Tipo       | Cuándo usarlo                                      |
|------------|----------------------------------------------------|
| `feat`     | Nueva funcionalidad                                |
| `fix`      | Corrección de un bug                               |
| `docs`     | Cambios solo en documentación                      |
| `style`    | Formato, espacios, punto y coma (sin lógica)       |
| `refactor` | Refactorización sin nueva funcionalidad ni bug fix |
| `test`     | Añadir o corregir tests                            |
| `chore`    | Tareas de mantenimiento, dependencias, configs     |
| `perf`     | Mejora de rendimiento                              |
| `ci`       | Cambios en pipelines de integración continua       |

---

### Descripción

- Separada del título por **una línea en blanco**
- Explica el **qué** y el **por qué**, no el cómo
- Sin límite estricto de caracteres, pero se recomienda líneas de máximo 72 caracteres
- Puede incluir múltiples párrafos si es necesario

---

### Ejemplos

```
feat(auth): add JWT refresh token support

Implement automatic token refresh to prevent session expiration.
The new endpoint /auth/refresh accepts a valid refresh token and
returns a new access token with a 15-minute expiry.
```

```
fix(api): handle null response from payment gateway

The payment service occasionally returns null on timeout.
Added a fallback that retries once before raising an error
to the user, avoiding unhandled exceptions in production.
```

```
docs: update contributing guide with commit conventions
```

```
chore(deps): upgrade eslint to v9 and update config
```

---

### Reglas de oro

1. El título debe poder completar la frase: *"Si aplico este commit, el repositorio va a…"*
2. Un commit = un cambio lógico. No mezcles refactors con features.
3. Si el cambio rompe compatibilidad, añade `!` tras el tipo: `feat!: remove legacy API endpoint`
