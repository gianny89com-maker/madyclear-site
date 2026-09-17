# MADYCLEAR — PRODUCTION OFFICIELLE

**Source unique de production : branche `main` de ce dépôt.**

Version métier de référence : **Dossier maître MADYCLEAR — 17/09/2026**.

## Production officielle

- Site : `https://www.madyclear.fr/`
- Cockpit privé : `https://www.madyclear.fr/app/`
- Parcours réservation : `https://www.madyclear.fr/reservation/`
- Domaine unique : `madyclear.fr`
- Base centrale : Supabase MADYCLEAR
- Cockpit : **V1.9.2 LAUNCH**
- MADYCLEAR = client pilote n°1 de DIGISTAFF

## Règle de production

- `main` = site public officiel MADYCLEAR.
- Ne pas remettre en production une ancienne archive, un ancien ZIP ou une ancienne grille tarifaire.
- Toute évolution doit modifier cette base au lieu de créer un nouveau site parallèle.
- Ne pas créer un deuxième CRM ou une deuxième application MADYCLEAR.
- Conserver `/app/`, les fichiers SEO, les validations Google et le domaine actuel.
- Ne pas remplacer le design validé sans décision explicite.
- Préserver la clé locale `madyclear-personal-v1`.

## Activité actuellement mise en avant

Priorité : **nettoyage textile à domicile et sur site professionnel en Martinique**.

Méthode principale : **injection-extraction**, après diagnostic du textile.

Prestations actives : canapés, matelas, fauteuils, tapis, chaises textiles et demandes textiles professionnelles.

Le nettoyage automobile et les vitres restent des extensions futures du projet MADYCLEAR et ne doivent pas être présentés comme l’offre principale actuelle.

## Financement de lancement

- Besoin opérationnel : **2 000 €**
- Mensualité : **125 €**
- Durée : **18 mois**
- Enveloppe prudente retenue pour le pilotage : **2 400 € maximum**

L’ancien scénario global à 7 000 € est conservé comme historique d’extension, pas comme besoin prioritaire de lancement.

## Tarification officielle

La grille commune site/app est centralisée dans :

`/assets/madyclear-pricing.json`

- Canapé 2 places : **160 €**
- Canapé 3 places : **190 €**
- Canapé angle / panoramique : **240 €**
- Fauteuil : **80 €**
- Matelas 1 place : **120 €**
- Matelas 2 places : **160 €**
- Tapis standard : **100 €**
- Chaise textile : **40 €**
- Minimum intervention textile : **80 €**

Le minimum est un plancher de facture. Les packs restent personnalisés et uniquement sur devis. Aucun pourcentage de réduction ni prix fixe de pack ne doit être publié.

L’avantage fiscal éventuel ne doit être présenté que comme **potentiel et sous conditions d’éligibilité**.

## Règles commerciales validées — 17/09/2026

### Forfaits entretien

- Prix public : **à partir de 130 €/mois**.
- Base actuelle : **2 passages par mois selon la formule**.
- Les calculs internes de marge et de coût par passage restent confidentiels et ne doivent pas être affichés publiquement.
- Présentation publique séparée de la grille ponctuelle : **« Vos forfaits, sans stress »**.
- Forfait soumis à conditions, rendez-vous, disponibilités et éventuels compléments pour prestations particulières.

### Paiement fractionné

- Paiement fractionné possible jusqu’à **3 fois maximum**.
- Le seuil public n’est pas affiché tant qu’il n’est pas définitivement fixé.
- Toute proposition de 3× reste soumise à validation MADYCLEAR selon le montant.

### Réservation garantie

- Après validation du devis, un versement de **30 € d’arrhes** confirme le créneau.
- Les 30 € sont déduits de la facture finale.
- Les modalités de report et d’annulation sont communiquées avant paiement.
- Les passages d’un forfait actif ne nécessitent pas 30 € d’arrhes à chaque rendez-vous.
- Le parcours `/reservation/` est préparé pour une future automatisation du paiement.
- Le montant de 30 € est centralisé dans `/assets/madyclear-pricing.json` afin d’éviter les divergences.
- **Stripe est mis de côté pour le moment : aucun encaissement automatique n’est actif.**
- Les arrhes sont donc encaissées manuellement jusqu’à décision contraire.

