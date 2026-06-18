import "dotenv/config";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum ada di .env");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const suffixes = [
  "Rasa Strawberry",
  "Rasa Cokelat",
  "Rasa Vanilla",
  "Porsi Besar",
  "Porsi Kecil",
  "Makan Siang",
  "Makan Malam",
  "Menu Warung",
  "Menu Kafe",
  "Cepat Saji",
  "Rendah Gula",
  "Tanpa Gula",
  "Dalam Kota",
  "Luar Kota",
  "Dekat Rumah",
  "Dekat Kampus",
  "Di Kebun Binatang",
  "Bersuara Keras",
  "Favorit Anak",
  "Anak-anak",
  "Profesional",
  "Berpengalaman",
  "Tradisional",
  "Peliharaan",
  "Restoran",
  "Rumahan",
  "Terkenal",
  "Keluarga",
  "Liburan",
  "Mingguan",
  "Sebentar",
  "Menegangkan",
  "Indonesia",
  "Luar Negeri",
  "Berbayar",
  "Kemasan",
  "Premium",
  "Sarapan",
  "Modern",
  "Favorit",
  "Spesial",
  "Dingin",
  "Hangat",
  "Manis",
  "Pedas",
  "Murah",
  "Mahal",
  "Botol",
  "Gelas",
  "Kafe",
  "Segar",
  "Pagi",
  "Malam",
  "Sehat",
  "Ramai",
  "Sepi",
  "Dekat",
  "Jauh",
  "Baru",
  "Lama",
  "Besar",
  "Kecil",
  "Wisata",
  "Nyaman",
  "Lucu",
  "Jinak",
  "Liar",
  "Kartun",
  "Bayi",
  "Dewasa",
  "Gemuk",
  "Kurus",
  "Cepat",
  "Lambat",
  "Rumah",
  "Hutan",
  "Air",
  "Darat",
  "Berbulu",
  "Unik",
  "Senior",
  "Junior",
  "Magang",
  "Kantor",
  "Lapangan",
  "Seragam",
  "Sibuk",
  "Santai",
  "Tim",
  "Mandiri",
  "Kota",
  "Desa",
  "Ahli",
  "Pemula",
  "Ramah",
  "Disiplin",
  "Bekas",
  "Gaming",
  "Sekolah",
  "Mini",
  "Wireless",
  "Portable",
  "Canggih",
  "Rusak",
  "Standar",
  "Online",
  "Offline",
  "Digital",
  "Klasik",
  "Travel",
  "Harian",
  "Ringan",
  "Berat",
  "Pelan",
  "Bersama",
  "Serius",
  "Rutin",
  "Aplikasi",
  "Video",
  "Foto",
  "Live",
  "Komentar",
  "Like",
  "Chat",
  "Grup",
  "Story",
  "Status",
  "Populer",
  "Privat",
  "Publik",
  "HP",
  "Laptop",
  "Tenang",
  "Deras",
  "Indah",
  "Gelap",
  "Terang",
  "Panas",
  "Basah",
  "Kering",
  "Alami",
  "Tenar",
  "Bersih",
  "Kotor",
  "Dalam",
  "Dangkal",
  "Seru",
  "Sedih",
  "Weekend",
  "Gratis",
  "Pendek",
  "Panjang",
  "Enak",
  "Tawar",
  "Putih",
  "Hitam"
].sort((a, b) => b.length - a.length);

function cleanText(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function normalize(value) {
  return cleanText(value).toLowerCase();
}

function removeSameTrailingNumber(a, b) {
  const aMatch = a.match(/\s+(\d+)$/);
  const bMatch = b.match(/\s+(\d+)$/);

  if (aMatch && bMatch && aMatch[1] === bMatch[1]) {
    return [
      cleanText(a.replace(/\s+\d+$/, "")),
      cleanText(b.replace(/\s+\d+$/, ""))
    ];
  }

  return [a, b];
}

function removeSharedSuffix(a, b) {
  let civilian = cleanText(a);
  let undercover = cleanText(b);

  [civilian, undercover] = removeSameTrailingNumber(civilian, undercover);

  let changed = true;

  while (changed) {
    changed = false;

    for (const suffix of suffixes) {
      const lowerSuffix = suffix.toLowerCase();

      const civilianLower = civilian.toLowerCase();
      const undercoverLower = undercover.toLowerCase();

      const civilianEnds = civilianLower.endsWith(" " + lowerSuffix);
      const undercoverEnds = undercoverLower.endsWith(" " + lowerSuffix);

      if (civilianEnds && undercoverEnds) {
        civilian = cleanText(civilian.slice(0, civilian.length - suffix.length));
        undercover = cleanText(undercover.slice(0, undercover.length - suffix.length));
        changed = true;
        break;
      }
    }

    [civilian, undercover] = removeSameTrailingNumber(civilian, undercover);
  }

  return [civilian, undercover];
}

const rows = await sql`
  SELECT civilian_word, undercover_word
  FROM word_pairs
  WHERE lang = 'id'
  AND pack = 'standard'
`;

const seen = new Set();
const cleanedPairs = [];

for (const row of rows) {
  let civilian = cleanText(row.civilian_word);
  let undercover = cleanText(row.undercover_word);

  [civilian, undercover] = removeSharedSuffix(civilian, undercover);

  if (!civilian || !undercover) continue;
  if (normalize(civilian) === normalize(undercover)) continue;

  const key = `${normalize(civilian)}|${normalize(undercover)}`;

  if (seen.has(key)) continue;

  seen.add(key);

  cleanedPairs.push({
    civilian,
    undercover
  });
}

console.log(`Data lama dibaca: ${rows.length}`);
console.log(`Data simple yang akan disimpan: ${cleanedPairs.length}`);

await sql`
  DELETE FROM word_pairs
  WHERE lang = 'id'
  AND pack = 'standard'
`;

for (const item of cleanedPairs) {
  await sql`
    INSERT INTO word_pairs (
      civilian_word,
      undercover_word,
      lang,
      pack,
      difficulty
    )
    VALUES (
      ${item.civilian},
      ${item.undercover},
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

console.log(`Selesai. Total kata simple sekarang: ${result[0].total}`);
process.exit(0);
