@echo off
echo ========================================
echo   Pushing to GitHub...
echo ========================================
echo.

cd /d "%~dp0"

git add .
if errorlevel 1 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

git commit -m "Update: %date% %time%"
if errorlevel 1 (
    echo WARNING: No changes to commit or commit failed
)

git push origin main
if errorlevel 1 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo Make sure you have:
    echo 1. Configured Git credentials
    echo 2. Internet connection
    echo 3. Access to the repository
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Pushed to GitHub
echo ========================================
echo.
pause
