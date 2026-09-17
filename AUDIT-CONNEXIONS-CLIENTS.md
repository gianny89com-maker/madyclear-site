# AUDIT DES CONNEXIONS CLIENTS — MADYCLEAR

Date : 17 septembre 2026  
Site audité : https://www.madyclear.fr/

## Résultat exécutif

Le site public fonctionne correctement comme vitrine et comme préparateur de message WhatsApp. Il ne possède toutefois aucun backend de collecte, aucune base de prospects, aucun système d’alerte email indépendant et aucune relance automatisée.

Un prospect n’est actuellement connu de MADYCLEAR que s’il termine lui-même l’envoi du message dans WhatsApp.

## Connexions actuellement actives

| Canal | État | Fonctionnement réel |
|---|---|---|
| Téléphone | Actif | Le lien lance l’appel vers 06 96 01 70 07. |
| WhatsApp | Partiel | Le site prépare un message et ouvre WhatsApp. Aucun message n’est envoyé automatiquement. |
| Email | Partiel | Le lien ouvre la messagerie du visiteur. Aucun email automatique n’est généré par le formulaire. |
| Google Business Profile | Actif | La fiche renvoie vers madyclear.fr. |
| Google Search Console | Actif | Le domaine et le sitemap sont reconnus. |
| GitHub Pages | Actif | Le site officiel est publié depuis la branche main. |
| CRM MADYCLEAR | Non connecté | L’application locale ne reçoit pas les demandes du site. |
| Instagram | Non connecté au site | Aucun lien ni remontée de prospects. |
| Facebook | Non connecté au site | Aucun lien ni remontée de prospects. |
| TikTok | Non connecté au site | Aucun lien ni remontée de prospects. |
| YouTube | Non connecté au site | Aucun lien ni remontée de prospects. |
| Agenda | Non connecté | Aucun créneau ni rendez-vous n’est créé automatiquement. |
| Relances | Absentes | Aucun rappel interne ou message client automatique. |
| Mesure des conversions | Absente | Aucun suivi des clics, demandes, devis ou transformations. |

## Risque principal

Le formulaire actuel utilise uniquement JavaScript dans le navigateur. Après validation, il construit une URL `wa.me` et ouvre WhatsApp. Il ne transmet rien à MADYCLEAR tant que le client n’appuie pas lui-même sur Envoyer dans WhatsApp.

Conséquences :
- abandon invisible ;
- aucune copie email ;
- aucune fiche prospect ;
- aucune date de relance ;
- aucune statistique de conversion ;
- impossibilité de savoir quelle source a apporté le client.

## Architecture cible MADYCLEAR — Employé Client V1

1. Le client remplit le formulaire du site.
2. Le formulaire crée un prospect sécurisé dans la base CRM.
3. MADYCLEAR reçoit immédiatement un email sur contact@madyclear.fr.
4. La notification email apparaît sur le téléphone via l’application Gmail.
5. WhatsApp s’ouvre avec le message prérempli pour permettre l’envoi des photos.
6. Le prospect reçoit un statut : Nouveau, À qualifier, Devis envoyé, Relance, Rendez-vous, Gagné ou Perdu.
7. Une date de prochaine action est enregistrée.
8. Le système rappelle à Gino les prospects sans réponse.
9. Les relances destinées au client ne sont envoyées automatiquement que si le canal, le consentement et les règles WhatsApp le permettent.
10. Les demandes provenant de Google, Instagram, Facebook ou du site utilisent une source distincte pour mesurer les résultats.

## Socle technique recommandé

- Site officiel : GitHub Pages conservé.
- Base CRM : Supabase.
- Réception instantanée : fonction sécurisée côté serveur.
- Notification principale : email vers contact@madyclear.fr.
- Alerte téléphone : notification Gmail sur le téléphone.
- WhatsApp initial : lien direct conservé.
- Automatisation : n8n ou fonctions planifiées une fois les comptes connectés.
- Agenda : Google Calendar après connexion.
- Tableau de suivi : CRM MADYCLEAR connecté à la même base.

## Règles de relance recommandées

- Immédiat : accusé de réception uniquement après demande réellement enregistrée.
- 24 heures : rappel interne si le prospect n’a pas reçu de devis.
- 48 heures après devis : tâche de relance interne.
- 7 jours : dernière relance, puis classement sans suite.
- Arrêt immédiat des relances en cas de refus, demande de suppression ou rendez-vous confirmé.
- Aucun envoi promotionnel sans consentement approprié.

## Données minimales à enregistrer

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

Les photographies ne doivent pas être stockées automatiquement dans la première version. Elles restent dans WhatsApp tant qu’un stockage sécurisé séparé n’est pas validé.

## Branchements requis avant activation

1. Connexion ou création du projet Supabase de production.
2. Validation de l’adresse qui recevra les alertes.
3. Configuration d’un service d’envoi email.
4. Vérification de WhatsApp Business et décision concernant l’API officielle Meta.
5. Connexion Google Calendar.
6. URLs officielles Instagram, Facebook, TikTok et YouTube.
7. Mise à jour de la politique de confidentialité avant toute nouvelle collecte.
8. Test complet avec un faux prospect avant ouverture publique.

## Ordre de mise en œuvre

### Phase 1 — Fiabilité
- Enregistrement sécurisé des demandes.
- Email instantané.
- Notification sur téléphone.
- Tableau prospects.
- Source du prospect.

### Phase 2 — Organisation
- Statuts commerciaux.
- Dates de relance.
- Rappels internes.
- Agenda.

### Phase 3 — Automatisation externe
- Accusés de réception.
- Relances client autorisées.
- WhatsApp Business API.
- Mesure complète des conversions par réseau.
