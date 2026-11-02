# Notice de déploiement (sans déployer)

Le site est statique : copier ces éléments chez n'importe quel hébergeur statique.

```
index.html
assets/        (css, js, fonts, img)
legal/
```

## Avant la mise en ligne
1. Renseigner `WEB3FORMS_ACCESS_KEY` dans `assets/js/config.js`. La clé Web3Forms est publique par conception, mais lui associer un domaine autorisé dans le tableau de bord Web3Forms.
2. Rédiger les pages `legal/mentions-legales.html` et `legal/confidentialite.html`.
3. Une fois le domaine choisi, ajouter `og:url`, `og:image` (PNG 1200×630) et `<link rel="canonical">` dans `index.html`.
4. Retirer `<meta name="robots" content="noindex">` des pages légales si elles doivent être indexées.
5. Tester un envoi réel du formulaire.

## Tester en local
```bash
python3 -m http.server 8000
```
Puis ouvrir http://localhost:8000.

## Limites Web3Forms (offre gratuite)
Sources tierces : environ 250 envois par mois, formulaires et domaines illimités. Une source indique 250 envois au total. À vérifier sur https://web3forms.com/pricing.
