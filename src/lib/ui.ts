// Texte der Unterseiten (Muster 2026-11). DE = Standard, VI = Vietnamesisch. Keine erfundenen Daten.
export const U = {
  de: {
    menu: {
      title: "Speisekarte", search: "Gericht suchen …", all: "Alle", count: (n: number) => `${n} Gerichte`, choiceHead: "Wählbar mit", unit: "Einheit",
      legend: "Kennbuchstaben/-zahlen = Allergen-Codes laut Speisekarte. Die Legende erfragen Sie bitte beim Service.",
      onRequest: "Preis auf Anfrage", empty: "Keine Gerichte gefunden.", results: (n: number) => `${n} Treffer`, from: "ab", opts: "Auswahl",
      groupsLabel: "Speisekarten-Bereiche", sectionsLabel: "Rubriken", searchLabel: "Speisekarte durchsuchen", cardLegend: "Allergene",
    },
    sig: { title: "Signature", sub: "Empfehlungen des Hauses – direkt aus unserer Speisekarte", badge: "Signature", badge2: "Empfehlung des Hauses", more: "Zur Speisekarte", tiles: [["Sushi Menüs", "Kombinationen zum Teilen", "sushi", "menus"], ["Vietnam Spezialitäten", "Món Đặc Biệt aus unserer Küche", "haupt", "dacbiet"], ["Festmenü", "Thực Đơn Tiệc für Gruppen", "fest", "tiec"]] as [string, string, string, string][], pick: "Auswahl" },
    video: { title: "Video", sub: "Einblicke in die kulinarische Welt von Rạng Đông", filter: "Kategorie", all: "Alle", view: "Ansicht", grid: "Kacheln", list: "Liste", featured: "Im Fokus", play: "Abspielen", pause: "Pause", mute: "Ton aus", unmute: "Ton an", full: "Vollbild", note: "Platzhalter-Videos – echte Filmaufnahmen folgen." },
    book: {
      title: "Reservierung", sub: "Anfrage in Sekunden – wir bestätigen persönlich", name: "Name", namePh: "Vor- und Nachname", phone: "Telefon", phonePh: "Ihre Telefonnummer", date: "Datum", datePh: "Datum wählen",
      time: "Uhrzeit", timePh: "z. B. 18:30", persons: "Personen", note: "Hinweise", notePh: "Wünsche, Allergien, Anlass", email: "E-Mail (optional)", send: "Anfrage senden", p1: "1 Person", pN: "Personen",
      eName: "Bitte Namen angeben.", ePhone: "Bitte Telefonnummer angeben.", eDate: "Bitte ein Datum wählen.", ePast: "Das Datum liegt in der Vergangenheit.",
      hours: "Öffnungszeiten", hoursV: "Öffnungszeiten auf Anfrage", address: "Adresse", hotline: "Telefon", wa: "WhatsApp", viaWa: "Per WhatsApp anfragen",
      tipsT: "Hinweise", tips: ["Besonders am Wochenende empfiehlt sich eine frühzeitige Anfrage.", "Ihre Anfrage ist noch keine Reservierung – die Bestätigung erfolgt durch das Restaurant.", "Bitte geben Sie Änderungen oder Absagen rechtzeitig bekannt."],
      notice: "Ihre Anfrage wird per E-Mail geöffnet. Hat sich Ihr E-Mail-Programm nicht geöffnet, nutzen Sie bitte:", openMail: "E-Mail öffnen", sendWa: "Per WhatsApp senden", roomAlt: "Gastraum im Rạng Đông",
    },
    events: {
      kick: "Feiern & Events", h1: "Feiern in Ihrem Stil", h2: "Bei Rạng Đông", p: "Von der kleinen Feier bis zum besonderen Abend mit Familie, Freunden oder Kollegen.", btn: "Beratung & Anfrage", more: "Party & Technik",
      feats: ["Sound", "Licht", "Event", "Service"], cards: [["Geburtstag & Jubiläum", "Ein besonderer Rahmen für unvergessliche Augenblicke."], ["Business & Gruppen", "Gemeinsam essen, anstoßen und besondere Momente teilen."], ["Vietnamesisches Festmenü", "Thực Đơn Tiệc – Platten zum Teilen für 6, 8 oder 10 Personen."], ["Private Dining", "Persönliche Atmosphäre, abgestimmt auf Ihren Anlass."]] as [string, string][], ask: "Anfrage",
    },
    amb: { title: "Ambiente", cards: [["Atmosphäre", "Ein Ambiente zwischen Hongkong-Charme und japanischer Zurückhaltung."], ["Lounge & Dining", "Ein Platz für gute Gespräche und besondere Abende."], ["Feiern & Gruppen", "Genussmomente für gemeinsame Anlässe."]] as [string, string][], guide: "Food Guide", sub: "Wärme, Eleganz und der Zauber eines gemeinsamen Abends." },
    contact: {
      title: "Kontakt", tagline: "JAPANESE & VIETNAMESE CUISINE", intro: "Wir sind gern für Sie da – für Beratung, Reservierungen oder Feiern.", call: "Anrufen", route: "Route", address: "Adresse", hours: "Öffnungszeiten", hoursV: "Öffnungszeiten auf Anfrage",
      phone: "Telefon", mail: "E-Mail", wa: "WhatsApp", formT: "Nachricht an uns", name: "Name *", email: "E-Mail *", phoneF: "Telefon", msg: "Ihre Nachricht *", send: "Nachricht senden",
      eName: "Bitte Namen angeben.", eMail: "Bitte gültige E-Mail angeben.", eMsg: "Bitte eine Nachricht eingeben.", notice: "Ihre Nachricht wird per E-Mail geöffnet. Hat sich Ihr E-Mail-Programm nicht geöffnet, nutzen Sie bitte:", openMail: "E-Mail öffnen", sendWa: "Per WhatsApp senden",
      openMaps: "Google Maps öffnen", schem: "Schematische Darstellung", mapLabel: "Schematische Umgebungskarte von Berlin-Marzahn",
    },
  },
  vi: {
    menu: {
      title: "Thực đơn", search: "Tìm món …", all: "Tất cả", count: (n: number) => `${n} món`, choiceHead: "Có thể chọn", unit: "Đơn vị",
      legend: "Chữ cái/số nhỏ = mã dị ứng theo thực đơn gốc. Vui lòng hỏi nhân viên để biết chú giải.",
      onRequest: "Giá vui lòng hỏi", empty: "Không tìm thấy món nào.", results: (n: number) => `${n} kết quả`, from: "từ", opts: "Lựa chọn",
      groupsLabel: "Nhóm thực đơn", sectionsLabel: "Mục", searchLabel: "Tìm trong thực đơn", cardLegend: "Dị ứng",
    },
    sig: { title: "Món đặc sắc", sub: "Tinh hoa của nhà hàng – lấy thẳng từ thực đơn", badge: "Signature", badge2: "Gợi ý của nhà hàng", more: "Xem thực đơn", tiles: [["Sushi Menüs", "Thực đơn sushi chia sẻ", "sushi", "menus"], ["Đặc sản Việt Nam", "Món Đặc Biệt của nhà bếp", "haupt", "dacbiet"], ["Thực Đơn Tiệc", "Mâm cho nhóm 6 / 8 / 10 người", "fest", "tiec"]] as [string, string, string, string][], pick: "Lựa chọn" },
    video: { title: "Video", sub: "Khám phá thế giới ẩm thực Rạng Đông", filter: "Lọc theo danh mục", all: "Tất cả", view: "Hiển thị", grid: "Lưới", list: "Danh sách", featured: "Nổi bật", play: "Phát", pause: "Tạm dừng", mute: "Tắt tiếng", unmute: "Bật tiếng", full: "Toàn màn hình", note: "Video minh họa tạm thời – video thật sẽ được cập nhật." },
    book: {
      title: "Đặt bàn", sub: "Gửi yêu cầu nhanh chóng – nhà hàng sẽ xác nhận lại", name: "Họ tên", namePh: "Nhập họ và tên của bạn", phone: "Số điện thoại", phonePh: "Nhập số điện thoại liên hệ", date: "Ngày", datePh: "Chọn ngày",
      time: "Giờ", timePh: "Ví dụ 18:30", persons: "Số khách", note: "Ghi chú", notePh: "Yêu cầu, dị ứng, dịp", email: "Email (không bắt buộc)", send: "Gửi yêu cầu", p1: "1 khách", pN: "khách",
      eName: "Vui lòng nhập họ tên.", ePhone: "Vui lòng nhập số điện thoại.", eDate: "Vui lòng chọn ngày.", ePast: "Ngày đã qua.",
      hours: "Giờ mở cửa", hoursV: "Giờ mở cửa: vui lòng hỏi nhà hàng", address: "Địa chỉ", hotline: "Điện thoại", wa: "WhatsApp", viaWa: "Hỏi bàn qua WhatsApp",
      tipsT: "Lưu ý đặt bàn", tips: ["Nên gửi yêu cầu sớm, đặc biệt vào cuối tuần.", "Yêu cầu của bạn chưa phải đặt bàn hoàn tất – nhà hàng sẽ xác nhận lại.", "Vui lòng báo sớm nếu cần thay đổi hoặc hủy."],
      notice: "Yêu cầu của bạn được mở trong email. Nếu chương trình email chưa mở, hãy dùng:", openMail: "Mở email", sendWa: "Gửi qua WhatsApp", roomAlt: "Không gian nhà hàng Rạng Đông",
    },
    events: {
      kick: "Tiệc & Sự kiện", h1: "Tổ chức tiệc theo phong cách của bạn", h2: "Tại Rạng Đông", p: "Từ buổi tiệc nhỏ đến buổi tối đặc biệt cùng gia đình, bạn bè hoặc đồng nghiệp.", btn: "Tư vấn & Gửi yêu cầu", more: "Tiệc & Kỹ thuật",
      feats: ["Âm thanh", "Ánh sáng", "Sự kiện", "Dịch vụ"], cards: [["Sinh nhật & Kỷ niệm", "Một không khí đặc biệt cho những khoảnh khắc khó quên."], ["Doanh nghiệp & Nhóm", "Cùng ăn, cùng nâng ly và sẻ chia những khoảnh khắc đặc biệt."], ["Thực Đơn Tiệc", "Mâm chia sẻ cho 6, 8 hoặc 10 người."], ["Private Dining", "Bầu không khí riêng tư, phù hợp với dịp của bạn."]] as [string, string][], ask: "Gửi yêu cầu",
    },
    amb: { title: "Không gian", cards: [["Không khí", "Không gian giữa nét quyến rũ Hồng Kông và sự tiết chế Nhật Bản."], ["Lounge & Dining", "Chỗ cho những cuộc trò chuyện hay và những buổi tối đặc biệt."], ["Tiệc & Nhóm", "Khoảnh khắc thưởng thức cho những dịp chung vui."]] as [string, string][], guide: "Food Guide", sub: "Sự ấm áp, tinh tế và phép màu của một buổi tối bên nhau." },
    contact: {
      title: "Liên hệ", tagline: "JAPANESE & VIETNAMESE CUISINE", intro: "Chúng tôi luôn sẵn sàng hỗ trợ – tư vấn, đặt bàn hoặc tổ chức tiệc.", call: "Gọi ngay", route: "Chỉ đường", address: "Địa chỉ", hours: "Giờ mở cửa", hoursV: "Giờ mở cửa: vui lòng hỏi nhà hàng",
      phone: "Điện thoại", mail: "Email", wa: "WhatsApp", formT: "Gửi tin nhắn cho chúng tôi", name: "Họ và tên *", email: "Email *", phoneF: "Số điện thoại", msg: "Nội dung tin nhắn *", send: "Gửi liên hệ",
      eName: "Vui lòng nhập họ tên.", eMail: "Vui lòng nhập email hợp lệ.", eMsg: "Vui lòng nhập nội dung.", notice: "Tin nhắn của bạn được mở trong email. Nếu chương trình email chưa mở, hãy dùng:", openMail: "Mở email", sendWa: "Gửi qua WhatsApp",
      openMaps: "Mở Google Maps", schem: "Sơ đồ minh họa", mapLabel: "Sơ đồ minh họa khu vực Berlin-Marzahn",
    },
  },
};
export type Lang = "de" | "vi";
