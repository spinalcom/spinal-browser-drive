<!-- Copyright 2026 SpinalCom - www.spinalcom.com -->

# 07 — Lots, recette et bascule

## 1. Avant le code

| Étape | Livrable | Critère de fin |
|---|---|---|
| A | Validation de ces specs et des décisions D3, D4, D5, D8, O-1 à O-8 | Réponses de l'utilisateur consignées dans le README |
| B | **Design system** : jetons, polices, tous les composants de [05](05-design-system.md) §3.1 à §3.5, page `/studio/_ds` | Chaque composant montre ses états en thème clair et sombre ; contrastes AA vérifiés par script ; `svelte-check` sans erreur |
| C | **Maquettes** (HTML statique construit avec les composants du design system) : connexion ; Drive (dossier, détails Versions, vue double, assistant Nouveau jumeau) ; Studio (disposition, navigateur, fiche avec 3 onglets, palette de commandes) ; un atelier dense (Données ou Analyses) ; confirmation de portée ; plateau des tâches | Validation de l'utilisateur, avec une liste de corrections close |

## 2. Lots de développement

Chaque lot a une **cible mesurable**, un **critère d'arrêt** et une **recette** (capacités de [06](06-tracabilite.md) + parcours Playwright). Un lot n'est terminé que si sa recette passe **et** que les parcours des lots précédents passent toujours. Commit et push sur `refonte-svelte` à chaque lot, jamais de fusion sur `dev` ou `master`.

| Lot | Contenu | Capacités | Cible mesurable | Critère d'arrêt |
|---|---|---|---|---|
| **0 — Socle** | SvelteKit, design system intégré, session hub, `charger`, adaptateur `suivre`, registre d'actions, plateau des tâches, barre supérieure, palette de commandes, `ViewerHost`, proxy de dev, repli SPA dans `web` et `patch.cjs` (proposés) | DR-01 | JS initial ≤ 150 Ko gz ; connexion → Drive vide affiché ≤ 1 s ; zéro abonnement restant après déconnexion (compteur de `bind` actifs = 0) | Mesures relevées et comparées à l'existant (Drive et Studio actuels) ; si un budget est dépassé de plus de 20 %, on corrige avant le lot 1 |
| **1 — Drive et Admin** | Explorateur, détails, versions, partage, journal, vue double, Admin, mot de passe | DR-02 à 13, DR-VER, ADM | Dossier de 2 000 fichiers ≤ 300 ms ; dépôt de 10 fichiers suivi sans blocage de l'interface | Recettes DR et ADM passées sur un jeu dédié (copie de base) |
| **2 — Jumeau et Studio** | Assistant Nouveau jumeau, onglet Maquettes, shell Studio, navigateur, fiche (Résumé, Attributs, Documents, Notes, Relations de base), sélection 3D, menu du viewer | DR-DT, ST-SOC, ST-GRA (hors 07), ST-BIM-05/06/08/09, ST-ATT-01, ST-DOC | Jumeau ouvert → navigateur interactif ≤ 1,5 s ; sélection 3D → fiche ≤ 150 ms ; 100 000 nœuds dépliés à 60 i/s | Recettes passées ; aucun écart de données avec le Studio historique sur 20 objets témoins (attributs, documents, notes relus dans les deux interfaces) |
| **3 — Géographie et maquettes** | Ateliers Géographie et Maquettes et scènes, outils de recalcul | ST-GEO, ST-BIM-01 à 04, 10, ST-VIS-01, ST-ATT-05 | Diff d'architecture de 5 000 pièces sans tâche > 50 ms sur le fil principal | Génération et projection rejouées sur un jumeau de test : graphe identique à celui produit par le Studio historique (comparaison de structure scriptée) |
| **4 — Données et classements** | Tableau d'attributs, profils de colonnes, Excel, classements, recherche avancée, liens | ST-ATT-02 à 04, ST-GRP, ST-BIM-07, ST-LINK | Tableau de 20 000 lignes fluide ; aller-retour Excel exact (Unicode, 0, vide) | Fichier exporté puis réimporté sans aucune différence ; compatibilité des colonnes avec l'export historique vérifiée octet par octet sur les en-têtes |
| **5 — Exploitation** | Tickets, Mission, planning, événements de la fiche | ST-TIC, ST-MIS, ST-EVT | Calendrier de 2 000 événements fluide | Recettes passées, dont les 4 portées d'annulation et la correction de la suppression en lot |
| **6 — Mesures et points** | Onglet Mesures, dock Courbes, points de contrôle, heatmap, simulation, dashboards | ST-MES, ST-CP, ST-SIM, ST-DASH | Courbe de 500 000 points ≤ 200 ms ; heatmap de 1 000 pièces sans gel | Valeurs `0`, `false` et absentes correctement distinguées ; propagation d'un profil relue sur toutes les instances |
| **7a — Réseaux (arborescence et profils)** | Arborescence technique, profils virtuels, rapprochement BIM/BMS, bibliothèque de profils, supervision | ST-IOT, ST-PROF, ST-OPC-03/04, ST-SNMP-03/04, ST-VIS-02 | Aperçu de génération de 5 000 objets ≤ 2 s (Worker) | Configurations existantes relues et réenregistrées sans perte (champs inconnus conservés) |
| **7b — Réseaux (connecteurs)** | BACnet, OPC UA, SNMP, surveillance, organisation manuelle | ST-BAC, ST-OPC-01/02/05, ST-SNMP-01/02/05, ST-ORG | États rapportés par les organs reflétés en moins de 2 s | Recette avec un organ de test, ou à défaut sur des modèles de découverte simulés ; sinon décision explicite de ce qui reste non vérifié |
| **8 — Analyses** | Atelier Analyses complet | ST-ANA | Ouverture d'une analyse multi-algorithmes ≤ 300 ms | Les 41 opérations testées par identifiant ; toutes les analyses existantes de la base de test rouvertes et réenregistrées sans différence |
| **9 — Experts et bascule** | Inspecteur (structure, graphe), redirections des anciens liens, retrait progressif des anciennes interfaces | GI, ST-GRA-07 | — | Matrice 06 complète (183/183 avec destination et recette réussie, ou décision) ; validation de la bascule par l'utilisateur |

