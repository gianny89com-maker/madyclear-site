MADYCLEAR Cockpit — V1.8.1 Guardrails Patch — Optimisation finale
Date : 13/09/2026

OBJECTIF
Conserver une seule interface, sans doublon, avec tout ce qui est utile accessible immédiatement.

AJUSTEMENTS
- Suppression du panneau séparé « Liens directs utiles » : doublon éliminé.
- Les cartes n8n / Supabase / Gmail / Calendar / Drive / Météo / WhatsApp restent l’unique point d’entrée.
- Chaque fiche connecteur propose :
  1. « Ouvrir maintenant » : accès direct au service, sans automatisation.
  2. « Préparer l’API » : conserve le futur branchement dans les validations.
- Statuts : À BRANCHER / PRÉPARÉ / CONNECTÉ.
- Migration automatique : les préparations déjà faites auparavant sont reconnues depuis le journal d’événements.
- Pas de doublon de validation : une API déjà préparée n’est pas rajoutée une seconde fois.
- WhatsApp direct ouvre le partage WhatsApp avec texte préparé, sans tenter d’écrire au propre numéro MADYCLEAR.
- Ouvrir un service est considéré comme lecture/navigation externe uniquement ; aucun envoi ou changement n’est effectué.
- Toute écriture, envoi, modification ou API profonde reste soumise aux garde-fous validés.

DONNÉE CONFIRMÉE
Ligne publique MADYCLEAR : +596 696 01 70 07.
Elle reste utilisée comme identité commerciale ; les messages clients du CRM utilisent toujours le numéro du contact concerné.
