# DIGISTAFF — Dossier maître V1

Mise à jour : 17 septembre 2026

## Décision d’architecture

DIGISTAFF est construit à partir du cockpit MADYCLEAR existant, sans créer une seconde application concurrente.

- Interface de référence : `https://www.madyclear.fr/app/`
- Code de référence : `/app/index.html`, `/app/app.css`, `/app/service-worker.js`
- Clé locale à préserver : `madyclear-personal-v1`
- Base centrale : projet Supabase MADYCLEAR existant
- Workspace pilote : `MADYCLEAR`
- MADYCLEAR = client pilote n°1 de DIGISTAFF
- Les données locales restent utilisables hors ligne
- La synchronisation distante vient compléter le cockpit, pas le remplacer

## Rôle de DIGISTAFF

DIGISTAFF devient le système nerveux commun entre :

1. le cockpit personnel ;
2. le CRM Supabase ;
3. les événements et files d’actions ;
4. les employés IA ;
5. les connecteurs externes ;
6. les validations humaines ;
7. le journal d’audit.

## Ce qui est conservé

- CRM clients/prospects
- devis terrain
- planning/interventions
- notes et captures
- objectifs
- projets
- Action Engine
- file locale
- garde-fous AUTO / VALIDATION / CRITIQUE
- PWA installable et hors connexion
- capture site → CRM déjà active
- tables Supabase `madyclear_*`
- règles d’automatisation déjà préparées

## Ce qui est supprimé comme doublon

- `app/app.js` : copie non chargée du moteur déjà intégré dans `index.html`
- `app/v1_8_2_options.js` : module orphelin non chargé
- `app/sw.js` : ancien service worker remplacé par `app/service-worker.js`
- ancienne application Supabase `madyclear-app` : dépréciée, remplacée par `https://www.madyclear.fr/app/`

## Ce qui ne doit pas être dupliqué

Ne pas recréer de deuxième CRM, deuxième moteur de devis, deuxième base clients, deuxième service worker ou deuxième application MADYCLEAR. Les nouvelles fonctions DIGISTAFF doivent se brancher sur les composants existants.

## Employés IA V1

- **Employé Client** : qualification, résumé besoin, préparation réponse, suivi prospect
- **Employé Commercial** : scoring, pipeline, prochaine action, préparation relance/devis
- **Employé Admin** : tâches, agenda, documents, organisation, contrôle des échéances
- **Employé Réseaux** : préparation de contenus, collecte des performances, publication uniquement après validation
- **Employé Pilotage** : synthèse activité, objectifs, alertes, recommandations opérationnelles

Voir `AGENTS.md`.

## Règle d’autonomie

- **AUTO** : lire, calculer, classer, dédupliquer, préparer, journaliser, actions locales réversibles
- **VALIDATION** : envoi client, publication, création/modification externe, dépense, action engageante
- **CRITIQUE** : suppression sensible, paiement, changement sécurité, action irréversible

Aucun agent ne contourne ces règles.

## Architecture cible

`Cockpit MADYCLEAR` ↔ `DIGISTAFF Core` ↔ `Supabase` ↔ `Action Outbox` ↔ `Connecteurs`

Le Core doit traiter un événement une seule fois, produire une trace d’audit et décider : exécution locale, file d’attente, validation ou blocage.

## Priorité de réalisation

1. stabiliser la source unique et retirer les doublons ;
2. brancher le cockpit au CRM Supabase avec authentification ;
3. synchroniser clients, leads, tâches, devis et réservations ;
4. connecter l’Action Engine à l’outbox ;
5. ajouter Employé Client + Commercial ;
6. brancher Calendar/Gmail/Drive ;
7. activer WhatsApp automatisé seulement au lancement officiel ;
8. ajouter Réseaux puis Pilotage ;
9. transformer les briques éprouvées en produit DIGISTAFF réutilisable.

## Principe produit

DIGISTAFF n’est pas une maquette séparée. Chaque module doit d’abord fonctionner réellement pour MADYCLEAR, puis être rendu configurable pour un futur client externe.