# Déploiement manuel MADYCLEAR V1.8.2

## Objectif
Remplacer le contenu actuel du dossier `/app/` par ce pack complet.

## À déposer
Tous les fichiers contenus dans ce ZIP :
- index.html
- app.css
- app.js
- v1_8_2_options.js
- manifest.webmanifest
- service-worker.js
- logo.png
- icons/

## Après dépôt
1. Attendre le redéploiement Vercel.
2. Ouvrir `https://madyclear.fr/app/?v=1-8-2-options`.
3. Cliquer sur `Forcer la mise à jour` si l’ancienne version reste affichée.
4. Tester : Accueil, MADY, Clients, DIGI, Projets, Outils, Export sauvegarde.

## Rollback
Si souci : remettre le ZIP précédent `MADYCLEAR_PERSONAL_COCKPIT_V1_8_1_GUARDRAILS_PATCH.zip`.
