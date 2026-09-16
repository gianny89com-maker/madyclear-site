# MADYCLEAR — Site final Vercel

Tarification textile mise à jour : 15/09/2026 (grille finale validée).

Site statique multi-pages, sans dépendance externe.

## Production
- Domaine public : https://madyclear.fr/
- Cible : Vercel
- Ne pas supprimer ni remplacer la route existante https://madyclear.fr/app/ lors du déploiement final.
- GitHub Pages n'est pas utilisé pour la production de cette version.

## Pages
- /
- /automobile/
- /textile/
- /vitres/
- /professionnels/
- /devis/

## Fonctionnement
- panier local via localStorage ; aucune donnée client n'est stockée sur le site ;
- calcul automatique des offres groupées : 2 éléments = 5 %, 3–4 = 8 %, 5+ = 10 % indicatif avec validation manuelle ;
- le Pack Voisin est signalé mais n'applique pas de remise aveugle ;
- les prestations « à partir de » et diagnostics sont signalés comme estimations ;
- formulaire final préremplit WhatsApp ; photos à joindre ensuite dans la conversation ;
- paiement prévu sur place après prestation.
