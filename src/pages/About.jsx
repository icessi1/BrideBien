import { motion, useScroll, useTransform } from 'framer-motion';

export default function About() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="relative bg-[#fffcfb] overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1594553423282-55b2cae2501d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Atelier Background"
          />
        </motion.div>
        
        <div className="relative z-10 text-center space-y-8 px-8">
           <motion.span 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="text-[#c68e9a] text-[10px] uppercase tracking-[0.6em] font-bold block"
           >
             Miras ve Zanaat
           </motion.span>
           <motion.h1 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1 }}
             className="font-serif text-7xl md:text-[10rem] text-[#120f10] leading-none"
           >
             Bir Düşün <br/><span className="italic text-gold-gradient">Doğuşu.</span>
           </motion.h1>
        </div>
      </section>

      {/* Story Content */}
      <section className="relative py-40 px-8 md:px-20 max-w-[100rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
          <div className="space-y-12">
            <h2 className="font-serif text-5xl md:text-7xl text-[#120f10] leading-tight">
              Nişantaşı'nın Kalbinde <br/><span className="text-[#c68e9a]">30 Yıllık Tutku.</span>
            </h2>
            <div className="space-y-8 text-gray-500 text-xl font-light leading-relaxed">
              <p>
                Bride Bien, 1990 yılından bu yana her dikişinde bir hikaye saklayan, her kumaşında bir rüyayı barındıran tasarımlarıyla Haute Couture dünyasına yön veriyor.
              </p>
              <p>
                Geleneksel terzilik sanatını, yarının teknolojisiyle birleştirerek gelinlik deneyimini fiziksel dünyanın ötesine taşıyoruz. Bizim için her prova, bir sanat eserinin son fırça darbeleridir.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-100">
               <div>
                  <span className="block font-serif text-5xl text-[#c68e9a] mb-2">1990</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#120f10]">Kuruluş</span>
               </div>
               <div>
                  <span className="block font-serif text-5xl text-[#c68e9a] mb-2">50+</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#120f10]">Usta Terzi</span>
               </div>
               <div>
                  <span className="block font-serif text-5xl text-[#c68e9a] mb-2">∞</span>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-[#120f10]">Zarafet</span>
               </div>
            </div>
          </div>

          <div className="relative">
             <motion.div 
               style={{ y: y2 }}
               className="aspect-[4/5] bg-gray-100 overflow-hidden shadow-2xl"
             >
                <img src="https://images.unsplash.com/photo-1518049362265-d5b2a6467637?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Craftsmanship" />
             </motion.div>
             <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#c68e9a] opacity-10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-60 bg-[#120f10] text-center px-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="grid grid-cols-6 h-full">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="border-r border-white/20 h-full" />
               ))}
            </div>
         </div>
         <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto space-y-12 relative z-10"
         >
            <span className="text-[#c68e9a] text-[10px] uppercase tracking-[0.8em] font-bold block">Manifesto</span>
            <h2 className="font-serif text-6xl md:text-8xl text-white leading-tight">
              "Her Kadın Kendi Masalının <span className="italic text-[#c68e9a]">Başrolüdür.</span>"
            </h2>
            <div className="w-20 h-[1px] bg-[#c68e9a] mx-auto"></div>
         </motion.div>
      </section>
    </div>
  );
}
