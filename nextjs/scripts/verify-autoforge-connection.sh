#!/usr/bin/env bash
# verify-autoforge-connection.sh
# Checks that AutoForge is properly configured for this boilerplate.
# Run from the nextjs/ directory: bash scripts/verify-autoforge-connection.sh

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

pass() {
    echo -e "  ${GREEN}[PASS]${NC} $1"
    PASS=$((PASS + 1))
}

fail() {
    echo -e "  ${RED}[FAIL]${NC} $1"
    FAIL=$((FAIL + 1))
}

warn() {
    echo -e "  ${YELLOW}[WARN]${NC} $1"
    WARN=$((WARN + 1))
}

echo ""
echo "=========================================="
echo "  AutoForge Connection Verification"
echo "=========================================="
echo ""

# -----------------------------------------------
# 1. Subscription credentials
# -----------------------------------------------
echo "--- Subscription Auth ---"

CRED_FILE="$HOME/.claude/.credentials.json"
if [ -f "$CRED_FILE" ]; then
    pass "Subscription credentials found: $CRED_FILE"
else
    fail "Subscription credentials NOT found: $CRED_FILE"
    echo "       Fix: Run 'claude' CLI once and log in with your subscription account."
fi

# -----------------------------------------------
# 2. API key should NOT be set (subscription mode)
# -----------------------------------------------
echo ""
echo "--- API Key Check ---"

if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    pass "ANTHROPIC_API_KEY is not set (correct for subscription mode)"
else
    fail "ANTHROPIC_API_KEY is SET -- this will bypass subscription auth!"
    echo "       Fix: Run 'unset ANTHROPIC_API_KEY' or remove it from your shell profile."
fi

if [ -z "${ANTHROPIC_AUTH_TOKEN:-}" ]; then
    pass "ANTHROPIC_AUTH_TOKEN is not set (correct for subscription mode)"
else
    warn "ANTHROPIC_AUTH_TOKEN is set -- may interfere with subscription auth"
    echo "       Consider: 'unset ANTHROPIC_AUTH_TOKEN'"
fi

# -----------------------------------------------
# 3. .autoforge/ directory structure
# -----------------------------------------------
echo ""
echo "--- AutoForge Directory Structure ---"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

check_file() {
    local rel_path="$1"
    local full_path="$PROJECT_DIR/$rel_path"
    if [ -f "$full_path" ]; then
        pass "$rel_path exists"
    else
        fail "$rel_path is MISSING"
    fi
}

check_dir() {
    local rel_path="$1"
    local full_path="$PROJECT_DIR/$rel_path"
    if [ -d "$full_path" ]; then
        pass "$rel_path/ exists"
    else
        fail "$rel_path/ is MISSING"
    fi
}

check_dir ".autoforge"
check_dir ".autoforge/prompts"
check_file ".autoforge/prompts/initializer_prompt.md"
check_file ".autoforge/prompts/coding_prompt.md"
check_file ".autoforge/allowed_commands.yaml"
check_file ".autoforge/settings.json"
check_file ".autoforge/.gitignore"
check_file "CLAUDE.md"

# -----------------------------------------------
# 4. Settings.json content check
# -----------------------------------------------
echo ""
echo "--- Settings Validation ---"

SETTINGS_FILE="$PROJECT_DIR/.autoforge/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
    if grep -q '"acceptEdits"' "$SETTINGS_FILE"; then
        pass "settings.json uses acceptEdits permission mode"
    else
        fail "settings.json does NOT use acceptEdits -- agents will crash on Windows!"
        echo "       Fix: Set defaultMode to 'acceptEdits' in .autoforge/settings.json"
    fi

    if grep -q '"bypassPermissions"' "$SETTINGS_FILE"; then
        fail "settings.json contains bypassPermissions -- THIS WILL CRASH!"
        echo "       Fix: Replace 'bypassPermissions' with 'acceptEdits' immediately."
    fi
fi

# -----------------------------------------------
# 5. Claude CLI availability
# -----------------------------------------------
echo ""
echo "--- Claude CLI ---"

if command -v claude &>/dev/null; then
    CLAUDE_PATH=$(command -v claude)
    pass "Claude CLI found: $CLAUDE_PATH"
else
    fail "Claude CLI not found in PATH"
    echo "       Fix: Install Claude Code CLI: npm install -g @anthropic-ai/claude-code"
fi

# -----------------------------------------------
# 6. pnpm availability
# -----------------------------------------------
echo ""
echo "--- Package Manager ---"

if command -v pnpm &>/dev/null; then
    PNPM_VERSION=$(pnpm --version 2>/dev/null || echo "unknown")
    pass "pnpm found (version: $PNPM_VERSION)"
else
    warn "pnpm not found -- this project requires pnpm"
    echo "       Fix: npm install -g pnpm"
fi

# -----------------------------------------------
# Summary
# -----------------------------------------------
echo ""
echo "=========================================="
echo "  Results: ${GREEN}${PASS} passed${NC}, ${RED}${FAIL} failed${NC}, ${YELLOW}${WARN} warnings${NC}"
echo "=========================================="

if [ "$FAIL" -eq 0 ]; then
    echo ""
    echo -e "  ${GREEN}AutoForge connection ready.${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "  ${RED}Fix the failures above before running AutoForge agents.${NC}"
    echo ""
    exit 1
fi
