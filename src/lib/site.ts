export const SITE = {
  name: "Rạng Đông",
  tagline: "Japanese & Vietnamese Cuisine",
  street: "Marzahner Chaussee 205",
  city: "12681 Berlin",
  phoneDisplay: "030 469 02659",
  phoneTel: "+493046902659",
  whatsappDisplay: "0152 51745601",
  whatsappUrl: "https://wa.me/4915251745601",
  email: "info@rangdong.de",
  mapsSearch: "https://www.google.com/maps/search/?api=1&query=Marzahner%20Chaussee%20205%2C%2012681%20Berlin",
  mapsDir: "https://www.google.com/maps/dir/?api=1&destination=Marzahner%20Chaussee%20205%2C%2012681%20Berlin",
};

export const NAV: [string, string][] = [
  ["/", "Home"],
  ["/speisekarte", "Speisekarte"],
  ["/signature", "Signature"],
  ["/reservierung", "Reservierung"],
  ["/events", "Events"],
  ["/party-technik", "Party & Technik"],
  ["/ambiente", "Ambiente"],
  ["/food-guide", "Food Guide"],
  ["/kontakt", "Kontakt"],
];

export type CatId = "hot" | "sushi" | "party" | "viet";
export interface Cat {
  id: CatId; de: string; vi: string; sub: string;
  still: string; poster: string; video: string; videos: string[]; posters: string[]; thumbs: string[]; stills: string[]; symbol: string; display: string; imgs: string[];
}
// still/poster/video = KIT-Hero + Motion-Demo, passend zum jeweiligen Video; echte Fotos/Videos später hier austauschen. Poster/video = KIT-Motion-Demo (Platzhalter bis echte Videos vorliegen)
export const CATS: Cat[] = [
  { id: "hot", de: "Warme Küche", vi: "Đồ nóng", sub: "VIETNAM · HONG KONG", still: "/img/dishes/final/hot-1.jpg", poster: "/fx/v-hot-1.jpg", video: "/fx/v-hot-1.mp4", videos: ["/fx/v-hot-1.mp4", "/fx/v-hot-2.mp4"], posters: ["/fx/v-hot-1.jpg", "/fx/v-hot-2.jpg"], thumbs: ["/img/thumb/hot-a.jpg", "/img/thumb/hot-b.jpg", "/img/thumb/hot-c.jpg"], stills: ["/img/still/hot-1.jpg", "/img/still/hot-2.jpg", "/img/still/hot-3.jpg", "/img/still/hot-4.jpg"], symbol: "♨", display: "Heiße Spezialitäten", imgs: ["/img/dishes/final/hot-1.jpg", "/img/dishes/final/hot-2.jpg", "/img/dishes/final/hot-3.jpg", "/img/dishes/final/hot-4.jpg", "/img/dishes/final/hot-5.jpg"] },
  { id: "sushi", de: "Sushi", vi: "Sushi", sub: "JAPANESE CUISINE", still: "/img/dishes/final/sushi-2.jpg", poster: "/fx/v-sushi-1.jpg", video: "/fx/v-sushi-1.mp4", videos: ["/fx/v-sushi-1.mp4", "/fx/v-sushi-2.mp4"], posters: ["/fx/v-sushi-1.jpg", "/fx/v-sushi-2.jpg"], thumbs: ["/img/thumb/sushi-a.jpg", "/img/thumb/sushi-b.jpg", "/img/thumb/sushi-c.jpg"], stills: ["/img/still/sushi-1.jpg", "/img/still/sushi-2.jpg", "/img/still/sushi-3.jpg", "/img/still/sushi-4.jpg"], symbol: "◉", display: "Sushi Selections", imgs: ["/img/dishes/final/sushi-1.jpg", "/img/dishes/final/sushi-special.jpg", "/img/dishes/final/sushi-2.jpg", "/img/dishes/final/sushi-3.jpg", "/img/dishes/final/sushi-4.jpg"] },
  { id: "party", de: "Festmenüs", vi: "Đồ tiệc", sub: "VIETNAMESE PARTY", still: "/img/dishes/final/party-1.jpg", poster: "/fx/v-party-1.jpg", video: "/fx/v-party-1.mp4", videos: ["/fx/v-party-1.mp4", "/fx/v-party-2.mp4"], posters: ["/fx/v-party-1.jpg", "/fx/v-party-2.jpg"], thumbs: ["/img/thumb/party-a.jpg", "/img/thumb/party-b.jpg", "/img/thumb/party-c.jpg"], stills: ["/img/still/party-1.jpg", "/img/still/party-2.jpg", "/img/still/party-3.jpg", "/img/still/party-4.jpg"], symbol: "✧", display: "Vietnamese Party", imgs: ["/img/dishes/final/party-1.jpg", "/img/dishes/final/party-2.jpg", "/img/dishes/final/party-3.jpg", "/img/dishes/final/party-4.jpg"] },
  { id: "viet", de: "Vietnamesisch", vi: "Món Việt", sub: "VIETNAMESE CUISINE", still: "/img/dishes/final/viet-1.jpg", poster: "/fx/v-viet-1.jpg", video: "/fx/v-viet-1.mp4", videos: ["/fx/v-viet-1.mp4", "/fx/v-viet-2.mp4"], posters: ["/fx/v-viet-1.jpg", "/fx/v-viet-2.jpg"], thumbs: ["/img/thumb/viet-a.jpg", "/img/thumb/viet-b.jpg", "/img/thumb/viet-c.jpg"], stills: ["/img/still/viet-1.jpg", "/img/still/viet-2.jpg", "/img/still/viet-3.jpg", "/img/still/viet-4.jpg"], symbol: "❋", display: "Vietnamese Kitchen", imgs: ["/img/dishes/final/viet-1.jpg", "/img/dishes/final/viet-2.jpg", "/img/dishes/final/viet-3.jpg", "/img/dishes/final/viet-4.jpg"] },
];
