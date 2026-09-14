# MADYCLEAR Personal — Audit V1.7.1
Date : 13/09/2026
Statut : AUDITED STABLE — base exploitable en test réel téléphone

## Verdict
La V1.7 initiale contenait plusieurs bugs bloquants. Ils ont été corrigés dans V1.7.1.
La base locale est désormais cohérente et les fonctions principales ont passé un test navigateur automatisé simulé.
Un dernier test d’acceptation sur téléphone reste nécessaire pour les fonctions dépendantes du matériel : caméra, dictée vocale, installation PWA et comportement hors ligne réel.

## Bugs corrigés
1. Démarrage JS : `clone` était appelé avant initialisation, pouvant arrêter tout le moteur au chargement.
2. CRM : fonctions `normalizePhone` et `waUrl` manquantes, ce qui cassait le rendu des contacts.
3. Modules V1.7 : non inclus dans `renderAll()`, donc modules/portail pouvaient rester vides.
4. Capture rapide : plusieurs actions visaient `noteText` alors que le vrai champ est `quickNote`.
5. Accueil : absence de projet pouvait provoquer une erreur dans le focus du jour.
6. Pointage : bilan transformé en vrai bilan hebdomadaire local.
7. Trigger horaire : la configuration déclenche maintenant réellement un scan lorsque la PWA est active.
8. Descriptions modules rendues plus honnêtes : aucune fonction non développée n’est présentée comme déjà opérationnelle.
9. Heartbeat : réduction du bruit dans le journal.

## Tests automatiques passés
- Syntaxe `app.js` : OK.
- Syntaxe `service-worker.js` : OK.
- Manifest JSON : OK.
- IDs HTML dupliqués : 0.
- Références `getElementById` manquantes : 0.
- Actions utilisées non enregistrées : 0.
- Fichiers PWA référencés manquants : 0.
- Démarrage complet du moteur : OK.
- Navigation Accueil / MADY / Clients / DIGI / Projets : OK.
- Calcul devis textile : 50 € public -> 25 € reste estimé SAP sur ligne test : OK.
- Ajout client : OK.
- Modification client : OK.
- Normalisation WhatsApp Martinique : OK (`0696...` -> `596696...`).
- Enregistrement note : OK.
- Mise à jour objectif : OK.
- DIGISTAFF Question : OK.
- DIGISTAFF Diagnostic : OK.
- DIGISTAFF Proposition -> file de validation : OK.
- Approbation d’une validation : OK.
- Portal Hub Entreprise / Vie perso : OK.
- Module Salarié : pointer départ/arrivée : OK.
- Bilan hebdomadaire : OK.
- Vide-poche -> préremplissage note : OK.
- Macro « Préparer ma journée » -> scan + CRM : OK.
- KeepConnected heartbeat : OK lorsque la PWA est active.
- Trigger horaire -> scan : OK lorsque la PWA est active.
- Référence photo via input/caméra : OK en simulation de fichier.
- Migration d’une ancienne structure V1.1 vers V1.7.1 : OK.

## Fonctionnalités réellement utilisables maintenant
### Locales / sans compte externe
- CRM clients/prospects.
- Devis et calculs locaux.
- Notes / mémoire.
- Projets et objectifs.
- DIGISTAFF local : recherche, diagnostic, propositions et commandes sûres prévues.
- Action Engine et macros locales.
- Portail Entreprise / Vie perso.
- Pointage salarié et bilan hebdomadaire local.
- File Core locale / journal / validations.
- PWA installable et cache hors ligne après première ouverture sur hébergement HTTPS compatible.

### Utilisables avec conditions appareil/navigateur
- Dictée vocale : dépend du support SpeechRecognition ; fallback texte présent.
- Caméra : input mobile compatible ; le fichier est actuellement référencé dans le journal mais PAS encore archivé dans Drive/IndexedDB.
- WhatsApp / téléphone : ouverture via liens système.

## Fonctionnalités faisables mais pas encore branchées
- Sauvegarde des photos Avant/Après dans Google Drive.
- Renommage/archivage automatique des photos.
- Export hebdomadaire vers Google Sheets.
- Météo Vitres.
- Gmail / Calendar / Drive via n8n ou backend.
- Synchronisation multi-appareils Supabase/PostgreSQL.
- n8n distant : logique prête, mais webhook réel à configurer et sécuriser.
- Notifications/push distantes.

## Fonctions impossibles à garantir avec une PWA seule
- Exécution H24 après fermeture complète de l’application.
- Foreground Service Android.
- Redémarrage BOOT_COMPLETED.
- Triggers natifs Wi-Fi/Bluetooth fiables appareil verrouillé.
- Widgets Android/iOS natifs exécutant des macros en arrière-plan.

Ces fonctions nécessitent le futur `Android Companion` Kotlin ou une application tierce type MacroDroid.

## Sécurité / confidentialité
- Aucun script tiers chargé par l’interface actuelle.
- Aucun secret API embarqué dans le navigateur.
- Les données CRM restent localement sur l’appareil tant que le Core distant n’est pas configuré.
- `localStorage` n’est pas chiffré : acceptable pour prototype privé, mais pas suffisant comme stockage final de données sensibles multi-appareils.
- Ne pas placer de clé API permanente dans le champ webhook ou dans le code client.

## Décision recommandée
Geler V1.7.1 comme base de test stable.
Ne pas ajouter de gros modules avant validation sur téléphone des 8 parcours : Navigation, Client, Devis, Pointage, Vide-poche, DIGISTAFF, Photo, Sauvegarde.
Ensuite seulement : Drive Photos -> n8n -> Supabase -> Android Companion.
