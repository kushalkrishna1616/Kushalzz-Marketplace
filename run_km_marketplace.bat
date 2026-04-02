@echo off
echo Starting Kushalzz Marketplace Frontend...
echo Kushalzz Marketplace is starting in a new window!

:: Start the Frontend
start "Kushalzz Marketplace Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Your local shop is opening now!
echo Local: http://localhost:5173/
echo.
pause
