@echo off
rem true sns - stop the local servers started by start.bat (ports 5173 and 7777).

call :stop 5173 web
call :stop 7777 relay

echo.
echo Done.
goto :eof

:stop
set "FOUND="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":%1 .*LISTENING"') do (
  set "FOUND=1"
  taskkill /F /PID %%p >nul 2>&1
)
if defined FOUND (echo [%2] stopped - port %1) else (echo [%2] was not running - port %1)
exit /b
