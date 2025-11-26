#!/bin/bash
# Bash script to test rate limiting
# Usage: ./test-rate-limit.sh

echo "Testing Rate Limiting..."
echo "Making 11 requests (10 allowed, 11th should fail with 429)"
echo ""

BASE_URL="http://localhost:3000"
SUCCESS_COUNT=0
RATE_LIMITED_COUNT=0

# Test regular endpoint (should be rate limited after 10 requests)
echo "Testing regular endpoint: $BASE_URL/"
for i in {1..11}; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/")
    if [ "$STATUS" -eq 200 ]; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        echo "Request $i : Status $STATUS"
    elif [ "$STATUS" -eq 429 ]; then
        RATE_LIMITED_COUNT=$((RATE_LIMITED_COUNT + 1))
        echo "Request $i : Status 429 (Rate Limited)"
    else
        echo "Request $i : Status $STATUS"
    fi
    sleep 0.1
done

echo ""
echo "Results:"
echo "  Successful: $SUCCESS_COUNT"
echo "  Rate Limited: $RATE_LIMITED_COUNT"
echo ""

# Test health endpoint (should never be rate limited)
echo "Testing health endpoint (should NOT be rate limited): $BASE_URL/health"
HEALTH_SUCCESS_COUNT=0
for i in {1..20}; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/health")
    if [ "$STATUS" -eq 200 ]; then
        HEALTH_SUCCESS_COUNT=$((HEALTH_SUCCESS_COUNT + 1))
        if [ $i -le 5 ] || [ $i -eq 20 ]; then
            echo "Request $i : Status $STATUS"
        fi
    else
        echo "Request $i : Status $STATUS"
    fi
    sleep 0.05
done

echo ""
echo "Health endpoint results:"
echo "  Successful: $HEALTH_SUCCESS_COUNT/20"
echo ""

if [ $RATE_LIMITED_COUNT -gt 0 ]; then
    echo "✓ Rate limiting is working correctly!"
else
    echo "⚠ Rate limiting may not be working (no 429 responses)"
fi




