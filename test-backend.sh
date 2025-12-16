#!/bin/bash
echo "Testing backend connection..."
echo ""

echo "1. Testing basic endpoint:"
curl -s http://127.0.0.1:8000/
echo ""
echo ""

echo "2. Testing with CORS headers:"
curl -s -X GET http://127.0.0.1:8000/api/v1/projects/get \
  -H "Origin: http://localhost:3000" \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json" | head -1
echo ""
echo ""

echo "3. Checking if port 8000 is listening:"
netstat -tuln | grep 8000 || ss -tuln | grep 8000
echo ""

echo "Backend status: OK if you see responses above"

