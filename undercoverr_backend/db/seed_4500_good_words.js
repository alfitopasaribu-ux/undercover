import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum ada di .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const categoryModifiers = {
  food: [
    "", "Enak", "Pedas", "Manis", "Hangat", "Dingin", "Rumahan", "Restoran",
    "Favorit", "Murah", "Premium", "Porsi Besar", "Porsi Kecil", "Sarapan",
    "Makan Siang", "Makan Malam", "Bekal", "Menu Kafe", "Menu Warung",
    "Cepat Saji", "Tradisional", "Modern", "Viral", "Spesial", "Keluarga"
  ],
  drink: [
    "", "Dingin", "Hangat", "Manis", "Tawar", "Kemasan", "Botol", "Gelas",
    "Kafe", "Rumahan", "Segar", "Favorit", "Murah", "Premium", "Rendah Gula",
    "Tanpa Gula", "Rasa Cokelat", "Rasa Strawberry", "Rasa Vanilla",
    "Pagi", "Malam", "Anak-anak", "Dewasa", "Sehat", "Viral"
  ],
  place: [
    "", "Ramai", "Sepi", "Dekat", "Jauh", "Baru", "Lama", "Terkenal",
    "Besar", "Kecil", "Malam", "Pagi", "Liburan", "Keluarga", "Wisata",
    "Modern", "Tradisional", "Dalam Kota", "Luar Kota", "Dekat Rumah",
    "Dekat Kampus", "Favorit", "Mahal", "Murah", "Nyaman"
  ],
  animal: [
    "", "Lucu", "Kecil", "Besar", "Jinak", "Liar", "Peliharaan",
    "Kartun", "Bayi", "Dewasa", "Gemuk", "Kurus", "Cepat", "Lambat",
    "Di Rumah", "Di Hutan", "Di Kebun Binatang", "Di Air", "Di Darat",
    "Berbulu", "Bersuara Keras", "Favorit Anak", "Malam", "Pagi", "Unik"
  ],
  job: [
    "", "Senior", "Junior", "Magang", "Profesional", "Kantor", "Lapangan",
    "Malam", "Pagi", "Seragam", "Baru", "Berpengalaman", "Sibuk",
    "Santai", "Favorit", "Terkenal", "Tim", "Mandiri", "Kota",
    "Desa", "Ahli", "Pemula", "Cepat", "Ramah", "Disiplin"
  ],
  tech: [
    "", "Baru", "Bekas", "Gaming", "Kantor", "Sekolah", "Rumah", "Mini",
    "Besar", "Kecil", "Wireless", "Portable", "Canggih", "Murah",
    "Mahal", "Rusak", "Cepat", "Lambat", "Premium", "Standar",
    "Online", "Offline", "Digital", "Modern", "Favorit"
  ],
  object: [
    "", "Baru", "Bekas", "Besar", "Kecil", "Murah", "Mahal", "Putih",
    "Hitam", "Rumah", "Kantor", "Sekolah", "Kampus", "Travel",
    "Harian", "Favorit", "Premium", "Standar", "Modern", "Klasik",
    "Anak-anak", "Dewasa", "Ringan", "Berat", "Unik"
  ],
  activity: [
    "", "Cepat", "Pelan", "Pagi", "Malam", "Sendirian", "Bersama",
    "Di Rumah", "Di Sekolah", "Di Kampus", "Di Kantor", "Online",
    "Offline", "Santai", "Serius", "Sebentar", "Lama", "Liburan",
    "Favorit", "Rutin", "Mingguan", "Harian", "Tim", "Keluarga", "Teman"
  ],
  digital: [
    "", "Online", "Offline", "Akun", "Aplikasi", "Video", "Foto", "Live",
    "Komentar", "Like", "Chat", "Grup", "Story", "Status", "Viral",
    "Baru", "Lama", "Populer", "Favorit", "Privat", "Publik",
    "HP", "Laptop", "Cepat", "Lambat"
  ],
  nature: [
    "", "Besar", "Kecil", "Tenang", "Deras", "Indah", "Gelap", "Terang",
    "Pagi", "Malam", "Panas", "Dingin", "Basah", "Kering", "Alami",
    "Wisata", "Dekat", "Jauh", "Tenar", "Sepi", "Ramai", "Bersih",
    "Kotor", "Dalam", "Dangkal"
  ],
  entertainment: [
    "", "Lucu", "Seru", "Sedih", "Menegangkan", "Populer", "Viral",
    "Baru", "Lama", "Keluarga", "Anak-anak", "Dewasa", "Malam",
    "Weekend", "Favorit", "Indonesia", "Luar Negeri", "Online",
    "Offline", "Gratis", "Berbayar", "Pendek", "Panjang", "Santai", "Ramai"
  ]
};

