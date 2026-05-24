@echo off
REM Create directory structure for PosterGen

echo Creating directory structure...

md src\app\api\auth
md src\app\api\events
md src\app\api\templates
md src\app\api\results
md src\app\api\posters
md src\app\(auth)\login
md src\app\(auth)\signup
md src\app\dashboard
md src\app\events
md src\app\templates
md src\app\editor
md src\app\admin

md src\components\layout
md src\components\forms
md src\components\editor
md src\components\dashboard
md src\components\common

md src\lib
md src\styles

md prisma
md public\images
md public\fonts

echo.
echo Directory structure created successfully!
echo.
echo Next steps:
echo 1. Run: npm install
echo 2. Configure .env.local
echo 3. Run: npm run prisma:migrate
echo 4. Run: npm run dev
