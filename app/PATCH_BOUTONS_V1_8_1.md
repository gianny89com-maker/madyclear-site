MADYCLEAR Cockpit — V1.8.1 Guardrails PATCH
Date : 13/09/2026

OBJECTIF
Réparer les boutons sans créer de nouvelle version conceptuelle.

BASE
V1.8.1 Guardrails reste la base officielle.

CORRECTION
- Ajout d'une couche de navigation de secours indépendante.
- Les boutons Accueil / MADY / Clients / DIGI / Projets réagissent même si le moteur principal plante.
- Les panneaux data-open disposent aussi d'une ouverture de secours.
- Fermeture des panneaux sécurisée.
- Tous les boutons HTML reçoivent type='button' pour éviter les comportements parasites.
- Cache PWA isolé en 1.8.1-patch.
- Aucune nouvelle fonctionnalité ajoutée.
- Aucune action externe autorisée.

TEST PRIORITAIRE APRÈS DÉPLOIEMENT
1. Ouvrir le lien Vercel.
2. Voir V1.8.1 PATCH.
3. Tester uniquement : Accueil → MADY → Clients → DIGI → Projets.
4. Si ces cinq boutons réagissent, le dossier boutons est clos.
