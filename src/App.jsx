import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import ARStudio from './pages/ARStudio';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import NotFound from './pages/NotFound';
import Seo from './components/Seo';

// --- PAGE TRANSITION WRAPPER ---
const PageTransition = ({ children }) => {
  return (
    <motion.div
      className="relative"
      style={{ position: 'relative' }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const seoByPath = {
    '/': {
      title: 'BrideBein&Dress',
      description: 'Bride Bien gelinlik ve abiye koleksiyonlarını dijitalde keşfedin. AR Stüdyo ile sanal prova yapın, atölyeden randevu alın.',
    },
    '/koleksiyon': {
      title: 'Koleksiyon 2026',
      description: 'Gelinlik, abiye ve nişanlık modellerini inceleyin. Her bir tasarım için ürün detaylarını görün ve AR deneme adımına geçin.',
    },
    '/ar-studyo': {
      title: 'AR Studyo',
      description: 'Canlı kamera görüntüsü üzerinde gelinlik fitting ayarı yapın, ölçek ve konum ayarlayın, çekimi kaydedin.',
    },
    '/hikayemiz': {
      title: 'Hikayemiz',
      description: 'Bride Bien mirasını, tasarım anlayışını ve Nişantaşı\'ndaki atölyenin couture hikayesini keşfedin.',
    },
    '/iletisim': {
      title: 'İletişim ve Randevu',
      description: 'Bride Bien ile iletişime geçin. Atölye randevusu alın ve size özel prova sürecini başlatın.',
    },
  };
  const seoConfig = location.pathname.startsWith('/urun/')
    ? {
        title: 'Urun Detayi',
        description: 'Bride Bien tasarim detaylarini inceleyin, AR ile deneyin ve atolyeden randevu alin.',
      }
    : (seoByPath[location.pathname] || {
        title: 'Bride Bien',
        description: 'Bride Bien resmi web sitesi.',
      });
  
  return (
    <>
      <Seo
        title={seoConfig.title}
        description={seoConfig.description}
        path={location.pathname}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/koleksiyon" element={<PageTransition><Collection /></PageTransition>} />
          <Route path="/ar-studyo" element={<PageTransition><ARStudio /></PageTransition>} />
          <Route path="/urun/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
          <Route path="/hikayemiz" element={<PageTransition><About /></PageTransition>} />
          <Route path="/iletisim" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/gizlilik-politikasi" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/cerez-politikasi" element={<PageTransition><CookiePolicy /></PageTransition>} />
          {/* Alias for ar-studio */}
          <Route path="/ar-studio" element={<PageTransition><ARStudio /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}
