
import React, { useState } from 'react';
import { UserInput, LessonPlanResponse } from './types';
import { generateLessonPlan } from './services/geminiService';
import { LessonPlanView } from './components/LessonPlanView';
import { Sparkles, BookOpen, User, GraduationCap, Layout, School, UserCheck, Calendar, Hash } from 'lucide-react';

function App() {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [input, setInput] = useState<UserInput>({
    teacherName: '',
    teacherNip: '',
    principalName: '',
    principalNip: '',
    schoolName: '',
    className: '',
    subject: '',
    topic: '',
    date: ''
  });
  const [result, setResult] = useState<LessonPlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.teacherName || !input.schoolName || !input.subject || !input.topic) {
      setError("Mohon lengkapi semua data wajib.");
      return;
    }
    
    setError(null);
    setStep('loading');

    try {
      const data = await generateLessonPlan(input);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError("Gagal membuat rencana pembelajaran. Silakan coba lagi atau cek koneksi internet.");
      setStep('input');
    }
  };

  const handleBack = () => {
    setStep('input');
    setResult(null);
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-bold text-blue-900 mb-2">Sedang Merancang Pembelajaran...</h2>
        <p className="text-gray-600 text-center max-w-md">
          AI sedang menyusun RPPM, Modul Ajar, dan LKM interaktif dengan soal HOTS.
        </p>
      </div>
    );
  }

  if (step === 'result' && result) {
    return <LessonPlanView data={result} input={input} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side Branding */}
        <div className="bg-blue-800 text-white p-8 md:w-1/3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h1 className="font-bold text-xl tracking-tight">Auto-RPPM</h1>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Buat Rencana Program Pembelajaran Mendalam, Modul Ajar, dan LKM dalam hitungan detik.
            </p>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex items-center gap-2"><Layout size={16}/> RPPM & Modul Ajar</li>
              <li className="flex items-center gap-2"><BookOpen size={16}/> Soal HOTS & Numerasi</li>
              <li className="flex items-center gap-2"><GraduationCap size={16}/> Integrasi Video</li>
            </ul>
          </div>
          <div className="text-xs text-blue-300 mt-8">
            &copy; {new Date().getFullYear()} EduAI Tools
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-8 md:w-2/3 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mulai Buat Rencana</h2>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Guru</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="teacherName"
                    value={input.teacherName}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nama Lengkap"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP Guru</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="teacherNip"
                    value={input.teacherNip}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="NIP / -"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kepala Sekolah</label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="principalName"
                    value={input.principalName}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Nama Kepala Sekolah"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIP Kepsek</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="principalNip"
                    value={input.principalNip}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="NIP / -"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sekolah</label>
              <div className="relative">
                <School className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="schoolName"
                  value={input.schoolName}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: SMAN 1 Jakarta"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas / Fase</label>
                <input
                  type="text"
                  name="className"
                  value={input.className}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Cth: X / Fase E"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  name="subject"
                  value={input.subject}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Cth: Fisika"
                  required
                />
              </div>
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal / Waktu</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="date"
                  value={input.date}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Contoh: Jakarta, 20 Oktober 2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tema / Pokok Bahasan</label>
              <input
                type="text"
                name="topic"
                value={input.topic}
                onChange={handleInputChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="Contoh: Energi Terbarukan"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-700 text-white font-medium py-3 rounded-lg hover:bg-blue-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Buat Rencana Pembelajaran
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
