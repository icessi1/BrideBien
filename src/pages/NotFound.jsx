import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fffcfb] flex items-center justify-center px-8">
      <Seo
        title="Sayfa Bulunamadi"
        description="Aradiginiz sayfa bulunamadi. Bride Bien ana sayfasina donerek koleksiyonu kesfetmeye devam edebilirsiniz."
        path="/404"
        noindex
      />
      <div className="text-center max-w-2xl">
        <p className="text-[#c68e9a] uppercase tracking-[0.35em] text-xs font-semibold mb-5">Error 404</p>
        <h1 className="font-serif text-6xl md:text-8xl text-[#120f10] mb-6">Sayfa Bulunamadi</h1>
        <p className="text-gray-500 text-lg mb-10">
          Ulasmaya calistiginiz icerik kaldirilmis, tasinmis veya hatali baglanti ile acilmis olabilir.
        </p>
        <Link to="/" className="inline-block px-10 py-4 bg-[#120f10] text-white uppercase tracking-[0.25em] text-xs font-semibold hover:bg-[#c68e9a] transition-colors">
          Ana Sayfaya Don
        </Link>
      </div>
    </div>
  );
}