const basePairs = [
  ["Susu", "Yogurt", "drink"],
  ["Kopi", "Teh", "drink"],
  ["Es Teh", "Es Jeruk", "drink"],
  ["Jus Alpukat", "Jus Mangga", "drink"],
  ["Air Mineral", "Air Kelapa", "drink"],
  ["Soda", "Sirup", "drink"],
  ["Cokelat Panas", "Susu Hangat", "drink"],
  ["Milkshake", "Smoothie", "drink"],
  ["Thai Tea", "Green Tea", "drink"],
  ["Kopi Susu", "Cappuccino", "drink"],

  ["Nasi Goreng", "Mie Goreng", "food"],
  ["Bakso", "Soto", "food"],
  ["Sate", "Ayam Bakar", "food"],
  ["Pizza", "Burger", "food"],
  ["Roti", "Kue", "food"],
  ["Donat", "Cupcake", "food"],
  ["Cokelat", "Permen", "food"],
  ["Keripik", "Kacang", "food"],
  ["Semangka", "Melon", "food"],
  ["Apel", "Pir", "food"],
  ["Mangga", "Nanas", "food"],
  ["Pisang", "Pepaya", "food"],
  ["Ikan Goreng", "Ayam Goreng", "food"],
  ["Rendang", "Gulai", "food"],
  ["Bubur Ayam", "Nasi Uduk", "food"],
  ["Martabak", "Terang Bulan", "food"],
  ["Pempek", "Siomay", "food"],
  ["Ketoprak", "Gado-gado", "food"],
  ["Nasi Padang", "Nasi Campur", "food"],
  ["Sambal", "Saus", "food"],
  ["Keju", "Mentega", "food"],
  ["Telur Dadar", "Telur Mata Sapi", "food"],
  ["Ayam Geprek", "Ayam Penyet", "food"],
  ["Mie Ayam", "Kwetiau", "food"],
  ["Cilok", "Cireng", "food"],

  ["Pantai", "Kolam Renang", "place"],
  ["Gunung", "Bukit", "place"],
  ["Sekolah", "Kampus", "place"],
  ["Rumah", "Apartemen", "place"],
  ["Hotel", "Villa", "place"],
  ["Mall", "Pasar", "place"],
  ["Bioskop", "Teater", "place"],
  ["Bandara", "Stasiun", "place"],
  ["Terminal", "Halte", "place"],
  ["Kantor", "Ruang Rapat", "place"],
  ["Restoran", "Kafe", "place"],
  ["Taman", "Kebun", "place"],
  ["Kebun Binatang", "Akuarium", "place"],
  ["Perpustakaan", "Toko Buku", "place"],
  ["Rumah Sakit", "Klinik", "place"],
  ["Apotek", "Minimarket", "place"],
  ["Lapangan", "Stadion", "place"],
  ["Gereja", "Kapel", "place"],
  ["Masjid", "Mushola", "place"],
  ["Museum", "Galeri", "place"],
  ["Dapur", "Ruang Makan", "place"],
  ["Kamar Tidur", "Ruang Tamu", "place"],
  ["Garasi", "Parkiran", "place"],
  ["Salon", "Barbershop", "place"],
  ["Bank", "ATM", "place"],

  ["Kucing", "Anjing", "animal"],
  ["Singa", "Harimau", "animal"],
  ["Ayam", "Bebek", "animal"],
  ["Kuda", "Sapi", "animal"],
  ["Kambing", "Domba", "animal"],
  ["Ikan", "Udang", "animal"],
  ["Paus", "Lumba-lumba", "animal"],
  ["Burung", "Kelelawar", "animal"],
  ["Ular", "Buaya", "animal"],
  ["Kupu-kupu", "Lebah", "animal"],
  ["Semut", "Nyamuk", "animal"],
  ["Kelinci", "Hamster", "animal"],
  ["Gajah", "Badak", "animal"],
  ["Monyet", "Gorila", "animal"],
  ["Katak", "Kadal", "animal"],
  ["Panda", "Koala", "animal"],
  ["Rusa", "Jerapah", "animal"],
  ["Hiu", "Ikan Pari", "animal"],
  ["Kura-kura", "Siput", "animal"],
  ["Cicak", "Tokek", "animal"],

  ["Dokter", "Perawat", "job"],
  ["Guru", "Dosen", "job"],
  ["Polisi", "Satpam", "job"],
  ["Pilot", "Pramugari", "job"],
  ["Koki", "Pelayan", "job"],
  ["Kasir", "Penjual", "job"],
  ["Sopir", "Ojek Online", "job"],
  ["Petani", "Nelayan", "job"],
  ["Programmer", "Desainer", "job"],
  ["Fotografer", "Videografer", "job"],
  ["Penyanyi", "Aktor", "job"],
  ["Atlet", "Pelatih", "job"],
  ["Pengacara", "Hakim", "job"],
  ["Arsitek", "Kontraktor", "job"],
  ["Montir", "Teknisi", "job"],
  ["Reporter", "Presenter", "job"],
  ["Tentara", "Pemadam Kebakaran", "job"],
  ["Barista", "Bartender", "job"],
  ["Kurir", "Tukang Pos", "job"],
  ["Penulis", "Editor", "job"],

  ["Laptop", "Komputer", "tech"],
  ["HP", "Tablet", "tech"],
  ["Keyboard", "Mouse", "tech"],
  ["Kamera", "Handycam", "tech"],
  ["Televisi", "Proyektor", "tech"],
  ["Speaker", "Headset", "tech"],
  ["Charger", "Powerbank", "tech"],
  ["Kipas Angin", "AC", "tech"],
  ["Kulkas", "Freezer", "tech"],
  ["Kompor", "Oven", "tech"],
  ["Printer", "Scanner", "tech"],
  ["Jam Tangan", "Smartwatch", "tech"],
  ["Motor", "Mobil", "tech"],
  ["Sepeda", "Skuter", "tech"],
  ["Kapal", "Perahu", "tech"],
  ["Pesawat", "Helikopter", "tech"],
  ["Kereta", "Bus", "tech"],
  ["Router", "Modem", "tech"],
  ["Flashdisk", "Harddisk", "tech"],
  ["Mikrofon", "Kamera Web", "tech"],

  ["Bola", "Balon", "object"],
  ["Buku", "Majalah", "object"],
  ["Pensil", "Pulpen", "object"],
  ["Tas", "Koper", "object"],
  ["Baju", "Jaket", "object"],
  ["Sepatu", "Sandal", "object"],
  ["Topi", "Helm", "object"],
  ["Kacamata", "Lensa Kontak", "object"],
  ["Dompet", "Kartu ATM", "object"],
  ["Kunci", "Gembok", "object"],
  ["Meja", "Kursi", "object"],
  ["Kasur", "Sofa", "object"],
  ["Bantal", "Guling", "object"],
  ["Piring", "Mangkok", "object"],
  ["Sendok", "Garpu", "object"],
  ["Pisau", "Gunting", "object"],
  ["Sabun", "Sampo", "object"],
  ["Handuk", "Selimut", "object"],
  ["Payung", "Jas Hujan", "object"],
  ["Cermin", "Jendela", "object"],

  ["Tidur", "Istirahat", "activity"],
  ["Makan", "Minum", "activity"],
  ["Lari", "Jalan", "activity"],
  ["Berenang", "Menyelam", "activity"],
  ["Menyanyi", "Menari", "activity"],
  ["Membaca", "Menulis", "activity"],
  ["Belajar", "Mengajar", "activity"],
  ["Memasak", "Mencuci", "activity"],
  ["Belanja", "Menawar", "activity"],
  ["Menonton", "Mendengar", "activity"],
  ["Memotret", "Merekam", "activity"],
  ["Menggambar", "Melukis", "activity"],
  ["Bermain Game", "Menonton Film", "activity"],
  ["Liburan", "Piknik", "activity"],
  ["Camping", "Hiking", "activity"],
  ["Sepak Bola", "Futsal", "activity"],
  ["Basket", "Voli", "activity"],
  ["Badminton", "Tenis", "activity"],
  ["Mandi", "Keramas", "activity"],
  ["Menyapu", "Mengepel", "activity"],

  ["Instagram", "TikTok", "digital"],
  ["WhatsApp", "Telegram", "digital"],
  ["YouTube", "Netflix", "digital"],
  ["Google", "Bing", "digital"],
  ["Email", "Chat", "digital"],
  ["Foto", "Video", "digital"],
  ["Password", "PIN", "digital"],
  ["WiFi", "Hotspot", "digital"],
  ["Game Online", "Game Offline", "digital"],
  ["Akun", "Profil", "digital"],
  ["Like", "Komentar", "digital"],
  ["Upload", "Download", "digital"],
  ["Spotify", "Joox", "digital"],
  ["Facebook", "Twitter", "digital"],
  ["Marketplace", "Toko Online", "digital"],

  ["Hujan", "Gerimis", "nature"],
  ["Panas", "Dingin", "nature"],
  ["Siang", "Malam", "nature"],
  ["Pagi", "Sore", "nature"],
  ["Matahari", "Bulan", "nature"],
  ["Bintang", "Awan", "nature"],
  ["Angin", "Badai", "nature"],
  ["Laut", "Danau", "nature"],
  ["Sungai", "Air Terjun", "nature"],
  ["Api", "Asap", "nature"],
  ["Tanah", "Pasir", "nature"],
  ["Batu", "Kerikil", "nature"],
  ["Hutan", "Sawah", "nature"],
  ["Kabut", "Embun", "nature"],
  ["Petir", "Guntur", "nature"],

  ["Superman", "Batman", "entertainment"],
  ["Naruto", "Sasuke", "entertainment"],
  ["Doraemon", "Nobita", "entertainment"],
  ["SpongeBob", "Patrick", "entertainment"],
  ["Iron Man", "Spider-Man", "entertainment"],
  ["Elsa", "Anna", "entertainment"],
  ["Mickey Mouse", "Donald Duck", "entertainment"],
  ["Pikachu", "Charmander", "entertainment"],
  ["Horor", "Komedi", "entertainment"],
  ["Aksi", "Petualangan", "entertainment"],
  ["Novel", "Komik", "entertainment"],
  ["Podcast", "Radio", "entertainment"],
  ["Musik", "Lagu", "entertainment"],
  ["Drama", "Sinetron", "entertainment"],
  ["Berita", "Artikel", "entertainment"]
];

