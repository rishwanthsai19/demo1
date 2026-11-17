# Rishwanth Sai | Profile Website

A single-page profile site built with HTML5, CSS3 and vanilla JavaScript only, deployed to GitHub Pages with GitHub Actions.

## Structure
- `index.html`: all sections (hero, journey, interests, family, hobbies, footer)
- `css/theme.css`: CSS variables only (the one theme file)
- `css/style.css`: layout and components, using `var()` everywhere
- `js/main.js`: navigation, light/dark toggle (saved in localStorage), reveal animations, flip cards, lightbox
- `images/`: add your photos per section (hero, journey, interests, family, hobbies)
- `.github/workflows/`: validate, deploy, pr-checks, lighthouse, notify

## Theme switch exercise
```
git checkout -b theme/dark-mode
# edit ONLY css/theme.css, replace the :root values with the dark palette from the use case document
git add css/theme.css && git commit -m "Switch to dark theme"
git push origin theme/dark-mode
```
Open a PR, get a peer review, merge, and the pipeline redeploys the site. Repeat on `theme/warm-tones`.

## Setup
1. Repo Settings > Pages > Source: GitHub Actions
2. Settings > Branches: require the `all-checks-passed` status check on `main`
3. Optional: add a `SLACK_WEBHOOK_URL` secret and uncomment the curl lines in `notify.yml`


## Light / dark toggle
The navbar button sets `data-theme` on `<html>`. Both palettes live in `css/theme.css` (`:root` = light, `:root[data-theme="dark"]` = dark), so re-theming is still a one-file change.
