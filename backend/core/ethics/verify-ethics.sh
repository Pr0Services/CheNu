#!/bin/bash
# ============================================
# CHE·NU — ETHICAL FOUNDATION VERIFICATION
# ============================================
# This script verifies the integrity of the
# frozen ethical foundation.
# ============================================

EXPECTED_HASH="1122494114f55449991abca77eccf0324b89d6df79b3183e13459730bb97be7d"
FOUNDATION_FILE="ethics/ETHICAL_FOUNDATION_v1.md"

echo "🔒 CHE·NU Ethical Foundation Verification"
echo "=========================================="
echo ""

if [ ! -f "$FOUNDATION_FILE" ]; then
    echo "❌ ERROR: Foundation file not found: $FOUNDATION_FILE"
    exit 1
fi

ACTUAL_HASH=$(sha256sum "$FOUNDATION_FILE" | cut -d' ' -f1)

echo "Expected: $EXPECTED_HASH"
echo "Actual:   $ACTUAL_HASH"
echo ""

if [ "$EXPECTED_HASH" = "$ACTUAL_HASH" ]; then
    echo "✅ VERIFIED: Ethical foundation is intact."
    exit 0
else
    echo "❌ FAILED: Ethical foundation has been modified!"
    echo ""
    echo "The ethical foundation is immutable."
    echo "Any modification invalidates the system's ethical guarantees."
    exit 1
fi
