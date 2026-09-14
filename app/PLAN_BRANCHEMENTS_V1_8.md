# MADYCLEAR Cockpit V1.8 — Plan de branchement

## OPÉRATIONNEL MAINTENANT
- CRM Clients
- Devis MADYCLEAR
- Notes / captures
- Projets
- Suivi salarié
- Sauvegarde JSON
- Action Engine
- Photos locales
- Portail Entreprise / Vie perso
- Journal d'activité
- Validations locales

## À BRANCHER — ORDRE RECOMMANDÉ

### 1. n8n
Rôle : orchestrateur central.
Entrées : cockpit, formulaires, emails, calendrier.
Sorties : CRM, notifications, Drive, Supabase.
Statut : À BRANCHER.

### 2. Supabase
Rôle : base centrale + synchronisation multi-appareils.
Tables prévues : events, decisions, actions, alerts + données métier.
Statut : À BRANCHER.

### 3. Gmail
Rôle : détection mails clients, préparation brouillons, classement.
Statut : À BRANCHER via n8n / connecteur Google.

### 4. Google Calendar
Rôle : rendez-vous et planning.
Statut : À BRANCHER via n8n / Google OAuth.

### 5. Google Drive
Rôle : stockage automatique photos chantier, devis, documents.
Statut : À BRANCHER.

### 6. Météo
Rôle : module Vitres / déplacement / planification.
Statut : À BRANCHER.

### 7. WhatsApp Business
Rôle : automatisations officielles et alertes.
Statut : À BRANCHER via Meta Cloud API.
Le WhatsApp direct local du CRM reste déjà utilisable.

## RÈGLE
Aucun connecteur ne doit casser le cockpit local.
Si un service externe tombe : saisie locale, journal et file d'attente continuent.
