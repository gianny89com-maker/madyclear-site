# DOSSIER MAÎTRE MADYCLEAR

Mise à jour : 16 septembre 2026

## Source de vérité

- Site officiel : https://www.madyclear.fr/
- Application privée : https://www.madyclear.fr/app/
- Dépôt de production : `gianny89com-maker/madyclear-site`
- Branche publique : `main`
- Base centrale : Supabase MADYCLEAR
- Workspace pilote DIGISTAFF : `MADYCLEAR`
- Domaine commercial unique : `madyclear.fr`

Le domaine temporaire ChatGPT Site, les anciennes archives et les anciennes versions ne doivent pas être utilisés comme source de production.

## État global

| Bloc | État |
|---|---|
| Site public | **ACTIF** |
| Domaine madyclear.fr | **ACTIF** |
| Google Business Profile | **ACTIF** |
| Google Search Console | **ACTIF** |
| Formulaire site → CRM Supabase | **ACTIF** |
| Ouverture WhatsApp après capture | **ACTIVE** |
| Cockpit MADYCLEAR | **ACTIF — V1.9.1 PRICING SYNC** |
| Synchronisation cockpit ↔ Supabase | **PRÉPARÉE / MANUELLE** |
| DIGISTAFF | **EN CONSTRUCTION SUR LA BASE MADYCLEAR** |
| Gmail / Calendar / Drive / Metricool | **DISPONIBLES VIA PASSERELLE** |
| Alertes e-mail automatiques | **PRÉPARÉES — INACTIVES** |
| WhatsApp automatisé / relances client | **À BRANCHER AU LANCEMENT OFFICIEL** |

## Identité validée

- Nom commercial : MADYCLEAR
- Activité prioritaire : nettoyage professionnel de textiles
- Méthode principale : injection-extraction et détachage après diagnostic
- Publics : particuliers et professionnels
- Zone commerciale : Martinique entière
- Téléphone et WhatsApp : 06 96 01 70 07
- Email : contact@madyclear.fr
- Adresse personnelle : non affichée au public

## Positionnement de lancement

MADYCLEAR démarre en priorité par le **nettoyage textile mobile**, afin de lancer une activité légère, rentable et compatible avec le maintien du CDI.

Prestations actives :

- canapés ;
- matelas ;
- fauteuils ;
- tapis ;
- chaises textiles ;
- prestations textiles professionnelles ;
- petites opportunités B2B compatibles avec le matériel et les capacités opérationnelles.

Le nettoyage automobile et les vitres restent dans le projet global MADYCLEAR, mais sont conservés comme extensions futures et ne constituent pas l’offre principale de lancement.

## Financement de lancement

Scénario opérationnel actuel :

- financement : **2 000 €** ;
- mensualité : **125 €** ;
- durée : **18 mois** ;
- enveloppe prudente de remboursement retenue pour le pilotage : **2 400 € maximum** ;
- remboursement possible grâce au salaire, avec les prestations MADYCLEAR comme accélérateur et marge de sécurité.

L’ancien scénario global à 7 000 € est conservé comme référence historique d’extension du projet, mais ne constitue plus le besoin de lancement prioritaire.

## Tarification officielle

La source tarifaire technique commune est :

`/assets/madyclear-pricing.json`

Le site public et le cockpit utilisent la même grille afin d’éviter toute divergence.

| Prestation | Tarif complet |
|---|---:|
| Canapé 2 places | 160 € |
| Canapé 3 places | 190 € |
| Canapé angle / panoramique | 240 € |
| Fauteuil | 80 € |
| Matelas 1 place | 120 € |
| Matelas 2 places | 160 € |
| Tapis standard | 100 € |
| Chaise textile | 40 € |
| Minimum d’intervention textile | 80 € |

### Règles commerciales validées

1. La grille affiche uniquement les tarifs unitaires complets.
2. Le minimum d’intervention est un plancher de facture, pas une prestation supplémentaire.
3. Le client peut composer librement un pack avec plusieurs textiles.
4. Le pack est personnalisé et uniquement sur devis.
5. Aucun prix de pack, pourcentage ou montant de réduction n’est affiché.
6. Le prix public reste le prix facturé.
7. L’avantage fiscal éventuel est expliqué séparément, uniquement sous conditions d’éligibilité.

Exemple : une prestation facturée 160 € peut, si toutes les conditions du dispositif applicable sont remplies, représenter un coût final inférieur pour le client. Cela ne constitue jamais une remise commerciale automatique.

## Horaires

- Demandes et devis du lundi au samedi : 7 h–22 h
- Demandes et devis le dimanche : 7 h–12 h
- Interventions : uniquement sur rendez-vous, selon les disponibilités

## Parcours client actuel

1. Le visiteur remplit le formulaire sur `madyclear.fr`.
2. La demande est enregistrée dans le CRM Supabase via `madyclear-capture`.
3. Le site ouvre ensuite WhatsApp avec un message prérempli pour faciliter l’envoi de photos et la discussion.
4. Le prospect est qualifié et suivi dans le CRM/cockpit.
5. Le tarif et le créneau sont confirmés avant intervention.
6. L’intervention est réalisée selon le textile et son état.
7. Après satisfaction, un avis Google authentique peut être demandé.

