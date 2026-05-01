import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Maximize, RefreshCcw, Download, Sparkles, Ruler, Scan, Activity, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data';

// --- AR TRACKING POINT COMPONENT ---
const TrackingPoint = ({ delay = 0, style = {} }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
    transition={{ duration: 2, repeat: Infinity, delay }}
    className="absolute w-2 h-2 bg-[#c68e9a] rounded-full shadow-[0_0_10px_#c68e9a]"
    style={style}
  >
    <div className="absolute inset-0 bg-white/40 rounded-full animate-ping" />
  </motion.div>
);

export default function ARStudio() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [isScanning, setIsScanning] = useState(true);
  const [error, setError] = useState(null);
  const [processingLevel, setProcessingLevel] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1920 }, height: { ideal: 1080 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        
        // Progressive scanning simulation
        const interval = setInterval(() => {
          setProcessingLevel(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              setTimeout(() => {
                setIsScanning(false);
                setTimeout(() => setIsLocked(true), 800); // Lock dress after scan
              }, 500);
              return 100;
            }
            return prev + 1.5;
          });
        }, 30);

      } catch (err) {
        console.error("Kamera erişim hatası:", err);
        setError("Kamera erişimi reddedildi. Lütfen tarayıcı ayarlarından izin verin.");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col md:flex-row overflow-hidden font-sans selection:bg-[#c68e9a]">
      {/* AR VIEWPORT */}
      <div className="relative flex-1 bg-neutral-900 overflow-hidden cursor-crosshair">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-white bg-black">
            <div className="max-w-md space-y-8">
              <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                 <Camera size={40} className="text-[#c68e9a]" />
              </div>
              <h2 className="font-serif text-4xl leading-tight">{error}</h2>
              <Link to="/" className="inline-block px-12 py-4 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#c68e9a] hover:text-white transition-all shadow-2xl">Ana Sayfaya Dön</Link>
            </div>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover scale-x-[-1] opacity-90 transition-opacity duration-1000"
            />
            
            {/* VIRTUAL MIRROR SCANNING GRID */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
               <div className="w-full h-full grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]">
                  {[...Array(400)].map((_, i) => (
                    <div key={i} className="border-[0.5px] border-white/10" />
                  ))}
               </div>
            </div>

            {/* AI TRACKING POINTS (FACE & BODY SIMULATION) */}
            <AnimatePresence>
               {!isScanning && (
                 <div className="absolute inset-0 pointer-events-none">
                   {/* Face Tracking */}
                   <TrackingPoint style={{ top: '25%', left: '50%' }} delay={0} />
                   <TrackingPoint style={{ top: '28%', left: '46%' }} delay={0.2} />
                   <TrackingPoint style={{ top: '28%', left: '54%' }} delay={0.2} />
                   
                   {/* Shoulder Tracking */}
                   <TrackingPoint style={{ top: '40%', left: '35%' }} delay={0.5} />
                   <TrackingPoint style={{ top: '40%', right: '35%' }} delay={0.5} />
                   
                   {/* Waist Tracking */}
                   <TrackingPoint style={{ top: '65%', left: '42%' }} delay={0.8} />
                   <TrackingPoint style={{ top: '65%', right: '42%' }} delay={0.8} />

                   {/* Dynamic Measurement Line */}
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '30%' }}
                     className="absolute top-[40%] left-[35%] h-[1px] bg-gradient-to-r from-[#c68e9a] to-transparent opacity-40"
                   />
                 </div>
               )}
            </AnimatePresence>

            {/* DRESS MOCKUP - AI FITTING SIMULATION */}
            <AnimatePresence mode="wait">
              {!isScanning && (
                <motion.div 
                  key={activeProduct.id}
                  initial={{ opacity: 0, scale: 0.8, y: 100, filter: 'blur(20px)' }}
                  animate={{ 
                    opacity: isLocked ? 0.6 : 0.2, 
                    scale: isLocked ? 1.05 : 1, 
                    y: 0,
                    filter: 'blur(0px)'
                  }}
                  exit={{ opacity: 0, scale: 1.2, filter: 'blur(40px)' }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-screen"
                >
                  <div className="relative w-full max-w-2xl h-full flex items-center justify-center">
                    <img 
                      src={activeProduct.image} 
                      alt="AR Fitting" 
                      className="w-full max-w-[85%] h-auto object-contain drop-shadow-[0_0_50px_rgba(198,142,154,0.3)]"
                    />
                    {/* Fabric Movement Simulation Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#c68e9a]/5 to-transparent animate-pulse" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOADING / SCANNING INTERFACE */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center z-[100] p-12 text-center"
                >
                  <div className="relative w-64 h-64 mb-16">
                     {/* Cyber-Circle */}
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="128" cy="128" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="transparent" />
                        <motion.circle 
                          cx="128" cy="128" r="120" 
                          stroke="#c68e9a" strokeWidth="3" fill="transparent"
                          strokeDasharray={754}
                          strokeDashoffset={754 - (754 * processingLevel) / 100}
                          strokeLinecap="round"
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                          <Scan className="text-[#c68e9a]" size={48} />
                        </motion.div>
                        <div className="flex flex-col">
                           <span className="text-white font-serif text-4xl font-light tracking-tighter">%{Math.round(processingLevel)}</span>
                           <span className="text-[8px] uppercase tracking-[0.5em] text-[#c68e9a] font-bold">Analiz</span>
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                    <h3 className="text-white text-[11px] uppercase tracking-[0.8em] font-bold opacity-80">AI Body Fitting Engine v2.0</h3>
                    <div className="flex justify-center gap-2">
                       {[...Array(3)].map((_, i) => (
                         <motion.div 
                           key={i}
                           animate={{ height: [4, 16, 4] }}
                           transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                           className="w-[2px] bg-[#c68e9a]"
                         />
                       ))}
                    </div>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-loose max-w-sm">
                      Kameraya doğru bakınız. <br/>
                      Işık seviyesi kontrol ediliyor... <br/>
                      Vücut hatları tanımlanıyor...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* HUD OVERLAY - CAMERA BUTTONS */}
            <div className="absolute inset-0 p-12 flex flex-col justify-between pointer-events-none z-50">
              <div className="flex justify-between items-start pointer-events-auto">
                <Link to="/" className="w-16 h-16 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group shadow-2xl">
                  <X size={28} className="group-hover:rotate-90 transition-transform" />
                </Link>
                
                <div className="flex flex-col gap-4 items-end">
                  <div className="px-6 py-3 bg-black/60 backdrop-blur-3xl border border-[#c68e9a]/30 rounded-full flex items-center gap-4 text-white shadow-2xl">
                     <div className="w-2 h-2 bg-[#c68e9a] rounded-full animate-pulse" />
                     <span className="text-[10px] uppercase tracking-[0.4em] font-bold">AI Tracking Lock</span>
                  </div>
                  <div className="flex gap-4">
                     <button className="w-12 h-12 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors">
                        <Eye size={20} />
                     </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pointer-events-auto pb-10">
                <div className="flex items-center gap-16 bg-black/80 backdrop-blur-3xl border border-white/10 px-16 py-8 rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                   <button className="text-white/30 hover:text-[#c68e9a] transition-all hover:scale-110">
                      <RefreshCcw size={24} />
                   </button>
                   
                   <div className="relative group cursor-pointer">
                      <motion.div 
                        whileTap={{ scale: 0.9 }}
                        className="w-24 h-24 rounded-full border-4 border-white/10 flex items-center justify-center transition-all duration-700 group-hover:border-[#c68e9a]"
                      >
                         <div className="w-18 h-18 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)]" />
                      </motion.div>
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#c68e9a] text-white text-[9px] px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest font-bold whitespace-nowrap shadow-2xl">
                        Anı Yakala
                      </div>
                   </div>

                   <button className="text-white/30 hover:text-[#c68e9a] transition-all hover:scale-110">
                      <Maximize size={24} />
                   </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* LUXURY PRODUCT SELECTOR (SIDEBAR) */}
      <div className="w-full md:w-[480px] bg-[#120f10] border-l border-white/5 flex flex-col z-[150] shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-12 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-xl bg-[#c68e9a]/10 flex items-center justify-center border border-[#c68e9a]/20">
                <User size={24} className="text-[#c68e9a]" />
             </div>
             <div>
                <span className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold block mb-1">Mirror Mode</span>
                <span className="text-gray-500 text-[8px] uppercase tracking-widest font-bold">v2.4.0 Interactive</span>
             </div>
          </div>
          <h2 className="font-serif text-5xl text-white leading-tight">Gelinlik <br/><span className="text-gold-gradient italic">Prova.</span></h2>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
          {PRODUCTS.map(product => (
            <motion.div 
              key={product.id}
              whileHover={{ x: 10, backgroundColor: 'rgba(198,142,154,0.05)' }}
              onClick={() => {
                setIsLocked(false);
                setActiveProduct(product);
                setTimeout(() => setIsLocked(true), 500);
              }}
              className={`group relative p-8 rounded-3xl border transition-all duration-700 cursor-pointer overflow-hidden ${activeProduct.id === product.id ? 'border-[#c68e9a] bg-[#c68e9a]/10' : 'border-white/5 hover:border-white/10 bg-white/[0.01]'}`}
            >
              <div className="flex gap-8 items-center relative z-10">
                <div className="w-28 h-36 bg-neutral-900 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl transform group-hover:scale-105 transition-transform duration-1000">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-3">
                  <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#c68e9a] opacity-80">{product.category}</span>
                  <h4 className="text-white text-2xl font-serif">{product.name}</h4>
                  <div className="flex items-center gap-2 text-gray-500">
                     <Ruler size={12} />
                     <span className="text-[10px] uppercase tracking-widest">Özel Ölçü Uyumu</span>
                  </div>
                </div>
              </div>
              
              {activeProduct.id === product.id && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-[#c68e9a]/10 to-transparent pointer-events-none"
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="p-12 bg-black/60 border-t border-white/10 backdrop-blur-3xl">
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <p className="text-[#c68e9a] text-[10px] uppercase tracking-[0.4em] font-bold mb-2">Seçili Model</p>
                  <h3 className="text-white text-3xl font-serif">{activeProduct.name}</h3>
               </div>
               <button className="w-14 h-14 bg-white/5 hover:bg-[#c68e9a] hover:text-white text-gray-400 rounded-full flex items-center justify-center transition-all">
                  <Download size={24} />
               </button>
            </div>
            <p className="text-gray-500 text-xs font-light leading-relaxed">
              Bu tasarım, vücut hatlarınıza göre %98 doğrulukla simüle edilmiştir. Detaylar için atölye randevusu alabilirsiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
             <button className="w-full py-6 bg-[#c68e9a] text-white text-[11px] uppercase tracking-[0.5em] font-bold hover:shadow-[0_0_40px_rgba(198,142,154,0.4)] hover:scale-[1.02] transition-all">
                Randevu Talebi Gönder
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
