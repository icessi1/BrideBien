import { useEffect, useRef, useState } from 'react';
import { Camera, Sparkles, MapPin, ArrowRight, Play, Maximize, Compass } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const STYLES = `
  .bb-home {
    --bb-pearl: #faf6f5;
    --bb-dark-ink: #1a1516;
    --bb-rose-gold: #c68e9a;
    --bb-rose-gold-light: #e6c8cd;
  }
  .bb-home .bb-stroke {
    color: transparent;
    -webkit-text-stroke: 1px var(--bb-rose-gold);
  }
  .bb-home .bb-dark-section {
    background-color: var(--bb-dark-ink);
    color: var(--bb-pearl);
  }
`;

const AbstractSculpture = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene;
    let camera;
    let renderer;
    let loadedModel;
    let animationId;
    let controls;

    const mountNode = mountRef.current;
    if (!mountNode) return;

    const width = mountNode.clientWidth;
    const height = mountNode.clientHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountNode.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 2;
    controls.maxDistance = 8; // Don't allow zooming out further than initial view

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const light1 = new THREE.DirectionalLight(0xffffff, 2);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xffffff, 2, 100);
    light2.position.set(-5, 2, 2);
    scene.add(light2);

    const loader = new GLTFLoader();
    loader.load(
      '/wedding_dress.glb',
      (gltf) => {
        loadedModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        loadedModel.position.sub(center);
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const scale = 4 / maxAxis;
        loadedModel.scale.setScalar(scale);
        loadedModel.position.y = -1;
        scene.add(loadedModel);
      },
      undefined,
      () => {
        sculpture.visible = true;
      }
    );


    const handleResize = () => {
      if (!mountNode) return;
      const w = mountNode.clientWidth;
      const h = mountNode.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (renderer?.domElement?.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
      if (loadedModel) {
        loadedModel.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose?.());
            } else {
              child.material?.dispose?.();
            }
          }
        });
      }
      if (controls) controls.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-auto" />;
};

