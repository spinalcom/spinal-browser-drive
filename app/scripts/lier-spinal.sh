#!/bin/sh
# Copyright 2026 SpinalCom - www.spinalcom.com
# Lie les paquets Spinal installés pour l'API BOS (192/194 fichiers identiques au Studio livré ; seul
# connectorjs/Models/Val accepte en plus les nombres en entrée, sans effet sur l'écriture du graphe).
set -eu
cd "$(dirname "$0")/.."
NM=$(cd ../../../organ/spinal-organ-api-bos-config/node_modules && pwd)
mkdir -p node_modules
for p in "$NM"/spinal*; do ln -sfn "$p" "node_modules/$(basename "$p")"; done
echo "$(ls -d node_modules/spinal* | wc -l) paquets Spinal liés depuis $NM"
