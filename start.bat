@echo off
rem true sns - start the local servers (web app on 5173, test relay on 7777).
rem Each server opens in its own minimized window; close them with stop.bat.

set "ROOT=%~dp0"

netstat -ano | findstr /R /C:":7777 .*LISTENING" >nul
if %errorlevel%==0 (
  echo [relay] already running on port 7777
) else (
  echo [relay] starting on port 7777 ...
  start "true-sns relay" /min cmd /c "cd /d "%ROOT%dev-relay" && node relay.mjs"
)

netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if %errorlevel%==0 (
  echo [web] already running on port 5173
) else (
  echo [web] starting on port 5173 ...
  start "true-sns web" /min cmd /c "cd /d "%ROOT%coracle" && pnpm dev"
)

echo.
echo Waiting for the web server ...
set /a TRIES=0
:wait
set /a TRIES+=1
netstat -ano | findstr /R /C:":5173 .*LISTENING" >nul
if %errorlevel%==0 goto ready
if %TRIES% GEQ 40 goto timeout
rem ping is used as a sleep because "timeout" fails when stdin is redirected
ping -n 2 127.0.0.1 >nul
goto wait

:ready
echo.
echo Ready: http://localhost:5173
echo Log in with "Use a test account (dev only)".
if not defined NO_BROWSER start "" http://localhost:5173
goto end

:timeout
echo.
echo The web server did not come up within 40 seconds.
echo Check the "true-sns web" window for errors.

:end