## Mise en activité terrain V1

Objectif de démarrage : **10 prestations réelles payées** avant accélération.

Pipeline opérationnel de référence :

`Nouveau → Qualifié → Devis envoyé → Devis accepté → Arrhes reçues → RDV confirmé → Réalisé → Payé → À relancer`

Le cockpit V1.9.2 expose ces statuts et rappelle les règles forfait / arrhes directement dans l’application.

## Horaires validés

- Demandes et devis du lundi au samedi : **7 h–22 h**
- Demandes et devis le dimanche : **7 h–12 h**
- Interventions : **uniquement sur rendez-vous**, selon les disponibilités

## Coordonnées publiques

- Email : `contact@madyclear.fr`
- Téléphone et WhatsApp : `06 96 01 70 07`
- Zone d’intervention : Martinique entière
- Adresse personnelle : non affichée publiquement

## Parcours client actuel

1. Le visiteur remplit le formulaire sur le site.
2. La demande est enregistrée dans le CRM Supabase via `madyclear-capture`.
3. WhatsApp s’ouvre ensuite avec le message prérempli.
4. Le prospect est suivi dans le cockpit/CRM.
5. Le tarif et le créneau sont confirmés avant intervention.
6. Après validation du devis, les **30 € d’arrhes sont encaissées manuellement** pour confirmer le créneau.
7. Une fois les arrhes reçues, le statut passe à **RDV confirmé**.

## Cockpit MADYCLEAR

Runtime officiel :

- `/app/index.html`
- `/app/app.css`
- `/app/sync.js`
- `/app/manifest.webmanifest`
- `/app/service-worker.js`
- `/app/icons/*`

Le cockpit est local-first et reste utilisable hors ligne. La synchronisation Supabase est authentifiée et manuelle par défaut. Aucun message client, publication sociale ou paiement n’est déclenché automatiquement par la synchronisation tant qu’une automatisation n’est pas explicitement activée.

## Connexions

### Actives

- GitHub Pages
- formulaire → CRM Supabase
- téléphone
- email direct
- ouverture WhatsApp
- Google Business Profile
- Google Search Console

### Disponibles / préparées

- Gmail
- Google Calendar
- Google Drive
- Metricool
- alertes e-mail propriétaire
- confirmation et relance WhatsApp

### En pause

- Stripe / paiement automatique des arrhes

Les automatisations WhatsApp restent inactives avant le lancement officiel et nécessitent un connecteur autorisé, de type Peach Core ou API Meta Cloud.

## DIGISTAFF

Architecture cible :

`Cockpit MADYCLEAR ↔ DIGISTAFF Core ↔ Supabase ↔ Action Outbox ↔ Connecteurs`

Les agents prévus sont : Employé Client, Commercial, Admin, Réseaux et Pilotage.

Règle d’autonomie : **AUTO / VALIDATION / CRITIQUE**. Les actions externes ou engageantes restent soumises à validation humaine tant qu’elles ne sont pas explicitement autorisées.

## Confidentialité

- page publique : `/politique-confidentialite.html` ;
- les demandes du formulaire sont enregistrées dans le CRM pour le suivi commercial ;
- les photos de diagnostic restent confidentielles ;
- aucune publication avant/après sans accord explicite ;
- aucune information sur le domicile ou la vie privée du client ne doit être partagée.

## Référencement local

- conserver le même nom, téléphone, domaine et horaires sur le site, Google Business Profile et les annuaires ;
- utiliser naturellement les termes « nettoyage canapé Martinique », « nettoyage matelas », « nettoyage tapis à domicile » et « injection-extraction » ;
- privilégier les vraies photos avant/après et les avis clients authentiques ;
- ne jamais promettre un résultat impossible à garantir.

Pour l’état complet du projet, consulter `DOSSIER-MADYCLEAR.md`.