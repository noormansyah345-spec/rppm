
import { GoogleGenAI, Type, SchemaParams } from "@google/genai";
import { UserInput, LessonPlanResponse } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: SchemaParams = {
  type: Type.OBJECT,
  properties: {
    identifikasi: {
      type: Type.OBJECT,
      properties: {
        peserta_didik: { type: Type.STRING, description: "Analysis of student (murid) readiness, interests, background." },
        materi_pelajaran: { type: Type.STRING, description: "Analysis of material structure, relevance to DAILY LIFE, difficulty." },
        dimensi_profil_lulusan: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of selected DPL codes ONLY (e.g. ['DPL1', 'DPL3', 'DPL5']) that are most relevant to the topic."
        }
      },
      required: ["peserta_didik", "materi_pelajaran", "dimensi_profil_lulusan"]
    },
    desain_pembelajaran: {
      type: Type.OBJECT,
      properties: {
        capaian_pembelajaran: { type: Type.STRING },
        lintas_disiplin_ilmu: { type: Type.STRING },
        tujuan_pembelajaran: { type: Type.STRING },
        topik_pembelajaran: { type: Type.STRING },
        pertanyaan_pemantik: { type: Type.STRING },
        praktik_pedagogis: { type: Type.STRING },
        kemitraan_pembelajaran: { type: Type.STRING },
        lingkungan_pembelajaran: { type: Type.STRING },
        pemanfaatan_digital: { type: Type.STRING },
      },
      required: ["capaian_pembelajaran", "lintas_disiplin_ilmu", "tujuan_pembelajaran", "topik_pembelajaran", "pertanyaan_pemantik", "praktik_pedagogis", "kemitraan_pembelajaran", "lingkungan_pembelajaran", "pemanfaatan_digital"]
    },
    langkah_pembelajaran: {
      type: Type.OBJECT,
      properties: {
        awal: {
          type: Type.OBJECT,
          properties: {
            prinsip: { type: Type.STRING },
            kegiatan: { type: Type.STRING }
          }
        },
        inti: {
          type: Type.OBJECT,
          properties: {
            memahami: {
              type: Type.OBJECT,
              properties: {
                prinsip: { type: Type.STRING },
                kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            mengaplikasi: {
              type: Type.OBJECT,
              properties: {
                prinsip: { type: Type.STRING },
                kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            merefleksi: {
              type: Type.OBJECT,
              properties: {
                prinsip: { type: Type.STRING },
                kegiatan: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        },
        penutup: {
          type: Type.OBJECT,
          properties: {
            prinsip: { type: Type.STRING },
            kegiatan: { type: Type.STRING }
          }
        }
      },
      required: ["awal", "inti", "penutup"]
    },
    asesmen_pembelajaran: {
      type: Type.OBJECT,
      properties: {
        awal: { type: Type.STRING },
        proses: { type: Type.STRING },
        akhir: { type: Type.STRING }
      },
      required: ["awal", "proses", "akhir"]
    },
    modul_ajar: {
      type: Type.OBJECT,
      properties: {
        informasi_umum: {
          type: Type.OBJECT,
          properties: {
            identitas_sekolah: { type: Type.STRING },
            kompetensi_awal: { type: Type.STRING, description: "Focus on student prior knowledge" },
            dimensi_profil_lulusan: { type: Type.STRING, description: "Describe the specific DPL targets" }
          },
          required: ["identitas_sekolah", "kompetensi_awal", "dimensi_profil_lulusan"]
        },
        komponen_inti: {
          type: Type.OBJECT,
          properties: {
            tujuan_pembelajaran: { type: Type.STRING },
            pertanyaan_pemantik: { type: Type.STRING },
            uraian_materi_detail: { type: Type.STRING, description: "VERY EXTENSIVE, COMPREHENSIVE, AND DETAILED explanation of the material (Isi Materi Terurai secara mendalam)." },
            link_video_materi: { type: Type.STRING, description: "Search query for a video specifically matching the detailed material." },
            glosarium: { type: Type.STRING },
            daftar_pustaka: { type: Type.STRING }
          },
          required: ["tujuan_pembelajaran", "pertanyaan_pemantik", "uraian_materi_detail", "link_video_materi", "glosarium", "daftar_pustaka"]
        }
      },
      required: ["informasi_umum", "komponen_inti"]
    },
    lkpd: {
      type: Type.OBJECT,
      properties: {
        judul: { type: Type.STRING },
        materi_singkat: { type: Type.STRING },
        petunjuk_umum: { type: Type.STRING },
        soal_pilihan_ganda: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              pertanyaan: { type: Type.STRING },
              pilihan: { type: Type.ARRAY, items: { type: Type.STRING } },
              kunci: { type: Type.STRING },
              level_kognitif: { type: Type.STRING, description: "Bloom's taxonomy level (e.g., 'C2 (Memahami)', 'C4 (Menganalisis)')" },
              tingkat_kesulitan: { type: Type.STRING, description: "'Mudah', 'Sedang', or 'Sulit'" }
            },
            required: ["pertanyaan", "pilihan", "kunci", "level_kognitif", "tingkat_kesulitan"]
          }
        },
        soal_numerasi: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              pertanyaan: { type: Type.STRING },
              kunci: { type: Type.STRING },
              level_kognitif: { type: Type.STRING, description: "Bloom's taxonomy level (C3, C4, C5, C6)" },
              tingkat_kesulitan: { type: Type.STRING, description: "'Sedang' or 'Sulit'" }
            },
            required: ["pertanyaan", "kunci", "level_kognitif", "tingkat_kesulitan"]
          }
        },
        rubrik_penilaian: { type: Type.STRING }
      },
      required: ["judul", "materi_singkat", "petunjuk_umum", "soal_pilihan_ganda", "soal_numerasi", "rubrik_penilaian"]
    },
    video_rekomendasi: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          judul: { type: Type.STRING },
          deskripsi: { type: Type.STRING },
          query_pencarian: { type: Type.STRING }
        },
        required: ["judul", "deskripsi", "query_pencarian"]
      }
    }
  }
};

