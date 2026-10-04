@echo off
setlocal EnableExtensions EnableDelayedExpansion

cd /d "%~dp0"

title Miniaturas

rem ================================================
rem CONFIGURACION (config.env)
rem ================================================

set "FRONTEND_PORT=5173"
set "BACKEND_PORT=3000"

for /f "usebackq eol=# tokens=1,* delims==" %%A in ("config.env") do set "%%A=%%B"

echo ================================================
echo MINIATURAS
echo ================================================

rem ================================================
rem REQUISITOS
rem ================================================

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] No se encuentra Node.js. Instalalo desde https://nodejs.org
    pause
    exit /b 1
)

where python >nul 2>nul
if errorlevel 1 (
    echo.
    echo [ERROR] No se encuentra Python 3. Instalalo desde https://www.python.org
    pause
    exit /b 1
)

rem ================================================
rem MODO
rem ================================================

echo.
echo Seleccione el modo de ejecucion:
echo.
echo   1. Solo este ordenador
echo   2. Red local (movil, tablet y otros equipos de casa)
echo.

choice /c 12 /n /m "Opcion (1-2): "

set "URL=http://localhost:%FRONTEND_PORT%"
set "VITE_ARGS="

if errorlevel 2 (
    set "VITE_ARGS=--host"
    call :detectar_ip
)

rem ================================================
rem DEPENDENCIAS
rem ================================================

echo.
echo ================================================
echo COMPROBANDO DEPENDENCIAS
echo ================================================

call :dependencias_node backend || goto error
call :dependencias_node frontend || goto error

python -c "import requests, bs4" >nul 2>nul
if errorlevel 1 (
    echo INSTALANDO DEPENDENCIAS PYTHON...
    python -m pip install --disable-pip-version-check -q -r scripts\requirements.txt || goto error
) else (
    echo DEPENDENCIAS PYTHON OK
)

rem ================================================
rem MINIATURAS
rem ================================================

echo.
echo ================================================
echo ACTUALIZANDO MINIATURAS
echo ================================================

python scripts\scraping.py

rem ================================================
rem SERVIDORES
rem ================================================

echo.
echo ================================================
echo INICIANDO SERVIDORES
echo ================================================

start "Miniaturas - Backend" /d "%~dp0backend" cmd /k npm start
start "Miniaturas - Frontend" /d "%~dp0frontend" cmd /k npm run dev -- %VITE_ARGS%

echo ESPERANDO A QUE ARRANQUEN...

set /a INTENTOS=0

:esperar
set /a INTENTOS+=1
curl -s -o nul "http://127.0.0.1:%BACKEND_PORT%/api/categorias" && curl -s -o nul "http://localhost:%FRONTEND_PORT%" && goto abrir
if %INTENTOS% geq 30 goto abrir
timeout /t 1 /nobreak >nul
goto esperar

:abrir
echo.
echo ================================================
echo LISTO: %URL%
echo ================================================

if defined VITE_ARGS (
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
    echo         Desde otros dispositivos usa la IP que muestre la ventana del frontend.
)
exit /b 0

:dependencias_node
if exist "%~1\node_modules" (
    echo DEPENDENCIAS %~1 OK
    exit /b 0
)
echo INSTALANDO DEPENDENCIAS %~1...
pushd "%~1"
call npm install
set "RESULTADO=%errorlevel%"
popd
exit /b %RESULTADO%

:error
echo.
echo [ERROR] No se pudieron instalar las dependencias. Revisa tu conexion a internet.
pause
exit /b 1
