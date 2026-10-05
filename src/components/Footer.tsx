import { site } from '../config/site';
import { categories } from '../data/categories';
import { categoryUrl } from '../lib/catalog';
import { waGeneral } from '../lib/whatsapp';
import { Icon } from './Icon';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="rs-footer">
      <div className="rs-container rs-footer__grid">
        <div className="rs-footer__brand">
          <img src="/images/brand/risha-logo-ivory.webp" width={426} height={288} alt={site.fullName} loading="lazy" />
          <p className="rs-small rs-muted">{site.tagline}. {site.serviceArea}.</p>
          <div className="rs-social">
            <a href={site.social.instagram} className="rs-iconbtn" aria-label="ريشة على إنستغرام" target="_blank" rel="noopener">
              <Icon name="instagram" />
            </a>
            <a href={site.social.facebook} className="rs-iconbtn" aria-label="ريشة على فيسبوك" target="_blank" rel="noopener">
              <Icon name="facebook" />
            </a>
            <a href={waGeneral()} className="rs-iconbtn rs-iconbtn--wa" aria-label="ريشة على واتساب" target="_blank" rel="noopener">
              <Icon name="whatsapp" />
            </a>
          </div>
        </div>
        <nav aria-label="الأقسام" className="rs-footer__col">
          <h2 className="rs-footer__title">الأقسام</h2>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <a href={categoryUrl(c)}>{c.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="روابط" className="rs-footer__col">
          <h2 className="rs-footer__title">ريشة</h2>
          <ul>
            <li>
              <a href="/offers/">العروض الحالية</a>
            </li>
            <li>
              <a href="/category/school/#bundles">باقات المدارس</a>
            </li>
            <li>
              <a href="/#about">عن ريشة</a>
            </li>
            <li>
              <a href="/search/">البحث</a>
            </li>
            <li>
              <a href="/policies/">التوصيل والاستبدال والخصوصية</a>
            </li>
          </ul>
        </nav>
        <div className="rs-footer__col">
          <h2 className="rs-footer__title">تواصل معنا</h2>
          <ul>
            <li>
              <a href={waGeneral()} target="_blank" rel="noopener" className="rs-footer__wa">
                <Icon name="whatsapp" size="sm" /> واتساب
              </a>
            </li>
            <li>
              <a href={site.social.instagram} target="_blank" rel="noopener">
                <Icon name="instagram" size="sm" /> إنستغرام
              </a>
            </li>
            <li>
              <a href={site.social.facebook} target="_blank" rel="noopener">
                <Icon name="facebook" size="sm" /> فيسبوك
              </a>
            </li>
            <li className="rs-footer__plain">
              <Icon name="pin" size="sm" /> {site.country}
            </li>
          </ul>
        </div>
      </div>
      <div className="rs-container rs-footer__base">
        <p>
          © {year} {site.fullName}
        </p>
        <p>الطلب والتأكيد عبر واتساب · لا دفع عبر الموقع</p>
      </div>
    </footer>
  );
}
