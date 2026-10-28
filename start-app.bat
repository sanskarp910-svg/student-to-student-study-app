@echo off
title Student to Student Study App
echo Starting Student to Student Study App...
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"
start http://127.0.0.1:3000/
call npx vite --host 127.0.0.1 --port 3000
pause
