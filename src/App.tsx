import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Type, 
  Sparkles, 
  Layout, 
  MessageSquare, 
  Image as ImageIcon, 
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateThumbnailConcept, ThumbnailConcept } from './services/geminiService';

export default function App() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [concept, setConcept] = useState<ThumbnailConcept | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("File quá lớn. Vui lòng chọn ảnh dưới 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!title || !image) {
      setError("Vui lòng nhập tiêu đề và tải lên ảnh nhân vật.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateThumbnailConcept(title, image);
      setConcept(result);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo concept.");
    } finally {
      setIsGenerating(false);
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f0f12] text-zinc-100 font-sans selection:bg-red-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/5 bg-[#0f0f12]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/20">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Thumbnail Master AI
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Expert Content Strategy</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> High-Engagement Designs</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> AI-Powered Analysis</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5 text-red-500" /> 1. Nhân Vật Gốc
            </h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`group relative aspect-video rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-3
                ${image ? 'border-red-500/50 bg-red-500/5' : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-500 hover:bg-zinc-800'}`}
            >
              {image ? (
                <>
                  <img src={image} alt="Reference" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20">Thay đổi ảnh</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-zinc-800 border border-zinc-700 group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8 text-zinc-500 group-hover:text-zinc-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-zinc-300">Tải lên ảnh chân dung</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG tối đa 10MB</p>
                  </div>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </section>

          <section className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-500" /> 2. Thông Tin Video
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-2">Tiêu đề video</label>
                <textarea 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Đừng mua iPhone 15 nếu chưa xem video này!"
                  className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:ring-2 focus:ring-red-500/20 focus:border-red-500/50 outline-none transition-all resize-none shadow-inner"
                />
              </div>

              <button
                id="generate-button"
                onClick={handleGenerate}
                disabled={isGenerating || !title || !image}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/10 transition-all active:scale-[0.98]
                  ${isGenerating || !title || !image 
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700' 
                    : 'bg-red-600 hover:bg-red-500 text-white cursor-pointer'}`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    ĐANG PHÂN TÍCH...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    TẠO CONCEPT VIRAL
                  </>
                )}
              </button>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p>{error}</p>
                </motion.div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!concept && !isGenerating ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-[40px] p-12 text-center"
              >
                <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                  <Sparkles className="w-10 h-10 text-zinc-700" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-300">Sẵn sàng để bắt đầu?</h3>
                <p className="text-zinc-500 mt-2 max-w-sm">
                  Hãy nhập tiêu đề và tải lên ảnh nhân vật để AI phân tích và đề xuất concept thumbnail triệu view.
                </p>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="h-48 bg-zinc-900/50 animate-pulse rounded-[40px] border border-white/5" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-40 bg-zinc-900/50 animate-pulse rounded-3xl border border-white/5" />
                  <div className="h-40 bg-zinc-900/50 animate-pulse rounded-3xl border border-white/5" />
                </div>
                <div className="h-64 bg-zinc-900/50 animate-pulse rounded-[40px] border border-white/5" />
              </motion.div>
            ) : (
              <motion.div 
                key="concept"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="space-y-6 pb-12"
              >
                {/* 1. Phân tích tiêu đề */}
                <section className="bg-zinc-900/80 border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold">1. Phân Tích Chiến Lược</h3>
                  </div>
                  <p className="text-zinc-300 leading-relaxed italic border-l-4 border-blue-500/50 pl-6 py-2">
                    {concept?.analysis}
                  </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 2. Cảm xúc chính */}
                  <section className="bg-zinc-900/80 border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-500/10 rounded-xl">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-bold">2. Cảm Xúc</h3>
                    </div>
                    <div className="bg-zinc-950/50 rounded-2xl p-4 border border-zinc-800">
                      <span className="text-xl font-bold text-white tracking-wide">
                        {concept?.emotion}
                      </span>
                    </div>
                  </section>

                  {/* 5. Từ khóa */}
                  <section className="bg-zinc-900/80 border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-500/10 rounded-xl">
                        <Type className="w-5 h-5 text-green-500" />
                      </div>
                      <h3 className="text-lg font-bold">5. Chữ Chèn Ảnh</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {concept?.keywords.map((kw, i) => (
                        <span key={i} className="px-3 py-1.5 bg-zinc-800 border border-white/10 rounded-full text-xs font-bold text-zinc-300 uppercase tracking-tighter">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {/* 3. Ý tưởng hình ảnh */}
                <section className="bg-zinc-900/80 border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 rounded-xl">
                      <Camera className="w-5 h-5 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold">3. Ý Tưởng Hình Ảnh</h3>
                  </div>
                  <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
                    <p className="whitespace-pre-line">{concept?.idea}</p>
                  </div>
                </section>

                {/* 4. Prompt AI */}
                <section className="bg-zinc-900/80 border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md relative group">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-500/10 rounded-xl">
                        <ImageIcon className="w-5 h-5 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-bold">4. Prompt Tạo Ảnh AI (Midjourney/DALL-E)</h3>
                    </div>
                    <button 
                      onClick={() => concept && copyToClipboard(concept.prompt)}
                      className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold
                        ${copied ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-zinc-400 hover:text-white'}`}
                      title="Copy Prompt"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'ĐÃ SAO CHÉP' : 'SAO CHÉP'}
                    </button>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-yellow-500/90 leading-relaxed">
                    {concept?.prompt}
                  </div>
                </section>

                {/* 6. Bố cục chữ */}
                <section className="bg-zinc-900/80 border border-white/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-teal-500/10 rounded-xl">
                      <Layout className="w-5 h-5 text-teal-500" />
                    </div>
                    <h3 className="text-lg font-bold">6. Gợi Ý Bố Cục & Màu Sắc</h3>
                  </div>
                  <div className="bg-teal-500/5 border border-teal-500/20 rounded-2xl p-6 text-zinc-300 text-sm leading-relaxed">
                    {concept?.layout}
                  </div>
                </section>

                <div className="pt-6">
                  <button 
                    onClick={() => {
                        setTitle('');
                        setImage(null);
                        setConcept(null);
                    }}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" /> Bắt đầu với video mới
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-40 grayscale">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Powered by Gemini Vision 1.5</span>
          </div>
          <div className="flex gap-8 text-xs font-semibold text-zinc-600 uppercase tracking-widest">
            <a href="#" className="hover:text-zinc-400 transition-colors">Documentation</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
