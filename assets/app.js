/* =====================================================================
   Qaidy – Programm der Webseite
   Liest die Einträge aus daten.js und die Texte aus texte.js und baut
   daraus die Seite. Hier muss normalerweise nichts geändert werden.
   ===================================================================== */
(() => {
  "use strict";

  const DATEN = window.QAIDY_DATEN;
  const TEXTE = window.QAIDY_TEXTE || {};
  const E = (DATEN && DATEN.einstellungen) || {};

  const SPRACHEN = {
    ar: { html: "ar", dir: "rtl", locale: "ar-IQ", datum: "lang" },
    de: { html: "de", dir: "ltr", locale: "de-DE", datum: "lang" },
    // Badini: arabische Schrift, Zahlen wie im Irak, Datum nur in Ziffern
    ku: { html: "ku-Arab", dir: "rtl", locale: "ar-IQ", datum: "kurz" },
    en: { html: "en", dir: "ltr", locale: "en-GB", datum: "lang" }
  };
  const STANDARD_SPRACHE = "ar";
  const SPENDEN_SICHTBAR = 8;

  // So viel ist 1 US-Dollar in der jeweiligen Währung wert
  const KURSE = Object.assign({ USD: 1 }, E.kurse);
  const HAUPT = KURSE[E.hauptwaehrung] ? E.hauptwaehrung : "USD";

  const SVG_ATTR = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const ICON = {
    // Familienzeichen: Haus mit Herz – wie oben auf der Seite
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M12 17.6s-3.4-2-3.4-4.3a1.8 1.8 0 0 1 3.4-.8 1.8 1.8 0 0 1 3.4.8c0 2.3-3.4 4.3-3.4 4.3z" fill="#F2C46D" stroke="none"/></svg>',
    herz: `<svg ${SVG_ATTR}><path d="M12 20s-7-4.4-8.6-8.6C2.2 8.2 4.2 5 7.4 5c1.9 0 3.6 1.1 4.6 2.7C13 6.1 14.7 5 16.6 5c3.2 0 5.2 3.2 4 6.4C19 15.6 12 20 12 20z"/></svg>`,
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path fill="currentColor" d="M9.1 7.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4l.7 1.7c.1.3 0 .5-.1.7l-.5.6c-.1.1-.2.3 0 .5.5.9 1.3 1.7 2.3 2.3.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.7-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.5.4-1.3.6-2 .4-2.6-.7-4.7-2.8-5.4-5.4-.2-.7 0-1.5.4-2z"/></svg>'
  };

  // Vorschau-Daten: nur sichtbar, solange in daten.js noch nichts eingetragen ist
  const BEISPIEL = {
    spenden: [
      { datum: "2026-10-30", name: "آزاد", betrag: 100, waehrung: "USD" },
      { datum: "2026-10-29", name: "Dilan & Rêber", betrag: 500, waehrung: "EUR",
        notiz: { ar: "للطريق", de: "Für den Weg", ku: "بۆ رێکێ", en: "For the path" } },
      { datum: "2026-10-27", anonym: true, betrag: 250000, waehrung: "IQD" },
      { datum: "2026-10-24", name: "شيرين", betrag: 200, waehrung: "USD" },
      { datum: "2026-10-21", name: "Nadia", betrag: 30, waehrung: "EUR" },
      { datum: "2026-10-18", name: "دلشاد", betrag: 100000, waehrung: "IQD" },
      { datum: "2026-10-12", anonym: true, betrag: 50, waehrung: "USD" },
      { datum: "2026-10-08", name: "سامي", betrag: 150, waehrung: "USD" },
      { datum: "2026-10-03", name: "Rojin", betrag: 20, waehrung: "EUR" },
      { datum: "2026-09-28", name: "كاوا", betrag: 75000, waehrung: "IQD" }
    ],
    ausgaben: [
      {
        datum: "2026-10-26",
        titel: { ar: "تصليح الطريق إلى جبل كاراجال", de: "Weg zum Karajal-Berg ausgebessert", ku: "چاکرنا رێکا چیایێ کاراجال", en: "Repaired the path to Mount Karajal" },
        text: { ar: "اشترينا الحصى والإسمنت، وعمل شباب العائلة يومين على الطريق.", de: "Schotter und Zement gekauft, die jungen Männer der Familie haben zwei Tage am Weg gearbeitet.", ku: "مە کەڤر و چیمەنتۆ کڕی، و گەنجێن مالباتێ دوو رۆژان ل سەر رێکێ کار کر.", en: "We bought gravel and cement, and the young men of the family worked on the path for two days." },
        betrag: 300,
        waehrung: "USD",
        bilder: [
          { src: "bilder/beispiel-weg-vorher.svg", text: { ar: "قبل", de: "Vorher", ku: "بەری", en: "Before" } },
          { src: "bilder/beispiel-weg.svg", text: { ar: "بعد", de: "Nachher", ku: "پشتی", en: "After" } }
        ]
      },
      {
        datum: "2026-10-15",
        titel: { ar: "خزان ماء جديد للبيت الكبير", de: "Neuer Wassertank für das große Haus", ku: "تانکیەکا ئاڤێ یا نوی بۆ مالا مەزن", en: "New water tank for the big house" },
        text: { ar: "خزان سعة ٢٠٠٠ لتر مع التركيب.", de: "Tank mit 2.000 Litern, inklusive Einbau.", ku: "تانکیەکا ٢٠٠٠ لیتری دگەل دانانێ.", en: "2,000-litre tank including installation." },
        betrag: 450000,
        waehrung: "IQD",
        bilder: ["bilder/beispiel-wasser.svg"]
      },
      {
        datum: "2026-10-05",
        titel: { ar: "مستلزمات مدرسية للأطفال", de: "Schulsachen für die Kinder", ku: "پێدڤیێن قوتابخانێ بۆ زارۆکان", en: "School supplies for the children" },
        text: { ar: "حقائب ودفاتر وأقلام لـ ١٢ طفلاً.", de: "Taschen, Hefte und Stifte für 12 Kinder.", ku: "جانتە، دەفتەر و پێنووس بۆ ١٢ زارۆکان.", en: "Bags, notebooks and pens for 12 children." },
        betrag: 150,
        waehrung: "EUR"
      }
    ]
  };

  let sprache = STANDARD_SPRACHE;
  let alleSpenden = false;
  let hochgezaehlt = false;
  let fotoListen = [];
  let betrachter = { bilder: [], titel: "", index: 0 };
  const warnungen = new Set();

  const $ = (id) => document.getElementById(id);

  // ---------- Hilfen ----------

  function esc(wert) {
    return String(wert == null ? "" : wert).replace(/[&<>"']/g, (z) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[z]
    ));
  }

  function t(schluessel, werte) {
    let text = (TEXTE[sprache] || {})[schluessel] || (TEXTE.de || {})[schluessel] || schluessel;
    if (werte) Object.keys(werte).forEach((k) => { text = text.split("{" + k + "}").join(werte[k]); });
    return text;
  }

  // Text aus den Daten in der gewählten Sprache – sonst die erste vorhandene
  function lokal(wert) {
    if (wert == null) return "";
    if (typeof wert !== "object") return String(wert);
    return wert[sprache] || wert.ar || wert.de || wert.en || wert.ku || Object.values(wert)[0] || "";
  }

  function warne(text) {
    if (warnungen.has(text)) return;
    warnungen.add(text);
    console.warn("Qaidy: " + text);
  }

  function zahl(wert, optionen) {
    return new Intl.NumberFormat(SPRACHEN[sprache].locale, optionen).format(wert);
  }

  // Arabisch und Kurdisch: Währung als Wort – verständlicher als "US$" oder "د.ع."
  const WAEHRUNG_WORT = {
    ar: { USD: "دولار", IQD: "دينار", EUR: "يورو" },
    ku: { USD: "دۆلار", IQD: "دینار", EUR: "یۆرۆ" }
  };

  function geld(betrag, waehrung) {
    const stellen = waehrung === "IQD" || Number.isInteger(betrag) ? 0 : 2;
    const ziffern = { minimumFractionDigits: stellen, maximumFractionDigits: stellen };
    const wort = (WAEHRUNG_WORT[sprache] || {})[waehrung];
    if (wort) return zahl(betrag, ziffern) + " " + wort;
    try {
      return zahl(betrag, Object.assign({ style: "currency", currency: waehrung, currencyDisplay: "narrowSymbol" }, ziffern));
    } catch (fehler) {
      return zahl(betrag, ziffern) + " " + waehrung;
    }
  }

  function datumText(iso) {
    const teile = String(iso || "").split("-").map(Number);
    if (teile.length !== 3 || teile.some((z) => !z)) return "";
    const optionen = SPRACHEN[sprache].datum === "kurz"
      ? { day: "numeric", month: "numeric", year: "numeric" }
      : { day: "numeric", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat(SPRACHEN[sprache].locale, optionen).format(new Date(teile[0], teile[1] - 1, teile[2]));
  }

  function waehrungVon(eintrag) {
    return String(eintrag.waehrung || HAUPT).toUpperCase();
  }

  function betragVon(eintrag) {
    if (eintrag.betrag == null || eintrag.betrag === "") return 0;
    const betrag = Number(eintrag.betrag);
    if (!Number.isFinite(betrag)) {
      warne("Betrag ist keine Zahl: " + JSON.stringify(eintrag));
      return 0;
    }
    return betrag;
  }

  function inUSD(betrag, waehrung) {
    const kurs = KURSE[waehrung];
    if (!kurs) {
      warne("Kein Wechselkurs für " + waehrung + " in daten.js");
      return 0;
    }
    return betrag / kurs;
  }

  function ausUSD(usd, waehrung) {
    return usd * KURSE[waehrung];
  }

  // Umgerechnete Beträge glatt runden, damit sie ruhig lesbar sind
  function glatt(wert, waehrung) {
    return waehrung === "IQD" ? Math.round(wert / 1000) * 1000 : Math.round(wert);
  }

  // Jeder Name bekommt immer dieselbe von fünf Farben für seinen Anfangsbuchstaben
  function farbeVon(text) {
    let h = 0;
    for (const z of text) h = (h * 31 + z.codePointAt(0)) >>> 0;
    return h % 5;
  }

  // Der große Betrag zählt beim ersten Öffnen kurz hoch – ein kleiner Blickfang
  function zeigeBetrag(el, ziel, waehrung) {
    const ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hochgezaehlt || ruhig || ziel <= 0 || !window.requestAnimationFrame) {
      el.textContent = geld(ziel, waehrung);
      return;
    }
    hochgezaehlt = true;
    const start = performance.now();
    const dauer = 1100;
    const schritt = (jetzt) => {
      const p = Math.min(1, (jetzt - start) / dauer);
      el.textContent = geld(p < 1 ? Math.round(ziel * (1 - Math.pow(1 - p, 3))) : ziel, waehrung);
      if (p < 1) requestAnimationFrame(schritt);
    };
    requestAnimationFrame(schritt);
    // Sicherheitsnetz: steht der Tab im Hintergrund, pausiert die Animation – dann trotzdem den Endwert zeigen
    setTimeout(() => { el.textContent = geld(ziel, waehrung); }, dauer + 200);
  }

  function summeUSD(liste) {
    return liste.reduce((summe, x) => summe + inUSD(betragVon(x), waehrungVon(x)), 0);
  }

  const nachDatum = (a, b) => String(b.datum || "").localeCompare(String(a.datum || ""));

  function daten() {
    const spenden = (DATEN && DATEN.spenden) || [];
    const ausgaben = (DATEN && DATEN.ausgaben) || [];
    if (E.beispieldaten && spenden.length === 0 && ausgaben.length === 0) {
      return { beispiel: true, spenden: BEISPIEL.spenden, ausgaben: BEISPIEL.ausgaben };
    }
    return { beispiel: false, spenden, ausgaben };
  }

  // ---------- Seite aufbauen ----------

  function renderTexte() {
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.dataset.t); });
    document.querySelectorAll("[data-t-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.tAria)); });
    document.querySelectorAll("[data-sprache]").forEach((knopf) => {
      knopf.setAttribute("aria-pressed", String(knopf.dataset.sprache === sprache));
    });
    document.title = t("seitentitel");
    $("jahr").textContent = zahl(new Date().getFullYear(), { useGrouping: false });
  }

  function renderKasse(d) {
    const ein = inUSD(Number(E.anfangsbestand) || 0, HAUPT) + summeUSD(d.spenden);
    const aus = summeUSD(d.ausgaben);
    const rest = ein - aus;

    zeigeBetrag($("verfuegbar"), glatt(ausUSD(rest, HAUPT), HAUPT), HAUPT);
    $("verfuegbar-andere").innerHTML = Object.keys(KURSE)
      .filter((w) => w !== HAUPT)
      .map((w) => "<bdi>≈ " + esc(geld(glatt(ausUSD(rest, w), w), w)) + "</bdi>")
      .join(" ");
    $("summe-spenden").textContent = geld(glatt(ausUSD(ein, HAUPT), HAUPT), HAUPT);
    $("summe-ausgaben").textContent = geld(glatt(ausUSD(aus, HAUPT), HAUPT), HAUPT);

    const anteil = ein > 0 ? Math.min(1, Math.max(0, aus / ein)) : 0;
    $("balken").style.width = (anteil * 100).toFixed(1) + "%";
    $("anteil").textContent = t("ausgegebenAnteil", { p: zahl(anteil, { style: "percent", maximumFractionDigits: 0 }) });

    const letztes = d.spenden.concat(d.ausgaben).map((x) => String(x.datum || "")).filter(Boolean).sort().pop();
    $("stand").textContent = letztes ? t("stand", { d: datumText(letztes) }) : "";

    const kurs = [geld(1, "USD")]
      .concat(Object.keys(KURSE).filter((w) => w !== "USD").map((w) => geld(KURSE[w], w)))
      .join(" = ");
    const kursDatum = datumText(E.kurseStand);
    $("kurs").innerHTML = esc(t("kursHinweis") + (kursDatum ? " (" + kursDatum + ")" : "")) + "<br><bdi>" + esc(kurs) + "</bdi>";
  }

  function renderSpenden(d) {
    const liste = d.spenden.slice().sort(nachDatum);
    const sichtbar = alleSpenden ? liste : liste.slice(0, SPENDEN_SICHTBAR);
    $("spenden-liste").innerHTML = sichtbar.length
      ? sichtbar.map(spendeHtml).join("")
      : '<li class="leer">' + esc(t("keineSpenden")) + "</li>";

    const mehr = $("spenden-mehr");
    mehr.hidden = liste.length <= SPENDEN_SICHTBAR;
    mehr.textContent = alleSpenden ? t("wenigerZeigen") : t("alleSpenden", { n: zahl(liste.length) });
    mehr.setAttribute("aria-expanded", String(alleSpenden));
  }

  function spendeHtml(s) {
    const name = String(s.name || "").trim();
    const anonym = Boolean(s.anonym) || !name;
    const zeichen = anonym ? "♥" : Array.from(name)[0].toUpperCase();
    return '<li class="spende">' +
      '<span class="avatar ' + (anonym ? "avatar-anonym" : "farbe-" + farbeVon(name)) + '" aria-hidden="true">' + esc(zeichen) + "</span>" +
      '<span class="spende-text">' +
        '<span class="spende-zeile">' +
          '<span class="spende-name"><bdi>' + esc(anonym ? t("anonym") : name) + "</bdi></span>" +
          '<bdi class="spende-betrag">' + esc(geld(betragVon(s), waehrungVon(s))) + "</bdi>" +
        "</span>" +
        '<span class="spende-klein">' + esc(datumText(s.datum)) + "</span>" +
        (s.notiz ? '<span class="spende-klein">' + esc(lokal(s.notiz)) + "</span>" : "") +
      "</span>" +
    "</li>";
  }

  function renderAusgaben(d) {
    fotoListen = [];
    const liste = d.ausgaben.slice().sort(nachDatum);
    $("beitraege").innerHTML = liste.length
      ? liste.map(beitragHtml).join("")
      : '<p class="leer">' + esc(t("keineAusgaben")) + "</p>";
  }

  function beitragHtml(a) {
    const titel = lokal(a.titel);
    const bilder = (a.bilder || [])
      .map((b) => (typeof b === "string" ? { src: b } : b))
      .filter((b) => b && b.src)
      .map((b) => ({ src: b.src, text: lokal(b.text) }));
    const nr = fotoListen.push({ bilder, titel }) - 1;
    const betrag = betragVon(a) > 0
      ? '<p class="beitrag-betrag"><span class="betrag-aus">' + esc(t("ausgegebenBetrag")) + " <bdi>" + esc(geld(betragVon(a), waehrungVon(a))) + "</bdi></span></p>"
      : "";
    return '<article class="beitrag">' +
      '<div class="beitrag-inhalt">' +
        '<div class="beitrag-kopf">' +
          '<span class="beitrag-zeichen">' + ICON.logo + "</span>" +
          '<span class="beitrag-wer"><strong>' + esc(t("familie")) + '</strong><span class="beitrag-datum">' + esc(datumText(a.datum)) + "</span></span>" +
        "</div>" +
        "<h3>" + esc(titel) + "</h3>" +
        (a.text ? "<p>" + esc(lokal(a.text)) + "</p>" : "") +
        betrag +
      "</div>" +
      fotosHtml(bilder, nr, titel) +
    "</article>";
  }

  function fotosHtml(bilder, nr, titel) {
    if (!bilder.length) return "";
    const zeigen = bilder.slice(0, 4);
    return '<div class="fotos fotos-' + zeigen.length + '">' +
      zeigen.map((b, i) => {
        const mehr = i === 3 && bilder.length > 4 ? '<span class="foto-mehr">+' + esc(zahl(bilder.length - 4)) + "</span>" : "";
        return '<button type="button" class="foto" data-beitrag="' + nr + '" data-bild="' + i + '" aria-label="' + esc(t("fotoOeffnen") + ": " + (b.text || titel)) + '">' +
          '<img src="' + esc(b.src) + '" alt="" loading="lazy" decoding="async">' + mehr +
        "</button>";
      }).join("") +
    "</div>";
  }

  function renderSpendenWie(beispiel) {
    const konto = E.spendenkonto || {};
    const nummer = String(E.whatsapp || "").replace(/\D/g, "");
    const waLink = nummer
      ? "https://wa.me/" + nummer + "?text=" + encodeURIComponent(t("whatsappNachricht"))
      : beispiel ? "https://wa.me/" : "";
    const hatKonto = Boolean(konto.iban);
    const hatPaypal = Boolean(konto.paypal);
    let html = "";

    if (hatKonto) {
      html += '<dl class="konto">' +
        kontoZeile("inhaber", konto.inhaber, false) +
        kontoZeile("iban", konto.iban, true) +
        kontoZeile("bic", konto.bic, true) +
      "</dl>";
    }
    if (hatPaypal) {
      html += '<a class="knopf knopf-oliv knopf-block" href="' + esc(konto.paypal) + '" target="_blank" rel="noopener">' + ICON.herz + "<span>" + esc(t("paypal")) + "</span></a>";
    }
    if (!hatKonto && !hatPaypal) {
      html += "<p>" + esc(waLink ? t("spendenBald") : t("spendenBaldOhneWhatsapp")) + "</p>";
    } else if (waLink) {
      html += '<p class="mit-abstand">' + esc(t("spendenFrage")) + "</p>";
    }
    if (waLink) {
      html += '<a class="knopf knopf-whatsapp knopf-block" href="' + esc(waLink) + '" target="_blank" rel="noopener">' + ICON.whatsapp + "<span>" + esc(t("whatsappSchreiben")) + "</span></a>";
    }
    $("spenden-wie-inhalt").innerHTML = html;
  }

  function kontoZeile(schluessel, wert, kopierbar) {
    if (!wert) return "";
    // ohne Leerzeichen kopieren – manche Banking-Apps lehnen eine IBAN mit Leerzeichen ab
    const knopf = kopierbar
      ? ' <button type="button" class="knopf knopf-neutral knopf-klein" data-kopieren="' + esc(String(wert).replace(/\s+/g, "")) + '">' + esc(t("kopieren")) + "</button>"
      : "";
    return '<div class="konto-zeile"><dt>' + esc(t(schluessel)) + '</dt><dd><bdi class="konto-wert">' + esc(wert) + "</bdi>" + knopf + "</dd></div>";
  }

  function teilAdresse() {
    let adresse = E.adresse || location.href.split("#")[0].split("?")[0];
    if (sprache !== STANDARD_SPRACHE) adresse += (adresse.includes("?") ? "&" : "?") + "lang=" + sprache;
    return adresse;
  }

  function renderTeilen() {
    const adresse = teilAdresse();
    $("teilen-whatsapp").href = "https://wa.me/?text=" + encodeURIComponent(t("teilNachricht") + "\n" + adresse);
    $("teilen-facebook").href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(adresse);
  }

  function renderAlles() {
    renderTexte();
    const hinweis = $("beispiel-hinweis");
    if (!DATEN) {
      hinweis.textContent = t("datenFehler");
      hinweis.hidden = false;
      return;
    }
    const d = daten();
    hinweis.hidden = !d.beispiel;
    renderKasse(d);
    renderSpenden(d);
    renderAusgaben(d);
    renderSpendenWie(d.beispiel);
    renderTeilen();
  }

  // Titelbild aus daten.js – leer gelassen zeigt die Seite stattdessen gemalte Berge
  function renderTitelbild() {
    const img = $("titelbild");
    if (!img || E.titelbild === undefined) return;
    if (!E.titelbild) img.remove();
    else if (img.getAttribute("src") !== E.titelbild) img.src = E.titelbild;
  }

  // ---------- Sprache ----------

  function startSprache() {
    const ausLink = new URLSearchParams(location.search).get("lang");
    if (SPRACHEN[ausLink]) return ausLink;
    try {
      const gemerkt = localStorage.getItem("qaidy-sprache");
      if (SPRACHEN[gemerkt]) return gemerkt;
    } catch (fehler) { /* z. B. privater Modus */ }
    return STANDARD_SPRACHE;
  }

  function setzeSprache(neu, merken) {
    sprache = SPRACHEN[neu] ? neu : STANDARD_SPRACHE;
    document.documentElement.lang = SPRACHEN[sprache].html;
    document.documentElement.dir = SPRACHEN[sprache].dir;
    if (merken) {
      try { localStorage.setItem("qaidy-sprache", sprache); } catch (fehler) { /* z. B. privater Modus */ }
      try {
        const url = new URL(location.href);
        if (sprache === STANDARD_SPRACHE) url.searchParams.delete("lang");
        else url.searchParams.set("lang", sprache);
        history.replaceState(null, "", url);
      } catch (fehler) { /* z. B. bei geöffneter Datei (file://) */ }
    }
    renderAlles();
  }

  // ---------- Kopieren ----------

  async function kopiere(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (fehler) {
      const feld = document.createElement("textarea");
      feld.value = text;
      feld.setAttribute("readonly", "");
      feld.style.position = "fixed";
      feld.style.opacity = "0";
      document.body.appendChild(feld);
      feld.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (fehler2) { ok = false; }
      feld.remove();
      return ok;
    }
  }

  // ---------- Bildbetrachter ----------

  function oeffneFoto(nr, index) {
    const eintrag = fotoListen[nr];
    if (!eintrag || !eintrag.bilder[index]) return;
    const dialog = $("bildbetrachter");
    if (typeof dialog.showModal !== "function") {
      window.open(eintrag.bilder[index].src, "_blank", "noopener");
      return;
    }
    betrachter = { bilder: eintrag.bilder, titel: eintrag.titel, index };
    zeigeFoto();
    dialog.showModal();
  }

  function zeigeFoto() {
    const bild = betrachter.bilder[betrachter.index];
    const img = $("betrachter-bild");
    img.src = bild.src;
    img.alt = bild.text || betrachter.titel;
    $("betrachter-text").textContent = bild.text ? betrachter.titel + " – " + bild.text : betrachter.titel;
    const mehrere = betrachter.bilder.length > 1;
    $("betrachter-zurueck").hidden = !mehrere;
    $("betrachter-weiter").hidden = !mehrere;
    $("betrachter-zaehler").textContent = mehrere ? zahl(betrachter.index + 1) + " / " + zahl(betrachter.bilder.length) : "";
  }

  function blaettern(schritt) {
    const anzahl = betrachter.bilder.length;
    if (anzahl < 2) return;
    betrachter.index = (betrachter.index + schritt + anzahl) % anzahl;
    zeigeFoto();
  }

  // ---------- Ereignisse ----------

  function bindeEreignisse() {
    document.querySelectorAll("[data-sprache]").forEach((knopf) => {
      knopf.addEventListener("click", () => setzeSprache(knopf.dataset.sprache, true));
    });

    $("spenden-mehr").addEventListener("click", () => {
      alleSpenden = !alleSpenden;
      renderSpenden(daten());
      if (!alleSpenden) $("spenden").scrollIntoView({ block: "start" });
    });

    $("beitraege").addEventListener("click", (ereignis) => {
      const foto = ereignis.target.closest(".foto");
      if (foto) oeffneFoto(Number(foto.dataset.beitrag), Number(foto.dataset.bild));
    });

    $("link-kopieren").addEventListener("click", async () => {
      const status = $("teilen-status");
      status.textContent = (await kopiere(teilAdresse())) ? t("linkKopiert") : teilAdresse();
      setTimeout(() => { status.textContent = ""; }, 4000);
    });

    document.addEventListener("click", async (ereignis) => {
      const knopf = ereignis.target.closest("[data-kopieren]");
      if (!knopf || !(await kopiere(knopf.dataset.kopieren))) return;
      knopf.textContent = t("kopiert");
      setTimeout(() => { knopf.textContent = t("kopieren"); }, 2500);
    });

    const dialog = $("bildbetrachter");
    const rtl = () => SPRACHEN[sprache].dir === "rtl";
    $("betrachter-zu").addEventListener("click", () => dialog.close());
    $("betrachter-zurueck").addEventListener("click", () => blaettern(-1));
    $("betrachter-weiter").addEventListener("click", () => blaettern(1));
    dialog.addEventListener("click", (ereignis) => {
      if (ereignis.target === dialog || ereignis.target.classList.contains("betrachter-flaeche")) dialog.close();
    });
    dialog.addEventListener("keydown", (ereignis) => {
      if (ereignis.key === "ArrowRight") blaettern(rtl() ? -1 : 1);
      if (ereignis.key === "ArrowLeft") blaettern(rtl() ? 1 : -1);
    });

    // Wischen auf dem Handy: in Leserichtung zum nächsten Foto
    let startX = null;
    dialog.addEventListener("touchstart", (ereignis) => { startX = ereignis.touches[0].clientX; }, { passive: true });
    dialog.addEventListener("touchend", (ereignis) => {
      if (startX === null) return;
      const dx = ereignis.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) >= 50) blaettern((dx < 0) !== rtl() ? 1 : -1);
    });
  }

  bindeEreignisse();
  renderTitelbild();
  setzeSprache(startSprache(), false);
})();
