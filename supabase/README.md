# Configuración de Supabase para el Blog

Este documento detalla cómo configurar tu proyecto de Supabase para alojar el contenido del blog de "Desarrollo de Apps Móviles" y de **futuros sitios web**.

## 1. Crear el Proyecto en Supabase

1.  Ve a [Supabase](https://supabase.com/) y crea un nuevo proyecto.
2.  Toma nota de la `SUPABASE_URL` y la `SUPABASE_ANON_KEY` (las necesitarás si conectas el frontend en el futuro).

    ### ¿Dónde encontrarlas?
    1.  En tu dashboard de Supabase, ve a **Project Settings** (el ícono de engranaje ⚙️ abajo a la izquierda).
    2.  Haz clic en **API** en el menú lateral.
    3.  Ahí verás **Project URL** (`SUPABASE_URL`).
    4.  Y debajo **Project API keys**, busca la que dice `anon` y `public` (`SUPABASE_ANON_KEY`).

## 2. Ejecutar el Schema SQL


El archivo `schema.sql` contiene toda la estructura necesaria.

1.  En el dashboard de tu proyecto Supabase, ve a **SQL Editor**.
2.  Crea un "New Query".
3.  Copia y pega el contenido de `supabase/schema.sql` de este repositorio.
4.  Ejecuta la query (`Run`).

Esto creará las tablas optimizadas para manejar múltiples sitios web en una sola base de datos.

## 3. Estrategia Multi-Dominio (Multi-Tenant)

Hemos agregado una columna `site_id` a las tablas `articles`, `categories` y `tags`.

Esto te permite usar **la misma base de datos** para todos tus dominios satélite. Solo necesitas filtrar por el `site_id` correspondiente en cada frontend.

### Ejemplo de Uso:

*   **Web 1 (Apps Móviles):** Guardas los artículos con `site_id = 'apps-moviles'`.
*   **Web 2 (Otro Nicho):** Guardas los artículos con `site_id = 'otro-nicho'`.

Cuando hagas las consultas desde el código:

```typescript
const { data, error } = await supabase
  .from('articles')
  .select('*')
  .eq('site_id', 'apps-moviles') // Aquí filtras por el sitio actual
  .eq('status', 'published');
```

¡Así puedes gestionar todo tu imperio de blogs desde un solo panel de Supabase!

## 4. Estructura de Datos (JSONB)

La columna `content` en la tabla `articles` es de tipo `JSONB` para guardar la estructura de secciones.

Formato esperado:
```json
[
  {
    "heading": "Introducción",
    "content": "Texto...",
    "subsections": []
  }
]
```

## 5. Políticas de Seguridad (RLS)

- **Público**: Lectura permitida para cualquier artículo publicado.
- **Privado (Admin)**: Gestión total solo para ti.
