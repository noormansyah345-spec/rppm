
import React, { useState } from 'react';
import { LessonPlanResponse, UserInput } from '../types';
import { ArrowLeft, Copy, BookOpen, FileText, FileDown, Key, Youtube, ExternalLink, Library } from 'lucide-react';

interface Props {
  data: LessonPlanResponse;
  input: UserInput;
  onBack: () => void;
}

export const LessonPlanView: React.FC<Props> = ({ data, input, onBack }) => {
  const [activeTab, setActiveTab] = useState<'rppm' | 'modul' | 'lkpd' | 'media'>('rppm');
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  
  // State for interactive answering
  const [userMcqAnswers, setUserMcqAnswers] = useState<{[key: number]: string}>({});
  const [userNumAnswers, setUserNumAnswers] = useState<{[key: number]: string}>({});

  // Helper to remove any lingering markdown artifacts
  const cleanText = (text: string | undefined) => {
    if (!text) return "";
    return text.replace(/\*\*|__|##|[*#]/g, '');
  };

  const dpls = [
    { code: 'DPL1', label: 'Keimanan dan Ketakwaan terhadap Tuhan YME' },
    { code: 'DPL3', label: 'Penalaran Kritis' },
    { code: 'DPL5', label: 'Kolaborasi' },
    { code: 'DPL7', label: 'Kesehatan' },
    { code: 'DPL2', label: 'Kewargaan' },
    { code: 'DPL4', label: 'Kreativitas' },
    { code: 'DPL6', label: 'Kemandirian' },
    { code: 'DPL8', label: 'Komunikasi' },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToWord = () => {
    const content = document.getElementById('printable-area');
    if (!content) {
      alert("Konten tidak ditemukan!");
      return;
    }

    const textareas = content.querySelectorAll('textarea');
    textareas.forEach(ta => {
        ta.setAttribute('data-placeholder', ta.placeholder);
        ta.placeholder = '';
        ta.innerHTML = ta.value; 
    });

    const range = document.createRange();
    range.selectNode(content);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
           alert('Berhasil disalin! Buka Microsoft Word dan Paste (Ctrl+V). Format tabel akan terjaga.');
        } else {
           alert('Gagal menyalin otomatis. Silakan seleksi manual (Ctrl+A pada area dokumen) dan copy.');
        }
      } catch (err) {
        console.error('Copy failed', err);
        alert('Browser tidak mendukung copy otomatis.');
      }
      
      selection.removeAllRanges();
    }

    textareas.forEach(ta => {
        ta.placeholder = ta.getAttribute('data-placeholder') || '';
    });
  };

  const handleMcqSelect = (questionIndex: number, optionChar: string) => {
    setUserMcqAnswers(prev => ({
        ...prev,
        [questionIndex]: optionChar
    }));
  };

  const handleNumAnswerChange = (questionIndex: number, value: string) => {
    setUserNumAnswers(prev => ({
        ...prev,
        [questionIndex]: value
    }));
  };

  // STANDARD STYLES FOR WORD COMPATIBILITY
  // Using explicit border widths and colors ensures Word respects the grid.
  const tableStyle = { 
    width: '100%', 
    borderCollapse: 'collapse' as const, 
    border: '1px solid black', 
    marginBottom: '20px',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: '12pt'
  };
  
  const cellStyle = { 
    border: '1px solid black', 
    padding: '8px', 
    verticalAlign: 'top', 
    fontSize: '12pt',
    color: 'black'
  };
  
  const headerCellStyle = { 
    ...cellStyle, 
    fontWeight: 'bold', 
    backgroundColor: '#f0f0f0' 
  };
  
  const sectionHeaderStyle = { 
    ...cellStyle, 
    backgroundColor: '#1d4ed8', // blue-700
    color: 'white', 
    fontWeight: 'bold', 
    textAlign: 'center' as const, 
    verticalAlign: 'middle' 
  };
  
  const lkpdSectionHeader = { 
    ...cellStyle, 
    backgroundColor: '#000000', 
    color: 'white', 
    fontWeight: 'bold', 
    textTransform: 'uppercase' as const, 
    textAlign: 'center' as const
  };

  // Specific styles for Modul Ajar labels to look neat in Word
  const labelColumnStyle = { 
    ...cellStyle, 
    width: '30%', // Fixed percentage width for labels
    fontWeight: 'bold', 
    backgroundColor: '#f9fafb' 
  };

  const valueColumnStyle = {
    ...cellStyle,
    width: '70%',
    backgroundColor: '#ffffff'
  };
  
  return (
    <div className="max-w-[297mm] mx-auto p-4 md:p-8 font-sans">
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 1cm !important;
            box-shadow: none !important;
            border: none !important;
            background-color: white;
          }
          html, body {
            height: auto !important;
            overflow: visible !important;
            background: white !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Header Actions */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="flex bg-gray-200 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('rppm')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'rppm' ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <BookOpen size={16} />
            RPPM
          </button>
          <button 
            onClick={() => setActiveTab('modul')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'modul' ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Library size={16} />
            Modul Ajar
          </button>
          <button 
            onClick={() => setActiveTab('lkpd')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'lkpd' ? 'bg-white text-blue-800 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <FileText size={16} />
            LKM
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${activeTab === 'media' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            <Youtube size={16} />
            Video Animasi
          </button>
        </div>

        <div className="flex gap-2 items-center">
           {activeTab === 'lkpd' && (
             <button 
               onClick={() => setShowAnswers(!showAnswers)} 
               className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-sm text-sm font-medium ${showAnswers ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
             >
               <Key size={18} />
               <span>{showAnswers ? 'Sembunyikan Jawaban' : 'Tampilkan Jawaban'}</span>
             </button>
           )}
           {activeTab !== 'media' && (
             <>
              <button onClick={handleCopyToWord} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm font-medium">
                <Copy size={18} />
                <span>Salin ke Word</span>
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm font-medium">
                <FileDown size={18} />
                <span>Salin ke PDF</span>
              </button>
             </>
           )}
        </div>
      </div>

      {activeTab === 'media' ? (
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
             <div className="bg-red-600 text-white p-2 rounded-lg">
                <Youtube size={28} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-gray-800">Rekomendasi Video Animasi</h2>
                <p className="text-gray-500 text-sm">Kartun edukasi & animasi dipilih otomatis untuk topik: {input.topic}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {data.video_rekomendasi && data.video_rekomendasi.map((vid, idx) => {
                const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(vid.query_pencarian)}`;
                return (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 hover:shadow-lg transition-shadow flex flex-col h-full">
                     <div className="p-4 bg-white border-b border-gray-100 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-semibold">Animasi {idx + 1}</span>
                        </div>
                        <h3 className="font-bold text-lg text-blue-900 mb-2 leading-tight">{cleanText(vid.judul)}</h3>
                        <p className="text-gray-600 text-sm line-clamp-3">{cleanText(vid.deskripsi)}</p>
                     </div>
                     
                     <div className="p-4 bg-gray-50 border-t border-gray-200 mt-auto">
                       <a 
                         href={searchUrl}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                       >
                         <ExternalLink size={18} />
                         Tonton di YouTube
                       </a>
                       
                       <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1 font-semibold">Link Video (Copy ke Word):</p>
                          <div className="text-xs text-blue-600 bg-white p-2 rounded border border-gray-200 break-all select-all font-mono cursor-text">
                             {searchUrl}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 italic">
                            *Salin link di atas dan tempel di Word agar terkoneksi.
                          </p>
                       </div>
                     </div>
                  </div>
                );
             })}
          </div>
        </div>
      ) : (
        /* Document Container */
        <div 
          id="printable-area" 
          className="bg-white shadow-2xl p-[1cm] text-black mx-auto w-full min-h-[210mm]"
          style={{ fontFamily: '"Times New Roman", Times, serif', fontSize: '12pt', lineHeight: '1.4' }}
        >
          
          {activeTab === 'rppm' && (
            <>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14pt', marginBottom: '15px', textTransform: 'uppercase' }}>
                Rencana Program Pembelajaran Mendalam
              </div>

              <table border={1} style={tableStyle}>
                <tbody>
                  <tr>
                    <td style={{...cellStyle, width: '150px', fontWeight: 'bold'}}>Nama Sekolah</td>
                    <td style={cellStyle}>: {cleanText(input.schoolName)}</td>
                    <td style={{...cellStyle, width: '150px', fontWeight: 'bold'}}>Kelas / Fase</td>
                    <td style={cellStyle}>: {cleanText(input.className)}</td>
                  </tr>
                  <tr>
                    <td style={{...cellStyle, fontWeight: 'bold'}}>Nama Guru</td>
                    <td style={cellStyle}>: {cleanText(input.teacherName)}</td>
                    <td style={{...cellStyle, fontWeight: 'bold'}}>Mata Pelajaran</td>
                    <td style={cellStyle}>: {cleanText(input.subject)}</td>
                  </tr>
                  <tr>
                    <td style={{...cellStyle, fontWeight: 'bold'}}>Topik</td>
                    <td style={cellStyle}>: {cleanText(input.topic)}</td>
                    <td style={{...cellStyle, fontWeight: 'bold'}}>Waktu</td>
                    <td style={cellStyle}>: {cleanText(input.date) || '-'}</td>
                  </tr>
                </tbody>
              </table>

              <table border={1} style={tableStyle}>
                <tbody>
                  <tr>
                    <td rowSpan={3} style={{...sectionHeaderStyle, width: '150px'}}>
                      Identifikasi
                    </td>
                    <td style={{...cellStyle, backgroundColor: '#f9fafb'}}>
                      <strong>Murid:</strong> {cleanText(data.identifikasi.peserta_didik)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Materi Pelajaran:</strong> {cleanText(data.identifikasi.materi_pelajaran)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Dimensi Profil Lulusan:</strong>
                      <div style={{ marginTop: '4px', paddingLeft: '8px' }}>
                        {data.identifikasi.dimensi_profil_lulusan.length > 0 ? (
                          dpls
                            .filter(dpl => data.identifikasi.dimensi_profil_lulusan.includes(dpl.code))
                            .map((dpl) => (
                              <div key={dpl.code} style={{ marginBottom: '2px' }}>
                                • {dpl.label}
                              </div>
                            ))
                        ) : (
                          <span style={{ fontStyle: 'italic', color: '#666' }}>- Tidak ada dimensi spesifik terpilih -</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={9} style={sectionHeaderStyle}>
                      Desain Pembelajaran
                    </td>
                    <td style={cellStyle}>
                      <strong>Capaian Pembelajaran:</strong> {cleanText(data.desain_pembelajaran.capaian_pembelajaran)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Lintas Disiplin Ilmu:</strong> {cleanText(data.desain_pembelajaran.lintas_disiplin_ilmu)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Tujuan Pembelajaran:</strong> {cleanText(data.desain_pembelajaran.tujuan_pembelajaran)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Topik Pembelajaran:</strong> {cleanText(data.desain_pembelajaran.topik_pembelajaran)}
                    </td>
                  </tr>
                  <tr>
                    <td style={{...cellStyle, backgroundColor: '#fffbeb'}}>
                      <strong>Pertanyaan Pemantik:</strong> {cleanText(data.desain_pembelajaran.pertanyaan_pemantik)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Praktik Pedagogis:</strong> {cleanText(data.desain_pembelajaran.praktik_pedagogis)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Kemitraan Pembelajaran:</strong> {cleanText(data.desain_pembelajaran.kemitraan_pembelajaran)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Lingkungan Pembelajaran:</strong> {cleanText(data.desain_pembelajaran.lingkungan_pembelajaran)}
                    </td>
                  </tr>
                  <tr>
                    <td style={cellStyle}>
                      <strong>Pemanfaatan Digital:</strong> {cleanText(data.desain_pembelajaran.pemanfaatan_digital)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <table border={1} style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan={2} style={{...sectionHeaderStyle, textAlign: 'center'}}>
                      Langkah-Langkah Pembelajaran
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                      <td rowSpan={4} style={{...sectionHeaderStyle, width: '150px'}}>
                        Pengalaman Belajar
                      </td>
                      <td style={{...cellStyle, backgroundColor: '#eff6ff'}}>
                        <strong>AWAL ({cleanText(data.langkah_pembelajaran.awal.prinsip)})</strong>
                        <p style={{marginTop: '4px', marginBottom: '0'}}>{cleanText(data.langkah_pembelajaran.awal.kegiatan)}</p>
                      </td>
                  </tr>
                  <tr>
                      <td style={{padding: 0, border: '1px solid black'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', border: 'none'}}>
                          <tbody>
                            <tr>
                                <td style={{padding: '6px', borderBottom: '1px solid black', backgroundColor: '#e5e7eb', fontWeight: 'bold', textAlign: 'center'}}>INTI</td>
                            </tr>
                            <tr>
                                <td style={{padding: '6px', borderBottom: '1px solid black'}}>
                                  <strong>Memahami ({cleanText(data.langkah_pembelajaran.inti.memahami.prinsip)}):</strong>
                                  <ol style={{paddingLeft: '20px', marginTop: '4px', marginBottom: '4px'}}>
                                    {data.langkah_pembelajaran.inti.memahami.kegiatan.map((k, i) => <li key={i}>{cleanText(k)}</li>)}
                                  </ol>
                                </td>
                            </tr>
                            <tr>
                                <td style={{padding: '6px', borderBottom: '1px solid black'}}>
                                  <strong>Mengaplikasi ({cleanText(data.langkah_pembelajaran.inti.mengaplikasi.prinsip)}):</strong>
                                  <ol style={{paddingLeft: '20px', marginTop: '4px', marginBottom: '4px'}}>
                                    {data.langkah_pembelajaran.inti.mengaplikasi.kegiatan.map((k, i) => <li key={i}>{cleanText(k)}</li>)}
                                  </ol>
                                </td>
                            </tr>
                            <tr>
                                <td style={{padding: '6px'}}>
                                  <strong>Merefleksi ({cleanText(data.langkah_pembelajaran.inti.merefleksi.prinsip)}):</strong>
                                  <ol style={{paddingLeft: '20px', marginTop: '4px', marginBottom: '4px'}}>
                                    {data.langkah_pembelajaran.inti.merefleksi.kegiatan.map((k, i) => <li key={i}>{cleanText(k)}</li>)}
                                  </ol>
                                </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                  </tr>
                  <tr>
                      <td style={{...cellStyle, backgroundColor: '#eff6ff'}}>
                        <strong>PENUTUP ({cleanText(data.langkah_pembelajaran.penutup.prinsip)})</strong>
                        <p style={{marginTop: '4px', marginBottom: '0'}}>{cleanText(data.langkah_pembelajaran.penutup.kegiatan)}</p>
                      </td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <table border={1} style={tableStyle}>
                <tbody>
                    <tr>
                      <td rowSpan={3} style={{...sectionHeaderStyle, width: '150px'}}>
                          Asesmen Pembelajaran
                      </td>
                      <td style={{...cellStyle, width: '35%'}}>
                          <strong>Asesmen pada Awal Pembelajaran:</strong>
                          <p style={{marginTop: '4px', marginBottom: '0'}}>{cleanText(data.asesmen_pembelajaran.awal)}</p>
                      </td>
                      <td rowSpan={3} style={{...cellStyle, backgroundColor: '#f9fafb', fontStyle: 'italic', textAlign: 'justify', verticalAlign: 'middle'}}>
                          Asesmen dalam pembelajaran mendalam disesuaikan dengan assessment as learning, assessment for learning, dan assessment of learning. Metode yang digunakan bersifat komprehensif untuk mengukur pencapaian kompetensi murid.
                      </td>
                    </tr>
                    <tr>
                      <td style={cellStyle}>
                          <strong>Asesmen pada Proses Pembelajaran:</strong>
                          <p style={{marginTop: '4px', marginBottom: '0'}}>{cleanText(data.asesmen_pembelajaran.proses)}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style={cellStyle}>
                          <strong>Asesmen pada Akhir Pembelajaran:</strong>
                          <p style={{marginTop: '4px', marginBottom: '0'}}>{cleanText(data.asesmen_pembelajaran.akhir)}</p>
                      </td>
                    </tr>
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'modul' && data.modul_ajar && (
            <div>
              <div style={{ borderBottom: '3px double black', marginBottom: '20px', paddingBottom: '10px', textAlign: 'center' }}>
                <h1 style={{ fontWeight: 'bold', fontSize: '14pt', margin: 0 }}>MODUL AJAR</h1>
              </div>
              
              {/* A. INFORMASI UMUM */}
              <table border={1} style={tableStyle}>
                 <thead>
                    <tr><th colSpan={2} style={lkpdSectionHeader}>A. INFORMASI UMUM</th></tr>
                 </thead>
                 <tbody>
                    <tr><td style={labelColumnStyle}>Identitas Sekolah</td><td style={valueColumnStyle}>{cleanText(data.modul_ajar.informasi_umum.identitas_sekolah)}</td></tr>
                    <tr><td style={labelColumnStyle}>Kompetensi Awal</td><td style={valueColumnStyle}>{cleanText(data.modul_ajar.informasi_umum.kompetensi_awal)}</td></tr>
                    <tr><td style={labelColumnStyle}>Dimensi Profil Lulusan</td><td style={valueColumnStyle}>{cleanText(data.modul_ajar.informasi_umum.dimensi_profil_lulusan)}</td></tr>
                 </tbody>
              </table>

              <br/>

              {/* B. KOMPONEN INTI */}
              <table border={1} style={tableStyle}>
                 <thead>
                    <tr><th colSpan={2} style={lkpdSectionHeader}>B. KOMPONEN INTI</th></tr>
                 </thead>
                 <tbody>
                    <tr>
                      <td style={labelColumnStyle}>Tujuan Pembelajaran</td>
                      <td style={valueColumnStyle}>{cleanText(data.modul_ajar.komponen_inti.tujuan_pembelajaran)}</td>
                    </tr>
                    <tr>
                      <td style={labelColumnStyle}>Pertanyaan Pemantik</td>
                      <td style={valueColumnStyle}>{cleanText(data.modul_ajar.komponen_inti.pertanyaan_pemantik)}</td>
                    </tr>
                    
                    {/* Separate Header Row for Material */}
                    <tr>
                       <td colSpan={2} style={{...cellStyle, backgroundColor: '#eff6ff', fontWeight: 'bold', textAlign: 'center'}}>
                          URAIAN MATERI PEMBELAJARAN
                       </td>
                    </tr>
                    
                    {/* Content Row for Material */}
                    <tr>
                      <td colSpan={2} style={{...cellStyle, whiteSpace: 'pre-line', textAlign: 'justify', padding: '15px'}}>
                        {cleanText(data.modul_ajar.komponen_inti.uraian_materi_detail)}
                      </td>
                    </tr>

                    {/* Separate Header Row for Video Link */}
                    <tr>
                       <td colSpan={2} style={{...cellStyle, backgroundColor: '#fdf2f8', fontWeight: 'bold', textAlign: 'center', color: '#be123c'}}>
                          VIDEO PEMBELAJARAN
                       </td>
                    </tr>

                    {/* Content Row for Video Link */}
                    <tr>
                       <td colSpan={2} style={{...cellStyle, textAlign: 'center', padding: '10px'}}>
                          <a 
                             href={`https://www.youtube.com/results?search_query=${encodeURIComponent(data.modul_ajar.komponen_inti.link_video_materi)}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             style={{color: 'blue', textDecoration: 'underline', fontWeight: 'bold'}}
                           >
                              https://www.youtube.com/results?search_query={encodeURIComponent(data.modul_ajar.komponen_inti.link_video_materi)}
                           </a>
                       </td>
                    </tr>
                    
                    <tr>
                      <td style={labelColumnStyle}>Glosarium</td>
                      <td style={valueColumnStyle}>{cleanText(data.modul_ajar.komponen_inti.glosarium)}</td>
                    </tr>
                    <tr>
                      <td style={labelColumnStyle}>Daftar Pustaka</td>
                      <td style={valueColumnStyle}>{cleanText(data.modul_ajar.komponen_inti.daftar_pustaka)}</td>
                    </tr>
                 </tbody>
              </table>
            </div>
          )}

          {activeTab === 'lkpd' && (
            <div>
              {/* LKPD HEADER */}
              <div style={{ borderBottom: '3px double black', marginBottom: '20px', paddingBottom: '10px', textAlign: 'center' }}>
                <h1 style={{ fontWeight: 'bold', fontSize: '14pt', textTransform: 'uppercase', margin: 0 }}>Lembar Kerja Murid (LKM)</h1>
                <h2 style={{ fontWeight: 'bold', fontSize: '12pt', margin: '5px 0 0 0' }}>{cleanText(data.lkpd.judul)}</h2>
              </div>
              
              <table border={0} style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                      <td style={{ padding: '4px', width: '150px', fontWeight: 'bold' }}>Nama Guru</td>
                      <td style={{ padding: '4px' }}>: {cleanText(input.teacherName)}</td>
                      <td style={{ padding: '4px', width: '150px', fontWeight: 'bold' }}>Kelas</td>
                      <td style={{ padding: '4px' }}>: {cleanText(input.className)}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>Nama Murid</td>
                      <td style={{ padding: '4px' }}>: ...........................................................</td>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>Tanggal</td>
                      <td style={{ padding: '4px' }}>: {cleanText(input.date) || '...........................................................'}</td>
                    </tr>
                </tbody>
              </table>

               {data.video_rekomendasi && data.video_rekomendasi.length > 0 && (
                <table border={1} style={{...tableStyle, marginBottom: '20px', backgroundColor: '#fff5f5'}}>
                   <tbody>
                      <tr>
                         <td style={{...headerCellStyle, backgroundColor: '#fee2e2', color: '#991b1b'}}>
                            VIDEO PEMBELAJARAN
                         </td>
                      </tr>
                      <tr>
                         <td style={cellStyle}>
                            <p style={{margin: 0, marginBottom: '5px'}}>Simak video berikut sebelum mengerjakan soal:</p>
                            <a 
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(data.video_rekomendasi[0].query_pencarian)}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{color: 'blue', textDecoration: 'underline', fontWeight: 'bold'}}
                            >
                               {cleanText(data.video_rekomendasi[0].judul)} (Klik Disini)
                            </a>
                            <div style={{fontSize: '10pt', color: '#666', marginTop: '5px'}}>
                               Atau salin link: <em>https://www.youtube.com/results?search_query={encodeURIComponent(data.video_rekomendasi[0].query_pencarian)}</em>
                            </div>
                         </td>
                      </tr>
                   </tbody>
                </table>
               )}

               <table border={1} style={tableStyle}>
                <tbody>
                  <tr>
                      <td style={{...headerCellStyle, width: '100%'}}>RINGKASAN MATERI</td>
                  </tr>
                  <tr>
                      <td style={{...cellStyle, whiteSpace: 'pre-line', textAlign: 'justify'}}>
                        {cleanText(data.lkpd.materi_singkat) || 'Ringkasan materi akan muncul di sini...'}
                      </td>
                  </tr>
                </tbody>
              </table>

              <br/>

              <table border={1} style={tableStyle}>
                <tbody>
                  <tr>
                      <td style={{...headerCellStyle, width: '100%'}}>PETUNJUK PENGERJAAN</td>
                  </tr>
                  <tr>
                      <td style={{...cellStyle, whiteSpace: 'pre-line'}}>
                        {cleanText(data.lkpd.petunjuk_umum)}
                      </td>
                  </tr>
                </tbody>
              </table>

              <br/>

              <table border={1} style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan={2} style={lkpdSectionHeader}>A. Soal Pilihan Ganda (10 Soal)</th>
                  </tr>
                  <tr>
                    <th style={{...headerCellStyle, width: '50px', textAlign: 'center'}}>No</th>
                    <th style={headerCellStyle}>Pertanyaan dan Pilihan Jawaban</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lkpd.soal_pilihan_ganda && data.lkpd.soal_pilihan_ganda.map((q, idx) => (
                    <tr key={idx} style={{ pageBreakInside: 'avoid' }}>
                        <td style={{...cellStyle, textAlign: 'center', fontWeight: 'bold'}}>{idx + 1}</td>
                        <td style={cellStyle}>
                          <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                            {cleanText(q.pertanyaan)} 
                            {showAnswers && (
                                <span style={{marginLeft: '10px', fontSize: '10pt', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '4px'}}>
                                    {cleanText(q.level_kognitif)} - {cleanText(q.tingkat_kesulitan)}
                                </span>
                            )}
                          </div>
                          <div style={{ paddingLeft: '10px' }}>
                              {q.pilihan.map((opt, optIdx) => {
                                const optChar = String.fromCharCode(65 + optIdx);
                                const isSelected = userMcqAnswers[idx] === optChar;
                                const isKey = q.kunci === optChar;
                                const showKey = showAnswers;

                                let color = 'inherit';
                                let fontWeight = 'normal';
                                
                                if (showKey) {
                                  if (isKey) {
                                      color = 'red';
                                      fontWeight = 'bold';
                                  } else if (isSelected) {
                                      color = 'blue'; 
                                  }
                                } else {
                                  if (isSelected) {
                                      fontWeight = 'bold';
                                      color = 'blue';
                                  }
                                }

                                return (
                                  <div 
                                    key={optIdx} 
                                    onClick={() => handleMcqSelect(idx, optChar)}
                                    style={{ 
                                      display: 'flex', 
                                      alignItems: 'start', 
                                      marginBottom: '4px', 
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <span style={{ 
                                      marginRight: '8px', 
                                      fontWeight: fontWeight, 
                                      color: color,
                                      minWidth: '25px'
                                    }}>
                                      {isSelected ? '◉' : '○'} {optChar}.
                                    </span>
                                    <span style={{ fontWeight: fontWeight, color: color }}>
                                      {cleanText(opt).replace(/^[A-E]\.\s*/, '')}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                          {showAnswers && (
                              <div style={{ marginTop: '5px', color: 'red', fontWeight: 'bold', fontSize: '11pt', borderTop: '1px dashed #ccc', paddingTop: '4px' }}>
                                  Kunci: {cleanText(q.kunci)}
                              </div>
                          )}
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <br />

              <table border={1} style={tableStyle}>
                <thead>
                  <tr>
                    <th colSpan={2} style={lkpdSectionHeader}>B. Soal Numerasi (HOTS - C3, C4, C5)</th>
                  </tr>
                  <tr>
                    <th style={{...headerCellStyle, width: '50px', textAlign: 'center'}}>No</th>
                    <th style={headerCellStyle}>Pertanyaan dan Jawaban</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lkpd.soal_numerasi.map((q, idx) => (
                    <tr key={idx} style={{ pageBreakInside: 'avoid' }}>
                        <td style={{...cellStyle, textAlign: 'center', fontWeight: 'bold'}}>{idx + 1}</td>
                        <td style={cellStyle}>
                          <div style={{ marginBottom: '10px', fontWeight: '500' }}>
                            {cleanText(q.pertanyaan)}
                            {showAnswers && (
                                <div style={{marginTop: '4px'}}>
                                    <span style={{fontSize: '10pt', backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px'}}>
                                        {cleanText(q.level_kognitif)} - {cleanText(q.tingkat_kesulitan)}
                                    </span>
                                </div>
                            )}
                          </div>
                          <textarea
                              value={userNumAnswers[idx] || ''}
                              onChange={(e) => handleNumAnswerChange(idx, e.target.value)}
                              placeholder="Tulis jawaban Anda di sini..."
                              style={{
                                  width: '100%',
                                  minHeight: '80px',
                                  padding: '8px',
                                  border: '1px solid #ccc',
                                  borderRadius: '0', 
                                  fontFamily: 'inherit',
                                  fontSize: 'inherit',
                                  resize: 'vertical',
                                  backgroundColor: '#f9fafb'
                              }}
                          />
                          {showAnswers && (
                              <div style={{ marginTop: '8px', border: '1px dashed red', padding: '8px', backgroundColor: '#fff5f5' }}>
                                  <span style={{ color: 'red', fontWeight: 'bold' }}>Kunci & Pembahasan:</span>
                                  <div style={{ marginTop: '2px' }}>{cleanText(q.kunci)}</div>
                              </div>
                          )}
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <table border={1} style={{...tableStyle, marginTop: '20px'}}>
                <thead>
                    <tr>
                      <th style={headerCellStyle}>RUBRIK PENILAIAN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                      <td style={{...cellStyle, fontStyle: 'italic', padding: '10px'}}>
                          {cleanText(data.lkpd.rubrik_penilaian)}
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* SIGNATURE SECTION (Side by Side) - Only show in doc tabs */}
          {activeTab !== 'media' && (
            <div style={{ breakInside: 'avoid', marginTop: '40px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                  <tbody>
                      <tr>
                          <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '10px', border: 'none' }}>
                              Mengetahui,<br/>
                              Kepala Sekolah
                              <div style={{ height: '80px' }}></div>
                              <strong>{cleanText(input.principalName) || '..............................'}</strong><br/>
                              NIP. {cleanText(input.principalNip) || '....................'}
                          </td>
                          <td style={{ width: '50%', textAlign: 'center', verticalAlign: 'top', padding: '10px', border: 'none' }}>
                              {cleanText(input.date) || '........................'}<br/>
                              Guru Mata Pelajaran
                              <div style={{ height: '80px' }}></div>
                              <strong>{cleanText(input.teacherName)}</strong><br/>
                              NIP. {cleanText(input.teacherNip) || '....................'}
                          </td>
                      </tr>
                  </tbody>
              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
