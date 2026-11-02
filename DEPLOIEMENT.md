# Notice de déploiement (sans déployer)

Le site est statique : copier ces éléments chez n'importe quel hébergeur statique.

```
index.html
assets/        (css, js, fonts, img)
legal/
```

## Avant la mise en ligne
1. La clé Web3Forms est renseignée dans `assets/js/config.js` (publique par conception). Lui associer `layerdoc.fr` comme domaine autorisé dans le tableau de bord Web3Forms, si l'offre le permet.
2. Relire les pages `legal/` (texte rédigé, non validé par un juriste). Vérifier la formule sur les transferts hors UE de Web3Forms dans sa documentation RGPD, puis forme juridique, . Puis retirer `<meta name="robots" content="noindex">` de ces pages.
3. Domaine `layerdoc.fr` : `canonical`, `og:url`, `robots.txt` et `sitemap.xml` sont en place. `og:image` (PNG 1200×630, `assets/img/og-image.png`) est en place.
4. Activer HTTPS sur `layerdoc.fr` chez l'hébergeur.
5. Tester un envoi réel du formulaire.

## Tester en local
```bash
npm run dev
```
Puis ouvrir http://localhost:8000 (aucune dépendance à installer). Autre option : `python3 -m http.server 8000`.

## Limites Web3Forms (offre gratuite)
Sources tierces : environ 250 envois par mois, formulaires et domaines illimités. Une source indique 250 envois au total. À vérifier sur https://web3forms.com/pricing.
