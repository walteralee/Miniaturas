@echo off

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

start http://localhost:5173
