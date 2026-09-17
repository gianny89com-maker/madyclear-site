# MADYCLEAR Personal — Cockpit V1.8.4 CLEAN

Application PWA privée publiée dans `madyclear.fr/app/`.

## Rôle officiel

Cette PWA est désormais la base interface officielle de DIGISTAFF pour le pilote MADYCLEAR. Il n’existe plus de seconde application active à maintenir en parallèle.

## État V1.8.4

- Cockpit local-first : les données personnelles restent locales par défaut.
- Clé de stockage historique conservée : `madyclear-personal-v1`.
- Grille textile interne alignée sur la grille officielle publiée sur `madyclear.fr` via le service worker actif.
- Tableau d’état du lancement : site officiel, capture CRM, Google, WhatsApp manuel et automatisations différées.
- Distinction entre le CRM public actif et la synchronisation cockpit encore à brancher.
- Aucune relance, publication ou action externe automatique activée avant le lancement officiel.
- Un seul service worker : `/app/service-worker.js`.
- Fichiers runtime orphelins supprimés : `app.js`, `v1_8_2_options.js`, `sw.js`.

## Fonctionnalités conservées

- Tableau de bord
- Clients + recherche + relances locales
- Interventions / planning local
- Devis terrain
- Tarifs repères officiels textile
- WhatsApp direct
- Options & outils
- Sauvegarde/export local
- Stockage local
- Mode hors-ligne
- Installation PWA
- Action Engine et garde-fous
- DIGISTAFF local : recherche, diagnostic, proposition, actions sûres

## Déploiement

Structure runtime active :

- `/app/index.html`
- `/app/app.css`
- `/app/manifest.webmanifest`
- `/app/service-worker.js`
- `/app/icons/*`

URL publique : `https://madyclear.fr/app/`

## DIGISTAFF

Le dossier `/DIGISTAFF/` contient la nouvelle source de vérité pour l’architecture, les agents, les politiques d’autonomie, le mapping Supabase et le plan d’implémentation.

## Règle de sécurité

Conserver la clé de stockage local existante afin de ne pas effacer les données de l’utilisateur. Toute automatisation externe reste soumise aux garde-fous AUTO / VALIDATION / CRITIQUE.