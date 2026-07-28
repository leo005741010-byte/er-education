@echo off
cd /d "%~dp0"
git add -A
git commit -m "Update ER education site"
git push
echo.
echo Done! Visit https://leo005741010-byte.github.io/er-education/
pause
