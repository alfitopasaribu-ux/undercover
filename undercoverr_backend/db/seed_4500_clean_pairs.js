import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum ada di .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const groups = [
  {
    name: "Makanan Indonesia",
    items: [
      "Nasi Goreng", "Mie Goreng", "Mie Ayam", "Bakso", "Soto", "Rawon", "Rendang", "Gulai",
      "Sate", "Ayam Bakar", "Ayam Goreng", "Ayam Geprek", "Ayam Penyet", "Ikan Goreng",
      "Ikan Bakar", "Pecel Lele", "Nasi Padang", "Nasi Uduk", "Nasi Kuning", "Bubur Ayam",
      "Lontong Sayur", "Ketoprak", "Gado-gado", "Karedok", "Pempek", "Siomay", "Batagor",
      "Sop Buntut", "Sop Ayam", "Capcay", "Kwetiau", "Bihun Goreng", "Nasi Campur",
      "Nasi Liwet", "Gudeg", "Tongseng", "Opor Ayam", "Telur Balado", "Perkedel", "Tempe Goreng"
    ]
  },
  {
    name: "Jajanan",
    items: [
      "Martabak", "Terang Bulan", "Donat", "Cupcake", "Roti Bakar", "Pisang Goreng",
      "Cireng", "Cilok", "Cimol", "Tahu Crispy", "Kentang Goreng", "Risoles", "Pastel",
      "Lumpia", "Kroket", "Bakwan", "Combro", "Misro", "Otak-otak", "Keripik", "Kacang",
      "Popcorn", "Permen", "Cokelat", "Wafer", "Biskuit", "Kue Cubit", "Kue Lapis",
      "Klepon", "Onde-onde", "Serabi", "Pukis", "Lemper", "Dadar Gulung", "Nagasari"
    ]
  },
  {
    name: "Minuman",
    items: [
      "Susu", "Yogurt", "Kopi", "Teh", "Es Teh", "Es Jeruk", "Jus Alpukat", "Jus Mangga",
      "Jus Jambu", "Jus Semangka", "Air Mineral", "Air Kelapa", "Soda", "Sirup",
      "Cokelat Panas", "Susu Hangat", "Milkshake", "Smoothie", "Thai Tea", "Green Tea",
      "Kopi Susu", "Cappuccino", "Latte", "Espresso", "Americano", "Lemon Tea",
      "Matcha", "Boba", "Es Campur", "Es Teler", "Es Cendol", "Es Dawet", "Wedang Jahe",
      "Sekoteng", "Bandrek", "Bajigur", "Jamu", "Yakult", "Kefir", "Sari Kacang Hijau"
    ]
  },
  {
    name: "Buah",
    items: [
      "Apel", "Pir", "Mangga", "Nanas", "Pisang", "Pepaya", "Semangka", "Melon",
      "Jeruk", "Lemon", "Anggur", "Stroberi", "Blueberry", "Rambutan", "Duku",
      "Salak", "Durian", "Nangka", "Sirsak", "Alpukat", "Jambu", "Kelapa",
      "Kiwi", "Markisa", "Manggis", "Ceri", "Leci", "Kurma", "Kelengkeng", "Belimbing"
    ]
  },
  {
    name: "Tempat",
    items: [
      "Pantai", "Kolam Renang", "Gunung", "Bukit", "Taman", "Kebun", "Kebun Binatang",
      "Akuarium", "Bioskop", "Teater", "Mall", "Pasar", "Restoran", "Kafe", "Hotel",
      "Villa", "Rumah", "Apartemen", "Sekolah", "Kampus", "Kantor", "Ruang Rapat",
      "Bandara", "Stasiun", "Terminal", "Halte", "Perpustakaan", "Toko Buku",
      "Rumah Sakit", "Klinik", "Apotek", "Minimarket", "Lapangan", "Stadion",
      "Museum", "Galeri", "Salon", "Barbershop", "Bank", "ATM"
    ]
  },
  {
    name: "Hewan",
    items: [
      "Kucing", "Anjing", "Kelinci", "Hamster", "Ayam", "Bebek", "Burung", "Kelelawar",
      "Singa", "Harimau", "Macan", "Cheetah", "Kuda", "Sapi", "Kambing", "Domba",
      "Gajah", "Badak", "Jerapah", "Zebra", "Monyet", "Gorila", "Panda", "Koala",
      "Ikan", "Udang", "Kepiting", "Lobster", "Paus", "Lumba-lumba", "Hiu", "Ikan Pari",
      "Ular", "Buaya", "Kadal", "Katak", "Kupu-kupu", "Lebah", "Semut", "Nyamuk"
    ]
  },
  {
    name: "Pekerjaan",
    items: [
      "Dokter", "Perawat", "Guru", "Dosen", "Polisi", "Satpam", "Tentara", "Pemadam Kebakaran",
      "Pilot", "Pramugari", "Koki", "Pelayan", "Kasir", "Penjual", "Sopir", "Ojek Online",
      "Petani", "Nelayan", "Programmer", "Desainer", "Fotografer", "Videografer",
      "Penyanyi", "Aktor", "Atlet", "Pelatih", "Pengacara", "Hakim", "Arsitek",
      "Kontraktor", "Montir", "Teknisi", "Reporter", "Presenter", "Barista", "Kurir",
      "Penulis", "Editor", "Dokter Gigi", "Apoteker", "Resepsionis"
    ]
  },
  {
    name: "Teknologi",
    items: [
      "Laptop", "Komputer", "HP", "Tablet", "Keyboard", "Mouse", "Kamera", "Handycam",
      "Televisi", "Proyektor", "Speaker", "Headset", "Earphone", "Charger", "Powerbank",
      "Kipas Angin", "AC", "Kulkas", "Freezer", "Kompor", "Oven", "Microwave",
      "Printer", "Scanner", "Jam Tangan", "Smartwatch", "Router", "Modem", "Flashdisk",
      "Harddisk", "SSD", "Mikrofon", "Kamera Web", "Drone", "Konsol Game", "PlayStation",
      "Xbox", "Nintendo Switch", "Remote", "Kalkulator"
    ]
  },
  {
    name: "Benda",
    items: [
      "Bola", "Balon", "Buku", "Majalah", "Pensil", "Pulpen", "Penghapus", "Penggaris",
      "Tas", "Koper", "Baju", "Jaket", "Celana", "Rok", "Sepatu", "Sandal", "Topi",
      "Helm", "Kacamata", "Lensa Kontak", "Dompet", "Kartu ATM", "Kunci", "Gembok",
      "Meja", "Kursi", "Kasur", "Sofa", "Bantal", "Guling", "Piring", "Mangkok",
      "Sendok", "Garpu", "Pisau", "Gunting", "Sabun", "Sampo", "Handuk", "Selimut",
      "Payung", "Jas Hujan", "Cermin", "Jendela"
    ]
  },
  {
    name: "Aktivitas",
    items: [
      "Tidur", "Istirahat", "Makan", "Minum", "Lari", "Jalan", "Berenang", "Menyelam",
      "Menyanyi", "Menari", "Membaca", "Menulis", "Belajar", "Mengajar", "Memasak",
      "Mencuci", "Belanja", "Menawar", "Menonton", "Mendengar", "Memotret", "Merekam",
      "Menggambar", "Melukis", "Bermain Game", "Menonton Film", "Liburan", "Piknik",
      "Camping", "Hiking", "Mandi", "Keramas", "Menyapu", "Mengepel", "Bekerja",
      "Berdoa", "Berjualan", "Berolahraga", "Mengemudi", "Berjalan-jalan"
    ]
  },
  {
    name: "Olahraga",
    items: [
      "Sepak Bola", "Futsal", "Basket", "Voli", "Badminton", "Tenis", "Tenis Meja",
      "Renang", "Lari", "Maraton", "Bersepeda", "Tinju", "Karate", "Taekwondo",
      "Judo", "Silat", "Yoga", "Gym", "Angkat Besi", "Golf", "Baseball", "Rugby",
      "Skateboard", "Surfing", "Panjat Tebing", "Bowling", "Biliar", "Catur",
      "E-sport", "Senam"
    ]
  },
  {
    name: "Digital",
    items: [
      "Instagram", "TikTok", "WhatsApp", "Telegram", "YouTube", "Netflix", "Google",
      "Bing", "Email", "Chat", "Foto", "Video", "Password", "PIN", "WiFi", "Hotspot",
      "Game Online", "Game Offline", "Akun", "Profil", "Like", "Komentar", "Upload",
      "Download", "Spotify", "Facebook", "Twitter", "Marketplace", "Toko Online",
      "Podcast", "Radio"
    ]
  },
  {
    name: "Alam",
    items: [
      "Hujan", "Gerimis", "Panas", "Dingin", "Siang", "Malam", "Pagi", "Sore",
      "Matahari", "Bulan", "Bintang", "Awan", "Angin", "Badai", "Laut", "Danau",
      "Sungai", "Air Terjun", "Api", "Asap", "Tanah", "Pasir", "Batu", "Kerikil",
      "Hutan", "Sawah", "Kabut", "Embun", "Petir", "Guntur", "Pelangi", "Ombak",
      "Gunung", "Bukit", "Lembah", "Gua", "Pulau", "Pantai"
    ]
  },
  {
    name: "Hiburan",
    items: [
      "Superman", "Batman", "Naruto", "Sasuke", "Doraemon", "Nobita", "SpongeBob",
      "Patrick", "Iron Man", "Spider-Man", "Elsa", "Anna", "Mickey Mouse",
      "Donald Duck", "Pikachu", "Charmander", "Horor", "Komedi", "Aksi",
      "Petualangan", "Novel", "Komik", "Musik", "Lagu", "Drama", "Sinetron",
      "Berita", "Artikel", "Film", "Kartun"
    ]
  },
  {
    name: "Transportasi",
    items: [
      "Motor", "Mobil", "Sepeda", "Skuter", "Bus", "Kereta", "Pesawat", "Helikopter",
      "Kapal", "Perahu", "Truk", "Ambulans", "Taksi", "Becak", "Delman",
      "Ojek", "Grab", "Gojek", "Kapal Feri", "Kapal Selam", "Jet Ski", "Kano",
      "Rakit", "Traktor", "Mobil Polisi", "Mobil Pemadam", "Mobil Balap", "Sepeda Listrik"
    ]
  }
];

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function shuffle(array) {
  let seed = 123456789;
  const result = [...array];

  function random() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
}

const pairs = [];
const seen = new Set();

for (const group of groups) {
  const items = group.items.map((x) => String(x).trim()).filter(Boolean);

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const civilianWord = items[i];
      const undercoverWord = items[j];

      if (normalize(civilianWord) === normalize(undercoverWord)) continue;

      const key1 = `${normalize(civilianWord)}|${normalize(undercoverWord)}`;
      const key2 = `${normalize(undercoverWord)}|${normalize(civilianWord)}`;

      if (seen.has(key1) || seen.has(key2)) continue;

      seen.add(key1);

      pairs.push({
        civilianWord,
        undercoverWord,
        category: group.name
      });
    }
  }
}

const shuffled = shuffle(pairs);
const finalPairs = shuffled.slice(0, 4500);

if (finalPairs.length < 4500) {
  console.error(`Pasangan kata kurang. Baru ada ${finalPairs.length}`);
  process.exit(1);
}

console.log(`Total pasangan natural yang akan dimasukkan: ${finalPairs.length}`);

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
      'easy'
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
