if [[ -z "${BOT_URL}" ]]; then
  BOT_URL="localhost:3001"
fi

if [[ -z "${DASHBOARD_TOKEN}" ]]; then
  DASHBOARD_TOKEN="TOKEN"
fi

sed -i -r "s@__BOT_URL__@$BOT_URL@" /app/index.html
sed -i -r "s@__DASHBOARD_TOKEN__@$DASHBOARD_TOKEN@" /app/index.html
