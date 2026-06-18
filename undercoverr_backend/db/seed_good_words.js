import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum ada di .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const pairs = [
  ["Nasi Goreng", "Mie Goreng", "easy"],
  ["Bakso", "Soto", "easy"],
  ["Sate", "Ayam Bakar", "easy"],
  ["Pizza", "Burger", "easy"],
  ["Kopi", "Teh", "easy"],
  ["Es Teh", "Es Jeruk", "easy"],
  ["Susu", "Yogurt", "easy"],
  ["Roti", "Kue", "easy"],
  ["Donat", "Cupcake", "easy"],
  ["Cokelat", "Permen", "easy"],
  ["Keripik", "Kacang", "easy"],
  ["Semangka", "Melon", "easy"],
  ["Apel", "Pir", "easy"],
  ["Mangga", "Nanas", "easy"],
  ["Pisang", "Pepaya", "easy"],
  ["Ikan Goreng", "Ayam Goreng", "easy"],
  ["Rendang", "Gulai", "normal"],
  ["Bubur Ayam", "Nasi Uduk", "normal"],
  ["Martabak", "Terang Bulan", "normal"],
  ["Pempek", "Siomay", "normal"],

  ["Pantai", "Kolam Renang", "easy"],
  ["Gunung", "Bukit", "easy"],
  ["Sekolah", "Kampus", "easy"],
  ["Rumah", "Apartemen", "easy"],
  ["Hotel", "Villa", "easy"],
  ["Mall", "Pasar", "easy"],
  ["Bioskop", "Teater", "easy"],
  ["Bandara", "Stasiun", "easy"],
  ["Terminal", "Halte", "easy"],
  ["Kantor", "Ruang Rapat", "easy"],
  ["Restoran", "Kafe", "easy"],
  ["Taman", "Kebun", "easy"],
  ["Kebun Binatang", "Akuarium", "normal"],
  ["Perpustakaan", "Toko Buku", "normal"],
  ["Rumah Sakit", "Klinik", "normal"],
  ["Apotek", "Minimarket", "normal"],
  ["Lapangan", "Stadion", "easy"],
  ["Gereja", "Kapel", "normal"],
  ["Masjid", "Mushola", "normal"],
  ["Museum", "Galeri", "normal"],

  ["Kucing", "Anjing", "easy"],
  ["Singa", "Harimau", "easy"],
  ["Ayam", "Bebek", "easy"],
  ["Kuda", "Sapi", "easy"],
  ["Kambing", "Domba", "easy"],
  ["Ikan", "Udang", "easy"],
  ["Paus", "Lumba-lumba", "normal"],
  ["Burung", "Kelelawar", "normal"],
  ["Ular", "Buaya", "normal"],
  ["Kupu-kupu", "Lebah", "easy"],
  ["Semut", "Nyamuk", "easy"],
  ["Kelinci", "Hamster", "easy"],
  ["Gajah", "Badak", "normal"],
  ["Monyet", "Gorila", "normal"],
  ["Katak", "Kadal", "normal"],

  ["Dokter", "Perawat", "easy"],
  ["Guru", "Dosen", "easy"],
  ["Polisi", "Satpam", "easy"],
  ["Pilot", "Pramugari", "normal"],
  ["Koki", "Pelayan", "easy"],
  ["Kasir", "Penjual", "easy"],
  ["Sopir", "Ojek Online", "easy"],
  ["Petani", "Nelayan", "easy"],
  ["Programmer", "Desainer", "normal"],
  ["Fotografer", "Videografer", "normal"],
  ["Penyanyi", "Aktor", "easy"],
  ["Atlet", "Pelatih", "easy"],
  ["Pengacara", "Hakim", "normal"],
  ["Arsitek", "Kontraktor", "normal"],
  ["Montir", "Teknisi", "normal"],

  ["Laptop", "Komputer", "easy"],
  ["HP", "Tablet", "easy"],
  ["Keyboard", "Mouse", "easy"],
  ["Kamera", "Handycam", "normal"],
  ["Televisi", "Proyektor", "normal"],
  ["Speaker", "Headset", "easy"],
  ["Charger", "Powerbank", "easy"],
  ["Kipas Angin", "AC", "easy"],
  ["Kulkas", "Freezer", "normal"],
  ["Kompor", "Oven", "normal"],
  ["Printer", "Scanner", "normal"],
  ["Jam Tangan", "Alarm", "normal"],
  ["Motor", "Mobil", "easy"],
  ["Sepeda", "Skuter", "easy"],
  ["Kapal", "Perahu", "normal"],
  ["Pesawat", "Helikopter", "normal"],
  ["Kereta", "Bus", "easy"],

  ["Bola", "Balon", "easy"],
  ["Buku", "Majalah", "easy"],
  ["Pensil", "Pulpen", "easy"],
  ["Tas", "Koper", "easy"],
  ["Baju", "Jaket", "easy"],
  ["Sepatu", "Sandal", "easy"],
  ["Topi", "Helm", "normal"],
  ["Kacamata", "Lensa Kontak", "normal"],
  ["Dompet", "Kartu ATM", "normal"],
  ["Kunci", "Gembok", "easy"],
  ["Meja", "Kursi", "easy"],
  ["Kasur", "Sofa", "easy"],
  ["Bantal", "Guling", "easy"],
  ["Piring", "Mangkok", "easy"],
  ["Sendok", "Garpu", "easy"],
  ["Pisau", "Gunting", "normal"],
  ["Sabun", "Sampo", "easy"],
  ["Handuk", "Selimut", "normal"],

  ["Tidur", "Istirahat", "easy"],
  ["Makan", "Minum", "easy"],
  ["Lari", "Jalan", "easy"],
  ["Berenang", "Menyelam", "normal"],
  ["Menyanyi", "Menari", "easy"],
  ["Membaca", "Menulis", "easy"],
  ["Belajar", "Mengajar", "normal"],
  ["Memasak", "Mencuci", "normal"],
  ["Belanja", "Menawar", "normal"],
  ["Menonton", "Mendengar", "normal"],
  ["Memotret", "Merekam", "normal"],
  ["Menggambar", "Melukis", "normal"],
  ["Bermain Game", "Menonton Film", "normal"],
  ["Liburan", "Piknik", "easy"],
  ["Camping", "Hiking", "normal"],
  ["Sepak Bola", "Futsal", "easy"],
  ["Basket", "Voli", "easy"],
  ["Badminton", "Tenis", "normal"],

  ["Instagram", "TikTok", "easy"],
  ["WhatsApp", "Telegram", "easy"],
  ["YouTube", "Netflix", "easy"],
  ["Google", "Bing", "normal"],
  ["Email", "Chat", "easy"],
  ["Foto", "Video", "easy"],
  ["Password", "PIN", "normal"],
  ["WiFi", "Hotspot", "easy"],
  ["Game Online", "Game Offline", "normal"],
  ["Akun", "Profil", "normal"],
  ["Like", "Komentar", "easy"],
  ["Upload", "Download", "normal"],

  ["Hujan", "Gerimis", "easy"],
  ["Panas", "Dingin", "easy"],
  ["Siang", "Malam", "easy"],
  ["Pagi", "Sore", "easy"],
  ["Matahari", "Bulan", "easy"],
  ["Bintang", "Awan", "normal"],
  ["Angin", "Badai", "normal"],
  ["Laut", "Danau", "easy"],
  ["Sungai", "Air Terjun", "normal"],
  ["Api", "Asap", "normal"],
  ["Tanah", "Pasir", "normal"],
  ["Batu", "Kerikil", "normal"],

  ["Superman", "Batman", "easy"],
  ["Naruto", "Sasuke", "easy"],
  ["Doraemon", "Nobita", "easy"],
  ["SpongeBob", "Patrick", "easy"],
  ["Iron Man", "Spider-Man", "easy"],
  ["Elsa", "Anna", "normal"],
  ["Mickey Mouse", "Donald Duck", "normal"],
  ["Pikachu", "Charmander", "normal"],

  ["Ayah", "Ibu", "easy"],
  ["Kakak", "Adik", "easy"],
  ["Teman", "Sahabat", "easy"],
  ["Pacar", "Gebetan", "normal"],
  ["Tetangga", "Tamu", "normal"],
  ["Bos", "Karyawan", "normal"],
  ["Pembeli", "Penjual", "easy"],
  ["Pemain", "Penonton", "easy"],
  ["Pemenang", "Juara", "normal"],

  ["Uang", "Koin", "easy"],
  ["Bank", "ATM", "easy"],
  ["Harga", "Diskon", "normal"],
  ["Tiket", "Karcis", "normal"],
  ["Hadiah", "Bonus", "normal"],
  ["Gaji", "Upah", "normal"],
  ["Belanja", "Bayar", "easy"],

  ["Horor", "Komedi", "easy"],
  ["Aksi", "Petualangan", "normal"],
  ["Musik", "Lagu", "easy"],
  ["Drama", "Sinetron", "normal"],
  ["Novel", "Komik", "easy"],
  ["Berita", "Artikel", "normal"],
  ["Podcast", "Radio", "normal"],

  ["Merah", "Biru", "easy"],
  ["Hitam", "Putih", "easy"],
  ["Kuning", "Hijau", "easy"],
  ["Besar", "Kecil", "easy"],
  ["Cepat", "Lambat", "easy"],
  ["Tinggi", "Pendek", "easy"],
  ["Kanan", "Kiri", "easy"],
  ["Depan", "Belakang", "easy"],
  ["Atas", "Bawah", "easy"],
  ["Manis", "Asin", "easy"],
  ["Pedas", "Asam", "easy"],
  ["Mahal", "Murah", "easy"]
];

function normalize(value) {
  return String(value).trim().toLowerCase();
}

const cleaned = [];
const seen = new Set();

for (const item of pairs) {
  const civilianWord = item[0].trim();
  const undercoverWord = item[1].trim();
  const difficulty = item[2];

  if (!civilianWord || !undercoverWord) continue;
  if (normalize(civilianWord) === normalize(undercoverWord)) continue;

  const key = `${normalize(civilianWord)}|${normalize(undercoverWord)}`;
  if (seen.has(key)) continue;

  seen.add(key);
  cleaned.push({
    civilianWord,
    undercoverWord,
    difficulty
  });
}

console.log(`Total kata bagus yang akan dimasukkan: ${cleaned.length}`);

await sql`
  DELETE FROM word_pairs
  WHERE lang = 'id'
  AND pack = 'standard'
`;

for (const item of cleaned) {
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
