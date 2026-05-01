import { useMemo, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PRODUCTS } from '../data';
import { Camera, Sparkles, MapPin, ChevronRight, RotateCcw, Maximize2, Play } from 'lucide-react';

// --- INTERACTIVE 3D DRESS VIEWER ---
const DressViewer3D = () => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let scene, camera, renderer, animationId, controls, loadedModel;
    const mountNode = mountRef.current;
    if (!mountNode) return;
    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountNode.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 2;
    controls.maxDistance = 8;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const loader = new GLTFLoader();
    loader.load(`${import.meta.env.BASE_URL}wedding_dress.glb`, (gltf) => {
      loadedModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(loadedModel);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      loadedModel.position.sub(center);
      const scale = 4 / (Math.max(size.x, size.y, size.z) || 1);
      loadedModel.scale.setScalar(scale);
      loadedModel.position.y = -1;
      scene.add(loadedModel);
      setLoading(false);
    });

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountNode) return;
      const w = mountNode.clientWidth;
      const h = mountNode.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (renderer?.domElement?.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      if (controls) controls.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full cursor-grab active:cursor-grabbing group">
      <div ref={mountRef} className="w-full h-full" />
      <AnimatePresence>
        {loading && (
          <motion.div 
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-[#fffcfb]"
          >
            <div className="w-8 h-8 border-2 border-[#c68e9a] border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg text-[#120f10]">
            <RotateCcw size={18} />
         </div>
         <div className="p-3 bg-white/80 backdrop-blur rounded-full shadow-lg text-[#120f10]">
            <Maximize2 size={18} />
         </div>
      </div>
      <div className="absolute top-8 right-8 text-[9px] uppercase tracking-widest font-bold text-[#c68e9a] bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
        3D Interaktif Görünüm
      </div>
    </div>
  );
};

export default function ProductDetail() {
  const { id } = useParams();
  
  const product = useMemo(() => {
    return PRODUCTS.find(p => p.id === parseInt(id));
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [viewMode, setViewMode] = useState('image'); // 'image' or '3d' or 'video'
  const [isZoomed, setIsZoomed] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  
  // Update selected image if product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setViewMode('image');
      setIsZoomed(false);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <h2 className="font-serif text-4xl mb-8">Ürün bulunamadı.</h2>
        <Link to="/koleksiyon" className="text-[#c68e9a] uppercase tracking-widest font-bold">Koleksiyona Dön</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-40 bg-[#fffcfb]">
      <div className="max-w-[100rem] mx-auto px-8 md:px-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-12">
          <Link to="/koleksiyon" className="hover:text-[#120f10] transition-colors">Koleksiyon</Link>
          <ChevronRight size={12} />
          <span className="text-[#c68e9a]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          {/* Main Visual Area */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] overflow-hidden bg-white shadow-2xl border border-gray-50 group/zoom"
            >
              <AnimatePresence mode="wait">
                {viewMode === 'image' ? (
                  <motion.div 
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`w-full h-full relative overflow-hidden ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                    onClick={() => setIsZoomed(!isZoomed)}
                    onMouseMove={(e) => {
                      if (!isZoomed) return;
                      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                      const x = ((e.pageX - left - window.scrollX) / width) * 100;
                      const y = ((e.pageY - top - window.scrollY) / height) * 100;
                      e.currentTarget.style.setProperty('--x', `${x}%`);
                      e.currentTarget.style.setProperty('--y', `${y}%`);
                    }}
                  >
                    <img 
                      src={selectedImage} 
                      alt={product.name} 
                      className={`w-full h-full object-cover transition-transform duration-500 origin-[var(--x,50%)_var(--y,50%)] ${isZoomed ? 'scale-[2.5]' : 'scale-100'}`} 
                    />
                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur px-3 py-2 rounded-full shadow-lg opacity-100 transition-opacity flex items-center gap-2">
                      <Maximize2 size={14} className="text-[#c68e9a]" />
                      <span className="text-[8px] uppercase tracking-widest font-bold">
                        {isZoomed ? 'Uzaklaştırmak için Tıkla' : 'Yakınlaştırmak için Tıkla'}
                      </span>
                    </div>
                  </motion.div>
                ) : viewMode === '3d' ? (
                  <motion.div 
                    key="3d-viewer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full"
                  >
                    <DressViewer3D />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="video-viewer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden"
                  >
                     <video
                        autoPlay
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                        onEnded={() => setIsVideoEnded(true)}
                     >
                        <source src={`${import.meta.env.BASE_URL}rotating_bride_mp_.mp4`} type="video/mp4" />
                     </video>
                     
                     <AnimatePresence>
                        {isVideoEnded && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30"
                          >
                             <button 
                                onClick={(e) => {
                                  const video = e.currentTarget.parentElement.previousElementSibling;
                                  video.currentTime = 0;
                                  video.play();
                                  setIsVideoEnded(false);
                                }}
                                className="flex flex-col items-center gap-4 group"
                             >
                                <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                   <RotateCcw size={24} />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">Tekrar İzle</span>
                             </button>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* View Mode Toggle */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur-xl p-1 rounded-full shadow-2xl border border-white/20 z-20">
                <button 
                  onClick={() => setViewMode('image')}
                  className={`px-8 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${viewMode === 'image' ? 'bg-[#120f10] text-white' : 'text-gray-400 hover:text-[#120f10]'}`}
                >
                  Fotoğraf
                </button>
                <button 
                  onClick={() => setViewMode('3d')}
                  className={`px-8 py-2 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all ${viewMode === '3d' ? 'bg-[#120f10] text-white' : 'text-gray-400 hover:text-[#120f10]'}`}
                >
                  3D Görünüm
                </button>
              </div>
            </motion.div>

            {/* Thumbnail Slider */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
               {/* Detail Images Thumbnails */}
               {(product.images || []).map((img, idx) => (
                 <button 
                    key={idx}
                    onClick={() => { setSelectedImage(img); setViewMode('image'); }}
                    className={`flex-shrink-0 w-24 aspect-[3/4] overflow-hidden border-2 transition-all ${selectedImage === img && viewMode === 'image' ? 'border-[#c68e9a]' : 'border-transparent grayscale'}`}
                 >
                    <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx + 1}`} />
                 </button>
               ))}

               {/* Video Thumbnail */}
               <button 
                  onClick={() => setViewMode('video')}
                  className={`flex-shrink-0 w-40 aspect-[3/4] bg-neutral-900 flex items-center justify-center relative group border-2 transition-all ${viewMode === 'video' ? 'border-[#c68e9a]' : 'border-transparent grayscale'}`}
               >
                  <img src={product.image} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                  <Play size={20} className="text-white relative z-10" />
                  <span className="absolute bottom-4 text-[7px] text-white/50 uppercase tracking-widest font-bold">Video</span>
               </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-40 h-fit">
            <div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#c68e9a] text-[10px] uppercase tracking-[0.4em] font-bold block mb-4"
              >
                {product.category} — Haute Couture
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-6xl md:text-7xl text-[#120f10] mb-8 leading-tight"
              >
                {product.name}
              </motion.h1>
              <p className="text-gray-500 text-lg leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
               <div className="flex items-center gap-4">
                  <Sparkles size={18} className="text-[#c68e9a]" />
                  <span className="text-[11px] uppercase tracking-widest font-bold">El İşçiliği</span>
               </div>
               <div className="flex items-center gap-4">
                  <MapPin size={18} className="text-[#c68e9a]" />
                  <span className="text-[11px] uppercase tracking-widest font-bold">Nişantaşı</span>
               </div>
            </div>

            <div className="flex flex-col gap-5 pt-6">
              <Link to="/ar-studyo" className="no-underline">
                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: '#c68e9a' }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-6 bg-[#1a1516] text-white flex items-center justify-center gap-4 shadow-xl transition-all duration-500 group"
                >
                  <Camera size={20} className="group-hover:rotate-12 transition-transform" />
                  <span className="text-[11px] uppercase tracking-[0.4em] font-bold">AR İle Üzerinde Dene</span>
                </motion.button>
              </Link>

              <Link to="/iletisim" className="no-underline">
                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: '#1a1516', color: '#ffffff' }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-6 border border-[#1a1516] text-[#1a1516] bg-transparent text-[11px] uppercase tracking-[0.4em] font-bold transition-all duration-500"
                >
                  Atölye Randevusu Al
                </motion.button>
              </Link>
            </div>

            {/* Product Meta Information */}
            <div className="pt-12">
               <h4 className="text-[10px] uppercase tracking-widest font-bold mb-8 text-[#c68e9a]">Detaylar & Süreç</h4>
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Teslimat</span>
                    <span className="text-sm text-[#120f10] font-medium">4-8 Hafta</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Kumaş</span>
                    <span className="text-sm text-[#120f10] font-medium">İtalyan İpek & Saten</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-gray-50 pb-4">
                    <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Kalıp</span>
                    <span className="text-sm text-[#120f10] font-medium">Kişiye Özel Prova</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
