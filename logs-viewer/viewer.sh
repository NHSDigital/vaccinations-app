set -e

echo "*********************************************"
LOG_FILE=$1 node --loader ts-node/esm process.ts
echo "*********************************************"
npx --yes http-server www