Ordre : 0 → 1 → 2, puis 3 à 8 dans l'ordre proposé ou selon les priorités de l'utilisateur. Le lot 9 vient en dernier.

## 3. Recette transversale

Reprise de l'inventaire §9.4, à rejouer à partir du lot où les capacités concernées existent :

| Scénario | À partir du lot |
|---|---|
| Du fichier au jumeau exploitable | 3 |
| Révision BIM avec données métier | 3 |
| Réutilisation d'un document | 2 |
| Réseau raccordé au BIM | 7b |
| Points de contrôle et calcul | 8 |
| Incident sur équipement | 5 |
| Édition tabulaire aller-retour | 4 |
| Opérations par lot | 1, puis à chaque lot |
| Profils et partages | 1 (droits hub) |
| Navigation (lien direct, rechargement, changement de jumeau, précédent / suivant) | 2 |
| Dépendance indisponible (organ arrêté, maquette absente) | 2 |
| Concurrence et grands volumes (deux onglets sur le même objet) | 2 |

Plus, à chaque lot :
- **Fuites** : ouvrir et fermer 20 fois l'écran du lot → mémoire JS stable (± 10 %) et compteur de `bind` actifs revenu à sa valeur de départ.
- **Accessibilité** : parcours du lot au clavier seul ; contrôle automatique (axe-core) sans violation sérieuse.
- **Navigateurs** : Chromium et Firefox récents.

## 4. Conditions de test

- Toujours sur une **copie** de base (`.tools/backups`), jamais sur `nerve-center/memory` sans sauvegarde.
- Navigateurs headless uniquement, rien ne s'ouvre à l'écran.
- Bancs sous `systemd-run --user --scope -p MemoryMax=8G`, une page à la fois, petites maquettes d'abord.
- Hub : jamais deux instances sur la même `memory` ; arrêt par `SIGINT`.

## 5. Bascule (lot 9)

1. La nouvelle application devient l'entrée par défaut du serveur `web` : `/` et `/drive/` redirigent vers `/studio/drive`.
2. `/html/viewer/?path=…` redirige vers `/studio/jumeau/<id>` (chemin décodé, puis identifiant résolu).
3. Les anciennes interfaces restent accessibles sous `/legacy/…` pendant la période définie par O-8, puis sont retirées.
4. Aucune donnée n'est migrée : la nouvelle application lit et écrit les mêmes modèles que l'ancienne.
