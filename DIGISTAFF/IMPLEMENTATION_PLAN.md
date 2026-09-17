# DIGISTAFF — Plan d’implémentation

## Phase 0 — Nettoyage et source unique

État : EN COURS / préparé sur branche `digistaff-core-prep-v1`.

- garder `madyclear.fr/app/` comme cockpit officiel ;
- garder `app/service-worker.js` comme seul service worker ;
- retirer les fichiers runtime orphelins ;
- déprécier l’ancienne Edge Function `madyclear-app` ;
- conserver les données `madyclear_*` ;
- ne pas toucher aux tables non-MADYCLEAR appartenant potentiellement à d’autres projets.

Critère de sortie : une seule application et aucun cache ne réclame un fichier supprimé.

## Phase 1 — Authentification et synchronisation cockpit ↔ Supabase

Objectif : conserver l’expérience locale tout en ajoutant une source centrale sûre.

À construire :

1. authentification privée du cockpit ;
2. module `sync` avec état `LOCAL`, `SYNCING`, `ONLINE`, `DEGRADED` ;
3. mapping local ↔ distant pour clients, leads, tâches, devis, réservations ;
4. migration douce des données locales ;
5. synchronisation manuelle d’abord ;
6. synchronisation automatique seulement après tests.

Aucun secret serveur dans la PWA.

## Phase 2 — DIGISTAFF Core

Objectif : un point d’entrée serveur unique pour les agents et les actions sensibles.

Entrées : événements cockpit, événements CRM, tâches planifiées, webhooks externes.

Responsabilités :

- authentifier la demande ;
- vérifier le workspace ;
- normaliser l’événement ;
- appliquer la politique AUTO/VALIDATION/CRITIQUE ;
- appeler l’agent demandé ;
- écrire les résultats métier ;
- placer les actions externes dans l’outbox ;
- journaliser chaque décision.

Le Core ne remplace pas `madyclear-capture` : il traite ce qui vient après la capture.

## Phase 3 — Employé Client + Commercial

Premier couple d’agents à rendre réellement utile.

Scénario pilote :

`demande site → lead → qualification → données manquantes → estimation/préparation devis → tâche prochaine action → validation Gino → contact client`.

Mesures : délai de traitement, taux de dossiers complets, devis préparés, relances oubliées, conversion.

## Phase 4 — Admin et Agenda

- synchronisation Google Calendar ;
- génération de tâches ;
- préparation de journée ;
- rappels internes ;
- archivage Drive contrôlé.

Toute écriture externe est d’abord testée en mode validation.

## Phase 5 — WhatsApp officiel

Condition : lancement officiel + connecteur autorisé.

- numéro officiel ;
- modèles approuvés ;
- confirmation de réception ;
- relances conformes ;
- arrêt automatique si réponse/refus/réservation ;
- journalisation.

Ne pas activer avant cette condition.

## Phase 6 — Réseaux

Metricool = hub privilégié pour éviter plusieurs intégrations parallèles.

- préparation contenu ;
- calendrier ;
- analyse ;
- attribution des leads ;
- publication toujours soumise à validation au départ.

## Phase 7 — Pilotage

Vue globale dans l’app :

- objectif CA ;
- pipeline ;
- nombre de prospects ;
- devis ;
- RDV ;
- CA encaissé ;
- financement ;
- connexions ;
- activité des agents ;
- alertes ;
- prochaines actions.

## Phase 8 — Produit DIGISTAFF réutilisable

Seulement après validation MADYCLEAR :

- rendre agents paramétrables ;
- séparer configuration métier et moteur ;
- créer onboarding d’un nouveau workspace ;
- modèles sectoriels ;
- abonnement/service installé ;
- éventuelle interface DIGISTAFF dédiée.

## Ordre de priorité technique

1. source unique / nettoyage ;
2. authentification ;
3. sync CRM ;
4. Core ;
5. Client + Commercial ;
6. Calendar/Gmail/Drive ;
7. WhatsApp ;
8. Réseaux ;
9. Pilotage multi-entreprises.

## Règle anti-surenchère

Aucune nouvelle technologie n’est ajoutée si GitHub Pages + PWA + Supabase + connecteurs existants couvrent le besoin. n8n reste optionnel comme orchestrateur externe, pas comme deuxième base de vérité.