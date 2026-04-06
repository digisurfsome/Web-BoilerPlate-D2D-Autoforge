@echo off
REM verify-autoforge-connection.bat
REM Checks that AutoForge is properly configured for this boilerplate.
REM Run from the nextjs\ directory: scripts\verify-autoforge-connection.bat

setlocal enabledelayedexpansion

set PASS=0
set FAIL=0
set WARN=0

echo.
echo ==========================================
echo   AutoForge Connection Verification
echo ==========================================
echo.

REM -----------------------------------------------
REM 1. Subscription credentials
REM -----------------------------------------------
echo --- Subscription Auth ---

set "CRED_FILE=%USERPROFILE%\.claude\.credentials.json"
if exist "%CRED_FILE%" (
    echo   [PASS] Subscription credentials found: %CRED_FILE%
    set /a PASS+=1
) else (
    echo   [FAIL] Subscription credentials NOT found: %CRED_FILE%
    echo          Fix: Run 'claude' CLI once and log in with your subscription account.
    set /a FAIL+=1
)

REM -----------------------------------------------
REM 2. API key should NOT be set
REM -----------------------------------------------
echo.
echo --- API Key Check ---

if not defined ANTHROPIC_API_KEY (
    echo   [PASS] ANTHROPIC_API_KEY is not set ^(correct for subscription mode^)
    set /a PASS+=1
) else (
    echo   [FAIL] ANTHROPIC_API_KEY is SET -- this will bypass subscription auth!
    echo          Fix: Run 'set ANTHROPIC_API_KEY=' to clear it, or remove from environment.
    set /a FAIL+=1
)

if not defined ANTHROPIC_AUTH_TOKEN (
    echo   [PASS] ANTHROPIC_AUTH_TOKEN is not set ^(correct for subscription mode^)
    set /a PASS+=1
) else (
    echo   [WARN] ANTHROPIC_AUTH_TOKEN is set -- may interfere with subscription auth
    echo          Consider clearing it: 'set ANTHROPIC_AUTH_TOKEN='
    set /a WARN+=1
)

REM -----------------------------------------------
REM 3. .autoforge/ directory structure
REM -----------------------------------------------
echo.
echo --- AutoForge Directory Structure ---

set "PROJECT_DIR=%~dp0.."

call :check_dir ".autoforge"
call :check_dir ".autoforge\prompts"
call :check_file ".autoforge\prompts\initializer_prompt.md"
call :check_file ".autoforge\prompts\coding_prompt.md"
call :check_file ".autoforge\allowed_commands.yaml"
call :check_file ".autoforge\settings.json"
call :check_file ".autoforge\.gitignore"
call :check_file "CLAUDE.md"

REM -----------------------------------------------
REM 4. Settings.json content check
REM -----------------------------------------------
echo.
echo --- Settings Validation ---

set "SETTINGS_FILE=%PROJECT_DIR%\.autoforge\settings.json"
if exist "%SETTINGS_FILE%" (
    findstr /c:"acceptEdits" "%SETTINGS_FILE%" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   [PASS] settings.json uses acceptEdits permission mode
        set /a PASS+=1
    ) else (
        echo   [FAIL] settings.json does NOT use acceptEdits -- agents will crash on Windows!
        echo          Fix: Set defaultMode to 'acceptEdits' in .autoforge\settings.json
        set /a FAIL+=1
    )

    findstr /c:"bypassPermissions" "%SETTINGS_FILE%" >nul 2>&1
    if !errorlevel! equ 0 (
        echo   [FAIL] settings.json contains bypassPermissions -- THIS WILL CRASH!
        echo          Fix: Replace 'bypassPermissions' with 'acceptEdits' immediately.
        set /a FAIL+=1
    )
)

REM -----------------------------------------------
REM 5. Claude CLI availability
REM -----------------------------------------------
echo.
echo --- Claude CLI ---

where claude >nul 2>&1
if !errorlevel! equ 0 (
    for /f "delims=" %%i in ('where claude 2^>nul') do set "CLAUDE_PATH=%%i"
    echo   [PASS] Claude CLI found: !CLAUDE_PATH!
    set /a PASS+=1
) else (
    echo   [FAIL] Claude CLI not found in PATH
    echo          Fix: Install Claude Code CLI: npm install -g @anthropic-ai/claude-code
    set /a FAIL+=1
)

REM -----------------------------------------------
REM 6. pnpm availability
REM -----------------------------------------------
echo.
echo --- Package Manager ---

where pnpm >nul 2>&1
if !errorlevel! equ 0 (
    for /f "delims=" %%i in ('pnpm --version 2^>nul') do set "PNPM_VER=%%i"
    echo   [PASS] pnpm found ^(version: !PNPM_VER!^)
    set /a PASS+=1
) else (
    echo   [WARN] pnpm not found -- this project requires pnpm
    echo          Fix: npm install -g pnpm
    set /a WARN+=1
)

REM -----------------------------------------------
REM Summary
REM -----------------------------------------------
echo.
echo ==========================================
echo   Results: !PASS! passed, !FAIL! failed, !WARN! warnings
echo ==========================================

if !FAIL! equ 0 (
    echo.
    echo   AutoForge connection ready.
    echo.
    exit /b 0
) else (
    echo.
    echo   Fix the failures above before running AutoForge agents.
    echo.
    exit /b 1
)

REM -----------------------------------------------
REM Helper subroutines
REM -----------------------------------------------

:check_file
set "REL_PATH=%~1"
if exist "%PROJECT_DIR%\%REL_PATH%" (
    echo   [PASS] %REL_PATH% exists
    set /a PASS+=1
) else (
    echo   [FAIL] %REL_PATH% is MISSING
    set /a FAIL+=1
)
goto :eof

:check_dir
set "REL_PATH=%~1"
if exist "%PROJECT_DIR%\%REL_PATH%\" (
    echo   [PASS] %REL_PATH%\ exists
    set /a PASS+=1
) else (
    echo   [FAIL] %REL_PATH%\ is MISSING
    set /a FAIL+=1
)
goto :eof
