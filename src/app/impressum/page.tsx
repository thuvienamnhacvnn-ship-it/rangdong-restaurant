import type { Metadata } from "next";
import { BottomNote, Page, SectionTop } from "@/components/Page";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum" };

export default function Impressum() {
  return (
    <Page>
      <SectionTop k="RECHTLICHES" title="Impressum" sub="Angaben gemäß § 5 DDG" />
      <div className="legal glass">
        <h2>Anbieter</h2>
        <p>Rạng Đông – Japanese &amp; Vietnamese Cuisine<br />{SITE.street}<br />{SITE.city}</p>
        <h2>Kontakt</h2>
        <p>Telefon: <a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a><br />WhatsApp: <a href={SITE.whatsappUrl}>{SITE.whatsappDisplay}</a><br />E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
        <h2>Haftung für Inhalte</h2>
        <p>Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Die Speisekarte, Preise und Angebote können sich ändern; verbindlich sind die Angaben im Restaurant.</p>
        <h2>Haftung für Links</h2>
        <p>Unser Angebot enthält Links zu externen Websites Dritter (z. B. Google Maps, WhatsApp), auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter verantwortlich.</p>
        <h2>Urheberrecht</h2>
        <p>Die durch den Seitenbetreiber erstellten Inhalte und Werke unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. Vervielfältigung, Bearbeitung und Verbreitung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.</p>
      </div>
      <BottomNote />
    </Page>
  );
}
