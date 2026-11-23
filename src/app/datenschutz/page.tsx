import type { Metadata } from "next";
import { BottomNote, Page, SectionTop } from "@/components/Page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Datenschutz" };

export default function Datenschutz() {
  return (
    <Page>
      <SectionTop k="RECHTLICHES" title="Datenschutzerklärung" sub="Informationen zur Verarbeitung personenbezogener Daten" />
      <div className="legal glass">
        <h2>Verantwortlicher</h2>
        <p>Rạng Đông – Japanese &amp; Vietnamese Cuisine, {SITE.street}, {SITE.city}<br />E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> · Telefon: {SITE.phoneDisplay}</p>
        <h2>Keine Cookies, kein Tracking</h2>
        <p>Diese Website setzt keine Tracking- oder Analyse-Cookies ein und bindet keine Werbe-Dienste ein. Ein Cookie-Banner ist daher nicht erforderlich.</p>
        <h2>Server-Logfiles</h2>
        <p>Beim Aufruf der Seiten verarbeitet der Hosting-Anbieter technisch notwendige Daten (z. B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp), um die Seite auszuliefern und die Sicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).</p>
        <h2>Reservierungs- und Kontaktanfragen</h2>
        <p>Das Reservierungsformular speichert keine Daten auf unserem Server. Beim Absenden öffnet sich Ihr E-Mail-Programm mit vorbereitetem Text, oder Sie senden die Anfrage per WhatsApp. Die von Ihnen angegebenen Daten (Name, E-Mail, Datum, Personenzahl, Wünsche) verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b DSGVO). Bei Nutzung von WhatsApp gelten zusätzlich die Datenschutzbestimmungen des Anbieters.</p>
        <h2>Externe Links</h2>
        <p>Links zu Google Maps oder WhatsApp führen auf Seiten Dritter. Erst mit dem Klick werden Daten an den jeweiligen Anbieter übertragen. Es wird keine Karte automatisch eingebunden.</p>
        <h2>Ihre Rechte</h2>
        <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Zudem können Sie sich bei einer Aufsichtsbehörde beschweren, z. B. bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit, Alt-Moabit 59–61, 10555 Berlin.</p>
      </div>
      <BottomNote />
    </Page>
  );
}
