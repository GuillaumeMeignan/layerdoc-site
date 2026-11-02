# Recette : landing page Layerdoc

Tests réalisés dans Chromium (Playwright), serveur local, API Web3Forms simulée.

| Point | Attendu | Constaté | Statut |
|---|---|---|---|
| Responsive 375 / 768 / 1440 px | Aucun défilement horizontal | 0 px de débordement aux 3 largeurs | ✅ |
| Console | Aucune erreur ni avertissement | 0 | ✅ |
| Réseau | Aucun appel tiers hors Web3Forms | 0 appel tiers (polices locales) | ✅ |
| Lighthouse mobile et desktop | ≥ 90 partout | 100 / 100 / 100 / 100 | ✅ |
| Accessibilité (axe, WCAG 2.1 AA) | 0 violation | 0 (contrastes inclus) | ✅ |
| Cibles tactiles | ≥ 44 px | Boutons, liens de menu, onglets, FAQ ≥ 44 px | ✅ |
| `lang="fr"`, étiquettes, focus visible | Présents | Oui | ✅ |
| Onglets de sites | Change les lignes du tableau, clavier OK | OK (flèches, Début, Fin) | ✅ |
| Sélecteur marque blanche | Change barre, navigation, bouton | OK | ✅ |
| FAQ accordéon, ancres, défilement doux | `<details>`, `prefers-reduced-motion` respecté | OK | ✅ |
| Boutons d'action | Mènent à `#formulaire`, préremplissent, focus | OK (3 textes de la charte) | ✅ |
| Formulaire : envoi en cours | Bouton désactivé | OK | ✅ |
| Formulaire : erreur | Message clair, données conservées | OK | ✅ |
| Formulaire : succès | Remerciement seulement après réponse positive | OK | ✅ |
| Formulaire : champs vides | Message clair | OK | ✅ |
| Anti-spam | Champ `botcheck` caché | Présent | ✅ |
| Envoi réel Web3Forms | Message reçu par e-mail | Non testé : clé absente, API bloquée dans la session | ⚠️ À valider avec Guillaume |
| SEO | title, description, Open Graph, favicon | Présents, domaine `layerdoc.fr` (canonical, og:url, robots, sitemap) ; manque `og:image` | ⚠️ À valider avec Guillaume |
| Licence open source | Ligne retirée | Retirée | ⚠️ À valider avec Guillaume |
| FAQ hébergement / RGPD | Réponse finale | Texte provisoire neutre | ⚠️ À valider avec Guillaume |
| Mention « en cours de développement » | Libellé validé | Libellé proposé | ⚠️ À valider avec Guillaume |
| Pages légales | Contenu rédigé, consentement renvoie à la confidentialité | Rédigé ; champs jaunes à compléter (SIRET, adresse, hébergeur, e-mail) | ⚠️ À valider avec Guillaume |
| Mesure d'audience | Hors périmètre | Attributs `data-track` posés | ✅ |
