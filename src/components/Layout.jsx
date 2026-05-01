import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Layout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const navItems = [
    { label: 'Ana Sayfa', to: '/' },
    { label: 'Koleksiyon', to: '/koleksiyon' },
    { label: 'AR Stüdyo', to: '/ar-studyo' },
    { label: 'Hikayemiz', to: '/hikayemiz' },
    { label: 'İletişim', to: '/iletisim' },
  ];

  return (
    <div className="relative bg-[#fffcfb] selection:bg-[#c68e9a] selection:text-white font-sans">
      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-8 md:px-20 py-6 flex justify-between items-center ${isScrolled ? 'bg-white/90 backdrop-blur-2xl shadow-sm py-4' : ''}`}>
        <Link to="/" className="relative group">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={`transition-all duration-500 ${isScrolled ? 'w-16 h-16' : 'w-24 h-24'}`}
          >
            <img src={logo} alt="Bride Bien Logo" className="w-full h-full object-contain" />
          </motion.div>
        </Link>

        <div className="hidden lg:flex gap-12 text-[12px] uppercase tracking-[0.22em] font-semibold text-[#120f10]">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              to={item.to}
              className="relative overflow-hidden group py-2"
            >
              <span className="inline-block transition-transform duration-500 group-hover:-translate-y-full">{item.label}</span>
              <span className="absolute left-0 top-full inline-block text-[#c68e9a] transition-transform duration-500 group-hover:-translate-y-full">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-8">
           <Link to="/iletisim" className="hidden md:block">
             <motion.button 
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="px-10 py-3 bg-[#120f10] text-white text-[11px] uppercase tracking-[0.24em] font-semibold hover:bg-[#c68e9a] transition-all shadow-lg"
             >
               Randevu Al
             </motion.button>
           </Link>
           
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="lg:hidden w-10 h-10 flex flex-col justify-center items-end gap-2 cursor-pointer z-[110]"
           >
              <motion.div 
                animate={{ width: isMenuOpen ? '100%' : '100%', rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 5 : 0 }}
                className="w-full h-[1px] bg-[#120f10] origin-center"
              />
              <motion.div 
                animate={{ width: isMenuOpen ? '0%' : '70%', opacity: isMenuOpen ? 0 : 1 }}
                className="h-[1px] bg-[#120f10]"
              />
              <motion.div 
                animate={{ width: isMenuOpen ? '100%' : '40%', rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -5 : 0 }}
                className="h-[1px] bg-[#120f10] origin-center"
              />
           </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[105] bg-[#fffcfb] pt-10 px-8 lg:hidden"
          >
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-gray-100">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="w-16 h-16">
                <img src={logo} alt="Bride Bien Logo" className="w-full h-full object-contain" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Menüyü kapat"
                className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] font-bold text-[#120f10] hover:text-[#c68e9a] transition-colors"
              >
                <span>Kapat</span>
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-8 pt-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link 
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-serif text-5xl text-[#120f10] hover:text-[#c68e9a] transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="pt-12 border-t border-gray-100 mt-12"
              >
                <Link to="/iletisim" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-6 bg-[#120f10] text-white text-[10px] uppercase tracking-[0.4em] font-bold">
                    Randevu Al
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative min-h-screen" style={{ position: 'relative' }}>{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#120f10] text-white pt-40 pb-12 px-8 md:px-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden select-none">
           <img src={logo} alt="" className="w-full h-full object-contain scale-150 grayscale invert" />
        </div>
        
        <div className="max-w-[100rem] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
            <div className="lg:col-span-5 space-y-12">
              <div className="w-28 h-28 p-2 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                 <img src={logo} alt="Logo" className="w-full h-full object-contain grayscale invert" />
              </div>
              <div>
                <h2 className="font-serif text-6xl md:text-8xl leading-[0.9] mb-8">
                  Ziyaretinizi <br/>
                  <span className="text-[#c68e9a] italic">Planlayın.</span>
                </h2>
                <p className="text-gray-400 text-lg font-light max-w-md leading-relaxed">
                  Dijitalde beğendiğiniz tasarımı, Nişantaşı stüdyomuzda üzerinizde deneyimlemek ve size özel detayları konuşmak için randevu alın.
                </p>
              </div>
              <div className="flex flex-wrap gap-6 pt-4">
                <a 
                  href="https://wa.me/902122345678" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="px-10 py-5 bg-[#c68e9a] text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-white hover:text-[#120f10] transition-all duration-500 shadow-xl"
                >
                  WhatsApp Randevu
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-16 lg:pl-20">
              <div>
                <h4 className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold mb-10 border-b border-white/5 pb-4">Hızlı Erişim</h4>
                <ul className="space-y-5 text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">
                  <li><Link to="/" className="hover:text-[#c68e9a] transition-colors no-underline">Ana Sayfa</Link></li>
                  <li><Link to="/koleksiyon" className="hover:text-[#c68e9a] transition-colors no-underline">Koleksiyon</Link></li>
                  <li><Link to="/ar-studyo" className="hover:text-[#c68e9a] transition-colors no-underline">AR Stüdyo</Link></li>
                  <li><Link to="/hikayemiz" className="hover:text-[#c68e9a] transition-colors no-underline">Hikayemiz</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold mb-10 border-b border-white/5 pb-4">Sosyal Medya</h4>
                <ul className="space-y-5 text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400">
                  <li>
                    <a href="https://instagram.com/bridebien" target="_blank" rel="noreferrer" className="hover:text-white transition-colors no-underline">
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://pinterest.com/bridebien" target="_blank" rel="noreferrer" className="hover:text-white transition-colors no-underline">
                      Pinterest
                    </a>
                  </li>
                  <li>
                    <a href="https://facebook.com/bridebien" target="_blank" rel="noreferrer" className="hover:text-white transition-colors no-underline">
                      Facebook
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold mb-10 border-b border-white/5 pb-4">Atölye</h4>
                <address className="not-italic text-[11px] uppercase tracking-[0.3em] leading-loose text-gray-400 font-bold">
                  Nişantaşı, İstanbul <br/> 
                  +90 212 234 56 78 <br/>
                  info@bridebien.com
                </address>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.6em] uppercase text-gray-600 font-bold">
            <div>© 2026 BRIDE BIEN Haute Couture — Crafted with Elegance</div>
            <div className="flex gap-12">
              <Link to="/gizlilik-politikasi" className="hover:text-[#c68e9a] transition-colors no-underline">Gizlilik Politikası</Link>
              <Link to="/cerez-politikasi" className="hover:text-[#c68e9a] transition-colors no-underline">Çerez Ayarları</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
