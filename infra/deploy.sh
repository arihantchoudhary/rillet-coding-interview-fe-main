#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Step 1: Terraform — ensure Vercel projects exist ==="
cd "$SCRIPT_DIR"
terraform init -input=false
terraform apply -auto-approve

BACKEND_PROJECT=$(terraform output -raw backend_project_name)
FRONTEND_PROJECT=$(terraform output -raw frontend_project_name)

echo ""
echo "=== Step 2: Deploy backend ($BACKEND_PROJECT) ==="
cd "$ROOT_DIR/rillet-backend"

# Install deps locally for Vercel to bundle
npm install --omit=dev 2>/dev/null || npm install

vercel deploy --prod --yes --name "$BACKEND_PROJECT" 2>&1 | tee /tmp/vercel-backend-deploy.log
BACKEND_URL=$(grep -oE 'https://[a-zA-Z0-9._-]+\.vercel\.app' /tmp/vercel-backend-deploy.log | tail -1)

if [ -z "$BACKEND_URL" ]; then
  echo "ERROR: Could not extract backend URL from deployment"
  exit 1
fi

echo ""
echo "Backend deployed at: $BACKEND_URL"

# Verify backend health
echo "Checking backend health..."
sleep 3
curl -sf "$BACKEND_URL/api/health" && echo " — Backend healthy!" || echo " — Backend health check pending (may take a moment)"

echo ""
echo "=== Step 3: Deploy frontend ($FRONTEND_PROJECT) with VITE_API_BASE ==="
cd "$ROOT_DIR/rillet-react"

# Install deps locally for build
npm install 2>/dev/null || true

# Build with backend URL baked in
VITE_API_BASE="$BACKEND_URL/api" npm run build

# Deploy the built output
vercel deploy --prod --yes --name "$FRONTEND_PROJECT" --prebuilt 2>&1 | tee /tmp/vercel-frontend-deploy.log || \
  vercel deploy --prod --yes --name "$FRONTEND_PROJECT" 2>&1 | tee /tmp/vercel-frontend-deploy.log

FRONTEND_URL=$(grep -oE 'https://[a-zA-Z0-9._-]+\.vercel\.app' /tmp/vercel-frontend-deploy.log | tail -1)

echo ""
echo "============================================"
echo "  Deployment complete!"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo "============================================"