## Cockpit MADYCLEAR

Version de référence : **MADYCLEAR Personal Cockpit V1.9.1 PRICING SYNC**.

Architecture :

- interface PWA : `/app/` ;
- stockage local historique : `madyclear-personal-v1` — à préserver ;
- synchronisation : `/app/sync.js` → Edge Function `madyclear-sync` ;
- base centrale : Supabase ;
- un seul service worker : `/app/service-worker.js` ;
- tarifs communs site/app : `/assets/madyclear-pricing.json`.

Fonctions principales :

- CRM clients/prospects ;
- recherche et suivi ;
- devis ;
- interventions/planning ;
- tâches et prochaine action ;
- objectifs ;
- notes/captures ;
- import/export ;
- PWA hors ligne ;
- synchronisation manuelle Supabase authentifiée ;
- base officielle du pilote DIGISTAFF.

La clé locale `madyclear-personal-v1` ne doit pas être renommée.

## DIGISTAFF × MADYCLEAR

Décision d’architecture : **MADYCLEAR est le client pilote n°1 et le laboratoire réel de DIGISTAFF**.

Architecture cible :

`Cockpit MADYCLEAR ↔ DIGISTAFF Core ↔ Supabase ↔ Action Outbox ↔ Connecteurs`

DIGISTAFF ne doit pas créer un deuxième CRM, une deuxième base clients, une deuxième application MADYCLEAR ou un deuxième moteur de devis.

Employés IA prévus :

- Employé Client ;
- Employé Commercial ;
- Employé Admin ;
- Employé Réseaux ;
- Employé Pilotage.

Règle d’autonomie :

- **AUTO** : lecture, calcul, classement, déduplication, préparation, journalisation et actions locales réversibles ;
- **VALIDATION** : messages clients, publication, action externe, remise, modification engageante ;
- **CRITIQUE** : paiement, suppression sensible, sécurité, permissions, action irréversible.

## Connexions et automatisations

### Actif

- GitHub Pages / site officiel ;
- capture site → CRM Supabase ;
- téléphone ;
- email direct ;
- ouverture WhatsApp ;
- Google Business Profile ;
- Google Search Console.

### Disponible / préparé

- Gmail ;
- Google Calendar ;
- Google Drive ;
- Metricool ;
- alertes e-mail propriétaire ;
- confirmation WhatsApp ;
- relance WhatsApp ;
- règles d’automatisation CRM.

### À ne pas activer avant le lancement officiel

- envoi WhatsApp automatisé ;
- relances client automatisées ;
- publication sociale sans validation ;
- toute dépense ou action irréversible déclenchée par un agent.

Le connecteur WhatsApp actuel n’est pas considéré comme suffisant pour l’automatisation complète. Le branchement officiel doit passer par Peach Core ou l’API Meta Cloud validée.

## Confidentialité et discrétion

- Les demandes du formulaire sont désormais enregistrées dans le CRM afin de permettre le suivi commercial.
- Les données sont utilisées pour les devis, diagnostics, rendez-vous, prestations et suivi client.
- Les photographies ne doivent pas être publiées sans consentement explicite.
- Le domicile, les habitudes et les informations vues ou entendues pendant une intervention restent confidentiels.
- La politique publique est disponible sur `/politique-confidentialite.html`.
- Les informations d’immatriculation et mentions légales complètes seront finalisées avec les informations administratives définitives.

## Règles de communication

- Ne pas promettre la disparition de toutes les taches.
- Préciser que le résultat dépend de la fibre, de l’état et de l’ancienneté des marques.
- Employer « traitement des odeurs » et « nettoyage en profondeur ».
- N’utiliser « désinfection », « anti-acariens » ou « élimination des allergènes » que si le produit et le protocole permettent de le prouver.
- Identifier comme illustrations les images qui ne proviennent pas d’une intervention réelle.
- Ne jamais publier l’adresse personnelle.
- Respecter strictement l’intimité et la confidentialité du domicile.

## Priorités opérationnelles

1. Tester la première synchronisation réelle du cockpit avec le compte propriétaire Supabase.
2. Fiabiliser le suivi prospects et supprimer les anciennes fausses relances sans supprimer les contacts.
3. Améliorer l’import contacts : prévisualisation, sélection, mapping, déduplication et rapport de fusion.
4. Ajouter dans le cockpit une vue globale : financement, CA, prospects, devis, RDV, connexions et avancement projet.
5. Brancher DIGISTAFF Core, puis Employé Client + Employé Commercial.
6. Connecter progressivement Gmail, Calendar et Drive avec validation humaine.
7. Activer WhatsApp automatisé uniquement au lancement officiel.
8. Mesurer les premières conversions, les premiers avis Google et le coût d’acquisition réel.

## Règle de maintenance

Toute évolution doit modifier cette base unique au lieu de créer un nouveau site, un nouveau cockpit ou un nouveau dossier concurrent. Les anciennes versions servent uniquement d’historique.