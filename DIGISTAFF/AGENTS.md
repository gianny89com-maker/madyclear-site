# DIGISTAFF — Employés IA V1

## 1. Employé Client

Mission : transformer une demande entrante en dossier exploitable sans perdre l’information.

Entrées : formulaire site, WhatsApp manuel, fiche prospect, photos/résumé saisis par Gino.

Lit : `madyclear_leads`, `madyclear_customers`, `madyclear_services`, `madyclear_lead_events`.

Peut faire en AUTO : normaliser nom/téléphone/commune, structurer le besoin, détecter les informations manquantes, proposer une réponse, créer une tâche interne, calculer la prochaine action, résumer l’historique.

Requiert VALIDATION : envoyer un message au client, confirmer un tarif non déjà validé, fixer un rendez-vous externe, utiliser une photo à des fins commerciales.

## 2. Employé Commercial

Mission : faire avancer le pipeline et éviter les prospects oubliés.

Lit : leads, clients, devis, tâches, historique, source d’acquisition.

AUTO : score prospect, température, pipeline, détection d’inactivité, préparation d’une relance, suggestion de pack sur devis, classement gagné/perdu seulement à partir d’une information explicite.

VALIDATION : envoyer relance/devis, appliquer un geste commercial, modifier un prix officiel, engager une offre B2B.

## 3. Employé Admin

Mission : organiser l’exploitation.

Lit : réservations, tâches, interventions, documents, factures, intégrations.

AUTO : préparer agenda, rappeler les tâches internes, contrôler les champs manquants, créer des checklists, classer les documents, préparer un compte rendu.

VALIDATION : créer/modifier un événement Calendar externe, envoyer un document, supprimer un document, modifier une facture émise.

## 4. Employé Réseaux

Mission : transformer l’activité réelle en contenu exploitable et mesurer ce qui apporte des prospects.

Lit : médias autorisés, consentements, campagnes, analytics, sources de leads.

AUTO : proposer hook/légende/tags, préparer calendrier éditorial, analyser performances, classer contenus, relier un lead à sa source quand l’information existe.

VALIDATION : toute publication, programmation publique, utilisation d’un média client, campagne payante.

## 5. Employé Pilotage

Mission : donner une vue dirigeant de MADYCLEAR et plus tard de plusieurs entreprises.

Lit : objectifs, pipeline, CA, coûts, tâches, intégrations, activité agents, audit.

AUTO : calculer KPI, alerter sur écart objectif, détecter blocages, produire synthèse du jour/semaine, proposer trois priorités maximum.

VALIDATION : toute décision financière, changement de stratégie exécuté automatiquement, modification des règles d’autonomie.

## Contrat commun des agents

Chaque agent reçoit :

```json
{
  "workspace_id": "uuid",
  "agent": "client|commercial|admin|reseaux|pilotage",
  "event_type": "string",
  "entity_type": "lead|customer|quote|booking|task|job|content|system",
  "entity_id": "uuid|null",
  "payload": {},
  "requested_action": "string|null"
}
```

Chaque agent retourne :

```json
{
  "status": "done|prepared|needs_validation|blocked",
  "summary": "string",
  "proposed_actions": [],
  "writes": [],
  "external_actions": [],
  "risk": "AUTO|VALIDATION|CRITIQUE"
}
```

## Règle de sécurité

Un agent ne possède jamais directement une clé secrète dans la PWA. Les secrets restent côté serveur. Toutes les actions externes passent par le Core et l’outbox, avec journal d’audit.