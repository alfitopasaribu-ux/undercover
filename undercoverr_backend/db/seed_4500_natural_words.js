import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum ada di .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const clusters = [
  {
    name: "Nasi dan makanan berat",
    items: [
      "Nasi Goreng", "Nasi Uduk", "Nasi Kuning", "Nasi Padang", "Nasi Campur",
      "Nasi Liwet", "Nasi Kebuli", "Nasi Bakar", "Nasi Rawon", "Nasi Pecel",
      "Nasi Gudeg", "Nasi Rendang", "Nasi Ayam", "Nasi Telur", "Nasi Kucing",
      "Nasi Jagung", "Nasi Tumpeng", "Nasi Bali", "Nasi Hainan", "Nasi Kapau",
      "Nasi Timbel", "Nasi Gandul"
    ]
  },
  {
    name: "Mie, bakso, dan kuah",
    items: [
      "Mie Ayam", "Bakso", "Soto", "Rawon", "Sop Ayam", "Sop Buntut",
      "Mie Goreng", "Kwetiau", "Bihun Goreng", "Mie Rebus", "Mie Aceh",
      "Mie Kocok", "Laksa", "Seblak", "Bakmi", "Ramen", "Udon", "Pho",
      "Capcay", "Lontong Sayur", "Ketoprak", "Gado-gado"
    ]
  },
  {
    name: "Lauk pauk",
    items: [
      "Rendang", "Gulai", "Sate", "Ayam Bakar", "Ayam Goreng", "Ayam Geprek",
      "Ayam Penyet", "Ikan Bakar", "Ikan Goreng", "Bebek Goreng", "Bebek Bakar",
      "Tongseng", "Opor Ayam", "Semur Daging", "Dendeng", "Steak", "Kebab",
      "Nugget", "Sosis", "Burger", "Pizza", "Hotdog"
    ]
  },
  {
    name: "Jajanan gurih",
    items: [
      "Martabak", "Pempek", "Siomay", "Batagor", "Cilok", "Cireng", "Cimol",
      "Tahu Crispy", "Kentang Goreng", "Risoles", "Pastel", "Lumpia", "Kroket",
      "Bakwan", "Combro", "Otak-otak", "Keripik", "Kacang", "Popcorn",
      "Pangsit", "Dimsum", "Samosa"
    ]
  },
  {
    name: "Kue dan manisan",
    items: [
      "Donat", "Cupcake", "Roti Bakar", "Terang Bulan", "Kue Cubit", "Kue Lapis",
      "Klepon", "Onde-onde", "Serabi", "Pukis", "Lemper", "Dadar Gulung",
      "Nagasari", "Brownies", "Cheesecake", "Pancake", "Waffle", "Puding",
      "Es Krim", "Permen", "Cokelat", "Wafer"
    ]
  },
  {
    name: "Minuman hangat dan kafe",
    items: [
      "Susu", "Yogurt", "Kopi", "Teh", "Kopi Susu", "Cappuccino", "Latte",
      "Espresso", "Americano", "Cokelat Panas", "Susu Hangat", "Thai Tea",
      "Green Tea", "Matcha", "Lemon Tea", "Boba", "Milkshake", "Smoothie",
      "Yakult", "Kefir", "Jamu", "Wedang Jahe"
    ]
  },
  {
    name: "Minuman segar",
    items: [
      "Es Teh", "Es Jeruk", "Jus Alpukat", "Jus Mangga", "Jus Jambu",
      "Jus Semangka", "Jus Melon", "Jus Apel", "Jus Nanas", "Air Mineral",
      "Air Kelapa", "Soda", "Sirup", "Es Campur", "Es Teler", "Es Cendol",
      "Es Dawet", "Sekoteng", "Bandrek", "Bajigur", "Teh Botol", "Sari Kacang Hijau"
    ]
  },
  {
    name: "Buah",
    items: [
      "Apel", "Pir", "Mangga", "Nanas", "Pisang", "Pepaya", "Semangka", "Melon",
      "Jeruk", "Lemon", "Anggur", "Stroberi", "Blueberry", "Rambutan", "Duku",
      "Salak", "Durian", "Nangka", "Sirsak", "Alpukat", "Jambu", "Kelapa"
    ]
  },
  {
    name: "Tempat wisata",
    items: [
      "Pantai", "Kolam Renang", "Gunung", "Bukit", "Taman", "Kebun",
      "Kebun Binatang", "Akuarium", "Bioskop", "Teater", "Museum", "Galeri",
      "Stadion", "Lapangan", "Pulau", "Danau", "Air Terjun", "Hutan", "Sawah",
      "Villa", "Hotel", "Resort"
    ]
  },
  {
    name: "Tempat umum",
    items: [
      "Mall", "Pasar", "Restoran", "Kafe", "Rumah", "Apartemen", "Sekolah",
      "Kampus", "Kantor", "Ruang Rapat", "Bandara", "Stasiun", "Terminal",
      "Halte", "Perpustakaan", "Toko Buku", "Rumah Sakit", "Klinik", "Apotek",
      "Minimarket", "Bank", "ATM"
    ]
  },
  {
    name: "Hewan peliharaan dan ternak",
    items: [
      "Kucing", "Anjing", "Kelinci", "Hamster", "Ayam", "Bebek", "Burung",
      "Kuda", "Sapi", "Kambing", "Domba", "Ikan", "Kura-kura", "Marmut",
      "Angsa", "Merpati", "Kenari", "Kakatua", "Kalkun", "Kerbau", "Keledai",
      "Babi"
    ]
  },
  {
    name: "Hewan liar",
    items: [
      "Singa", "Harimau", "Macan", "Cheetah", "Gajah", "Badak", "Jerapah",
      "Zebra", "Monyet", "Gorila", "Panda", "Koala", "Beruang", "Serigala",
      "Rubah", "Rusa", "Kanguru", "Kuda Nil", "Ular", "Buaya", "Katak", "Kadal"
    ]
  },
  {
    name: "Hewan laut dan serangga",
    items: [
      "Paus", "Lumba-lumba", "Hiu", "Ikan Pari", "Udang", "Kepiting",
      "Lobster", "Cumi-cumi", "Gurita", "Kuda Laut", "Bintang Laut", "Kerang",
      "Ubur-ubur", "Kupu-kupu", "Lebah", "Semut", "Nyamuk", "Lalat", "Kecoa",
      "Capung", "Belalang", "Jangkrik"
    ]
  },
  {
    name: "Pekerjaan umum",
    items: [
      "Dokter", "Perawat", "Guru", "Dosen", "Polisi", "Satpam", "Tentara",
      "Pemadam Kebakaran", "Pilot", "Pramugari", "Koki", "Pelayan", "Kasir",
      "Penjual", "Sopir", "Ojek Online", "Petani", "Nelayan", "Apoteker",
      "Resepsionis", "Kurir", "Barista"
    ]
  },
  {
    name: "Pekerjaan kreatif dan kantor",
    items: [
      "Programmer", "Desainer", "Fotografer", "Videografer", "Penyanyi",
      "Aktor", "Atlet", "Pelatih", "Pengacara", "Hakim", "Arsitek",
      "Kontraktor", "Montir", "Teknisi", "Reporter", "Presenter", "Penulis",
      "Editor", "Akuntan", "Sekretaris", "Manajer", "Direktur"
    ]
  },
  {
    name: "Teknologi dan elektronik",
    items: [
      "Laptop", "Komputer", "HP", "Tablet", "Keyboard", "Mouse", "Kamera",
      "Handycam", "Televisi", "Proyektor", "Speaker", "Headset", "Earphone",
      "Charger", "Powerbank", "Printer", "Scanner", "Smartwatch", "Router",
      "Modem", "Flashdisk", "Harddisk"
    ]
  },
  {
    name: "Alat rumah",
    items: [
      "Kipas Angin", "AC", "Kulkas", "Freezer", "Kompor", "Oven", "Microwave",
      "Rice Cooker", "Blender", "Setrika", "Mesin Cuci", "Vacuum Cleaner",
      "Sapu", "Pel", "Ember", "Gayung", "Pisau", "Gunting", "Piring",
      "Mangkok", "Sendok", "Garpu"
    ]
  },
  {
    name: "Pakaian dan aksesori",
    items: [
      "Baju", "Jaket", "Celana", "Rok", "Kemeja", "Kaos", "Hoodie", "Jas",
      "Gaun", "Seragam", "Sepatu", "Sandal", "Topi", "Helm", "Kacamata",
      "Jam Tangan", "Dompet", "Tas", "Koper", "Ikat Pinggang", "Dasi", "Syal"
    ]
  },
  {
    name: "Transportasi",
    items: [
      "Motor", "Mobil", "Sepeda", "Skuter", "Bus", "Kereta", "Pesawat",
      "Helikopter", "Kapal", "Perahu", "Truk", "Ambulans", "Taksi", "Becak",
      "Delman", "Ojek", "Grab", "Gojek", "Kapal Feri", "Kapal Selam",
      "Jet Ski", "Sepeda Listrik"
    ]
  },
  {
    name: "Olahraga",
    items: [
      "Sepak Bola", "Futsal", "Basket", "Voli", "Badminton", "Tenis",
      "Tenis Meja", "Renang", "Lari", "Maraton", "Bersepeda", "Tinju",
      "Karate", "Taekwondo", "Judo", "Silat", "Yoga", "Gym", "Angkat Besi",
      "Golf", "Bowling", "Catur"
    ]
  },
  {
    name: "Digital dan hiburan",
    items: [
      "Instagram", "TikTok", "WhatsApp", "Telegram", "YouTube", "Netflix",
      "Google", "Bing", "Email", "Chat", "Foto", "Video", "Password", "PIN",
      "WiFi", "Hotspot", "Game Online", "Game Offline", "Akun", "Profil",
      "Spotify", "Podcast"
    ]
  }
];

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function shuffle(array) {
  let seed = 987654321;
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

for (const cluster of clusters) {
  const items = cluster.items.map((x) => String(x).trim()).filter(Boolean);

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const civilianWord = items[i];
      const undercoverWord = items[j];

      const a = normalize(civilianWord);
      const b = normalize(undercoverWord);

      if (a === b) continue;

      const key = [a, b].sort().join("|");

      if (seen.has(key)) continue;

      seen.add(key);

      pairs.push({
        civilianWord,
        undercoverWord,
        category: cluster.name
      });
    }
  }
}

const finalPairs = shuffle(pairs).slice(0, 4500);

console.log(`Total pasangan tersedia: ${pairs.length}`);
console.log(`Total yang akan dimasukkan: ${finalPairs.length}`);

if (finalPairs.length < 4500) {
  console.error("Gagal: pasangan belum sampai 4500.");
  process.exit(1);
}

await sql`
  DELETE FROM word_pairs
  WHERE lang = 'id'
  AND pack IN ('standard', 'standard_auto_bad')
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
