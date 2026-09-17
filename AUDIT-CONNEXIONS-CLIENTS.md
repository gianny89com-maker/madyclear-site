# AUDIT DES CONNEXIONS CLIENTS — MADYCLEAR

Date de mise à jour : 16 septembre 2026  
Site audité : https://www.madyclear.fr/

## Résultat exécutif

Le site public est désormais raccordé au CRM MADYCLEAR : le formulaire crée une demande dans Supabase via `madyclear-capture` **avant** l’ouverture de WhatsApp. MADYCLEAR ne dépend donc plus uniquement du fait que le prospect termine manuellement son message WhatsApp pour connaître son existence.

Le cockpit privé `https://www.madyclear.fr/app/` constitue l’interface opérationnelle officielle. Il dispose d’une synchronisation Supabase authentifiée et manuelle en V1. Les automatisations externes sensibles restent volontairement limitées avant le lancement officiel.

## Connexions actuellement actives

| Canal | État | Fonctionnement réel |
|---|---|---|
| Site officiel | Actif | GitHub Pages sur `madyclear.fr`. |
| Formulaire → CRM | Actif | Capture sécurisée dans Supabase via `madyclear-capture`. |
| Téléphone | Actif | Le lien lance l’appel vers 06 96 01 70 07. |
| WhatsApp | Actif manuel | Après capture CRM, le site ouvre WhatsApp avec un message prérempli. Aucun envoi automatique. |
| Email direct | Actif | Le visiteur peut ouvrir sa messagerie vers `contact@madyclear.fr`. |
| Google Business Profile | Actif | La fiche renvoie vers `madyclear.fr`. |
| Google Search Console | Actif | Le domaine et le sitemap sont reconnus. |
| Cockpit MADYCLEAR | Actif | PWA officielle dans `/app/`. |
| Cockpit ↔ Supabase | Préparé / manuel | Authentification + `madyclear-sync`. Premier test propriétaire à valider sur appareil. |
| Gmail | Disponible via passerelle | Pas d’alerte permanente automatique activée. |
| Google Calendar | Disponible via passerelle | Écritures externes à brancher progressivement. |
| Google Drive | Disponible via passerelle | Archivage automatisé non généralisé. |
| Metricool | Disponible via passerelle | Hub social retenu ; publication avec validation. |
| Alertes e-mail propriétaire | Préparées | Règle prête mais inactive avant activation contrôlée. |
| Confirmation WhatsApp | Préparée | Inactive avant lancement officiel. |
| Relance WhatsApp | Préparée | Inactive avant lancement officiel. |
| Réception Meta / WhatsApp | Technique prête | Fournisseur officiel non finalisé pour l’automatisation complète. |

## Parcours client actuel

1. Le client remplit le formulaire du site.
2. Le formulaire enregistre la demande dans le CRM Supabase.
3. La source, le besoin et les coordonnées exploitables sont conservés pour le suivi.
4. Le site ouvre WhatsApp avec un message prérempli.
5. Les photos peuvent ensuite être envoyées manuellement dans WhatsApp.
6. Le prospect peut être repris dans le cockpit MADYCLEAR via la synchronisation CRM.
7. Le suivi commercial reste humainement contrôlé avant toute automatisation client.

## Architecture officielle

- Site officiel : GitHub Pages.
- Domaine : `madyclear.fr`.
- Base CRM : Supabase.
- Capture publique : `madyclear-capture`.
- Cockpit privé : `madyclear.fr/app/`.
- Synchronisation : `/app/sync.js` → `madyclear-sync`.
- WhatsApp initial : lien direct conservé après capture CRM.
- Hub réseaux : Metricool.
- Agenda : Google Calendar via passerelle.
- Documents : Google Drive via passerelle.
- DIGISTAFF : couche d’intelligence et d’orchestration, sans création d’un second CRM.

## Données minimales suivies

- identifiant du prospect ;
- date et heure ;
- nom ;
- téléphone ;
- email facultatif ;
- commune ;
- prestation ;
- détails du besoin ;
- source ;
- statut ;
- consentement ;
- prochaine action ;
- historique des échanges.

Les photographies ne sont pas stockées automatiquement dans le CRM public. Elles restent dans le canal utilisé tant qu’un stockage sécurisé séparé n’est pas validé.

## Relances

Règles opérationnelles recommandées :

- immédiat : demande enregistrée et visible dans le CRM ;
- 24 h : rappel interne si le prospect n’a pas reçu de réponse ou de devis ;
- 48 h après devis : tâche de relance interne ;
- 7 jours : dernière relance contrôlée puis classement ;
- arrêt immédiat en cas de refus, demande de suppression ou rendez-vous confirmé.

Aucune relance WhatsApp automatique n’est activée avant validation du canal officiel, du consentement et des règles de lancement.

## WhatsApp : état réel

Le compte/connecteur actuel n’est pas retenu comme base suffisante pour l’automatisation complète. La cible reste :

- Peach Core, ou
- API officielle Meta Cloud.

Avant activation :

1. connecter le numéro officiel `+596 696 01 70 07` ;
2. valider les modèles de messages ;
3. tester un faux prospect contrôlé ;
4. vérifier l’arrêt automatique des relances en cas de réponse/refus/réservation ;
5. activer progressivement.

## DIGISTAFF et actions externes

DIGISTAFF doit appliquer les règles suivantes :

- **AUTO** : lecture, classement, calcul, préparation, déduplication, journalisation ;
- **VALIDATION** : email client, WhatsApp, publication, agenda externe, modification commerciale ;
- **CRITIQUE** : paiement, suppression sensible, sécurité, permissions, action irréversible.

Aucun secret serveur ou `service_role` ne doit être exposé dans la PWA.

## État de lancement

### Actif maintenant

- site public ;
- capture CRM ;
- téléphone ;
- email direct ;
- WhatsApp manuel ;
- Google Business Profile ;
- Google Search Console ;
- cockpit MADYCLEAR ;
- grille tarifaire commune site/app.

### Préparé mais non automatisé en permanence

- synchronisation cockpit ↔ Supabase ;
- Gmail ;
- Calendar ;
- Drive ;
- Metricool ;
- alertes e-mail ;
- confirmations WhatsApp ;
- relances WhatsApp.

### Décision avant lancement officiel

Le site et la capture CRM restent actifs. Les échanges WhatsApp restent manuels. Aucun abonnement ou envoi automatique client n’est activé tant que le flux complet n’a pas été testé et validé.