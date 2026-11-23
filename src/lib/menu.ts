// Speisekarte Rạng Đông — 1:1 aus RangDong-Speisekarte.pdf (45 Seiten), Stand der PDF.
// Preise + Allergen-Codes wie in der PDF. KEINE erfundenen Werte: fehlt etwas in der PDF, fehlt es auch hier.
// Die PDF enthält keine Allergen-Legende (nur Kennbuchstaben/-zahlen). Bei Món Đặc Biệt (Nr. 40–44) steht kein Preis in der PDF.
export type GroupId = "vor" | "haupt" | "sushi" | "drinks" | "vn" | "fest";

export interface Opt { k: string; de: string; en?: string; a?: string; price: string }
export interface Item {
  id: string;
  n?: string;            // Nummer laut PDF
  name: string;
  de?: string;           // Beschreibung DE
  en?: string;           // Beschreibung EN
  vi?: string;           // Beschreibung VI (nur vietnamesische Seiten)
  a?: string;            // Allergen-Codes wie in der PDF
  price?: string;        // einzelner Preis / Preisreihe wie in der PDF
  prices?: [string, string][]; // [Einheit, Preis] z. B. ["4 Stk.", "6.50 €"]
  opts?: Opt[];          // Auswahl A/B/C mit eigenem Preis
  sub?: string;          // Zwischenüberschrift, beginnt vor diesem Gericht
  note?: string;         // z. B. "heiß / kalt"
  veg?: boolean;         // grüne Schrift in der PDF = vegetarisch
  hot?: boolean;         // rote Schrift in der PDF = scharf
}
export interface Section {
  id: string;
  de: string; vi: string;
  kicker?: string;       // Untertitel laut PDF
  img: string;
  choices?: Opt[];       // "Wählbar mit" für mehrere Gerichte
  unit?: string;         // Einheit-Hinweis (z. B. "6 Stk.")
  items: Item[];
}
export interface Group { id: GroupId; roman: string; de: string; vi: string; short: string; shortVi: string; secs: Section[] }

