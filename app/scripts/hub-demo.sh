#!/bin/sh
# Copyright 2026 SpinalCom - www.spinalcom.com
# Hub de démonstration du nouveau Drive : COPIE de la base de dev, ports 17600 (http) et 17601 (binaire).
# Ne touche ni Docker ni nerve-center/memory. Arrêt par SIGINT (KillSignal du service), jamais SIGTERM.
#   hub-demo.sh preparer   copie la base (dump le plus récent de dump.bkp + data.db), une seule fois
#   hub-demo.sh demarrer   lance le hub (service systemd utilisateur, mémoire bridée)
#   hub-demo.sh arreter    arrêt propre (SIGINT)
#   hub-demo.sh etat
set -eu
RACINE=$(cd "$(dirname "$0")/../../../.." && pwd)
DEMO="$RACINE/.tools/refonte-svelte-fixtures/hub-demo"
UNITE=spinal-hub-demo
case "${1:-etat}" in
  preparer)
    if [ -f "$DEMO/memory/dump.db" ]; then echo "déjà préparé : $DEMO"; exit 0; fi
    mkdir -p "$DEMO/memory" "$DEMO/organs"
    DERNIER=$(ls -1 "$RACINE/nerve-center/memory/dump.bkp/"dump_*.db.zst | tail -1)
    echo "copie de $DERNIER"
    zstd -q -d "$DERNIER" -o "$DEMO/memory/dump.db"
    cp -r "$RACINE/nerve-center/memory/data.db" "$DEMO/memory/data.db"
    echo "prêt : $(du -sh "$DEMO/memory" | cut -f1)"
    ;;
  demarrer)
    [ -f "$DEMO/memory/dump.db" ] || { echo "lancer d'abord : $0 preparer"; exit 1; }
    systemctl --user is-active -q $UNITE && { echo "déjà démarré"; exit 0; }
    systemd-run --user --unit=$UNITE -p MemoryMax=6G -p KillSignal=SIGINT -p TimeoutStopSec=60 \
      --working-directory="$DEMO" "$RACINE/nerve-center/spinalhub" \
      -b "$DEMO/organs" -p 17600 -q 17601 -t 4 -d '0 */10 * * * *' -g '0 0 3 * * *'
    i=0; until curl -s -o /dev/null "http://127.0.0.1:17600/get_user_id?u=x&p=x"; do i=$((i+1)); [ $i -gt 120 ] && { echo "hub muet"; exit 1; }; sleep 1; done
    echo "hub de démo prêt sur http://127.0.0.1:17600"
    ;;
  arreter) systemctl --user stop $UNITE && echo "arrêté (SIGINT)";;
  etat) systemctl --user status $UNITE --no-pager | head -5 || true;;
esac
