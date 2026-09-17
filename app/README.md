# MADYCLEAR Personal — Cockpit V1.9.1 PRICING SYNC

Application PWA privée publiée dans `madyclear.fr/app/` et interface officielle du pilote DIGISTAFF × MADYCLEAR.

## Architecture officielle

- Interface : PWA MADYCLEAR.
- Stockage local historique : `madyclear-personal-v1` — conservé.
- Base centrale : Supabase MADYCLEAR.
- Synchronisation : `/app/sync.js` → Edge Function `madyclear-sync`.
- Capture publique : site → `madyclear-capture` → CRM Supabase.
- Tarification commune site/app : `/assets/madyclear-pricing.json`.
- Un seul service worker : `/app/service-worker.js`.

## Synchronisation V1

Après connexion du propriétaire, le cockpit peut synchroniser manuellement :

- clients et prospects locaux vers Supabase ;
- nouveaux prospects captés par le site vers le cockpit ;
- statut, priorité, valeur estimée et prochaine action ;
- brouillons de devis locaux vers Supabase ;
- snapshot cloud des tâches et réservations pour les prochaines vues DIGISTAFF.

La fusion utilise en priorité les identifiants de synchronisation, puis le téléphone ou l'e-mail normalisés afin de limiter les doublons. Les correspondances sont conservées dans `madyclear_external_refs`.

## Synchronisation des tarifs

La grille officielle n'est plus maintenue séparément entre le site et l'application.

Source unique :

`/assets/madyclear-pricing.json`

Le site public charge cette grille avec un HTML de secours identique. Le service worker de l'application charge la même grille et la rend disponible au moteur de devis, y compris hors ligne grâce au cache.

Grille officielle :

- Canapé 2 places : 160 €
- Canapé 3 places : 190 €
- Canapé angle / panoramique : 240 €
- Fauteuil : 80 €
- Matelas 1 place : 120 €
- Matelas 2 places : 160 €
- Tapis standard : 100 €
- Chaise textile : 40 €
- Minimum d’intervention textile : 80 €

Le minimum d’intervention est un plancher de facture, pas une prestation à additionner. Les packs restent personnalisés et uniquement sur devis.

## Sécurité

- Authentification Supabase obligatoire pour `madyclear-sync` (`verify_jwt=true`).
- RLS du workspace MADYCLEAR appliqué aux lectures et écritures.
- La clé secrète/service role n'est jamais exposée dans la PWA.
- Le mot de passe n'est jamais stocké par MADYCLEAR ; il est envoyé directement à Supabase Auth lors de la connexion.
- Les jetons de session sont stockés localement sur l'appareil afin de maintenir la connexion.
- Synchronisation automatique externe désactivée par défaut : la V1 se déclenche manuellement.
- Hors ligne, le cockpit reste fonctionnel et les données locales sont conservées.

## Ce qui n'est pas synchronisé automatiquement en V1

- photos/vidéos ;
- paiements ;
- publications sociales ;
- messages ou relances clients ;
- modifications engageantes de paramètres ou d'automatisations.

Ces éléments restent soumis aux garde-fous DIGISTAFF et seront branchés par phases.

## Runtime actif

- `/app/index.html`
- `/app/app.css`
- `/app/sync.js`
- `/app/manifest.webmanifest`
- `/app/service-worker.js`
- `/app/icons/*`

Les anciens doublons `app.js`, `v1_8_2_options.js` et `sw.js` restent supprimés.

## Utilisation

1. Ouvrir `https://www.madyclear.fr/app/`.
2. Appuyer sur **SYNC**.
3. Se connecter avec le compte Supabase propriétaire.
4. Appuyer sur **Synchroniser maintenant**.
5. L'application fusionne les données et se recharge pour afficher les nouveaux prospects.

Aucune relance WhatsApp, publication ou dépense n'est déclenchée par cette synchronisation.

## Version

Cockpit : `1.9.1-pricing-sync`.