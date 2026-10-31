@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
where py >nul 2>&1
if not errorlevel 1 (
  set "PYTHON=py -3"
) else (
  set "PYTHON=python"
)
%PYTHON% --version >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Python 3.11 or newer is required.
  echo Install from https://www.python.org/downloads/ then try again.
  pause
  exit /b 1
)
if not exist ".venv\Scripts\python.exe" (
  echo [SETUP] Creating Python environment...
  %PYTHON% -m venv .venv
  if errorlevel 1 goto failed
)
if not exist ".venv\ready.txt" (
  echo [SETUP] Installing Streamlit and OpenAI client...
  ".venv\Scripts\python.exe" -m pip install -r requirements.txt
  if errorlevel 1 goto failed
  echo ready>".venv\ready.txt"
)
echo [START] Open http://localhost:8501 in your browser.
".venv\Scripts\python.exe" -m streamlit run app.py
pause
exit /b 0
:failed
echo [ERROR] Setup failed. Check your internet connection and Python installation.
pause
exit /b 1