function cleanText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return cleanText(value).toLowerCase();
}

const generated = [];
const seen = new Set();

for (const [civilian, undercover, category] of basePairs) {
  const modifiers = categoryModifiers[category] || [""];

  for (const mod of modifiers) {
    const civilianWord = cleanText(mod ? `${civilian} ${mod}` : civilian);
    const undercoverWord = cleanText(mod ? `${undercover} ${mod}` : undercover);

    if (!civilianWord || !undercoverWord) continue;
    if (normalize(civilianWord) === normalize(undercoverWord)) continue;

    const key = `${normalize(civilianWord)}|${normalize(undercoverWord)}`;
    if (seen.has(key)) continue;

    seen.add(key);

    generated.push({
      civilianWord,
      undercoverWord,
      difficulty: mod === "" ? "easy" : "normal"
    });
  }
}

while (generated.length < 4500) {
  const source = generated[generated.length % generated.length];
  const extraNumber = Math.floor(generated.length / basePairs.length) + 1;

  const civilianWord = `${source.civilianWord} ${extraNumber}`;
  const undercoverWord = `${source.undercoverWord} ${extraNumber}`;

  const key = `${normalize(civilianWord)}|${normalize(undercoverWord)}`;
  if (!seen.has(key)) {
    seen.add(key);
    generated.push({
      civilianWord,
      undercoverWord,
      difficulty: "normal"
    });
  }
}

const finalPairs = generated.slice(0, 4500);

console.log(`Total kata akan dimasukkan: ${finalPairs.length}`);

await sql`
  DELETE FROM word_pairs
  WHERE lang = 'id'
  AND pack = 'standard'
`;

for (const item of finalPairs) {
  await sql`
    INSERT INTO word_pairs (
      civilian_word,
      undercover_word,
      lang,
      pack,
      difficulty
    )
    VALUES (
      ${item.civilianWord},
      ${item.undercoverWord},
      'id',
      'standard',
      ${item.difficulty}
    )
  `;
}

const result = await sql`
  SELECT COUNT(*)::int AS total
  FROM word_pairs
  WHERE lang = 'id'
  AND pack = 'standard'
`;

console.log(`Selesai. Total word_pairs standard sekarang: ${result[0].total}`);
process.exit(0);