export const generateLessonPlan = async (input: UserInput): Promise<LessonPlanResponse> => {
  const prompt = `
    Role: You are an expert Indonesian Curriculum Designer.
    Task: Create "RPPM" (Deep Learning Plan), "Modul Ajar", and "LKM".

    Context:
    Teacher: ${input.teacherName}
    School: ${input.schoolName}
    Class: ${input.className}
    Subject: ${input.subject}
    Topic: ${input.topic}

    REQUIREMENTS:
    1. **Terminology**: Use "murid" (lowercase).
    2. **Video**: STRICTLY search for "Animasi Pembelajaran" or "Kartun Edukasi" for videos.
    3. **Modul Ajar Focus**:
       - **Kompetensi Awal**: Elaborate on what students must know before this lesson.
       - **Dimensi Profil Lulusan**: List the specific dimensions targeted.
       - **Uraian Materi**: Provide a VERY DETAILED, EXTENSIVE, LONG explanation of the topic material (Isi Materi Terurai). It should be substantial enough for a full lesson.
       - **Link Video**: Inside the material section, provide a specific search query for a video that explains this material.
       - **Komponen Inti**: Only include Tujuan Pembelajaran, Pertanyaan Pemantik, Uraian Materi, Glosarium, and Daftar Pustaka.
       - **EXCLUSIONS**: Do NOT include Sarana Prasarana, Target Murid, Model Pembelajaran, Kegiatan Pembelajaran, Asesmen, Refleksi, or Lampiran in the Modul Ajar section.
    4. **Formatting**:
       - STRICTLY PLAIN TEXT.
       - DO NOT use markdown symbols like **, ##, *, or #.
       - DO NOT use bullet points that look like markdown. Use standard numbering (1. 2. 3.) or plain dashes (-).
    5. **Questions**:
       - 10 MCQs (Keys + Levels C1-C6).
       - 10 Numeracy (HOTS C3-C5 + Keys).

    Language: Indonesian.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as LessonPlanResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
