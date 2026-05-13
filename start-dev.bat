@echo off
REM Double-click this file to start the ZotMate dev server.
REM It will install dependencies the first time, then open http://localhost:5173

cd /d "%~dp0"

if not exist "node_modules\" (
  echo Installing dependencies (first run only)...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed. Check that Node.js is installed: https://nodejs.org
    pause
    exit /b 1
  )
)

echo.
echo Starting Vite dev server...
echo Open http://localhost:5173 in your browser.
echo Press Ctrl+C to stop.
echo.

start "" http://localhost:5173
call npm run dev

pause
