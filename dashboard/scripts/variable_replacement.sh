if [[ -z "${BOT_URL}" ]]; then
  BOT_URL="localhost:3001"
fi

if [[ -z "${CLIENT_ID}" ]]; then
  CLIENT_ID="NO_CLIENT_ID"
fi

sed -i -r "s@__BOT_URL__@$BOT_URL@" /app/index.html
sed -i -r "s@__CLIENT_ID__@$CLIENT_ID@" /app/index.html
