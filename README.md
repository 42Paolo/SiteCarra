# In Piazza — cucina di mare 🐟

Sito **responsive** (mobile, tablet e desktop) per il ristorante di pesce *In Piazza*, alle Caldine (Fiesole) — la famiglia è originaria di Porto Venere, da cui arriva la tradizione marinara in cucina.

Tre pagine, ciascuna un file HTML autonomo: **`index.html`** (menu), **`dove-siamo.html`** (indirizzo/contatti), **`chi-siamo.html`** (storia e filosofia). Lo stile e il comportamento condivisi da tutte e tre vivono in due file esterni; ogni pagina aggiunge solo il proprio `<style>`/`<script>` specifico. Nessuna dipendenza, nessun build — solo HTML/CSS/JS.

## Struttura del progetto

```
index.html          menu (Antipasti · Primi · Secondi · Dolci)
dove-siamo.html      indirizzo, mappa, contatti
chi-siamo.html       storia, ambiente, team, filosofia

css/
  base.css           condiviso da tutte le pagine: design tokens, reset,
                      guscio ".app", hamburger/logo, footer, overlay menu,
                      modal recensioni, breakpoint di crescita del layout

js/
  overlay.js         condiviso da tutte le pagine: hamburger + menu overlay
                      + modal recensioni (Google/Tripadvisor)

image/
  logo/              logo-lettering.webp + logo-ornaments.webp: il logo UNICO
                      del sito (vedi "Logo" sotto)
  piatti/            foto dei piatti con sfondo trasparente (900x900, webp)
  sfondi/            illustrazioni a china di sfondo (solo mobile/tablet:
                      su desktop lasciano il posto a un colore neutro);
                      overlay-porto-venere.webp = panorama del menu a tendina
  separatori/        foto panoramiche reali usate come separatori/hero
```

Ogni pagina ha poi un proprio `<style>` e `<script>` inline per ciò che le è specifico (griglia piatti e scroll-spy in `index.html`, reveal-on-scroll in `chi-siamo.html`, ecc.). Se cambi un colore, un font o il comportamento del menu overlay, modifica **una sola volta** in `css/base.css` / `js/overlay.js`: si applica automaticamente a tutte e tre le pagine.

## Logo

Il logo ("In Piazza · Café del Mar" + stella) è definito **una volta sola**, in `css/base.css` (`.logo-mark`). Ogni pagina contiene solo il segnaposto `<div class="logo-mark" role="img" aria-label="…"></div>` (header, barre in alto, menu a tendina): niente copie del disegno da tenere allineate.

- **Cambiare il logo ovunque:** sostituisci `image/logo/logo-lettering.webp` (scritte) e `image/logo/logo-ornaments.webp` (stella/abbellimenti) mantenendo proporzioni e posizione, oppure modifica la regola `.logo-mark` in `css/base.css`.
- **Dimensione per contesto:** variabile `--logo-h` (es. 120px→38px nell'header che collassa, 92px nel menu a tendina). `--logo-orn-op` regola gli abbellimenti: 1 visibili, 0 nascosti, `calc(...)` animati dallo scroll.

## Come vedere il risultato

Serve un server locale (i moduli CSS/JS esterni non si caricano da `file://`):

```bash
python3 -m http.server 8080      # dalla cartella del progetto
# poi apri http://localhost:8080
```

## Responsive

- **Mobile** (< 768px): layout "vecchio stile" a due colonne indipendenti sfalsate (masonry), pensato e calibrato per lo schermo del telefono.
- **Tablet** (768–1023px): stesso linguaggio visivo, ma piatto e titolo vengono riallineati riga per riga (niente più deriva indipendente tra le colonne, che a piatti più grandi confonderebbe l'abbinamento).
- **Desktop** (≥ 1024px, solo `index.html`): sidebar di navigazione fissa al posto delle tab in alto, un piatto per schermata intera, foto a bordo pagina alternata a destra/sinistra. Le altre due pagine (`dove-siamo.html`, `chi-siamo.html`) restano su un impianto più semplice — il contenitore si allarga e i testi restano ancorati a una larghezza comoda da leggere (~1080px), senza sidebar.

In ogni caso: **la versione mobile non viene mai alterata** dalle regole responsive — sono tutte dentro `@media (min-width: …)`, quindi sotto i rispettivi breakpoint il sito è identico a come è stato disegnato in origine.

## Funzionalità

- **Header sticky che collassa** (solo `index.html`): hero espanso → barra compatta scorrendo, sfondo che cambia tinta con la categoria attiva.
- **Tab bar / sidebar con scroll-spy**: la voce attiva si aggiorna da sola scorrendo il menu.
- **Layout piatti a zig-zag**: piatto e testo alternati a specchio, con divisori a onde o foto ogni 5 piatti.
- **Overlay menu** a tutto schermo (hamburger) con tenda d'onda animata, e **modal recensioni** (Google/Tripadvisor) con vetro smerigliato — entrambi supportano `prefers-reduced-motion`.

## Inserire le foto reali (placeholder attuali)

| Elemento | Dove | Pagina |
|---|---|---|
| Foto piatto | `.plate` (dentro `.plate-block`) | `index.html` — genera i placeholder via JS, cerca `plateHTML()` |
| Foto sala/team/locale | `.ph` (placeholder con icona macchina fotografica) | `chi-siamo.html` |

Le foto vere già inserite (hero, separatori panoramici) sono in `image/separatori/`; gli sfondi illustrati (solo mobile/tablet) sono in `image/sfondi/`.

## Deploy su GitHub Pages

Il repo è già su GitHub (`42Paolo/SiteCarra`). Dopo il primo push:

1. GitHub → **Settings → Pages**
2. *Source*: `Deploy from a branch` → branch `main` / cartella `/ (root)`
3. Online su `https://42paolo.github.io/SiteCarra/`
