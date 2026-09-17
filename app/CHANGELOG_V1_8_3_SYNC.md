# MADYCLEAR Personal Cockpit V1.8.3 — Synchronisation lancement

Base : V1.8.2 Options.

## Modifications appliquées

- Mise à jour de l’identité de version vers V1.8.3.
- Grille de devis textile alignée sur la grille officielle actuellement publiée sur `madyclear.fr` :
  - Canapé 2 places : 160 €
  - Canapé 3 places : 190 €
  - Canapé angle / panoramique : 240 €
  - Fauteuil : 80 €
  - Matelas 1 place : 120 €
  - Matelas 2 places : 160 €
  - Tapis standard : 100 €
  - Chaise textile : 40 €
  - Minimum d’intervention textile : 80 €
- Retrait du devis rapide des variantes textiles non présentes dans la grille publique officielle afin d’éviter les écarts de prix.
- La carte rapide « canapé 2 places » affiche désormais le tarif public de 160 € et non un reste à charge fiscal.
- Ajout d’un état consolidé du lancement dans l’accueil du cockpit.
- Le cockpit indique séparément :
  - site officiel actif ;
  - formulaire public vers CRM actif ;
  - Google Business Profile et Search Console actifs ;
  - WhatsApp client manuel après capture ;
  - cockpit personnel en mode local ;
  - alertes et relances automatiques en pause avant lancement.
- État Supabase clarifié : CRM public actif, synchronisation du cockpit encore à brancher.
- État Gmail, Calendar, Drive et WhatsApp clarifié pour éviter de présenter comme automatique ce qui ne l’est pas encore.
- Cache PWA changé en `1.8.3-sync` afin de purger les anciennes ressources lors de la mise à jour.

## Non modifié

- Structure visuelle générale du cockpit.
- Clé `localStorage` et données utilisateur existantes.
- CRM local existant.
- Notes, projets, captures, suivi salarié et sauvegardes.
- Garde-fous : actions externes non déclenchées automatiquement.
- Site public MADYCLEAR.

## Règle de lancement

Le site et la capture CRM publique restent actifs. Les échanges WhatsApp restent manuels. Les alertes e-mail, confirmations WhatsApp, relances WhatsApp et Peach Core restent inactifs jusqu’au lancement officiel.
