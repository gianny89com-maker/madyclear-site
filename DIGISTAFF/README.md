# DIGISTAFF — Dossier maître V1

Mise à jour : 16 septembre 2026

## Décision d’architecture

DIGISTAFF est construit à partir du cockpit MADYCLEAR existant, sans créer une seconde application concurrente.

- Interface de référence : `https://www.madyclear.fr/app/`
- Version cockpit : **V1.9.1 PRICING SYNC**
- Code de référence : `/app/index.html`, `/app/app.css`, `/app/sync.js`, `/app/service-worker.js`
- Clé locale à préserver : `madyclear-personal-v1`
- Base centrale : projet Supabase MADYCLEAR existant
- Workspace pilote : `MADYCLEAR`
- MADYCLEAR = client pilote n°1 de DIGISTAFF
- Les données locales restent utilisables hors ligne
- La synchronisation distante complète le cockpit, elle ne le remplace pas

## État d’avancement

| Phase | État |
|---|---|
| Nettoyage / source unique | **TERMINÉ** |
| Authentification cockpit | **RÉALISÉE** |
| Synchronisation cockpit ↔ Supabase V1 | **RÉALISÉE / TEST PROPRIÉTAIRE À VALIDER** |
| Grille tarifaire commune site/app | **RÉALISÉE** |
| DIGISTAFF Core | **PROCHAINE PHASE** |
| Employé Client + Commercial | **À CONSTRUIRE SUR LE CORE** |
| Gmail / Calendar / Drive | **PASSERELLES DISPONIBLES** |
| WhatsApp automatisé | **PAUSE AVANT LANCEMENT OFFICIEL** |
| Réseaux / Metricool | **PRÉPARÉ** |
| Pilotage global | **À INTÉGRER AU COCKPIT** |

## Rôle de DIGISTAFF

DIGISTAFF devient le système nerveux commun entre :

1. le cockpit personnel ;
2. le CRM Supabase ;
3. les événements et files d’actions ;
4. les employés IA ;
5. les connecteurs externes ;
6. les validations humaines ;
7. le journal d’audit.

## Architecture officielle

`Cockpit MADYCLEAR ↔ DIGISTAFF Core ↔ Supabase ↔ Action Outbox ↔ Connecteurs`

Le Core doit traiter un événement une seule fois, produire une trace d’audit et décider : exécution locale, file d’attente, validation ou blocage.

## Ce qui est conservé

- CRM clients/prospects ;
- devis terrain ;
- planning/interventions ;
- notes et captures ;
- objectifs ;
- projets ;
- Action Engine ;
- file locale ;
- garde-fous AUTO / VALIDATION / CRITIQUE ;
- PWA installable et hors connexion ;
- capture site → CRM active ;
- synchronisation Supabase authentifiée ;
- tables Supabase `madyclear_*` ;
- règles d’automatisation préparées ;
- grille tarifaire centralisée dans `/assets/madyclear-pricing.json`.

## Ce qui a été supprimé comme doublon

- `app/app.js` : copie non chargée du moteur déjà intégré dans `index.html` ;
- `app/v1_8_2_options.js` : module orphelin non chargé ;
- `app/sw.js` : ancien service worker remplacé par `app/service-worker.js` ;
- ancienne application Supabase `madyclear-app` : dépréciée, remplacée par `https://www.madyclear.fr/app/`.

## Ce qui ne doit pas être dupliqué

Ne pas recréer :

- deuxième CRM ;
- deuxième moteur de devis ;
- deuxième base clients ;
- deuxième service worker ;
- deuxième application MADYCLEAR ;
- deuxième grille tarifaire indépendante.

Les nouvelles fonctions DIGISTAFF doivent se brancher sur les composants existants.

## Synchronisation V1

Le cockpit dispose désormais d’une synchronisation Supabase authentifiée :

- connexion propriétaire via Supabase Auth ;
- session locale persistante ;
- Edge Function `madyclear-sync` protégée ;
- module `/app/sync.js` ;
- synchronisation manuelle clients/prospects ;
- récupération des prospects captés par le site ;
- brouillons de devis ;
- mapping local ↔ cloud ;
- rapprochement téléphone/e-mail ;
- snapshots tâches/réservations ;
- audit de synchronisation ;
- fonctionnement hors ligne conservé.

La synchronisation automatique externe reste désactivée par défaut jusqu’à validation réelle sur appareil.

## Employés IA V1

- **Employé Client** : qualification, résumé besoin, préparation réponse, suivi prospect ;
- **Employé Commercial** : scoring, pipeline, prochaine action, préparation relance/devis ;
- **Employé Admin** : tâches, agenda, documents, organisation, contrôle des échéances ;
- **Employé Réseaux** : préparation de contenus, collecte des performances, publication uniquement après validation ;
- **Employé Pilotage** : synthèse activité, objectifs, alertes, recommandations opérationnelles.

Voir `AGENTS.md`.

## Règle d’autonomie

- **AUTO** : lire, calculer, classer, dédupliquer, préparer, journaliser, actions locales réversibles ;
- **VALIDATION** : envoi client, publication, création/modification externe, dépense, action engageante ;
- **CRITIQUE** : suppression sensible, paiement, changement sécurité, action irréversible.

Aucun agent ne contourne ces règles.

## Priorité de réalisation

1. valider la première synchronisation réelle du propriétaire ;
2. construire le point d’entrée `DIGISTAFF Core` ;
3. connecter l’Action Engine à l’outbox ;
4. rendre Employé Client + Commercial réellement utiles ;
5. connecter progressivement Calendar/Gmail/Drive ;
6. intégrer la vue globale Pilotage dans le cockpit ;
7. activer WhatsApp automatisé seulement au lancement officiel ;
8. brancher Réseaux/Metricool avec validation ;
9. transformer les briques éprouvées en produit DIGISTAFF réutilisable.

## Principe produit

DIGISTAFF n’est pas une maquette séparée. Chaque module doit d’abord fonctionner réellement pour MADYCLEAR, être mesuré et corrigé, puis être rendu configurable pour un futur client externe.