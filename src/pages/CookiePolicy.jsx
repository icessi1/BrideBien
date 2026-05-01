import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="pt-32 pb-24 bg-[#fffcfb] min-h-screen">
      <div className="max-w-4xl mx-auto px-8 md:px-12">
        <span className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
          Yasal Bilgilendirme
        </span>
        <h1 className="font-serif text-5xl md:text-7xl text-[#120f10] mb-10">Cerez Politikasi</h1>
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <p>
            Bu web sitesi, deneyimi iyilestirmek, performansi analiz etmek ve temel islevleri calistirmak
            icin cerezler kullanir.
          </p>
          <p>
            Zorunlu cerezler sitenin calismasi icin gereklidir. Analitik cerezler ise ziyaret davranislarini
            anonim olarak anlamamiza yardimci olur.
          </p>
          <p>
            Tarayici ayarlariniz uzerinden cerez tercihlerinizi degistirebilir veya cerezleri silebilirsiniz.
            Ancak bu durumda bazi ozellikler beklenen sekilde calismayabilir.
          </p>
          <p>
            Cerez kullanimi hakkinda detayli bilgi icin bizimle <a className="text-[#c68e9a] underline" href="mailto:info@bridebien.com">info@bridebien.com</a> adresinden iletisime gecebilirsiniz.
          </p>
        </div>
        <div className="mt-12">
          <Link to="/iletisim" className="inline-block px-8 py-3 bg-[#120f10] text-white text-[10px] uppercase tracking-[0.35em] font-bold hover:bg-[#c68e9a] transition-colors">
            Cerez Tercihi Icin Iletisim
          </Link>
        </div>
      </div>
    </div>
  );
}
