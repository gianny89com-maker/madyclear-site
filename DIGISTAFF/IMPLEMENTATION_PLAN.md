# DIGISTAFF — Plan d’implémentation

## Phase 0 — Nettoyage et source unique

État : **TERMINÉ**.

- `madyclear.fr/app/` est le cockpit officiel ;
- `app/service-worker.js` est le seul service worker ;
- les fichiers runtime orphelins ont été retirés ;
- l’ancienne Edge Function `madyclear-app` est dépréciée ;
- les données `madyclear_*` sont conservées ;
- les tables non-MADYCLEAR ne sont pas modifiées.

Critère de sortie validé : une seule application runtime et aucun cache ne réclame un fichier supprimé.

## Phase 1 — Authentification et synchronisation cockpit ↔ Supabase

État : **V1 RÉALISÉE — activation utilisateur requise pour le premier test authentifié**.

Réalisé :

1. authentification privée du cockpit avec Supabase Auth ;
2. session locale persistante et rafraîchissement de jeton ;
3. Edge Function `madyclear-sync` protégée par JWT et RLS ;
4. module PWA `/app/sync.js` ;
5. synchronisation manuelle clients/prospects et brouillons de devis ;
6. remontée des leads captés par le site vers le cockpit ;
7. mapping local ↔ cloud via `madyclear_external_refs` ;
8. rapprochement secondaire par téléphone/e-mail normalisés ;
9. snapshot cloud des tâches et réservations ;
10. journal d’audit de synchronisation ;
11. conservation du fonctionnement local et hors ligne ;
12. aucune synchronisation automatique activée par défaut.

À valider sur appareil : connexion du compte propriétaire puis première synchronisation réelle. Le mot de passe reste saisi uniquement dans l’application et n’est pas transmis à l’équipe de développement.

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

1. source unique / nettoyage — **fait** ;
2. authentification — **fait** ;
3. sync CRM — **V1 faite** ;
4. test réel propriétaire — **prochaine action** ;
5. Core ;
6. Client + Commercial ;
7. Calendar/Gmail/Drive ;
8. WhatsApp ;
9. Réseaux ;
10. Pilotage multi-entreprises.

## Règle anti-surenchère

Aucune nouvelle technologie n’est ajoutée si GitHub Pages + PWA + Supabase + connecteurs existants couvrent le besoin. n8n reste optionnel comme orchestrateur externe, pas comme deuxième base de vérité.