const ARTryOnPreview = () => {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + direction * 1.5;
        if (next >= 100) {
          setDirection(-1);
          return 100;
        }
        if (next <= 0) {
          setDirection(1);
          return 0;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [direction]);

  return (
    <div className="relative aspect-[3/4] md:aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
      <img
        src="/ar-base.png"
        alt="AR Gelinlik Provası"
        className="w-full h-full object-cover"
      />

      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `inset(0 0 ${100 - progress}% 0)`,
          WebkitClipPath: `inset(0 0 ${100 - progress}% 0)`,
        }}
      >
        <img
          src="/ar-dress.png"
          alt="AR Gelinlik Sonucu"
          className="w-full h-full object-cover"
        />
      </div>

      <motion.div
        animate={{ top: `${progress}%` }}
        transition={{ duration: 0.05, ease: 'linear' }}
        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#c68e9a] to-transparent opacity-70 shadow-[0_0_15px_#c68e9a]"
      />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-md px-8 py-4 rounded-full border border-white/10">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-xs tracking-widest uppercase text-white font-medium">Beden Analizi</span>
        <Maximize size={16} className="text-[#c68e9a] ml-2" />
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="bb-home relative overflow-hidden bg-[#faf6f5] selection:bg-[#c68e9a] selection:text-white">
      <style>{STYLES}</style>

      <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-20 pt-24">
        <div className="absolute right-0 top-24 w-full md:w-2/3 h-full z-0 opacity-60 md:opacity-100">
          <AbstractSculpture />
        </div>

        <div className="relative z-10 w-full md:w-1/2 mt-20 md:mt-0">
          <h1 className="font-serif text-6xl md:text-8xl lg:text-[8rem] leading-[0.85] text-[#1a1516] mb-8">
            Sınırları <br />
            <span className="bb-stroke">Aşan</span><br />
            <span className="italic text-[#c68e9a]">Tasarım</span>
          </h1>
          <p className="text-gray-500 font-light max-w-md mb-12 text-lg leading-relaxed">
            Klasik terziliğin ustalığı, Artırılmış Gerçeklik (AR) teknolojisiyle buluşuyor.
            Düşlediğiniz tasarımı kendi üzerinizde keşfedin.
          </p>

          <div className="flex items-center gap-8 flex-wrap">
            <Link to="/ar-studyo">
              <button className="group relative px-8 py-4 bg-[#1a1516] text-[#faf6f5] overflow-hidden">
                <span className="relative z-10 text-xs tracking-[0.2em] uppercase">Sanal Provaya Başla</span>
                <div className="absolute inset-0 bg-[#c68e9a] transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
              </button>
            </Link>

            <Link
              to="/koleksiyon"
              className="flex items-center gap-3 cursor-pointer group no-underline"
            >
              <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#c68e9a] transition-colors">
                <Play size={14} className="text-[#1a1516] group-hover:text-[#c68e9a] ml-1" />
              </div>
              <span className="text-xs uppercase tracking-widest font-medium text-[#1a1516]">Koleksiyon</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="ar-deneyimi" className="bb-dark-section relative py-32 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#c68e9a] rounded-full blur-[150px] opacity-10" />

        <div className="max-w-[90rem] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-5 space-y-10">
            <Compass className="text-[#c68e9a]" size={32} />
            <h2 className="font-serif text-5xl md:text-7xl leading-tight">
              Aynaların <br /> Ötesinde
            </h2>
            <p className="text-gray-400 font-light text-lg md:text-xl leading-relaxed">
              Kameranızı açın ve odanızı kişisel bir podyuma dönüştürün. Seçtiğiniz gelinlik
              veya abiyeyi anında üzerinizde görüntüleyin.
            </p>
            <ul className="space-y-6 text-sm tracking-wide text-gray-300">
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-[#c68e9a] rounded-full" />Uygulama indirmeden aninda deneyim</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-[#c68e9a] rounded-full" />Yüksek doğrulukta beden simülasyonu</li>
              <li className="flex items-center gap-4"><span className="w-1.5 h-1.5 bg-[#c68e9a] rounded-full" />Fotoğraf çekin, paylaşın, randevu alın</li>
            </ul>
          </div>

          <div className="lg:col-span-7">
            <ARTryOnPreview />
          </div>
        </div>
      </section>

      <section id="koleksiyon" className="py-32 bg-[#faf6f5]">
        <div className="px-8 max-w-[90rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
              <span className="text-[#c68e9a] tracking-[0.2em] text-xs uppercase block mb-4">SS 2026 Koleksiyonu</span>
              <h2 className="font-serif text-5xl md:text-6xl text-[#1a1516]">Işığın <br />Yansımaları</h2>
            </div>
            <Link to="/koleksiyon" className="flex items-center gap-2 text-sm uppercase tracking-widest font-medium border-b border-[#1a1516] pb-1 hover:text-[#c68e9a] hover:border-[#c68e9a] transition-all no-underline">
              Tümünü Gör <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <Link to="/urun/1" className="md:col-span-7 group cursor-pointer no-underline text-current">
              <div className="overflow-hidden aspect-[4/5] bg-gray-200 mb-6 relative">
                <img src="https://images.unsplash.com/photo-1596450514735-111a2fe02935?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Model 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-[#1a1516] text-[10px] uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                  <Camera size={12} className="text-[#c68e9a]" /> AR ile Dene
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-2">Luna Gelinlik</h3>
              <p className="text-gray-500 text-sm tracking-wide">Fransız danteli ve ipek şifon</p>
            </Link>

            <Link to="/urun/2" className="md:col-span-5 md:mt-48 group cursor-pointer no-underline text-current">
              <div className="overflow-hidden aspect-[3/4] bg-gray-200 mb-6 relative">
                <img src="https://images.unsplash.com/photo-1572804013309-82a89b47afc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Model 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-[#1a1516] text-[10px] uppercase tracking-widest px-4 py-2 flex items-center gap-2">
                  <Camera size={12} className="text-[#c68e9a]" /> AR ile Dene
                </div>
              </div>
              <h3 className="font-serif text-2xl mb-2">Aura Couture</h3>
              <p className="text-gray-500 text-sm tracking-wide">El işlemesi kristal detaylar</p>
            </Link>
          </div>
        </div>
      </section>

      <section id="randevu" className="py-32 relative overflow-hidden bg-[#e6c8cd]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <h2 className="font-serif text-[15vw] leading-none whitespace-nowrap text-[#1a1516]">Bride Bien</h2>
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto px-8">
          <Sparkles className="mx-auto text-[#1a1516] mb-8" size={32} />
          <h2 className="font-serif text-4xl md:text-6xl mb-8 text-[#1a1516]">Dijitalde Başlayan Bir Hikaye</h2>
          <p className="text-[#1a1516]/70 mb-12 text-lg">
            Sanal provadan sonra dokuları hissetmek ve size özel detayları konuşmak için sizi
            Nişantaşı'ndaki atölyemize bekliyoruz.
          </p>
          <div className="flex items-center justify-center gap-3 text-[#1a1516]/80 mb-8">
            <MapPin size={16} />
            <span className="text-xs uppercase tracking-[0.2em]">Nişantaşı / İstanbul</span>
          </div>
          <Link to="/iletisim">
            <button className="px-12 py-5 bg-[#1a1516] text-[#faf6f5] text-xs tracking-[0.2em] uppercase hover:bg-black transition-colors">
              Özel Randevu Talep Et
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
