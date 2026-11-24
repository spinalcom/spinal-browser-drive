<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->
Contrôle du test DR-05 par mutations volontaires du nouveau code (24/11/2026) :
- nom écrit en majuscules → 3 tests en échec (détecté)
- dossier supplémentaire créé → 2 tests en échec (détecté)
- option `icon: 'dossier'` → aucun échec, **normal** : `Directory.get_file_info` réécrit `icon = 'folder'`, le graphe
  produit est identique (vérifié par instantané).

Contrôle du test ST-GEO-01 (24/11/2026), 5 régressions volontaires dans `domaines/geographie/hierarchie.ts`, toutes
détectées : pièce oubliée, pièces rattachées au bâtiment au lieu de l'étage, nom d'étage modifié, ordre des pièces
inversé, attribut couleur ajouté. Un test de reproductibilité (deux exécutions de l'ancien code) garantit que
l'instantané ne dépend ni des identifiants générés ni des dates.
