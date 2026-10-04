#!/usr/bin/env bash
# ================================================
# Miniaturas - arranque en Linux y macOS
# Uso: ./run.sh [local|red]
# ================================================

set -euo pipefail

cd "$(dirname "$0")"

FRONTEND_PORT=5173
BACKEND_PORT=3000

if [ -f .env ]; then
  while IFS='=' read -r clave valor; do
    export "$clave=$valor"
  done < <(grep -E '^[A-Z_]+=' .env | tr -d '\r')
fi

error() {
  echo
  echo "[ERROR] $*" >&2
  exit 1
}

titulo() {
  echo
  echo "================================================"
  echo "$1"
  echo "================================================"
}

titulo "MINIATURAS"

# ================================================
# REQUISITOS
# ================================================

command -v node >/dev/null 2>&1 ||
  error "No se encuentra Node.js. Instala la version 20 o superior desde https://nodejs.org"

node scripts/arranque.mjs version || error "Actualiza Node.js desde https://nodejs.org"

PY=""
for candidato in python3 python; do
  if command -v "$candidato" >/dev/null 2>&1 &&
    "$candidato" -c "import sys; sys.exit(sys.version_info < (3, 10))" 2>/dev/null; then
    PY="$candidato"
    break
  fi
done

[ -n "$PY" ] || error "No se encuentra Python 3.10 o superior. Instalalo desde https://www.python.org"

# ================================================
# MODO
# ================================================

MODO="${1:-}"

if [ "$MODO" != "local" ] && [ "$MODO" != "red" ]; then
  echo
  echo "Seleccione el modo de ejecucion:"
  echo
  echo "  1. Solo este ordenador"
  echo "  2. Red local (movil, tablet y otros equipos de casa)"
  echo
  read -rp "Opcion (1-2): " opcion
  [ "$opcion" = "2" ] && MODO="red" || MODO="local"
fi

URL="http://localhost:$FRONTEND_PORT"
VITE_ARGS=()

detectar_ip() {
  if command -v ip >/dev/null 2>&1; then
    ip route get 1.1.1.1 2>/dev/null |
      awk '{ for (i = 1; i <= NF; i++) if ($i == "src") { print $(i + 1); exit } }'
  elif command -v route >/dev/null 2>&1; then
    interfaz="$(route -n get default 2>/dev/null | awk '/interface:/ { print $2 }')"
    [ -n "$interfaz" ] && ipconfig getifaddr "$interfaz" 2>/dev/null
  fi
}

if [ "$MODO" = "red" ]; then
  VITE_ARGS=(--host)
  IP="$(detectar_ip || true)"

  if [ -n "$IP" ]; then
    URL="http://$IP:$FRONTEND_PORT"
  else
    echo
    echo "[AVISO] No se pudo detectar la IP de este equipo en la red."
    echo "        Usa la direccion \"Network\" que muestre el frontend."
  fi
fi

# ================================================
# PUERTOS
# ================================================

node scripts/arranque.mjs puerto "$BACKEND_PORT" ||
  error "El puerto $BACKEND_PORT esta ocupado. Cierra el programa que lo usa o cambia BACKEND_PORT en .env"

node scripts/arranque.mjs puerto "$FRONTEND_PORT" ||
  error "El puerto $FRONTEND_PORT esta ocupado. Cierra el programa que lo usa o cambia FRONTEND_PORT en .env"

# ================================================
# DEPENDENCIAS
# ================================================

titulo "DEPENDENCIAS"

for carpeta in backend frontend; do
  if [ -d "$carpeta/node_modules" ]; then
    echo "$carpeta: dependencias OK"
  else
    echo "$carpeta: instalando dependencias..."
    (cd "$carpeta" && npm install --no-fund --no-audit) ||
      error "No se pudieron instalar las dependencias. Revisa tu conexion a internet"
  fi
done

if [ ! -d .venv ]; then
  echo "CREANDO ENTORNO DE PYTHON..."
  "$PY" -m venv .venv ||
    error "No se pudo crear el entorno de Python (en Debian/Ubuntu: sudo apt install python3-venv)"
fi

# El backend usa este Python para descargar miniaturas
if [ -x .venv/bin/python ]; then
  PYTHON="$PWD/.venv/bin/python"
else
  PYTHON="$PWD/.venv/Scripts/python.exe"
fi

export PYTHON

if "$PYTHON" -c "import requests, bs4" 2>/dev/null; then
  echo "PYTHON OK"
else
  echo "INSTALANDO DEPENDENCIAS DE PYTHON..."
  "$PYTHON" -m pip install --disable-pip-version-check -q -r scripts/requirements.txt ||
    error "No se pudieron instalar las dependencias. Revisa tu conexion a internet"
fi

# ================================================
# MINIATURAS
# ================================================

titulo "ACTUALIZANDO MINIATURAS"

"$PYTHON" scripts/scraping.py || true

# ================================================
# SERVIDORES
# ================================================

titulo "INICIANDO SERVIDORES"

# Al salir (Ctrl+C) se detienen los dos servidores
trap 'trap - INT TERM EXIT; kill 0 2>/dev/null' INT TERM EXIT

(cd backend && npm start) &
# (forma compatible con el bash 3.2 de macOS cuando el array está vacío)
(cd frontend && npm run dev -- ${VITE_ARGS[@]+"${VITE_ARGS[@]}"}) &

node scripts/arranque.mjs esperar "http://127.0.0.1:$BACKEND_PORT/api/categorias" "http://localhost:$FRONTEND_PORT" ||
  error "Los servidores no han arrancado. Revisa los mensajes de arriba"

titulo "LISTO: $URL"

[ "$MODO" = "red" ] && echo "Abre esa direccion en cualquier dispositivo conectado a tu wifi."

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "$URL" || true
fi

echo
echo "Pulsa Ctrl+C para detener la aplicacion."

wait
