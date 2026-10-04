# Miniaturas

Gestor de miniaturas desarrollado con React, Node.js, SQLite y Python para organizar enlaces y miniaturas mediante categorías.

## Características

- Galería visual de enlaces: cada miniatura abre su página al pulsarla.
- Añadir enlaces con o sin imagen: si no eliges una, se descarga automáticamente la imagen de vista previa de la página.
- Actualizar, mover de categoría y borrar miniaturas (clic derecho o botón `⋯` en móvil).
- Gestión de categorías: crear, renombrar y eliminar (sus miniaturas pasan a "Sin categoría").
- Filtro por categoría con contador, que se recuerda entre visitas.
- Almacenamiento en SQLite (la base de datos se crea sola si no existe).
- Revisión de miniaturas al arrancar: descarga las que falten.
- Acceso desde cualquier dispositivo de la red local, con la IP detectada automáticamente.
- Diseño responsive para ordenadores, tablets y móviles.

## Requisitos

- Node.js 20 o superior
- Python 3

## Instalación

```bash
git clone https://github.com/walteralee/Miniaturas.git

cd Miniaturas
```

## Ejecución

```bat
.\EJECUTAR.bat
```

El script comprueba los requisitos, instala las dependencias que falten, actualiza las miniaturas, arranca los servidores y abre el navegador. Al iniciar podrás elegir entre:

1. Solo este ordenador.
2. Red local (móvil, tablet y otros equipos de casa).

### Ejecución manual

```bash
cd backend && npm install && npm start
cd frontend && npm install && npm run dev            # solo este equipo
cd frontend && npm run dev -- --host                 # red local
python scripts/scraping.py                           # revisar miniaturas
```

## Configuración

Los puertos se cambian copiando `.env.example` a `.env`:

```env
FRONTEND_PORT=5173
BACKEND_PORT=3000
```

## Estructura

```
backend/         API REST (Express + SQLite)
frontend/        Interfaz (React + Vite)
scripts/         Scraping de miniaturas (Python)
almacenamiento/  Base de datos e imágenes
```

## API

| Método | Ruta                             | Descripción                              |
| ------ | -------------------------------- | ---------------------------------------- |
| GET    | `/api/miniaturas`                | Lista las miniaturas                     |
| POST   | `/api/miniaturas`                | Crea una (`url`, `categoriaId`, imagen opcional) |
| PUT    | `/api/miniaturas/:id`            | Actualiza enlace y/o imagen              |
| PUT    | `/api/miniaturas/:id/categoria`  | Mueve a otra categoría                   |
| DELETE | `/api/miniaturas/:id`            | Borra una miniatura                      |
| GET    | `/api/categorias`                | Lista las categorías                     |
| POST   | `/api/categorias`                | Crea una categoría                       |
| PUT    | `/api/categorias/:id`            | Renombra una categoría                   |
| DELETE | `/api/categorias/:id`            | Elimina una categoría                    |

## Tecnologías

- React
- Vite
- Node.js
- Express
- SQLite
- Python
- BeautifulSoup
- CSS
- HTML
- JavaScript

## Versión

4.0 — Local/red, con categorías y SQLite.
