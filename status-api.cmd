@echo off
setlocal

set SCRIPT_DIR=%~dp0
set PS_SCRIPT=%SCRIPT_DIR%deploy\scripts\status-api.ps1

if not exist "%PS_SCRIPT%" (
  echo [error] script not found: "%PS_SCRIPT%"
  pause
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%PS_SCRIPT%" %*
set EXIT_CODE=%ERRORLEVEL%

if not "%EXIT_CODE%"=="0" (
  echo.
  echo [warn] status-api reported a non-healthy state with exit code %EXIT_CODE%
)

exit /b %EXIT_CODE%
