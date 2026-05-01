import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data';
import { Camera } from 'lucide-react';

export default function Collection() {
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const categories = ['Hepsi', 'Gelinlik', 'Abiye', 'Nişanlık'];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'Hepsi') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="pt-32 pb-40 px-8 md:px-20 min-h-screen bg-[#fffcfb]">
      {/* HEADER */}
      <div className="max-w-[100rem] mx-auto mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c68e9a] text-[12px] uppercase tracking-[0.3em] font-semibold block mb-6"
        >
          Seçkin Tasarımlar
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-serif text-6xl md:text-8xl text-[#120f10] mb-12"
        >
          Koleksiyon <span className="italic text-gold-gradient">2026</span>
        </motion.h1>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-[12px] uppercase tracking-[0.18em] font-semibold border-y border-gray-100 py-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative transition-colors duration-300 ${activeCategory === cat ? 'text-[#c68e9a]' : 'text-gray-400 hover:text-[#120f10]'}`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div 
                  layoutId="underline"
                  className="absolute -bottom-2 left-0 w-full h-[2px] bg-[#c68e9a]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-[100rem] mx-auto">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <Link to={`/urun/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 mb-6">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-500">
                        <Camera size={24} className="text-[#120f10]" />
                      </div>
                    </div>

                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold text-[#120f10] shadow-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-3xl text-[#120f10] mb-1">{product.name}</h3>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest font-medium">{product.details}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#c68e9a] mt-2">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-40">
            <p className="text-gray-400 italic">Bu kategoride henüz ürün bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
