set -e

echo "************** Processing logs **************"
LOG_FILE=$1 npx tsx process-cli.ts
echo "*********************************************"

echo "************** Graph server *****************"
npx --yes http-server www
echo "*********************************************"
