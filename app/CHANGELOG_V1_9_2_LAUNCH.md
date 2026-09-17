# MADYCLEAR Personal — V1.9.2 LAUNCH

## Objectif

Passer le cockpit du mode préparation au mode **mise en activité terrain V1**, sans casser le fonctionnement local-first ni la synchronisation Supabase.

## Changements

- Version runtime : `1.9.2-launch`.
- Grille textile toujours synchronisée depuis `/assets/madyclear-pricing.json`.
- Le fallback de l’application reprend désormais aussi les règles commerciales validées :
  - forfait entretien à partir de **130 €/mois** ;
  - **2 passages par mois selon la formule** ;
  - **30 € d’arrhes** après validation du devis ;
  - paiement automatique désactivé.
- Ajout du tunnel client dans le cockpit :
  - Nouveau
  - Qualifié
  - Devis envoyé
  - Devis accepté
  - Arrhes 30 € reçues
  - RDV confirmé
  - Réalisé
  - Payé
  - À relancer
- Les anciens statuts restent disponibles afin de ne perdre aucune donnée existante.
- Ajout d’une carte « Mise en activité terrain V1 » sur l’accueil avec l’objectif initial de **10 prestations payées**.
- Ajout d’un rappel forfait + arrhes dans l’écran de devis.
- Stripe reste volontairement en pause ; aucune transaction n’est déclenchée automatiquement.

## Sécurité / compatibilité

- Clé locale `madyclear-personal-v1` inchangée.
- `/app/sync.js` conservé.
- Aucun paiement, message ou publication externe automatique n’est ajouté.
- Les modules historiques ne sont pas supprimés ; le lancement est simplement recentré sur le textile.
