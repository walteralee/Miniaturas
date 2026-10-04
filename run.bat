@echo off
rem ================================================
rem Miniaturas - arranque en Windows
rem Uso: run.bat [local^|red]
rem ================================================

setlocal EnableExtensions

cd /d "%~dp0"

title Miniaturas

set "FRONTEND_PORT=5173"
set "BACKEND_PORT=3000"

if exist ".env" for /f "usebackq eol=# tokens=1,* delims==" %%A in (".env") do set "%%A=%%B"

echo ================================================
echo MINIATURAS
echo ================================================

rem ================================================
rem REQUISITOS
rem ================================================

where node >nul 2>nul
if errorlevel 1 (
    set "MENSAJE=No se encuentra Node.js. Instala la version 20 o superior desde https://nodejs.org"
    goto error
)

node scripts\arranque.mjs version
if errorlevel 1 (
    set "MENSAJE=Actualiza Node.js desde https://nodejs.org"
    goto error
)

set "PY="
python -c "import sys; sys.exit(sys.version_info < (3, 10))" >nul 2>nul && set "PY=python"
if not defined PY (
    py -3 -c "import sys; sys.exit(sys.version_info < (3, 10))" >nul 2>nul && set "PY=py -3"
)
if not defined PY (
    set "MENSAJE=No se encuentra Python 3.10 o superior. Instalalo desde https://www.python.org"
    goto error
)

rem ================================================
rem MODO
rem ================================================

set "MODO=%~1"

if /i "%MODO%"=="local" goto modo_elegido
if /i "%MODO%"=="red" goto modo_elegido

echo.
echo Seleccione el modo de ejecucion:
echo.
echo   1. Solo este ordenador
echo   2. Red local (movil, tablet y otros equipos de casa)
echo.

choice /c 12 /n /m "Opcion (1-2): "

if errorlevel 2 (set "MODO=red") else (set "MODO=local")

:modo_elegido

set "URL=http://localhost:%FRONTEND_PORT%"
set "VITE_ARGS="

if /i "%MODO%"=="red" (
    set "VITE_ARGS=--host"
    call :detectar_ip
)

rem ================================================
rem PUERTOS
rem ================================================

node scripts\arranque.mjs puerto %BACKEND_PORT%
if errorlevel 1 (
    set "MENSAJE=El puerto %BACKEND_PORT% esta ocupado. Cierra el programa que lo usa o cambia BACKEND_PORT en .env"
    goto error
)

node scripts\arranque.mjs puerto %FRONTEND_PORT%
if errorlevel 1 (
    set "MENSAJE=El puerto %FRONTEND_PORT% esta ocupado. Cierra el programa que lo usa o cambia FRONTEND_PORT en .env"
    goto error
)

rem ================================================
rem DEPENDENCIAS
rem ================================================

echo.
echo ================================================
echo DEPENDENCIAS
echo ================================================

call :dependencias_node backend || goto error_dependencias
call :dependencias_node frontend || goto error_dependencias

if not exist ".venv\Scripts\python.exe" (
    echo CREANDO ENTORNO DE PYTHON...
    %PY% -m venv .venv || goto error_dependencias
)

rem El backend usa este Python para descargar miniaturas
set "PYTHON=%~dp0.venv\Scripts\python.exe"

"%PYTHON%" -c "import requests, bs4" >nul 2>nul
if errorlevel 1 (
    echo INSTALANDO DEPENDENCIAS DE PYTHON...
    "%PYTHON%" -m pip install --disable-pip-version-check -q -r scripts\requirements.txt || goto error_dependencias
) else (
    echo PYTHON OK
)

rem ================================================
rem MINIATURAS
rem ================================================

echo.
echo ================================================
echo ACTUALIZANDO MINIATURAS
echo ================================================

"%PYTHON%" scripts\scraping.py

rem ================================================
rem SERVIDORES
rem ================================================

echo.
echo ================================================
echo INICIANDO SERVIDORES
echo ================================================

start "Miniaturas - Backend" /d "%~dp0backend" cmd /k npm start
start "Miniaturas - Frontend" /d "%~dp0frontend" cmd /k npm run dev -- %VITE_ARGS%

node scripts\arranque.mjs esperar "http://127.0.0.1:%BACKEND_PORT%/api/categorias" "http://localhost:%FRONTEND_PORT%"
if errorlevel 1 (
    set "MENSAJE=Los servidores no han arrancado. Revisa las ventanas Miniaturas - Backend y Miniaturas - Frontend"
    goto error
)

echo.
echo ================================================
echo LISTO: %URL%
echo ================================================

if /i "%MODO%"=="red" (
    echo.
    echo Abre esa direccion en cualquier dispositivo conectado a tu wifi.
)

start "" "%URL%"

echo.
echo Para detener la aplicacion cierra las ventanas "Miniaturas - Backend" y "Miniaturas - Frontend".
echo.
pause
exit /b 0

rem ================================================
rem SUBRUTINAS
rem ================================================

:detectar_ip
set "IP="
for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "(Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } | Select-Object -First 1).IPv4Address.IPAddress"`) do set "IP=%%I"
if defined IP (
    set "URL=http://%IP%:%FRONTEND_PORT%"
) else (
    echo.
    echo [AVISO] No se pudo detectar la IP de este equipo en la red.
    echo         Usa la direccion "Network" que muestre la ventana del frontend.
)
exit /b 0

:dependencias_node
if exist "%~1\node_modules" (
    echo %~1: dependencias OK
    exit /b 0
)
echo %~1: instalando dependencias...
pushd "%~1"
call npm install --no-fund --no-audit
set "RESULTADO=%errorlevel%"
popd
exit /b %RESULTADO%

:error_dependencias
set "MENSAJE=No se pudieron instalar las dependencias. Revisa tu conexion a internet"

:error
echo.
echo [ERROR] %MENSAJE%
echo.
pause
exit /b 1