const img = (n: number) => `/img/food/p${String(n).padStart(2, "0")}.webp`;
// Überschriften der PDF stehen in Großbuchstaben -> Titel-Schreibweise
export const tc = (s: string) =>
  s.toLowerCase().replace(/(^|[\s\-–(/.])(\p{L})/gu, (_m, a: string, b: string) => a + b.toUpperCase()).replace(/\bI\.o\./g, "I.O.");
const o = (k: string, de: string, en: string | undefined, price: string, a?: string): Opt => ({ k, de, en, price, a });
const it = (n: string | undefined, name: string, x: Partial<Item> = {}): Item => ({ id: "", n, name: tc(name), ...x });
const sec = (s: Omit<Section, "id" | "items"> & { id: string; items: Item[] }): Section => {
  s.items.forEach((x, i) => { x.id = `${s.id}-${i}`; });
  return s;
};

const WOK: Opt[] = [
  o("A", "Tofu", "Tofu", "10.90 €", "M"), o("B", "Hühnerfleisch", "Chicken meat", "12.90 €"), o("C", "Rindfleisch", "Beef", "13.90 €"),
  o("D", "Kross Ente", "Crispy duck", "13.90 €", "D"), o("E", "Garnelen", "Shrimp", "14.90 €", "E"), o("G", "Gebackenes Hühnerfleisch", "Baked chicken", "13.50 €", "D"),
];
const SAUCE: Opt[] = [
  o("A", "Tofu", "Tofu", "10.90 €", "M"), o("B", "Hühnerfleisch", "Chicken meat", "12.90 €"), o("C", "Rinderhüftsteak", "Beef rump steak", "13.90 €"),
  o("D", "Kross Ente", "Crispy duck", "13.90 €", "D"), o("E", "Garnelen", "Shrimp", "14.90 €", "E"), o("F", "Gegrillter Lachs", "Grilled salmon", "14.90 €", "C"),
  o("G", "Gebackenes Hühnerfleisch", "Baked chicken", "13.50 €", "D"),
];
const NOODLE_NOTE = "A,B,C,D";

export const GROUPS: Group[] = [
  {
    id: "vor", roman: "I", de: "Vorspeisen", vi: "Khai vị", short: "Vorspeisen", shortVi: "Khai vị",
    secs: [
      sec({
        id: "starter", de: "Starter", vi: "Khai vị", kicker: "STARTER", img: img(1),
        items: [
          it("1", "SOMMERROLLEN", { a: "C", de: "Reispapier umwickelt mit Reisnudeln, frischem Salat, serviert mit Limettendressing.", en: "Rice paper wrapped with rice noodles, fresh salad, served with lime dressing.", opts: [o("A", "Tofu", "Tofu", "4.20 €", "M"), o("B", "Hühnerfleisch", "Chicken meat", "4.50 €"), o("C", "Garnelen", "Shrimp", "4.90 €", "E")] }),
          it("2", "FRÜHLINGSROLLEN", { a: "C,E", price: "4.90 €", de: "Vietnamesische Frühlingsrollen mit Hühnerfleisch, Glasnudeln und Gemüse, serviert mit Wildkräutersalat und Limettendressing.", en: "Vietnamese spring rolls with chicken, glass noodles and vegetables, served with wild herb salad and lime dressing." }),
          it("3", "MINI-FRÜHLINGSROLLEN 6 STK.", { a: "D", price: "4.50 €" }),
          it("4", "GYOZA", { a: "D,M", de: "Gebackene Teigtaschen, serviert mit Sojasauce.", en: "Baked dumplings, served with soy sauce.", opts: [o("A", "Vegane Füllung", "Vegan filling", "4.50 €"), o("B", "Hühnerfleischfüllung", "Chicken filling", "4.90 €")] }),
          it("5", "SATE GA 2 STK.", { a: "B", price: "4.90 €", de: "Hausgemachte gegrillte Hühnerspieße, dazu Salat und Erdnusssauce.", en: "Homemade grilled chicken skewers, served with salad and peanut sauce." }),
          it("6", "TOM CHIEN XU (3 STK.)", { a: "E", price: "5.50 €", de: "Frittierte Garnelen mit Salat und Süß-Sauer-Sauce.", en: "Fried shrimp with salad and sweet and sour sauce." }),
        ],
      }),
      sec({
        id: "suppen", de: "Suppen", vi: "Súp", kicker: "VORSPEISEN & SUPPEN / STARTERS & SOUPS", img: img(2),
        items: [
          it("8", "GEBACKENE WANTAN", { a: "D,E", price: "4.90 €", de: "Gebackener Wantanteig gefüllt mit gehacktem Hühnerfleisch und Garnelen & Süß-Sauer-Sauce.", en: "Baked wonton pastry filled with minced chicken, shrimp, and sweet and sour sauce." }),
          it("9", "EDAMAME", { veg: true, a: "M", price: "4.90 €", de: "Gedämpfte Baby-Sojabohnen mit Salz.", en: "Steamed baby soybeans with salt." }),
          it("10", "KOKOS SUPPE", { a: "G", de: "Cremige Kokosmilchsuppe mit Gemüse, Cherrytomaten, Champignons und Koriander", en: "Creamy coconut milk soup with vegetables, cherry tomatoes, mushrooms, and cilantro", opts: [o("A", "Tofu", "Tofu", "4.50 €", "M"), o("B", "Hühnerfleisch", "Chicken meat", "4.50 €"), o("C", "Garnelen", "Shrimp", "4.90 €", "E")] }),
          it("11", "WANTAN SUPPE", { a: "D", price: "4.90 €", de: "Gefüllt mit gehacktem Hühnerfleisch, verschiedenem Gemüse und Koriander.", en: "Filled with minced chicken, various vegetables, and cilantro." }),
          it("12", "MISO SUPPE", { de: "Traditionelle japanische Suppe aus Miso, Fisch und Wakame.", en: "Traditional Japanese soup made with miso, fish, and wakame.", opts: [o("A", "Tofu", "Tofu", "4.50 €", "M"), o("B", "Lachs", "Salmon", "4.90 €", "C")] }),
        ],
      }),
      sec({
        id: "salate", de: "Salate", vi: "Salad", kicker: "SALAD", img: img(3),
        items: [
          it("13", "WAKAME SALAT", { veg: true, a: "L", price: "4.90 €", de: "Seetangsalat mit Sesam.", en: "Seaweed salad with sesame." }),
          it("14", "MANGOSALAT", { a: "E", de: "Mangostreifen mit Limetten und Schalotten, serviert mit hausgemachter Sauce.", en: "Mango strips with lime and shallots, served with homemade sauce.", opts: [o("A", "Tofu", "Tofu", "4.90 €", "M"), o("B", "Hühnerfleisch", "Chicken meat", "4.90 €"), o("C", "Garnelen", "Shrimp", "5.90 €", "E")] }),
        ],
      }),
    ],
  },
  {
    id: "haupt", roman: "II", de: "Hauptgerichte", vi: "Món chính", short: "Hauptgerichte", shortVi: "Món chính",
    secs: [
      sec({
        id: "wok", de: "Wokgerichte", vi: "Món xào Wok", kicker: "HAUPTSPEISEN / MAIN COURSES - WOK DISHES", img: img(4), choices: WOK,
        items: [
          it("20", "PHO XAO", { a: NOODLE_NOTE, de: "Gebratene Reisbandnudeln mit frischem Gemüse, Lauchzwiebeln, Sojasprossen, Röstzwiebeln, Erdnüssen, Sesam und Salat, serviert mit einer herzhaften dunklen Soße.", en: "Fried rice noodles with fresh vegetables, spring onions, bean sprouts, crispy onions, peanuts, sesame seeds, and salad, served with a hearty dark sauce." }),
          it("21", "YAKI UDON", { a: NOODLE_NOTE, de: "Gebratene Udon-Nudeln mit frischem Gemüse, Lauchzwiebeln, Sojasprossen, Röstzwiebeln, Erdnüssen, Sesam und Salat, serviert mit einer herzhaften dunklen Soße.", en: "Fried udon noodles with fresh vegetables, spring onions, bean sprouts, crispy onions, peanuts, sesame seeds, and salad, served with a hearty dark sauce." }),
          it("22", "MY XAO", { a: NOODLE_NOTE, de: "Gebratene Nudeln mit saisonalem Gemüse, Ei, Röstzwiebeln und Erdnüssen.", en: "Fried noodles with seasonal vegetables, eggs, fried onions, and peanuts." }),
          it("23", "MIEN XAO", { a: NOODLE_NOTE, de: "Gebratene Glasnudeln mit Gemüse und Röstzwiebeln.", en: "Fried glass noodles with vegetables and fried onions." }),
          it("24", "COM RANG", { a: NOODLE_NOTE, de: "Gebratener Eierreis mit saisonalem Gemüse, Ei, Röstzwiebeln und Erdnüssen.", en: "Egg-fried rice with seasonal vegetables, eggs, fried onions, and peanuts." }),
        ],
      }),
      sec({
        id: "vnspez", de: "Vietnam Spezialitäten", vi: "Đặc sản Việt Nam", kicker: "MAIN COURSES - VIETNAM SPECIALTIES", img: img(5),
        items: [
          it("25", "PHO HA NOI", { a: "C", de: "Traditionelle Reisbandnudelsuppe aus klarer Brühe, verfeinert mit Zimt, Kardamom, Sternanis, Ingwer, asiatischen Kräutern und Lauchzwiebeln.", en: "Traditional flat rice noodle soup made with a clear broth, flavored with cinnamon, cardamom, star anise, ginger, Asian herbs, and leeks.", opts: [o("A", "Tofu", "Tofu", "10.90 €", "M"), o("B", "Hühnerfleisch", "Chicken meat", "11.90 €"), o("C", "Rindfleisch", "Beef", "12.90 €"), o("D", "Rindfleisch & Hühnerfleisch", "Beef & chicken", "12.90 €")] }),
          it("26", "BUN NAM BO", { a: "E", de: "Reisnudeln mit Sojasprossen-Salat, Erdnüssen, Röstzwiebeln und vietnamesischen Kräutern in hausgemachter Soße.", en: "Rice noodles with bean sprout salad, peanuts, fried onions, and Vietnamese herbs in a homemade sauce.", opts: [o("A", "Tofu – Bun Dau", "Tofu", "10.90 €", "M"), o("B", "Gegrilltes Hühnerfleisch – Bun Ga Nuong", "Grilled chicken", "12.90 €"), o("C", "Rindfleisch – Bun Bo Nam Bo", "Beef", "12.90 €")] }),
          it("27", "BUN NEM HA NOI", { a: "D", de: "Reisnudeln mit knusprigen Frühlingsrollen, gerösteten Zwiebeln, Erdnüssen und Salat, dazu hausgemachte Sauce.", en: "Rice noodles with crispy spring rolls, roasted onions, peanuts, and lettuce, served with house sauce.", opts: [o("A", "Vegane Füllung – Bun Nem Chay", "Vegan filling", "10.90 €", "M"), o("B", "Füllung mit Fleisch", "Meat filling", "12.90 €")] }),
          it("28", "BUN CHA NUONG", { a: "C,L", price: "13.50 €", de: "Gegrilltes Schweinefleisch, serviert mit Salat, asiatischen Kräutern, hausgemachter Soße und Reisnudeln.", en: "Grilled pork served with salad, Asian herbs, homemade sauce, and rice noodles." }),
        ],
      }),
      sec({
        id: "sauce", de: "Saucengerichte", vi: "Món sốt", kicker: "MAIN COURSES - SAUCE DISHES", img: img(6), choices: SAUCE,
        items: [
          it("30", "KOKOS-CURRY", { a: "G,B,L", de: "Cremige Kokos-Curry-Sauce mit marktfrischem Gemüse, Kürbis, Erdnüssen und Sesamreis.", en: "Creamy coconut curry sauce with market-fresh vegetables, pumpkin, peanuts, and sesame rice." }),
          it("31", "MANGOSAUCE", { a: "G,B,L", de: "Mangosauce mit marktfrischem Gemüse, gerösteten Erdnüssen und Sesamreis.", en: "Mango sauce with market-fresh vegetables, pineapple, pumpkin, roasted peanuts, and sesame rice." }),
          it("32", "ERDNUSSSAUCE", { a: "G,B,L", de: "Cremige Erdnusssauce mit marktfrischem Gemüse, Erdnüssen und Sesamreis.", en: "Creamy peanut sauce with market-fresh vegetables, peanuts, and sesame rice." }),
          it("33", "CHOP SUEY", { hot: true, a: "L,C", de: "Dunkle Sauce mit marktfrischem Gemüse, Knoblauch, Chili und Sesamreis.", en: "Dark sauce with market-fresh vegetables, garlic, chili, and sesame rice." }),
          it("34", "SÜSS-SAUER-SAUCE", { de: "Süß-saure Sauce mit Gemüse, Ananas und Sesamreis.", en: "Sweet and sour sauce with vegetables, pineapple, and sesame rice." }),
        ],
      }),
      sec({
        id: "veg", de: "Vegetarisch", vi: "Món chay", kicker: "VEGETARISCHE HAUPTGERICHTE / VEGETARIAN MAIN COURSES", img: img(7),
        items: [
          it("36", "SEITAN NUONG – SEITANSPIESSE", { veg: true, a: "D,B,C,L,M", price: "13.90 €", de: "Gegrillte Seitanspieße aus zartem Weizenfleisch mit Gemüse, serviert mit cremiger Erdnuss-Kokosmilch-Sauce, Röstzwiebeln, gerösteten Erdnüssen, Sesam, dazu Jasminreis und frischem Salat.", en: "Grilled seitan skewers made from tender wheat meat with vegetables, served with a creamy peanut and coconut milk sauce, fried onions, roasted peanuts, sesame seeds, jasmine rice, and fresh salad." }),
          it("37", "VEGAN SESAM ENTE", { veg: true, a: "D,B,C,L,M", price: "13.90 €", de: "Knusprige vegane „Ente“ aus Seitan mit frischem Gemüse, serviert mit Sojasoße, Röstzwiebeln, gerösteten Erdnüssen, Sesam, dazu Jasminreis und Salat.", en: "Crispy vegan seitan \"duck\" with fresh vegetables, served with soy sauce, fried onions, roasted peanuts, sesame seeds, jasmine rice, and salad." }),
          it("38", "VEGAN CHICKEN", { veg: true, a: "B,D,M", price: "13.90 €", de: "Gebackenes veganes „Hühnerfleisch“ mit frischem Gemüse, serviert mit Jasminreis, Röstzwiebeln, gerösteten Erdnüssen, Sesam, Salat, Koriander und Fischsoße.", en: "Baked vegan \"chicken\" with fresh vegetables, served with jasmine rice, fried onions, roasted peanuts, sesame seeds, lettuce, cilantro, and fish sauce." }),
        ],
      }),
      sec({
        id: "dacbiet", de: "Special Dishes", vi: "Món Đặc Biệt", kicker: "VIETNAMESE SPECIALS", img: img(24),
        items: [
          it("40", "SHAKING BEEF (200G)", { price: "21.90 €", de: "Schwarze Soße. Serviert mit gemischtem Gemüse: Brokkoli, Blumenkohl, Karotten, Spargel, Kohl – dazu Reis.", en: "Black sauce. Served with mixed vegetables: broccoli, cauliflower, carrot, asparagus, cabbage – with rice." }),
          it("41", "GRILLED BEEF", { price: "21.90 €", de: "Hausgemachte Soße. Serviert mit gemischtem Gemüse: Brokkoli, Blumenkohl, Karotten, Spargel, gegrilltem Kohl – dazu Süßkartoffel.", en: "House sauce. Served with mixed vegetables: broccoli, cauliflower, carrot, asparagus, grilled cabbage – with sweet potato." }),
          // PDF 18.11 zeigt bei Teriyaki B „121.90 €" (offensichtlicher Tippfehler, alle Geschwister 21.90) -> hier 21.90, im Bericht an den Chef gemeldet.
          it("42", "TERIYAKI SAUCE", { de: "Mit Sake und Ingwer. Serviert mit Reis.", en: "With sake and ginger. Served with rice.", opts: [o("A", "Lachs", "Salmon", "21.90 €", "C"), o("B", "Rind (200g)", "Beef (200g)", "21.90 €")] }),
          it("43", "DUCKY DUCK", { hot: true, de: "Knoblauch-Chili-Soße. Serviert mit gemischtem Gemüse: Brokkoli, Blumenkohl, Karotten, Spargel, Kohl – dazu Reis.", en: "Garlic and chili sauce. Served with mixed vegetables: broccoli, cauliflower, carrot, asparagus, cabbage – with rice.", opts: [o("A", "Gegrillt", "Grilled", "21.90 €"), o("B", "Pfannengerührt", "Wok-tossed", "21.90 €")] }),
          it("44", "SPECIAL BLACK SAUCE", { hot: true, price: "21.90 €", de: "Zitronengras, Chili, Knoblauch, Sesamöl. 2 Garnelen, Fisch, 2 Jakobsmuscheln – dazu Reis.", en: "Lemongrass, chili, garlic, sesame oil. 2 prawns, fish, 2 scallops – with rice." }),
        ],
      }),
      sec({
        id: "dessert", de: "Dessert", vi: "Tráng miệng", kicker: "DESSERT", img: img(8),
        items: [
          it("50", "BANH CHUOI", { a: "G,B", price: "5.50 €", de: "Bananenkuchen auf Klebreis, verfeinert mit Kokoscreme, frischer Mango und gerösteten Erdnüssen.", en: "Banana cake on sticky rice, refined with coconut cream, fresh mango, and roasted peanuts." }),
          it("51", "CHUOI CHIEN", { a: "D", price: "4.50 €", de: "Gebackene Bananen mit Honig.", en: "Baked bananas with honey." }),
          it("52", "DUA CHIEN", { a: "D", price: "4.50 €", de: "Gebackene Ananas mit Honig.", en: "Baked pineapple with honey." }),
          it("53", "MOCHI (3 STK.)", { price: "5.20 €", de: "3 verschiedene Geschmacksrichtungen.", en: "3 different flavors." }),
          it("54", "KLEBREISKUGELN", { price: "5.50 €", de: "Gebackene Klebreiskugeln gefüllt mit süßen Bohnen und Honig.", en: "Baked sticky rice balls filled with sweet beans and honey." }),
        ],
      }),
      sec({
        id: "kids", de: "Kid's Menü & Extras", vi: "Trẻ em & Extra", kicker: "KID'S MENÜ / EXTRAS", img: img(9),
        items: [
          it("60", "KLEINE PHO SUPPE", { sub: "KID'S MENÜ", a: "C", price: "7.00 €" }),
          it("61", "MAMA'S SON", { a: "D,A", price: "7.00 €", de: "Chicken und Süßkartoffelpommes mit Unagi-Sauce.", en: "Chicken and sweet potato fries with unagi sauce." }),
          it("62", "PAPA'S DAUGHTER", { a: "E,D", price: "5.90 €", de: "Garnelen Tempura und Reis mit Unagi-Sauce.", en: "Shrimp tempura and rice with unagi sauce." }),
          it("65", "SAUCE NACH AUSWAHL", { sub: "EXTRAS", price: "2.50 €" }),
          it("66", "CURRY SAUCE", { a: "G", price: "4.50 €" }),
          it("67", "REIS, NUDELN", { price: "2.50 €" }),
          it("68", "SÜSSKARTOFFELPOMMES", { veg: true, a: "A", price: "4.90 €", de: "Mit Ketchup & Mayonnaise.", en: "With ketchup & mayonnaise." }),
        ],
      }),
    ],
  },
  {
    id: "sushi", roman: "III", de: "Sushi", vi: "Sushi", short: "Sushi", shortVi: "Sushi",
    secs: [
      sec({
        id: "io", de: "Inside Out Rolls", vi: "Inside Out Rolls", kicker: "INSIDE OUT ROLL 8 STK.", unit: "8 Stk.", img: img(11),
        items: [
          it("U22", "SAKE I.O.", { a: "C,L,A", price: "8.50 €", de: "Lachs, Avocado, Sesam, Mayonnaise, Tobiko", en: "Salmon, avocado, sesame, mayonnaise, tobiko" }),
          it("U23", "PHILADELPHIA I.O.", { a: "L,G", price: "9.00 €", de: "Lachs, Avocado, Gurke, Frischkäse, Sesam, Tobiko", en: "Salmon, avocado, cucumber, cream cheese, sesame, tobiko" }),
          it("U24", "MAGURO I.O.", { a: "C,L,A", price: "9.90 €", de: "Thunfisch, Gurke, Sesam, Tobiko", en: "Tuna, cucumber, sesame, tobiko" }),
          it("U25", "EBI I.O.", { a: "C,L,A,E", price: "8.50 €", de: "Garnele, Avocado, Mayonnaise, Sesam, Tobiko", en: "Shrimp, avocado, mayonnaise, sesame, tobiko" }),
          it("U26", "EBI TEMPURA I.O.", { price: "9.90 €", de: "Ebi-Tempura, Avocado, Gurke, Frischkäse, Sesam, Tobiko", en: "Shrimp tempura, avocado, cucumber, cream cheese, sesame, tobiko" }),
          it("U27", "CALIFORNIA I.O.", { a: "C,L,A,E,D", price: "7.90 €", de: "Surimi, Avocado, Mayonnaise, Sesam, Tobiko", en: "Surimi, avocado, mayonnaise, sesame, tobiko" }),
          it("U28", "CHICKEN I.O.", { a: "D,L,G", price: "7.90 €", de: "Chicken-Tempura, Gurke, Frischkäse, Sesam, Unagisoße", en: "Chicken tempura, cucumber, cream cheese, sesame, unagi sauce" }),
          it("U29", "VEGGIE I.O.", { veg: true, a: "L", price: "7.50 €", de: "Avocado, Gurke, Mango, Oshinko, Sesam", en: "Avocado, cucumber, mango, oshinko, sesame" }),
        ],
      }),
      sec({
        id: "nigiri", de: "Nigiri", vi: "Nigiri", kicker: "NIGIRI 2 STK.", unit: "2 Stk.", img: img(10),
        items: [
          it("N1", "SAKE NIGIRI", { a: "C", price: "4.50 €", de: "Lachs", en: "Salmon" }),
          it("N2", "TUNA NIGIRI", { a: "C", price: "5.00 €", de: "Thunfisch", en: "Tuna" }),
          it("N3", "BUTTERFISCH NIGIRI", { a: "D", price: "4.50 €", de: "Butterfisch", en: "Butterfish" }),
          it("N4", "EBI NIGIRI", { a: "E", price: "4.50 €", de: "Garnelen", en: "Shrimp" }),
          it("N5", "UNAGI NIGIRI", { a: "N", price: "5.00 €", de: "Aal", en: "Eel" }),
          it("N6", "KANI NIGIRI", { a: "E,D", price: "4.00 €", de: "Surimi", en: "Surimi" }),
          it("N7", "AVOCADO NIGIRI", { veg: true, price: "4.00 €", de: "Avocado", en: "Avocado" }),
          it("N8", "INARI NIGIRI", { veg: true, a: "M", price: "4.00 €", de: "Tofutasche", en: "Tofu pocket" }),
          it("N9", "LACHS SPARGEL NIGIRI", { a: "C", price: "5.90 €" }),
          it("N10", "UNAGI SPARGEL NIGIRI", { a: "N", price: "5.90 €" }),
        ],
      }),
      sec({
        id: "maki", de: "Maki", vi: "Maki", kicker: "MAKI 6 STK.", unit: "6 Stk.", img: img(11),
        items: [
          it("M11", "SAKE MAKI", { a: "C", price: "4.50 €", de: "Lachs", en: "Salmon" }),
          it("M12", "SAKE AVOCADO MAKI", { a: "C", price: "5.00 €", de: "Lachs, Avocado", en: "Salmon, avocado" }),
          it("M13", "TEKKA MAKI", { a: "C", price: "5.00 €", de: "Thunfisch", en: "Tuna" }),
          it("M14", "EBI MAKI", { a: "E", price: "4.50 €", de: "Garnelen", en: "Shrimp" }),
          it("M15", "EBI AVOCADO MAKI", { a: "E", price: "5.00 €", de: "Garnele, Avocado", en: "Shrimp, avocado" }),
          it("M16", "UNAGI MAKI", { a: "L,N", price: "5.00 €", de: "Aal, Sesam, Unagisoße", en: "Eel, sesame, unagi sauce" }),
          it("M17", "CALIFORNIA MAKI", { a: "E,D", price: "4.50 €", de: "Surimi, Avocado" }),
          it("M18", "BUTTERFISCH MAKI", { hot: true, a: "C", price: "4.50 €", de: "Butterfisch, Lauchzwiebeln, Chilisoße", en: "Butterfish, spring onions, chili sauce" }),
          it("M19", "AVOCADO MAKI", { veg: true, price: "4.00 €", de: "Avocado", en: "Avocado" }),
          it("M20", "KAPPA MAKI", { veg: true, price: "4.00 €", de: "Gurke", en: "Cucumber" }),
          it("M21", "OSHINKO MAKI", { veg: true, price: "4.00 €" }),
        ],
      }),
      sec({
        id: "special", de: "Special Rolls", vi: "Special Rolls", kicker: "SPECIAL ROLL 4 STK. / 8 STK.", unit: "4 Stk. / 8 Stk.", img: img(13),
        items: [
          it("SP31", "RED DRAGON", { a: "A,C*,D,F*,G,J*,K", prices: [["4 Stk.", "6.50 €"], ["8 Stk.", "11.90 €"]], de: "In: Lachs, Avocado, Frischkäse · Out: flambierter Lachs, Sesam, Tobiko, Cocktail- und Unagisoße", en: "In: salmon, avocado, cream cheese · Out: seared salmon, sesame, tobiko, cocktail and unagi sauce" }),
          it("SP32", "RANG DONG DRAGON", { a: "A,C*,D,F*,G,J*,K", prices: [["4 Stk.", "6.50 €"], ["8 Stk.", "11.90 €"]], de: "In: Surimi, Avocado, Frischkäse · Out: flambierter Lachs, Sesam, Tobiko, Cocktail- und Unagisoße", en: "In: surimi, avocado, cream cheese · Out: seared salmon, sesame, tobiko, cocktail and unagi sauce" }),
          it("SP33", "SEA DRAGON", { a: "A,C*,D,F*,G,J*,K", prices: [["4 Stk.", "6.90 €"], ["8 Stk.", "12.90 €"]], de: "In: Avocado-Tempura, Gurke, Frischkäse · Out: flambierter Thunfisch, Sesam, Tobiko, Cocktail- und Unagisoße", en: "In: avocado tempura, cucumber, cream cheese · Out: seared tuna, sesame, tobiko, cocktail and unagi sauce" }),
          it("SP34", "GREEN DRAGON", { a: "A,B,C*,D,F*,G,J*,K", prices: [["4 Stk.", "6.50 €"], ["8 Stk.", "11.90 €"]], de: "In: Ebi-Tempura, Gurke, Frischkäse · Out: Avocado, Sesam, Tobiko, Cocktail- und Unagisoße", en: "In: shrimp tempura, cucumber, cream cheese · Out: avocado, sesame, tobiko, cocktail and unagi sauce" }),
          it("SP35", "VIET DRAGON", { a: "A,B,C*,D,F*,G,J*,K", prices: [["4 Stk.", "6.90 €"], ["8 Stk.", "12.90 €"]], de: "In: Ebi-Tempura, Gurke, Frischkäse · Out: Ebi, Tobiko, Sesam, Cocktail- und Unagisoße", en: "In: shrimp tempura, cucumber, cream cheese · Out: shrimp, tobiko, sesame, cocktail and unagi sauce" }),
          it("SP36", "WHITE DRAGON", { a: "A,B,C*,D,F*,G,J*,K", prices: [["4 Stk.", "6.50 €"], ["8 Stk.", "11.90 €"]], de: "In: Ebi-Tempura, Avocado, Frischkäse · Out: flambierter Butterfisch, Cocktail- und Unagisoße, Sesam, Tobiko", en: "In: shrimp tempura, avocado, cream cheese · Out: seared butterfish, cocktail and unagi sauce, sesame, tobiko" }),
          it("SP37", "BLACK DRAGON", { a: "A,D,F*,G,K", prices: [["4 Stk.", "6.90 €"], ["8 Stk.", "12.90 €"]], de: "In: Spargel, Gurke, Frischkäse · Out: Unagi, Sesam, Unagisoße", en: "In: asparagus, cucumber, cream cheese · Out: unagi, sesame, unagi sauce" }),
          it("SP38", "VEGGIE SPECIAL ROLL", { veg: true, a: "F*,G,K", prices: [["4 Stk.", "6.00 €"], ["8 Stk.", "10.90 €"]], de: "In: Spargel, Gurke, Frischkäse · Out: Avocado, Teriyakisoße, Sesam", en: "In: asparagus, cucumber, cream cheese · Out: avocado, teriyaki sauce, sesame" }),
          it("SP39", "TOWADO VEGGIE", { veg: true, a: "F,G", prices: [["4 Stk.", "6.00 €"], ["8 Stk.", "10.90 €"]], de: "In: Spargel, Gurke, Frischkäse · Out: japanischer Tofu", en: "In: asparagus, cucumber, cream cheese · Out: Japanese tofu" }),
        ],
      }),
      sec({
        id: "sashimi", de: "Sashimi", vi: "Sashimi", kicker: "SASHIMI", img: img(12),
        items: [
          it("S1", "SALMON SASHIMI (6 STK.)", { a: "C,L", price: "12.90 €", de: "Lachsscheiben auf Seetangsalat und Lachskaviar.", en: "Salmon slices on seaweed salad and salmon caviar." }),
          it("S2", "TUNA SASHIMI (6 STK.)", { a: "C,L", price: "13.90 €", de: "Thunfischscheiben auf Seetangsalat und Lachskaviar.", en: "Tuna slices on seaweed salad and salmon caviar." }),
          it("S3", "TUNA & SALMON SASHIMI (6 STK.)", { a: "C,L", price: "13.50 €", de: "3 Lachs, 3 Thunfisch auf Seetangsalat und Lachskaviar.", en: "3 salmon, 3 tuna on seaweed salad and salmon caviar." }),
          it("S4", "MORIAWASE SASHIMI (9 STK.)", { a: "C,L", price: "16.90 €" }),
        ],
      }),
      sec({
        id: "mini", de: "Mini Tempura Roll", vi: "Mini Tempura Roll", kicker: "MINI TEMPURA ROLL 8 STK.", unit: "8 Stk.", img: img(13),
        items: [
          it("T40", "MINI SALMON CRUNCHY ROLL", { a: "C,L,G", price: "6.50 €", de: "Lachs, Frischkäse, Sesam, Cocktail- und Unagisoße.", en: "Salmon, cream cheese, sesame, cocktail and unagi sauce." }),
          it("T41", "MINI TUNA CRUNCHY ROLL", { a: "C,L,G", price: "6.50 €", de: "Thunfisch, Lauch, Frischkäse, Sesam, Cocktail- und Unagisoße.", en: "Tuna, leek, cream cheese, sesame, cocktail and unagi sauce." }),
          it("T42", "MINI CHICKEN CRUNCHY ROLL", { a: "C,G", price: "6.50 €", de: "Hähnchen, Gurke, Frischkäse, Cocktail- und Unagisoße.", en: "Chicken, cucumber, cream cheese, cocktail and unagi sauce." }),
          it("T43", "MINI EBI CRUNCHY ROLL", { a: "E,G", price: "6.50 €", de: "Garnele, Avocado, Frischkäse, Cocktail- und Unagisoße.", en: "Shrimp, avocado, cream cheese, cocktail and unagi sauce." }),
          it("T44", "MINI AVO CRUNCHY ROLL", { veg: true, price: "6.00 €", de: "Avocado, Frischkäse, Cocktailsoße, Sesam, Unagisoße.", en: "Avocado, cream cheese, cocktail sauce, sesame, unagi sauce." }),
        ],
      }),
      sec({
        id: "big", de: "Big Tempura Roll", vi: "Big Tempura Roll", kicker: "BIG TEMPURA ROLL 6 STK.", unit: "6 Stk.", img: img(13),
        items: [
          it("T45", "BIG SALMON CRUNCHY ROLL", { a: "C,N,G", price: "9.90 €", de: "Lachs, Avocado, Aal, Frischkäse, Cocktail- und Unagisoße.", en: "Salmon, avocado, eel, cream cheese, cocktail and unagi sauce." }),
          it("T46", "BIG EBI CRUNCHY ROLL", { a: "E,G", price: "9.90 €", de: "Garnele, Avocado, Frischkäse, Cocktail- und Unagisoße.", en: "Shrimp, avocado, cream cheese, cocktail and unagi sauce." }),
          it("T47", "BIG CHICKEN CRUNCHY ROLL", { a: "G", price: "9.50 €", de: "Hähnchen, Gurke, Avocado, Frischkäse, Cocktail- und Unagisoße.", en: "Chicken, cucumber, avocado, cream cheese, cocktail and unagi sauce." }),
          it("T48", "BIG VEGGIE CRUNCHY ROLL", { veg: true, a: "G,M", price: "8.50 €", de: "Avocado, Gurke, Tofutasche, Frischkäse, Cocktail- und Unagisoße.", en: "Avocado, cucumber, tofu pocket, cream cheese, cocktail sauce, and unagi sauce." }),
        ],
      }),
      sec({
        id: "bowls", de: "Bowls", vi: "Bowls", kicker: "BOWL", img: img(15),
        items: [
          it("B50", "SAKE FIRE BOWL", { a: "C,L", price: "12.90 €", de: "Flambierter Lachs, gemischter Salat, Mango, Gurke, Avocado, Sesam-, Cocktail- und Unagisoße, dazu Sushireis.", en: "Flambéed salmon, mixed salad, mango, cucumber, avocado, sesame, cocktail and unagi sauce, served with sushi rice." }),
          it("B51", "SAKE BOWL", { a: "C,L", price: "12.50 €", de: "Lachs, gemischter Salat, Mango, Gurke, Avocado, Sesam- und Unagisoße, dazu Sushireis.", en: "Salmon, mixed salad, mango, cucumber, avocado, sesame and unagi sauce, with sushi rice." }),
          it("B52", "SUSHI DON BOWL", { a: "C,E,N,D,L", price: "13.50 €", de: "Lachs, Thunfisch, Garnele, Aal, Surimi, Ebi Tempura, gemischter Salat, Sesam- und Unagisoße, dazu Sushireis.", en: "Salmon, tuna, shrimp, eel, surimi, ebi tempura, mixed salad, sesame and unagi sauce, with sushi rice." }),
          it("B53", "CHICKEN BOWL", { a: "D,L,M", price: "11.90 €", de: "Chicken Tempura, gemischter Salat, Mango, Gurke, Avocado, Sesam- und Unagisoße, dazu Sushireis.", en: "Chicken tempura, mixed salad, mango, cucumber, avocado, sesame and unagi sauce, and sushi rice." }),
          it("B54", "VEGGIE BOWL", { veg: true, a: "D,L,M", price: "10.50 €", de: "Gemüse Tempura, gemischter Salat, Sesam- und Unagisoße, dazu Sushireis.", en: "Vegetable tempura, mixed salad, sesame and unagi sauce, served with sushi rice." }),
        ],
      }),
      sec({
        id: "menus", de: "Sushi Menüs", vi: "Sushi Menüs", kicker: "SUSHI MENÜS", img: img(16),
        items: [
          it("1", "KOCHI MENÜ", { price: "11.90 €", de: "4 Lachs I.O. / 6 Avocado- & Kappa-Maki / 8 Mini Salmon Crunchy Roll" }),
          it("2", "SALMON MENÜ", { price: "13.50 €", de: "3 Lachs Nigiri / 6 Lachs Maki / 4 Philadelphia I.O." }),
          it("3", "TEKKA MENÜ", { price: "16.90 €", de: "3 Maguro Nigiri / 6 Tekka Maki / 8 Mini Tuna Crunchy Roll" }),
          it("4", "MAKI MIX MENÜ", { price: "11.50 €", de: "6 Sake Maki / 6 Tekka Maki / 6 Kappa Maki" }),
          it("5", "SAKURA MENÜ", { price: "19.50 €", de: "8 Rang Dong Dragon Special Roll / 6 Big Salmon Crunchy Roll" }),
          it("6", "KAIYO MENÜ", { price: "17.90 €", de: "4 Red Dragon Special Roll / 4 Nigiri Mix (Sake, Maguro, Ebi, Butterfisch) / 6 Sake Maki" }),
          it("7", "OTO MENÜ", { price: "21.50 €", de: "1 Sake Nigiri / 1 Ebi Nigiri / 1 Butterfisch Nigiri / 6 Avocado- & Kappa-Maki / 8 Rang Dong Dragon Special Roll" }),
          it("8", "TOKYO MENÜ", { price: "16.90 €", de: "6 Sake Maki / 1 Sake Nigiri / 1 Maguro Nigiri / 1 Ebi Nigiri / 1 Kani Nigiri / 8 California I.O." }),
        ],
      }),
      sec({
        id: "party", de: "Party & Veggie Menüs", vi: "Menu tiệc & chay", kicker: "PARTY & VEGGIE MENÜS", img: img(16),
        items: [
          it("9", "YOAKE MENÜ", { price: "40.00 €", de: "6 Lachs Maki / 6 Avocado- & Gurken-Maki / 4 Rang Dong Dragon Special Roll / 4 Red Dragon Special Roll / 4 Veggie I.O. / 6 Big Salmon Crunchy Roll / 4 Nigiri Mix (Lachs, Maguro, Avocado, Ebi)" }),
          it("10", "UMI MENÜ – FÜR 2 PERSONEN", { price: "55.00 €", de: "12 Maki (Sake, Tekka, Gurke, Avocado) / 8 Sake I.O. / 8 Rang Dong Dragon Special Roll / 4 Nigiri Mix / 6 Sashimi / 6 Big Salmon Crunchy Roll" }),
          it("11", "PARTY MENÜ – FÜR 4 PERSONEN", { price: "90.00 €", de: "24 Maki Mix / 8 I.O. / 16 Dragon Special Roll / 8 Nigiri Mix / 6 Sashimi / 12 Big Crunchy Roll" }),
          it("12", "VEGGIE A MENÜ", { veg: true, price: "10.90 €", de: "6 Avocado Maki / 6 Kappa Maki / 6 Oshinko Maki" }),
          it("13", "VEGGIE B MENÜ", { veg: true, price: "13.90 €", de: "6 Kappa Maki / 6 Avocado Maki / 2 Avocado Nigiri / 2 Inari Nigiri" }),
          it("14", "VEGGIE C MENÜ", { veg: true, price: "17.90 €", de: "4 Towado Special Roll / 4 Veggie I.O. / 2 Avocado Nigiri / 2 Inari Nigiri / 6 Avocado- & Kappa-Maki" }),
          it("15", "VEGGIE E MENÜ", { veg: true, price: "17.90 €", de: "4 Towado Special Roll / 4 Veggie Special Roll / 6 Big Veggie Crunchy Roll" }),
        ],
      }),
    ],
  },
  {
    id: "drinks", roman: "IV", de: "Getränke", vi: "Đồ uống", short: "Getränke", shortVi: "Đồ uống",
    secs: [
      sec({
        id: "wasser", de: "Wasser & Softdrinks", vi: "Nước & nước ngọt", kicker: "0,2 l | 0,4 l | 0,75 l", img: img(17),
        items: [
          it("100", "SPREEQUELL WASSER CLASSIC", { prices: [["0,2 l", "2.50 €"], ["0,4 l", "3.20 €"], ["0,75 l", "5.00 €"]] }),
          it("100", "SPREEQUELL WASSER NATURELL", { prices: [["0,2 l", "2.50 €"], ["0,4 l", "3.20 €"], ["0,75 l", "5.00 €"]] }),
          it("101", "COCA COLA", { a: "1,2,3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("102", "COCA COLA LIGHT", { a: "1,2,3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("103", "COCA COLA ZERO", { a: "1,2,3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("104", "FANTA", { a: "1,3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("105", "SPRITE", { a: "3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("106", "SPEZI", { a: "1,2,3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("107", "SCHWEPPES GINGER ALE", { a: "3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("108", "SCHWEPPES TONIC WATER", { a: "3,4", prices: [["0,2 l", "2.90 €"], ["0,4 l", "3.90 €"]] }),
          it("110", "APFEL", { sub: "GRANINI SÄFTE & SAFTSCHORLEN 0,2 l | 0,4 l", a: "8,1", en: "apple", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
          it("111", "MANGO", { a: "8,1", en: "mango", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
          it("112", "LITSCHI", { a: "8", en: "lychee", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
          it("113", "BANANE", { a: "8,1", en: "banana", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
          it("114", "KIRSCH", { a: "8,1", en: "cherry", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
          it("115", "KIBA", { a: "8,1", en: "cherry banana", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
          it("116", "GUAVE / DRACHENFRUCHT", { a: "8,1", en: "guava / dragon fruit", prices: [["0,2 l", "3.20 €"], ["0,4 l", "4.10 €"]] }),
        ],
      }),
      sec({
        id: "tee", de: "Tee & Kaffee", vi: "Trà & cà phê", kicker: "TEE / TEA - KAFFEE / COFFEE", img: img(18),
        items: [
          it("120", "JASMINTEE", { sub: "TEE / TEA (Tasse)", a: "2", price: "3.50 €", en: "jasmine tea" }),
          it("121", "GRÜNTEE", { a: "2", price: "3.50 €", en: "green tea" }),
          it("122", "INGWERTEE", { price: "4.50 €", en: "ginger tea" }),
          it("123", "APFELTEE", { price: "4.50 €", en: "apple tea" }),
          it("124", "ZITRONENGRASTEE", { price: "4.20 €", en: "lemongrass tea" }),
          it("125", "MINZTEE", { price: "4.20 €", en: "mint tea" }),
          it("126", "PASSIONSFRUCHT TEE", { price: "4.50 €", en: "passion fruit tea" }),
          it("130", "KAFFEE", { sub: "KAFFEE / COFFEE", a: "2", price: "2.50 €" }),
          it("131", "CAPPUCCINO", { a: "2", price: "3.50 €" }),
          it("132", "ESPRESSO", { a: "2", price: "2.50 €" }),
          it("133", "CA PHE SUA VIETNAM", { a: "2,G", price: "4.50 €", de: "heiß", en: "hot" }),
          it("134", "CA PHE SUA DA VIETNAM", { a: "2,G", price: "5.00 €", de: "kalt", en: "cold" }),
        ],
      }),
      sec({
        id: "home", de: "Homemades", vi: "Đồ uống nhà làm", kicker: "RANG DONG HOMEMADES", img: img(19),
        items: [
          it("135", "MANGO LASSI", { a: "G,8", price: "5.50 €", de: "Mangocreme, Mangosaft, Bio-Joghurt, Milch", en: "mango cream, mango juice, organic yogurt, milk" }),
          it("136", "AVOCADO LASSI", { a: "G", price: "5.50 €", de: "Avocado, Bio-Joghurt, Milch.", en: "avocado, organic yogurt, milk." }),
          it("137", "DUA TUOI", { price: "5.90 €", de: "Frische Kokosnuss", en: "Fresh coconut" }),
          it("140", "CHANH DA", { price: "5.50 €", de: "Limetten, Rohrzucker, Sodawasser, Minze.", en: "limes, cane sugar, soda water, mint." }),
          it("141", "CHANH LEO", { price: "5.50 €", de: "Passionsfruchtsaft", en: "Passion fruit juice" }),
          it("142", "NUOC MIA", { price: "5.90 €", de: "Zuckerrohrsaft", en: "Sugarcane juice" }),
          it("143", "NUOC SAU", { price: "5.90 €", de: "Saft aus vietnamesischer Sau-Frucht (Dracontomelon)", en: "Vietnamese dracontomelon juice (sour plum-like fruit)" }),
          it("144", "CAM TUOI", { price: "5.90 €", de: "Frisch gepresster Orangensaft.", en: "freshly squeezed orange juice." }),
          it("145", "GREEN SMOOTHIE", { price: "5.50 €" }),
          it("146", "LEMONGRAS ICED TEA", { price: "5.50 €", de: "Zitronengras, Limo, Limette, Zucker.", en: "lemongrass, lemonade, lime, sugar." }),
          it("147", "PASSION SUMMER", { a: "8,1", price: "5.50 €", de: "Eistee, Passionsfrucht, Maracujasaft, Limetten, Minze.", en: "iced tea, passion fruit, passion fruit juice, lime, mint." }),
          it("148", "GUNG CAY", { price: "5.50 €", de: "Limetten, Ingwer, Himbeerpüree, Sodawasser, Minze.", en: "limes, ginger, raspberry puree, soda water, mint." }),
          it("149", "MANGO DREAM", { a: "8,1", price: "5.50 €", de: "Eistee, frische Mango, Mangosaft, Limetten, Minze.", en: "iced tea, fresh mango, mango juice, lime, mint." }),
          it("150", "LYCHEE SPARKLING", { a: "8,1,3,4", price: "5.50 €", de: "Eistee, Litschisaft, Limetten, Sprite, Minze.", en: "iced tea, lychee juice, lime, Sprite, mint." }),
        ],
      }),
      sec({
        id: "bier", de: "Bier & alkoholfreie Cocktails", vi: "Bia & cocktail không cồn", kicker: "BIER / COCKTAIL NON ALKOHOL", img: img(21),
        items: [
          it("155", "HEINEKEN", { sub: "FASSBIER 0,3 l | 0,5 l", prices: [["0,3 l", "3.20 €"], ["0,5 l", "4.20 €"]] }),
          it("156", "RADLER / ALSTER / DIESEL", { prices: [["0,3 l", "3.20 €"], ["0,5 l", "4.20 €"]] }),
          it("157", "HEINEKEN 0,0", { sub: "FLASCHENBIER", price: "3.50 €", de: "0,33 l" }),
          it("158", "FRANZISKANER WEISSBIER", { price: "4.50 €", de: "0,5 l - Hefe Alkoholfrei / Hefe Hell / Kristall" }),
          it("159", "TIGER BIER", { price: "3.80 €", de: "0,33 l" }),
          it("160", "INGWER-LEMO", { sub: "COCKTAIL NON ALKOHOL", a: "1", price: "5.90 €", de: "Limette, Ingwer, Rohrzucker, Ginger Ale, Minze.", en: "Lime, ginger, raw sugar, ginger ale, mint." }),
          it("161", "PASSION-REFRESHER", { a: "1", price: "6.20 €", de: "Limetten, Maracuja, Ingwer, Minze, Soda.", en: "Lime, passion fruit, ginger, mint, soda." }),
        ],
      }),
      sec({
        id: "cocktails", de: "Cocktails", vi: "Cocktail", kicker: "COCKTAIL", img: img(22),
        items: [
          it("162", "MOSCOW MULE", { a: "1", price: "7.50 €", de: "Mampe Vodka, Limetten, Gurke, Schweppes Ginger Beer, Ingwer", en: "Mampe vodka, lime, cucumber, Schweppes Ginger Beer, ginger" }),
          it("163", "LONDON MULE", { a: "1", price: "8.00 €", de: "Mampe Gin, Limette, Schweppes Ginger Beer, Ingwer", en: "Mampe gin, lime, Schweppes Ginger Beer, ginger" }),
          it("164", "PINK MOJITO", { a: "1", price: "7.90 €", de: "Barcelo, Soda, Rohrzucker, Limette, Himbeerpüree, Minze", en: "Barcelo rum, soda, cane sugar, lime, raspberry puree, mint" }),
          it("165", "MANGO MOJITO", { a: "1", price: "7.90 €", de: "Barcelo, Soda, Rohrzucker, Limette, Mangopüree, Minze", en: "Barcelo rum, soda, cane sugar, lime, mango puree, mint" }),
          it("166", "WHISKEY SOUR", { a: "1", price: "9.90 €", de: "Whiskey Jim Beam, Angostura Bitter, Limette, Zuckersirup", en: "Jim Beam whiskey, Angostura bitters, lime, sugar syrup" }),
          it("167", "ELDERFLOWER SPECIAL", { a: "1", price: "9.00 €", de: "Bombay Sapphire, Limette, Holunderblüten-Sirup, Tonic Water", en: "Bombay Sapphire, lime, elderflower syrup, tonic water" }),
          it("168", "LILLET BERRY", { a: "1", price: "7.90 €", de: "Lillet, Berry Mix", en: "Lillet, berry mix" }),
          it("169", "LILLET GINGER FIZZ", { a: "1,3", price: "7.90 €", de: "Lillet Rosé, Tonic Water, Ginger Ale, Limette", en: "Lillet Rosé, tonic water, ginger ale, lime." }),
        ],
      }),
      sec({
        id: "aperitif", de: "Aperitif & Wein", vi: "Aperitif & rượu vang", kicker: "SCHNAPS / APERITIF / WEIN", img: img(23),
        items: [
          it("170", "VIETNAMESISCHER REISSCHNAPS", { sub: "SCHNAPS 2 cl", price: "3.80 €" }),
          it(undefined, "SAKE", { price: "5.90 €" }),
          it("171", "APEROL SPRITZ", { sub: "APERITIF", price: "7.00 €", de: "Aperol, Lutter & Wegner, Soda, Orange", en: "Aperol, Lutter & Wegner, soda, orange" }),
          it("172", "LIMONCE SPRITZ", { price: "7.00 €", de: "Limonce, Lutter & Wegner, Soda, Zitrone", en: "Limonce, Lutter & Wegner, soda, lemon" }),
          it("180", "PROSECCO", { sub: "WEIN 0,2 l", price: "4.50 €" }),
          it("181", "WEINSCHORLE", { price: "4.50 €" }),
          it("182", "MAYBACH RHEINHESSEN CHARDONNAY (TROCKEN)", { price: "5.50 €" }),
          it("183", "SCHANKWEIN WEISS", { price: "4.50 €", de: "Riesling Rietburg (Deutschland) / Grauburgunder Wachtenburg (Deutschland) / Chardonnay Mommessin (Frankreich).", en: "Riesling Rietburg (Germany) / Pinot Gris Wachtenburg (Germany) / Chardonnay Mommessin (France)." }),
          it("184", "SCHANKWEIN ROT", { a: "1", price: "4.50 €", de: "Dornfelder Rietburg (Deutschland) / Merlot Mommessin (Frankreich)", en: "Dornfelder Rietburg (Germany) / Merlot Mommessin (France)" }),
        ],
      }),
    ],
  },
  {
    id: "vn", roman: "V", de: "Vietnamesische Spezialitäten", vi: "Thực Đơn Việt Nam", short: "Vietnam", shortVi: "Việt Nam",
    secs: [
      sec({ id: "de-cuu-lau", de: "Dê – Cừu – Lẩu", vi: "Dê – Cừu – Lẩu", kicker: "THỰC ĐƠN VIỆT NAM", img: img(25), items: [
        it(undefined, "DÊ XÀO SẢ ỚT", { sub: "DÊ – CỪU", price: "50 €" }), it(undefined, "DÊ NƯỚNG MỌI", { price: "50 €" }), it(undefined, "DÊ HẤP", { price: "50 €" }), it(undefined, "CỪU NƯỚNG", { price: "70 €" }),
        it(undefined, "LẨU DÊ CHAO", { sub: "LẨU", price: "100 €" }), it(undefined, "LẨU DÊ THUỐC BẮC", { price: "120 €" }), it(undefined, "LẨU GÀ LÁ GIANG", { price: "100 €" }),
      ] }),
      sec({ id: "lau-om", de: "Lẩu & Món Om", vi: "Lẩu & Món Om", kicker: "THỰC ĐƠN VIỆT NAM", img: img(26), items: [
        it(undefined, "LẨU GÀ ỚT CAY", { sub: "LẨU – MÓN OM", price: "100 €" }), it(undefined, "LẨU BA BA THUỐC BẮC", { price: "120 / 200 €" }), it(undefined, "VỊT OM SẤU", { price: "160 €" }), it(undefined, "VỊT OM MĂNG", { price: "100 €" }),
        it(undefined, "LẨU LƯƠN", { price: "100 €" }), it(undefined, "LẨU HẢI SẢN", { price: "120 €" }), it(undefined, "LẨU THẬP CẨM", { price: "120 €" }), it(undefined, "LẨU RIÊU CUA BẮP BÒ", { price: "100 €" }), it(undefined, "CÁ TẦM OM CHUỐI ĐẬU", { price: "100 €" }),
      ] }),
      sec({ id: "ngan-chim-se", de: "Ngan & Chim Sẻ", vi: "Ngan & Chim Sẻ", kicker: "THỰC ĐƠN VIỆT NAM", img: img(27), items: [
        it(undefined, "TIẾT CANH", { sub: "NGAN VỊT", price: "6 €" }), it(undefined, "NGAN OM SẤU", { price: "100 €" }), it(undefined, "NGAN XÁO MĂNG", { price: "100 €" }), it(undefined, "NGAN HẤP", { price: "50 €" }),
        it(undefined, "CHIM SẺ CHIÊN MẮM", { sub: "CHIM SẺ", price: "50 €" }), it(undefined, "CHIM SẺ NƯỚNG LÁ CHANH", { price: "50 €" }), it(undefined, "CHIM SẺ XÚC BÁNH ĐA", { price: "50 €" }),
      ] }),
      sec({ id: "chim-ca-oc", de: "Chim, Cá & Ốc", vi: "Chim, Cá & Ốc", kicker: "THỰC ĐƠN VIỆT NAM", img: img(28), items: [
        it(undefined, "CHIM CÚT CHIÊN MẮM", { sub: "CHIM CÚT", price: "50 €" }), it(undefined, "CHIM CÚT NƯỚNG", { price: "50 €" }), it(undefined, "BỒ CÂU TIỀM THUỐC BẮC", { price: "80 €" }),
        it(undefined, "CÁ TẦM NHÚNG MẺ", { sub: "CÁ TẦM", price: "100 €" }), it(undefined, "CÁ TẦM NƯỚNG RIỀNG MẺ", { price: "50 €" }), it(undefined, "CÁ TẦM HẤP NGŨ LIỄU", { price: "100 €" }), it(undefined, "CÁ TẦM OM CHUỐI ĐẬU", { price: "100 €" }),
        it(undefined, "ỐC HẤP SẢ", { sub: "ỐC HƯƠNG – ỐC BƯƠU", price: "40 €" }), it(undefined, "ỐC XÀO SẢ ỚT", { price: "40 €" }),
      ] }),
      sec({ id: "luon-ech-tom", de: "Lươn, Ếch & Tôm", vi: "Lươn, Ếch & Tôm", kicker: "THỰC ĐƠN VIỆT NAM", img: img(29), items: [
        it(undefined, "SÚP LƯƠN", { sub: "LƯƠN", price: "20 €" }), it(undefined, "LƯƠN XÀO SẢ ỚT", { price: "50 €" }), it(undefined, "LƯƠN XÀO CÀ", { price: "50 €" }), it(undefined, "LƯƠN OM CHUỐI ĐẬU", { price: "100 €" }),
        it(undefined, "ẾCH XÀO CÀ", { sub: "ẾCH", price: "50 €" }), it(undefined, "ẾCH RANG LÁ LỐT", { price: "50 €" }), it(undefined, "ẾCH XÀO MĂNG", { price: "50 €" }),
        it(undefined, "TÔM XÓC TỎI", { sub: "TÔM", price: "50 €" }), it(undefined, "TÔM NƯỚNG MẮM NHĨ", { price: "50 €" }),
      ] }),
      sec({ id: "ga-bun-pho", de: "Gà, Bún & Phở", vi: "Gà, Bún & Phở", kicker: "THỰC ĐƠN VIỆT NAM", img: img(30), items: [
        it(undefined, "GÀ BÓ XÔI", { sub: "GÀ", price: "60 €" }), it(undefined, "GÀ HẤP HÀNH", { price: "40 €" }), it(undefined, "GÀ NƯỚNG MUỐI ỚT", { price: "100 €" }), it(undefined, "LẨU GÀ LÁ GIANG", { price: "100 €" }), it(undefined, "CHÂN GÀ RANG MUỐI", { price: "40 €" }),
        it(undefined, "BÚN CHẢ CÁ", { sub: "BÚN – PHỞ", price: "14.90 €" }), it(undefined, "BÚN THỊT NƯỚNG", { price: "13.50 €" }), it(undefined, "BÚN BÒ HUẾ", { price: "14.90 €" }), it(undefined, "PHỞ TÁI NẠM GẦU", { price: "14.90 €" }),
      ] }),
    ],
  },
  {
    id: "fest", roman: "VI", de: "Thực Đơn Tiệc", vi: "Thực Đơn Tiệc", short: "Festmenü", shortVi: "Thực đơn tiệc",
    secs: [
      sec({ id: "tiec", de: "Thực Đơn Tiệc", vi: "Thực Đơn Tiệc", kicker: "MÂM 6 / 8 / 10 NGƯỜI", unit: "Mâm 6 / 8 / 10 người", img: img(33), items: [
        it(undefined, "SÚP HẢI SẢN", { price: "60 / 70 / 80 €" }), it(undefined, "NỘM HOA CHUỐI VÓ BÒ", { price: "40 / 50 / 60 €" }), it(undefined, "NỘM SỨA", { price: "40 / 50 / 60 €" }),
        it(undefined, "DÊ TÁI CHANH", { price: "40 / 50 / 65 €" }), it(undefined, "DÊ HẤP SẢ", { price: "50 / 60 / 70 €" }), it(undefined, "DÊ NƯỚNG", { price: "50 / 60 / 70 €" }),
        it(undefined, "MỰC NƯỚNG SA TẾ", { price: "60 / 70 / 80 €" }), it(undefined, "MỰC HẤP", { price: "60 / 70 / 80 €" }),
        it(undefined, "CHIM SẺ CHIÊN MẮM", { price: "50 / 60 / 70 €" }), it(undefined, "CHIM CÚT CHIÊN MẮM", { price: "50 / 60 / 70 €" }),
        it(undefined, "MỰC SỐT BƠ TỎI", { price: "60 / 70 / 80 €" }), it(undefined, "CHIM BỒ CÂU TIỀM THUỐC BẮC", { price: "60 / 70 / 80 €" }),
        it(undefined, "CÁ TẦM OM CHUA", { price: "80 / 100 / 120 €" }), it(undefined, "CÁ TẦM OM CHUỐI ĐẬU", { price: "80 / 100 / 120 €" }),
        it(undefined, "RAU XÀO TỎI (MẦM + TÓP MỠ)", { price: "30 / 35 / 45 €" }), it(undefined, "CỪU NƯỚNG", { price: "90 / 110 €" }),
        it(undefined, "CÁ LẮC CUỐN CẢI", { price: "60 / 80 / 90 €" }), it(undefined, "BÒ LÚC LẮC", { price: "60 / 80 / 90 €" }),
        it(undefined, "HÀU NƯỚNG (+ ĐIỆP)", { price: "6 € / CON" }), it(undefined, "TÔM THẺ XÓC TỎI", { price: "50 / 60 / 70 €" }),
        it(undefined, "CANH MĂNG MỌC", { price: "60 / 70 / 80 €" }), it(undefined, "TÔM HÙM RANG MUỐI (SỐT ME)", { price: "150 / 200 / 250 €" }),
        it(undefined, "NGAN OM SẤU", { price: "80 / 100 / 120 €" }), it(undefined, "LẨU DÊ THUỐC BẮC", { price: "100 / 120 €" }),
        it(undefined, "LẨU LƯƠN", { price: "80 / 100 / 120 €" }), it(undefined, "XÔI CHIM", { price: "45 €" }),
        it(undefined, "XÔI GÀ", { price: "60 / 70 / 80 €" }), it(undefined, "XÔI GÁC", { price: "45 €" }),
        it(undefined, "TÔM SÚ RANG MUỐI", { price: "65 / 85 / 110 €" }), it(undefined, "LẨU GÀ LÁ GIANG", { price: "100 / 120 €" }),
      ] }),
    ],
  },
];

export const FLAT = GROUPS.flatMap((g) => g.secs.flatMap((s) => s.items.map((i) => ({ g, s, i }))));
export function findItem(secId: string, name: string) {
  const s = GROUPS.flatMap((g) => g.secs).find((x) => x.id === secId);
  return s?.items.find((i) => i.name.toLowerCase().startsWith(name.toLowerCase()));
}
export const lowestPrice = (i: Item): string | undefined => {
  if (i.price) return i.price;
  if (i.prices) return i.prices[0][1];
  if (i.opts?.length && i.opts[0].price) {
    const v = i.opts.map((x) => parseFloat(x.price)).filter((x) => !isNaN(x));
    return v.length ? `${Math.min(...v).toFixed(2)} €` : undefined;
  }
};
