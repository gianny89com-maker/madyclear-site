# MADYCLEAR Personal — V1.8.4 CLEAN

Date : 17 septembre 2026

## Objectif

Préparer MADYCLEAR comme base unique de DIGISTAFF en supprimant les doublons techniques sûrs et en conservant toutes les briques utiles.

## Nettoyage

Supprimés du runtime :

- `app/app.js` — doublon non chargé ;
- `app/v1_8_2_options.js` — module orphelin non chargé ;
- `app/sw.js` — ancien service worker non enregistré.

Conservés :

- `app/index.html` — application officielle ;
- `app/app.css` — styles officiels ;
- `app/service-worker.js` — unique service worker ;
- `app/manifest.webmanifest` ;
- les icônes PWA ;
- la clé locale `madyclear-personal-v1`.

## DIGISTAFF

Ajout du dossier `/DIGISTAFF/` avec :

- architecture/source de vérité ;
- cinq employés IA V1 ;
- mapping des tables Supabase existantes ;
- politique AUTO / VALIDATION / CRITIQUE ;
- plan d’implémentation.

## Supabase

L’ancienne Edge Function `madyclear-app`, qui exposait une autre application, a été dépréciée. La seule interface de référence est désormais `https://www.madyclear.fr/app/`.

Aucune table non-MADYCLEAR n’a été supprimée, afin de ne pas toucher à d’autres projets présents dans le même environnement Supabase.

## Résultat attendu

Une seule application à maintenir, une seule base métier MADYCLEAR, et DIGISTAFF qui vient se brancher sur ce socle au lieu de recréer des copies.