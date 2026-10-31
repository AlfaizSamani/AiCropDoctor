@echo off
setlocal
cd /d "%~dp0"
echo =========================================
echo       AI CROP DOCTOR - SETUP
echo =========================================
where py >nul 2>nul
if errorlevel 1 (
  echo Python launcher not found. Install Python 3.10 or 3.11 and enable Add Python to PATH.
  pause
  exit /b 1
)
if not exist .venv (
  py -3.11 -m venv .venv
  if errorlevel 1 py -3.10 -m venv .venv
)
if not exist .venv\Scripts\python.exe (
  echo Could not create the virtual environment. Install Python 3.10 or 3.11 and retry.
  pause
  exit /b 1
)
call .venv\Scripts\activate.bat
python -c "import sys; raise SystemExit(0 if sys.version_info[:2] in ((3,10),(3,11)) else 1)"
if errorlevel 1 (
  echo This project setup supports Python 3.10 or 3.11. Recreate .venv with a supported version.
  pause
  exit /b 1
)
python -m pip install --upgrade pip
if errorlevel 1 goto failed
python -m pip install torch==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cpu
if errorlevel 1 goto failed
python -m pip install -r requirements.txt
if errorlevel 1 goto failed
echo.
echo Setup complete. Starting the app...
echo Open http://127.0.0.1:5000/dashboard on this computer.
echo The first image analysis downloads the model and needs internet access.
python app.py
goto end
:failed
echo.
echo Setup failed. Check the error above and follow MANUAL_SETUP.md.
pause
:end
endlocal
