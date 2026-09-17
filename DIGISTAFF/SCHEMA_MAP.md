# DIGISTAFF — Cartographie du socle Supabase

Projet pilote : Supabase MADYCLEAR existant.

## Tables à réutiliser

| Fonction | Table existante | Usage DIGISTAFF |
|---|---|---|
| Espaces entreprise | `madyclear_workspaces` | isolation client / futur multi-tenant |
| Membres | `madyclear_members` | rôles et accès |
| Clients | `madyclear_customers` | vérité client |
| Prospects | `madyclear_leads` | pipeline commercial |
| Historique prospect | `madyclear_lead_events` | mémoire chronologique |
| Tâches | `madyclear_tasks` | prochaines actions |
| Devis | `madyclear_quotes` + `madyclear_quote_items` | propositions commerciales |
| Réservations | `madyclear_bookings` | planning métier |
| Interventions | `madyclear_jobs` | exécution terrain |
| Notifications | `madyclear_notifications` | alertes internes |
| Intégrations | `madyclear_integrations` | état des connecteurs |
| Règles auto | `madyclear_automation_rules` | déclencheurs/actions |
| File d’actions | `madyclear_automation_outbox` | exécution idempotente/reprise |
| Journal | `madyclear_audit_logs` | traçabilité |
| Paramètres | `madyclear_settings` | règles par workspace |
| Services | `madyclear_services` | catalogue métier |
| Médias | `madyclear_media_assets` | références médias métier |
| Consentements | `madyclear_content_consents` | contrôle publication |

## Décision anti-doublon

Aucune nouvelle table `digistaff_clients`, `digistaff_leads`, `digistaff_quotes` ou `digistaff_tasks` ne doit être créée pour MADYCLEAR. DIGISTAFF travaille sur les tables métier existantes.

Les futures tables `digistaff_*` ne seront autorisées que pour des concepts réellement transversaux à plusieurs entreprises, par exemple :

- registre d’agents ;
- exécutions d’agents ;
- validations générales ;
- profils de politiques ;
- modèles réutilisables.

Même dans ce cas, elles doivent référencer `workspace_id` et ne jamais recopier les données métier.

## État sécurité

Les tables métier centrales MADYCLEAR sont déjà sous RLS et disposent de politiques pour les membres authentifiés. Avant connexion directe du cockpit, les expressions `USING` / `WITH CHECK` de ces politiques devront être revues fonction par fonction et testées avec un vrai utilisateur authentifié.

La PWA publique ne doit jamais recevoir de `service_role` ni de clé secrète.

## Flux de données cible

### Capture publique

Site public → `madyclear-capture` → lead/customer/event Supabase → outbox/règles.

### Cockpit privé

PWA authentifiée → API/Edge Function sécurisée → tables `madyclear_*` → réponse synchronisée → cache local.

### Action externe

Agent/Core → `madyclear_automation_outbox` → worker/connecteur → résultat → audit → état métier.

## Données locales

La clé `madyclear-personal-v1` reste le cache et le mode hors-ligne. Lors de la première synchronisation, chaque objet local devra recevoir un identifiant distant et un horodatage de dernière synchronisation plutôt que d’être remplacé brutalement.

## Conflits

Stratégie V1 :

- données serveur métier = référence dès qu’un objet est synchronisé ;
- brouillon local récent = conservé jusqu’à confirmation de synchronisation ;
- aucune suppression locale ne supprime un objet cloud sans validation ;
- journaliser tout conflit avant résolution.