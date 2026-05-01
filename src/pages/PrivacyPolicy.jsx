import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-[#fffcfb] min-h-screen">
      <div className="max-w-4xl mx-auto px-8 md:px-12">
        <span className="text-[#c68e9a] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">
          Yasal Bilgilendirme
        </span>
        <h1 className="font-serif text-5xl md:text-7xl text-[#120f10] mb-10">Gizlilik Politikası</h1>
        <div className="space-y-8 text-gray-600 leading-relaxed">
          <p>
            Bride Bien olarak kişisel verilerinizin güvenliğini önemsiyoruz. Bu politika, web sitemizi
            kullanırken hangi verilerin toplandığını, hangi amaçlarla işlendiğini ve haklarınızı açıklamak
            için hazırlanmıştır.
          </p>
          <p>
            İletişim formları, randevu talepleri ve teknik kayıtlar üzerinden paylaştığınız bilgiler yalnızca
            hizmet sunumu, randevu planlaması ve müşteri iletişimi amacıyla kullanılmaktadır.
          </p>
          <p>
            Kişisel verileriniz, yürürlükteki mevzuata uygun olarak korunur ve açık rızanız veya yasal
            yükümlülükler dışında üçüncü kişilerle paylaşılmaz.
          </p>
          <p>
            Veri işleme süreçleriyle ilgili sorularınız için <a className="text-[#c68e9a] underline" href="mailto:info@bridebien.com">info@bridebien.com</a> adresinden bizimle iletişime geçebilirsiniz.
          </p>
        </div>
        <div className="mt-12">
          <Link to="/iletisim" className="inline-block px-8 py-3 bg-[#120f10] text-white text-[10px] uppercase tracking-[0.35em] font-bold hover:bg-[#c68e9a] transition-colors">
            İletişime Geç
          </Link>
        </div>
      </div>
    </div>
  );
}
