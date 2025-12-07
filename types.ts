
export interface UserInput {
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  schoolName: string;
  className: string;
  subject: string;
  topic: string;
  date: string;
}

export enum DPL {
  DPL1 = "DPL1: Keimanan dan Ketakwaan terhadap Tuhan YME",
  DPL2 = "DPL2: Kewargaan",
  DPL3 = "DPL3: Penalaran Kritis",
  DPL4 = "DPL4: Kreativitas",
  DPL5 = "DPL5: Kolaborasi",
  DPL6 = "DPL6: Kemandirian",
  DPL7 = "DPL7: Kesehatan",
  DPL8 = "DPL8: Komunikasi"
}

export interface MultipleChoiceQuestion {
  pertanyaan: string;
  pilihan: string[];
  kunci: string;
  level_kognitif: string; // e.g., "C4 (Menganalisis)"
  tingkat_kesulitan: string; // e.g., "Sulit"
}

export interface NumeracyQuestion {
  pertanyaan: string;
  kunci: string;
  level_kognitif: string; // e.g., "C5 (Mengevaluasi)"
  tingkat_kesulitan: string; // e.g., "Sulit"
}

export interface LKPD {
  judul: string;
  materi_singkat: string;
  petunjuk_umum: string;
  soal_pilihan_ganda: MultipleChoiceQuestion[];
  soal_numerasi: NumeracyQuestion[];
  rubrik_penilaian: string;
}

export interface VideoRecommendation {
  judul: string;
  deskripsi: string;
  query_pencarian: string;
}

export interface ModulAjar {
  informasi_umum: {
    identitas_sekolah: string;
    kompetensi_awal: string; // FOCUS 1
    dimensi_profil_lulusan: string; // FOCUS 2
  };
  komponen_inti: {
    tujuan_pembelajaran: string; // FOCUS 4
    pertanyaan_pemantik: string; // FOCUS 4
    uraian_materi_detail: string; // FOCUS 3 (Terurai Expanded)
    link_video_materi: string; // FOCUS 3 (Link Video)
    glosarium: string; // FOCUS 4
    daftar_pustaka: string; // FOCUS 4
  };
}

export interface LessonPlanResponse {
  identifikasi: {
    peserta_didik: string;
    materi_pelajaran: string;
    dimensi_profil_lulusan: string[];
  };
  desain_pembelajaran: {
    capaian_pembelajaran: string;
    lintas_disiplin_ilmu: string;
    tujuan_pembelajaran: string;
    topik_pembelajaran: string;
    pertanyaan_pemantik: string;
    praktik_pedagogis: string;
    kemitraan_pembelajaran: string;
    lingkungan_pembelajaran: string;
    pemanfaatan_digital: string;
  };
  langkah_pembelajaran: {
    awal: {
      prinsip: string;
      kegiatan: string;
    };
    inti: {
      memahami: { prinsip: string; kegiatan: string[] };
      mengaplikasi: { prinsip: string; kegiatan: string[] };
      merefleksi: { prinsip: string; kegiatan: string[] };
    };
    penutup: {
      prinsip: string;
      kegiatan: string;
    };
  };
  asesmen_pembelajaran: {
    awal: string;
    proses: string;
    akhir: string;
  };
  modul_ajar: ModulAjar;
  lkpd: LKPD;
  video_rekomendasi: VideoRecommendation[];
}
