@echo off

for /f "tokens=1,* delims==" %%A in (config.env) do (
    set %%A=%%B
)

echo ================================================
echo MINIATURAS
echo ================================================
echo.
echo Seleccione el modo de ejecucion:
echo.
echo   1. Desarrollo local
echo   2. Red local
echo.

set /p opcion=Opcion (1-2):

if "%opcion%"=="1" (
    copy /Y "frontend\.env.localhost" "frontend\.env" >nul
    set URL=http://%HOST_LOCAL%:%FRONTEND_PORT%
)

if "%opcion%"=="2" (
    copy /Y "frontend\.env.network" "frontend\.env" >nul
    set URL=http://%HOST_NETWORK%:%FRONTEND_PORT%
)

if not "%opcion%"=="1" if not "%opcion%"=="2" (
    echo.
    echo Opcion invalida.
    pause
    exit
)

echo.
echo ================================================
echo CONFIGURACION FRONTEND
echo ================================================
type frontend\.env

echo.
echo ================================================
echo COMPROBANDO BACKEND
echo ================================================

cd backend

if not exist node_modules (
    echo INSTALANDO DEPENDENCIAS BACKEND...
    call npm install
) else (
    echo DEPENDENCIAS BACKEND OK
)

cd ..

echo.
echo ================================================
echo ACTUALIZANDO MINIATURAS
echo ================================================

python scripts\scraping.py

echo.
echo ================================================
echo INICIANDO BACKEND NODE
echo ================================================

cd backend
start cmd /k "npm start"
cd ..

echo.
echo ================================================
echo COMPROBANDO FRONTEND
echo ================================================

cd frontend

if not exist node_modules (
    echo INSTALANDO DEPENDENCIAS FRONTEND...
    call npm install
) else (
    echo DEPENDENCIAS FRONTEND OK
)

echo.
echo ================================================
echo INICIANDO FRONTEND REACT
echo ================================================

start cmd /k "npm run dev"

cd ..

echo.
echo ================================================
echo ESPERANDO SERVIDORES
echo ================================================

timeout /t 5 >nul

start %URL%