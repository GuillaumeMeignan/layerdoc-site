# Notice de déploiement (sans déployer)

Le site est statique : copier ces éléments chez n'importe quel hébergeur statique.

```
index.html
assets/        (css, js, fonts, img)
legal/
```

## Avant la mise en ligne
1. Renseigner `WEB3FORMS_ACCESS_KEY` dans `assets/js/config.js`. La clé Web3Forms est publique par conception, mais lui associer un domaine autorisé dans le tableau de bord Web3Forms.
2. Relire les pages `legal/` (texte rédigé, non validé par un juriste). Vérifier la formule sur les transferts hors UE de Web3Forms dans sa documentation RGPD, puis forme juridique, . Puis retirer `<meta name="robots" content="noindex">` de ces pages.
3. Domaine `layerdoc.fr` : `canonical`, `og:url`, `robots.txt` et `sitemap.xml` sont en place. Reste à ajouter `og:image` (PNG 1200×630).
4. Activer HTTPS sur `layerdoc.fr` chez l'hébergeur.
5. Tester un envoi réel du formulaire.

## Tester en local
```bash
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000.

## Limites Web3Forms (offre gratuite)
Sources tierces : environ 250 envois par mois, formulaires et domaines illimités. Une source indique 250 envois au total. À vérifier sur https://web3forms.com/pricing.
