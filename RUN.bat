@echo off
REM PosterGen - Quick Start Script

echo.
echo ================================================
echo   PosterGen - Starting Development Server
echo ================================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found!
    echo Please run this script from the PosterGen directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo.
    call npm install
    if errorlevel 1 (
        echo Error: npm install failed!
        pause
        exit /b 1
    )
)

REM Check if Prisma client is generated
if not exist "node_modules\.prisma" (
    echo Generating Prisma client...
    echo.
    call npm run prisma:generate
    if errorlevel 1 (
        echo Error: Prisma generation failed!
        pause
        exit /b 1
    )
)

REM Start the development server
echo.
echo ================================================
echo   Starting Development Server...
echo ================================================
echo.
echo Next.js will start on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
