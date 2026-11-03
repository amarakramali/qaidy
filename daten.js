/* =====================================================================
   QAIDY – DATEN DER WEBSEITE
   ---------------------------------------------------------------------
   Nur diese Datei musst du bearbeiten, damit die Seite aktuell bleibt.

   • Neue Spende:   eine Zeile im Bereich "spenden" kopieren und ändern.
   • Neue Ausgabe:  einen Block im Bereich "ausgaben" kopieren und ändern.
   • Fotos:         in den Ordner "bilder" legen und hier mit Namen eintragen.

   Regeln, damit nichts kaputtgeht:
   • Datum immer so:          "2026-11-03"   (Jahr-Monat-Tag)
   • Beträge ohne Punkte:     250000   statt 250.000
   • Kommazahlen mit Punkt:   12.5     statt 12,5
   • Text immer in "Anführungszeichen", nach jedem Eintrag ein Komma.
   • Namen nur zeigen, wenn die Person einverstanden ist –
     sonst  anonym: true  eintragen.
   ===================================================================== */

window.QAIDY_DATEN = {

  einstellungen: {
    // Adresse der Webseite – wird beim Teilen auf WhatsApp/Facebook benutzt.
    adresse: "https://qaidy.de/",

    // Großes Foto ganz oben (wie das Titelbild bei Facebook), aus dem Ordner "bilder".
    // Am besten ein Querformat-Foto. Leer lassen ("") = gemalte Berge statt Foto.
    titelbild: "bilder/karajal.jpg",

    // So viele der größten Spender stehen oben auf der Seite. 0 = ausblenden.
    topSpender: 5,

    // In dieser Währung steht der Kontostand groß oben: "USD", "IQD" oder "EUR".
    hauptwaehrung: "USD",

    // Wechselkurse: So viel ist 1 US-Dollar wert.
    // Ab und zu anpassen und das Datum darunter ändern.
    kurse: {
      USD: 1,
      IQD: 1310,
      EUR: 0.86
    },
    kurseStand: "2026-11-03",

    // Geld, das schon da war, bevor es die Webseite gab (in der Hauptwährung).
    anfangsbestand: 0,

    // WhatsApp-Nummer für Fragen: mit Ländervorwahl, ohne + und ohne Leerzeichen,
    // z. B. "4917612345678". Leer lassen = kein WhatsApp-Knopf.
    whatsapp: "",

    // Spendenkonto – leer lassen, solange es noch keins gibt.
    spendenkonto: {
      inhaber: "",
      iban: "",
      bic: "",
      paypal: ""        // z. B. "https://paypal.me/deinname"
    },

    // true = Vorschau mit Beispieldaten, solange unten noch nichts eingetragen ist.
    // Sobald die erste echte Spende oder Ausgabe drinsteht, verschwinden die Beispiele.
    beispieldaten: true
  },

  // -------------------------------------------------------------------
  // SPENDEN – Reihenfolge egal, die Seite sortiert nach Datum.
  // waehrung: "USD", "IQD" oder "EUR"
  // -------------------------------------------------------------------
  spenden: [
    // { datum: "2026-11-01", name: "أحمد", betrag: 100, waehrung: "USD" },
    // { datum: "2026-11-02", anonym: true, betrag: 50000, waehrung: "IQD" },
    // { datum: "2026-11-03", name: "Layla", betrag: 50, waehrung: "EUR", notiz: "Für den Weg" },
  ],

  // -------------------------------------------------------------------
  // AUSGABEN – wofür das Geld verwendet wurde, am besten mit Fotos.
  // Text in einer Sprache:       titel: "Weg repariert"
  // oder in mehreren Sprachen:   titel: { ar: "...", de: "...", ku: "...", en: "..." }
  // -------------------------------------------------------------------
  ausgaben: [
    // {
    //   datum: "2026-10-20",
    //   titel: { ar: "تصليح الطريق إلى الجبل", de: "Weg zum Karajal-Berg ausgebessert" },
    //   text: { ar: "اشترينا الحصى والإسمنت.", de: "Schotter und Zement gekauft." },
    //   betrag: 300,
    //   waehrung: "USD",
    //   bilder: ["bilder/weg-vorher.jpg", "bilder/weg-nachher.jpg"]
    // },
  ]
};
