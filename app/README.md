# MADYCLEAR Personal — Cockpit V1.8.3

Application PWA privée publiée dans `madyclear.fr/app/`.

## État V1.8.3
- Cockpit local-first : les données personnelles du cockpit restent locales par défaut.
- Grille textile interne alignée sur la grille officielle publiée sur `madyclear.fr`.
- Tableau d’état du lancement : site officiel, capture CRM, Google, WhatsApp manuel et automatisations différées.
- Distinction explicite entre le CRM public déjà actif et la synchronisation du cockpit encore à brancher.
- Aucune relance, publication ou action externe automatique activée avant le lancement officiel.
- Mise à jour PWA versionnée avec purge de l’ancien cache.

## Fonctionnalités
- Tableau de bord
- Clients + recherche + relances locales
- Interventions / planning local
- Devis terrain
- Tarifs repères officiels textile
- WhatsApp direct
- Options & outils
- Import CSV clients/prospects
- Export CRM CSV
- Export/import JSON
- Stockage local
- Mode hors-ligne
- Installation PWA

## Déploiement
Structure principale :
- `/app/index.html`
- `/app/app.css`
- `/app/app.js`
- `/app/manifest.webmanifest`
- `/app/service-worker.js`
- `/app/icons/*`

URL publique : `https://madyclear.fr/app/`

## Règle de sécurité
Conserver la clé de stockage local existante afin de ne pas effacer les données de l’utilisateur. Toute automatisation externe reste soumise aux garde-fous déjà validés.
