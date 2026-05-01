import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', category: 'Gelinlik', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('Lütfen zorunlu alanları doldurun.');
      return;
    }
    setError('');
    setIsSubmitted(true);
    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="pt-32 pb-40 bg-[#fffcfb]">
      <div className="max-w-[100rem] mx-auto px-8 md:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Contact Info */}
          <div className="space-y-16">
            <div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold block mb-6"
              >
                İletişim & Randevu
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-7xl md:text-8xl text-[#120f10] leading-tight"
              >
                Sizi <br/><span className="italic text-gold-gradient text-6xl md:text-8xl">Bekliyoruz.</span>
              </motion.h1>
            </div>

            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-[#c68e9a]" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#c68e9a] mb-2">Adres</h4>
                  <p className="text-xl text-[#120f10] font-light leading-relaxed">
                    Teşvikiye Mah. Nişantaşı Cad. <br/>
                    No: 44, Şişli / İstanbul
                  </p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-[#c68e9a]" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#c68e9a] mb-2">Telefon</h4>
                  <p className="text-xl text-[#120f10] font-light">+90 (212) 234 56 78</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-[#c68e9a]" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#c68e9a] mb-2">E-Posta</h4>
                  <p className="text-xl text-[#120f10] font-light">randevu@bridebien.com</p>
                </div>
              </div>
            </div>

            <div className="pt-12">
               <a href="https://wa.me/905322223344" target="_blank" rel="noreferrer" className="inline-flex items-center gap-4 px-10 py-5 bg-[#25D366] text-white rounded-full text-[11px] uppercase tracking-[0.3em] font-bold shadow-xl hover:scale-105 transition-transform no-underline">
                  <MessageCircle size={20} />
                  WhatsApp ile Hızlı Randevu
               </a>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-12 md:p-20 shadow-2xl border border-gray-50 relative overflow-hidden"
          >
            <AnimatePresence>
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center text-center p-12"
                >
                   <div className="w-20 h-20 bg-[#c68e9a] rounded-full flex items-center justify-center text-white mb-8">
                      <Send size={32} />
                   </div>
                   <h3 className="font-serif text-4xl text-[#120f10] mb-4">Mesajınız Alındı</h3>
                   <p className="text-gray-500 font-light max-w-sm">
                      Talebiniz bize ulaştı. Stil danışmanlarımız en kısa sürede sizinle iletişime geçecektir.
                   </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <h3 className="font-serif text-4xl text-[#120f10] mb-12">Randevu Formu</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Ad Soyad *</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border-b border-gray-200 py-3 focus:border-[#c68e9a] outline-none transition-colors text-sm font-light bg-transparent" 
                    placeholder="Adınız Soyadınız" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Telefon *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border-b border-gray-200 py-3 focus:border-[#c68e9a] outline-none transition-colors text-sm font-light bg-transparent" 
                    placeholder="05xx xxx xx xx" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">İlgilendiğiniz Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border-b border-gray-200 py-3 focus:border-[#c68e9a] outline-none transition-colors text-sm font-light bg-transparent appearance-none"
                >
                  <option>Gelinlik</option>
                  <option>Abiye</option>
                  <option>Nişanlık</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Mesajınız</label>
                <textarea 
                  rows="4" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border-b border-gray-200 py-3 focus:border-[#c68e9a] outline-none transition-colors text-sm font-light bg-transparent resize-none" 
                  placeholder="Size nasıl yardımcı olabiliriz?"
                ></textarea>
              </div>

              {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}

              <button type="submit" className="w-full py-5 bg-[#120f10] text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-[#c68e9a] transition-all flex items-center justify-center gap-4 group">
                Randevu Talebi Gönder
                <Send size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
