# In Piazza — cucina di mare 🐟

Sito **mobile-first** (ottimizzato esclusivamente per smartphone) per il ristorante di pesce *In Piazza*, Porto Venere.
**Tutto in un unico file** `index.html` (HTML + `<style>` + `<script>` interni): nessuna dipendenza, nessun build, niente file esterni da collegare.

## Come vedere il risultato

- **Più semplice:** doppio click su `index.html` → si apre nel browser già stilizzato.
- **Con server locale** (consigliato, evita limiti di alcuni browser):

```bash
python3 -m http.server 8080      # dalla cartella del progetto
# poi apri http://localhost:8080
```

> 📱 **Vista mobile:** DevTools del browser (F12) → *Toggle device toolbar* (Cmd/Ctrl+Shift+M) → scegli un iPhone.
> Su schermo largo il sito si mostra comunque come una colonna stile telefono, centrata.

## Funzionalità

- **Hero** con logo *In Piazza* (line-art SVG) e sfondo che cambia tinta con la categoria attiva.
- **Tab bar sticky** (Crudi · Antipasti · Primi · Secondi) con underline dorato animato.
- **Scroll-spy**: scorrendo il menu la tab attiva si aggiorna da sola.
- **Layout piatti a zig-zag**: piatto ~40% / testo ~60%, alternati a specchio.
- **Separatori** a onde a tutta larghezza tra una categoria e l'altra.
- **Overlay menu** full-screen (hamburger), reveal animato, supporto `prefers-reduced-motion`.

## Inserire le immagini reali (placeholder CSS)

Tutto è dentro `index.html`. Cerca questi blocchi nel `<style>`/markup:

| Elemento | Dove | Come |
|---|---|---|
| Sfondo hero | `.hero__bg` | `background-image:url('assets/porto-venere.jpg'); background-size:cover;` (anche per categoria via `.hero[data-cat="primi"] .hero__bg`) |
| Piatti | `.plate` | `background-image:url('assets/piatto.jpg'); background-size:cover;` e togli lo `<span class="plate__label">` |
| Separatori | `.separator` | sostituisci l'`<svg class="separator__waves">` con un'immagine, oppure lascia le onde |
| Logo | blocco `.logo` | sostituisci gli `<svg>` col logo definitivo |

I piatti sono **tutti tondi della stessa dimensione** (grigi), pronti per le foto definitive.

## Deploy su GitHub Pages

Il repo è già su GitHub (`42Paolo/SiteCarra`). Dopo il primo push:

1. GitHub → **Settings → Pages**
2. *Source*: `Deploy from a branch` → branch `main` / cartella `/ (root)`
3. Online su `https://42paolo.github.io/SiteCarra/`
