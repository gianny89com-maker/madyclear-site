# MADYCLEAR KeepConnected Android Companion — Spécification V0

## Rôle
Petit service Android privé chargé de la persistance H24 que la PWA ne peut pas fournir.

## Stack
- Kotlin
- Foreground Service
- WorkManager
- Room
- BroadcastReceiver
- OkHttp
- Jetpack Security

## Flux
Android Service -> capte événement -> écrit dans Room -> exécute action locale sûre ou POST vers Autonomous Core -> reçoit résultat -> journalise -> met le cockpit à jour au prochain réveil.

## Triggers initiaux
- BOOT_COMPLETED
- connectivité réseau
- batterie faible / recharge
- tâches périodiques WorkManager
- notification/push distant (FCM) pour réveil serveur

## Sécurité
- Aucun secret métier dans l'UI.
- Keystore Android pour secrets.
- Webhooks signés.
- Liste blanche des actions autorisées.
- Aucune exécution shell arbitraire par défaut.
