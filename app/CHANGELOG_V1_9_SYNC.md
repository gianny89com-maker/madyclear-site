# MADYCLEAR Personal — V1.9 SYNC

Date : 17 septembre 2026

## Ajout principal

Le cockpit MADYCLEAR peut désormais être relié au CRM Supabase existant sans abandonner le mode local-first.

## Réalisé

- nouvelle Edge Function sécurisée `madyclear-sync` ;
- authentification propriétaire obligatoire ;
- RLS du workspace conservé ;
- nouveau module PWA `/app/sync.js` ;
- bouton `SYNC` injecté dans le cockpit ;
- connexion par mot de passe Supabase ;
- option de lien de connexion ;
- rafraîchissement de session ;
- déconnexion ;
- synchronisation manuelle bidirectionnelle des prospects/clients ;
- remontée des leads du site vers l'application ;
- envoi des brouillons de devis locaux vers Supabase ;
- récupération des tâches et réservations dans le snapshot DIGISTAFF ;
- mapping anti-doublons via `madyclear_external_refs` ;
- rapprochement secondaire téléphone/e-mail ;
- journalisation de chaque synchronisation dans `madyclear_audit_logs` ;
- conservation des données locales hors ligne ;
- aucune automatisation WhatsApp activée.

## Protection des données existantes

La clé locale `madyclear-personal-v1` n'est pas modifiée. La synchronisation complète le stockage local et ne le remplace pas.

## Non inclus en V1

Les tarifs/réglages globaux, médias, paiements, publications et messages clients ne sont pas synchronisés automatiquement. Ils restent hors du périmètre de cette phase afin d'éviter toute action externe ou écrasement non validé.

## Activation utilisateur

Une connexion unique du compte propriétaire dans le panneau `SYNC` est nécessaire avant la première synchronisation réelle. Le mot de passe n'est pas stocké dans l'application.