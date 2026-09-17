# MADYCLEAR Personal — V1.9.1 PRICING SYNC

## Objectif

Éviter toute divergence entre les tarifs affichés sur `madyclear.fr` et ceux utilisés par le cockpit `madyclear.fr/app/`.

## Source de vérité

La grille officielle est centralisée dans :

`/assets/madyclear-pricing.json`

Le site public charge cette grille avec un HTML de secours identique. Le service worker de l’application charge la même grille et l’injecte dans le moteur de devis, y compris hors ligne grâce au cache.

## Grille textile officielle

- Canapé 2 places : 160 €
- Canapé 3 places : 190 €
- Canapé angle / panoramique : 240 €
- Fauteuil : 80 €
- Matelas 1 place : 120 €
- Matelas 2 places : 160 €
- Tapis standard : 100 €
- Chaise textile : 40 €
- Minimum d’intervention textile : 80 €

## Règles appliquées

- Le minimum d’intervention est un plancher de facture, pas une prestation à additionner.
- Exemple : 1 chaise à 40 € seule déclenche un total minimum de 80 € ; 2 chaises = 80 € ; 3 chaises = 120 €.
- Les packs restent personnalisés et uniquement sur devis.
- Aucune réduction automatique ni pourcentage de remise n’est affiché pour les packs.
- Le prix public reste le prix facturé.
- L’avantage fiscal est présenté une seule fois comme potentiel, sous conditions, jamais comme une remise commerciale automatique.
- La clé localStorage `madyclear-personal-v1` reste inchangée.

## Version

Cockpit : `1.9.1-pricing-sync`.
