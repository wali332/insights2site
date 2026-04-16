import type { Website } from '../types';

export type TemplateTone = 'modern' | 'bold' | 'minimal';

export interface TemplateInput {
  website: Website;
  tone?: string | null;
}

const escapeHtml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const normalizeTone = (tone?: string | null): TemplateTone => {
  const normalized = (tone || '').toLowerCase().trim();

  if (normalized.includes('bold')) return 'bold';
  if (normalized.includes('minimal')) return 'minimal';
  return 'modern';
};

const getTemplateTitle = (tone: TemplateTone): string => {
  switch (tone) {
    case 'bold':
      return 'Bold Marketing';
    case 'minimal':
      return 'Minimal Clean';
    case 'modern':
    default:
      return 'Modern SaaS';
  }
};

const getHeroHeadline = (website: Website): string => {
  return website.hero?.headline || website.headline || 'A clearer way to present your product';
};

const getSubheadline = (website: Website): string => {
  return website.hero?.subheadline || website.subheadline || 'A clean landing page built from real customer language.';
};

const getCTA = (website: Website): string => {
  return website.cta || 'Get Started';
};

const getBenefitItems = (website: Website): string[] => {
  if (Array.isArray(website.benefits)) {
    return website.benefits.slice(0, 4);
  }

  if (website.benefits && typeof website.benefits === 'object' && Array.isArray(website.benefits.items)) {
    return website.benefits.items.slice(0, 4);
  }

  if (Array.isArray(website.benefitsList)) {
    return website.benefitsList.slice(0, 4);
  }

  return [];
};

const getTestimonials = (website: Website): string[] => {
  return Array.isArray(website.testimonials) ? website.testimonials.slice(0, 3) : [];
};

const getWhyChooseUs = (website: Website): string[] => {
  return Array.isArray(website.why_choose_us) ? website.why_choose_us.slice(0, 4) : [];
};

const buildHtmlDocument = ({
  title,
  bodyClass,
  styles,
  bodyHtml,
}: {
  title: string;
  bodyClass: string;
  styles: string;
  bodyHtml: string;
}): string => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="${bodyClass}">
  <style>
${styles}
  </style>
${bodyHtml}
</body>
</html>`;
};

const commonStyles = `
    :root {
      color-scheme: light;
    }

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: #ffffff;
      color: #111827;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .website-template {
      position: relative;
      width: 100%;
      overflow: hidden;
      background: #ffffff;
      color: #111827;
    }

    .template-page {
      width: min(1160px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 56px;
    }

    @media (min-width: 768px) {
      .template-page {
        width: min(1160px, calc(100% - 48px));
        padding: 40px 0 72px;
      }
    }

    @media (min-width: 1280px) {
      .template-page {
        width: min(1160px, calc(100% - 64px));
        padding: 48px 0 88px;
      }
    }

    .template-shell {
      position: relative;
      border: 1px solid #e5e7eb;
      border-radius: 28px;
      background: #ffffff;
      box-shadow: 0 30px 80px rgba(15, 23, 42, 0.06);
      overflow: hidden;
    }

    .template-shell-inner {
      padding: 28px;
    }

    @media (min-width: 768px) {
      .template-shell-inner {
        padding: 40px;
      }
    }

    @media (min-width: 1024px) {
      .template-shell-inner {
        padding: 56px;
      }
    }

    .template-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .template-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .template-mark {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      border: 1px solid #d1d5db;
      background: #111827;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.08em;
      flex-shrink: 0;
    }

    .template-brand-copy {
      min-width: 0;
    }

    .template-brand-copy strong {
      display: block;
      font-size: 0.98rem;
      letter-spacing: -0.03em;
      color: #111827;
      margin-bottom: 2px;
    }

    .template-brand-copy span {
      display: block;
      font-size: 0.85rem;
      color: #6b7280;
    }

    .template-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 999px;
      background: #fafafa;
      color: #374151;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .template-hero {
      display: grid;
      gap: 28px;
      align-items: start;
    }

    @media (min-width: 1024px) {
      .template-hero.two-col {
        grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
        gap: 40px;
      }

      .template-hero.centered {
        grid-template-columns: 1fr;
        justify-items: center;
      }
    }

    .template-headline {
      margin: 0;
      font-size: clamp(2.7rem, 5vw, 5.3rem);
      line-height: 0.96;
      letter-spacing: -0.065em;
      color: #0f172a;
      font-weight: 700;
      max-width: 12ch;
    }

    .template-headline.tight {
      max-width: 11ch;
    }

    .template-subheadline {
      margin: 0;
      margin-top: 20px;
      font-size: clamp(1.03rem, 1.6vw, 1.2rem);
      line-height: 1.8;
      color: #4b5563;
      max-width: 44rem;
    }

    .template-cta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 28px;
    }

    .template-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0 18px;
      border-radius: 14px;
      border: 1px solid transparent;
      font-size: 0.95rem;
      font-weight: 700;
      text-decoration: none;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
      cursor: pointer;
      white-space: nowrap;
    }

    .template-button:hover {
      transform: translateY(-1px);
    }

    .template-button.primary {
      background: #111827;
      color: #ffffff;
      border-color: #111827;
    }

    .template-button.secondary {
      background: #ffffff;
      color: #111827;
      border-color: #e5e7eb;
    }

    .template-button.soft {
      background: #f3f4f6;
      color: #111827;
      border-color: #e5e7eb;
    }

    .template-panel {
      border: 1px solid #e5e7eb;
      border-radius: 24px;
      background: #ffffff;
      padding: 22px;
    }

    .template-panel.alt {
      background: #fafafa;
    }

    .template-panel.dark {
      background: #111827;
      border-color: #1f2937;
      color: #ffffff;
    }

    .template-section {
      margin-top: 56px;
    }

    .template-section-title {
      margin: 0 0 16px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #6b7280;
    }

    .template-grid {
      display: grid;
      gap: 16px;
    }

    @media (min-width: 768px) {
      .template-grid.cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .template-grid.cols-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    .feature-card {
      padding: 20px;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .feature-card .feature-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: #111827;
      color: #fff;
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 14px;
    }

    .feature-card h3,
    .quote-card h3 {
      margin: 0 0 8px;
      font-size: 1rem;
      line-height: 1.35;
      letter-spacing: -0.02em;
      color: #111827;
    }

    .feature-card p,
    .quote-card p,
    .footer-copy {
      margin: 0;
      color: #4b5563;
      line-height: 1.75;
      font-size: 0.95rem;
    }

    .quote-card {
      padding: 20px;
      border-radius: 20px;
      border: 1px solid #e5e7eb;
      background: #ffffff;
    }

    .quote-mark {
      display: inline-block;
      font-size: 1.8rem;
      line-height: 1;
      color: #d1d5db;
      margin-bottom: 8px;
    }

    .footer {
      margin-top: 60px;
      padding-top: 22px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-copy strong {
      display: block;
      color: #111827;
      margin-bottom: 4px;
    }

    .template-mini-list {
      display: grid;
      gap: 12px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .template-mini-list li {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 14px 0;
      border-top: 1px solid #e5e7eb;
    }

    .template-mini-list li:first-child {
      border-top: 0;
      padding-top: 0;
    }

    .template-mini-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: #111827;
      margin-top: 8px;
      flex-shrink: 0;
    }

    .template-mini-copy strong {
      display: block;
      color: #111827;
      margin-bottom: 4px;
      font-size: 0.98rem;
    }

    .template-mini-copy span {
      display: block;
      color: #4b5563;
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .template-stacked-cta {
      padding: 28px;
      border-radius: 24px;
      border: 1px solid #e5e7eb;
      background: #fafafa;
      text-align: center;
    }

    .template-stacked-cta p {
      margin: 0 0 18px;
      color: #4b5563;
      line-height: 1.75;
    }

    .template-muted {
      color: #6b7280;
    }
`;

const buildFeatureCards = (items: string[]): string => {
  return items
    .map(
      (item, index) => `
        <article class="feature-card">
          <div class="feature-index">0${index + 1}</div>
          <h3>${escapeHtml(item)}</h3>
          <p>${escapeHtml(item)}</p>
        </article>
      `
    )
    .join('');
};

const buildTestimonials = (items: string[]): string => {
  return items
    .map(
      (item) => `
        <article class="quote-card">
          <span class="quote-mark">&ldquo;</span>
          <p>${escapeHtml(item)}</p>
          <h3 style="margin-top:16px;">Verified Customer</h3>
        </article>
      `
    )
    .join('');
};

const renderModernSaaS = (website: Website): string => {
  const headline = escapeHtml(getHeroHeadline(website));
  const subheadline = escapeHtml(getSubheadline(website));
  const cta = escapeHtml(getCTA(website));
  const benefits = getBenefitItems(website);
  const testimonials = getTestimonials(website);
  const whyChooseUs = getWhyChooseUs(website);

  return buildHtmlDocument({
    title: `${getTemplateTitle('modern')} | Insight2Site`,
    bodyClass: 'website-template template-modern',
    styles: `${commonStyles}

    .template-modern .template-shell {
      background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
    }

    .template-modern .hero-side {
      display: grid;
      gap: 16px;
    }

    .template-modern .hero-stat {
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 18px;
      background: #ffffff;
    }

    .template-modern .hero-stat strong {
      display: block;
      margin-bottom: 6px;
      font-size: 1rem;
      color: #111827;
    }

    .template-modern .hero-stat span {
      display: block;
      color: #4b5563;
      line-height: 1.7;
      font-size: 0.94rem;
    }
    `,
    bodyHtml: `
      <div class="website-template">
        <div class="template-page">
          <div class="template-shell">
            <div class="template-shell-inner">
              <div class="template-nav">
                <div class="template-brand">
                  <div class="template-mark">I2S</div>
                  <div class="template-brand-copy">
                    <strong>Insight2Site</strong>
                    <span>Modern SaaS landing page</span>
                  </div>
                </div>
                <div class="template-badge">Customer-led messaging</div>
              </div>

              <section class="template-hero two-col">
                <div>
                  <div class="template-badge">Built from real review data</div>
                  <h1 class="template-headline">${headline}</h1>
                  <p class="template-subheadline">${subheadline}</p>
                  <div class="template-cta-row">
                    <a href="#cta" class="template-button primary">${cta}</a>
                    <a href="#benefits" class="template-button secondary">See benefits</a>
                  </div>
                </div>

                <div class="hero-side">
                  <div class="template-panel">
                    <div class="template-section-title" style="margin-bottom:12px;">Core benefits</div>
                    <div class="template-grid" style="gap:12px;">
                      ${benefits.slice(0, 3)
                        .map(
                          (benefit) => `
                            <div class="hero-stat">
                              <strong>${escapeHtml(benefit)}</strong>
                              <span>${escapeHtml(benefit)}</span>
                            </div>
                          `
                        )
                        .join('')}
                    </div>
                  </div>

                  <div class="template-panel alt">
                    <div class="template-section-title" style="margin-bottom:12px;">Why choose us</div>
                    <ul class="template-mini-list">
                      ${(whyChooseUs.length ? whyChooseUs : benefits.slice(0, 3)).map((item) => `
                        <li>
                          <span class="template-mini-dot"></span>
                          <div class="template-mini-copy">
                            <strong>${escapeHtml(item)}</strong>
                            <span>${escapeHtml(item)}</span>
                          </div>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              </section>

              <section id="benefits" class="template-section">
                <div class="template-section-title">Benefits</div>
                <div class="template-grid cols-3">
                  ${buildFeatureCards(benefits.length ? benefits : ['Clear positioning', 'Relevant messaging', 'Strong conversion flow'])}
                </div>
              </section>

              <section class="template-section">
                <div class="template-section-title">Testimonials</div>
                <div class="template-grid cols-2">
                  ${buildTestimonials(testimonials.length ? testimonials : ['A clear, polished layout that feels trustworthy and direct.', 'The message matches what customers actually care about.'])}
                </div>
              </section>

              <section id="cta" class="template-section">
                <div class="template-stacked-cta">
                  <h2 class="template-headline" style="max-width: 14ch; margin: 0 auto 14px; font-size: clamp(2rem, 3vw, 3.2rem);">${escapeHtml(cta)}</h2>
                  <p>Turn review language into a focused landing page with clear hierarchy and a calm visual system.</p>
                  <a href="#top" class="template-button primary">Download-ready layout</a>
                </div>
              </section>

              <footer class="footer">
                <div class="footer-copy">
                  <strong>Insight2Site</strong>
                  <span>Modern SaaS template</span>
                </div>
                <div class="footer-copy">Built from customer reviews and generated with structured insights.</div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    `,
  });
};

const renderBoldMarketing = (website: Website): string => {
  const headline = escapeHtml(getHeroHeadline(website));
  const subheadline = escapeHtml(getSubheadline(website));
  const cta = escapeHtml(getCTA(website));
  const benefits = getBenefitItems(website);
  const testimonials = getTestimonials(website);

  return buildHtmlDocument({
    title: `${getTemplateTitle('bold')} | Insight2Site`,
    bodyClass: 'website-template template-bold',
    styles: `${commonStyles}

    .template-bold {
      background: #0f172a;
      color: #ffffff;
    }

    .template-bold .template-page {
      padding-top: 24px;
    }

    .template-bold .template-shell {
      background: #0f172a;
      border-color: #1e293b;
      box-shadow: 0 30px 80px rgba(15, 23, 42, 0.28);
    }

    .template-bold .template-shell-inner {
      padding: 28px;
    }

    @media (min-width: 768px) {
      .template-bold .template-shell-inner {
        padding: 40px;
      }
    }

    .template-bold .template-brand-copy strong,
    .template-bold .template-brand-copy span,
    .template-bold .template-badge,
    .template-bold .template-section-title,
    .template-bold .footer-copy,
    .template-bold .template-mini-copy span,
    .template-bold .template-mini-copy strong,
    .template-bold .template-headline,
    .template-bold .template-subheadline {
      color: #ffffff;
    }

    .template-bold .template-brand-copy span,
    .template-bold .template-section-title,
    .template-bold .footer-copy,
    .template-bold .template-mini-copy span,
    .template-bold .template-subheadline {
      color: rgba(255, 255, 255, 0.72);
    }

    .template-bold .template-mark {
      background: #ffffff;
      color: #0f172a;
      border-color: #e5e7eb;
    }

    .template-bold .template-badge,
    .template-bold .template-panel,
    .template-bold .template-panel.alt,
    .template-bold .feature-card,
    .template-bold .quote-card,
    .template-bold .template-stacked-cta {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .template-bold .feature-card h3,
    .template-bold .quote-card h3,
    .template-bold .template-mini-copy strong,
    .template-bold .template-mini-copy span {
      color: #ffffff;
    }

    .template-bold .template-button.primary {
      background: #ffffff;
      color: #0f172a;
      border-color: #ffffff;
    }

    .template-bold .template-button.secondary {
      background: transparent;
      color: #ffffff;
      border-color: rgba(255,255,255,0.18);
    }

    .template-bold .template-button.soft {
      background: rgba(255,255,255,0.08);
      color: #ffffff;
      border-color: rgba(255,255,255,0.12);
    }

    .template-bold .template-mini-list li {
      border-top-color: rgba(255,255,255,0.12);
    }

    .template-bold .footer {
      border-top-color: rgba(255,255,255,0.12);
    }

    .template-bold .hero-kicker {
      margin-bottom: 16px;
      color: rgba(255,255,255,0.68);
      font-size: 0.78rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      font-weight: 700;
    }
    `,
    bodyHtml: `
      <div class="website-template">
        <div class="template-page">
          <div class="template-shell">
            <div class="template-shell-inner">
              <div class="template-nav">
                <div class="template-brand">
                  <div class="template-mark">I2S</div>
                  <div class="template-brand-copy">
                    <strong>Insight2Site</strong>
                    <span>Bold marketing template</span>
                  </div>
                </div>
                <div class="template-badge">High-contrast editorial</div>
              </div>

              <section class="template-hero two-col">
                <div>
                  <div class="hero-kicker">Direct. Confident. Clear.</div>
                  <h1 class="template-headline tight" style="color:#ffffff;">${headline}</h1>
                  <p class="template-subheadline" style="max-width: 38rem;">${subheadline}</p>
                  <div class="template-cta-row">
                    <a href="#cta" class="template-button primary">${cta}</a>
                    <a href="#benefits" class="template-button secondary">View the proof</a>
                  </div>
                </div>

                <div class="template-panel" style="padding: 28px;">
                  <div class="template-section-title" style="color: rgba(255,255,255,0.7);">What makes it compelling</div>
                  <div class="template-grid" style="gap: 12px;">
                    ${benefits.slice(0, 4)
                      .map(
                        (benefit, index) => `
                          <div class="template-panel" style="background: rgba(255,255,255,0.06);">
                            <div style="display:flex; gap:16px; align-items:flex-start;">
                              <div class="template-mark" style="width:34px; height:34px; border-radius:12px; background:#ffffff; color:#0f172a;">0${index + 1}</div>
                              <div>
                                <h3 style="color:#ffffff; margin-bottom:6px;">${escapeHtml(benefit)}</h3>
                                <p style="color: rgba(255,255,255,0.72);">${escapeHtml(benefit)}</p>
                              </div>
                            </div>
                          </div>
                        `
                      )
                      .join('')}
                  </div>
                </div>
              </section>

              <section id="benefits" class="template-section">
                <div class="template-section-title" style="color: rgba(255,255,255,0.66);">Benefits</div>
                <div class="template-grid cols-2">
                  ${buildFeatureCards(benefits.length ? benefits : ['Strong value proposition', 'Simple hierarchy', 'Clear conversion path'])}
                </div>
              </section>

              <section class="template-section">
                <div class="template-section-title" style="color: rgba(255,255,255,0.66);">Testimonials</div>
                <div class="template-grid cols-2">
                  ${buildTestimonials(testimonials.length ? testimonials : ['This feels premium and confident, not generic.', 'The layout makes the product story easy to understand at a glance.'])}
                </div>
              </section>

              <section id="cta" class="template-section">
                <div class="template-stacked-cta" style="background:#ffffff; color:#111827;">
                  <h2 class="template-headline" style="margin: 0 auto 12px; font-size: clamp(2rem, 3vw, 3.4rem); color:#111827;">${escapeHtml(cta)}</h2>
                  <p style="color:#4b5563; max-width: 40rem; margin: 0 auto 18px;">A bold layout with stronger contrast, designed to make the CTA feel decisive without looking loud.</p>
                  <a href="#top" class="template-button primary">Download website</a>
                </div>
              </section>

              <footer class="footer">
                <div class="footer-copy">
                  <strong>Insight2Site</strong>
                  <span>Bold Marketing template</span>
                </div>
                <div class="footer-copy" style="color: rgba(255,255,255,0.72);">Built from customer reviews and structured for conversion.</div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    `,
  });
};

const renderMinimalClean = (website: Website): string => {
  const headline = escapeHtml(getHeroHeadline(website));
  const subheadline = escapeHtml(getSubheadline(website));
  const cta = escapeHtml(getCTA(website));
  const benefits = getBenefitItems(website);
  const testimonials = getTestimonials(website);

  return buildHtmlDocument({
    title: `${getTemplateTitle('minimal')} | Insight2Site`,
    bodyClass: 'website-template template-minimal',
    styles: `${commonStyles}

    .template-minimal .template-shell {
      box-shadow: none;
      border-radius: 0;
      border-left: 0;
      border-right: 0;
    }

    .template-minimal .template-shell-inner {
      padding-top: 34px;
      padding-bottom: 34px;
    }

    .template-minimal .template-hero.centered {
      text-align: center;
    }

    .template-minimal .template-headline {
      margin-inline: auto;
      max-width: 13ch;
    }

    .template-minimal .template-subheadline {
      margin-inline: auto;
      max-width: 42rem;
    }

    .template-minimal .template-cta-row {
      justify-content: center;
    }

    .template-minimal .template-panel,
    .template-minimal .feature-card,
    .template-minimal .quote-card,
    .template-minimal .template-stacked-cta {
      box-shadow: none;
      border-radius: 18px;
    }

    .template-minimal .template-grid.cols-2 {
      align-items: start;
    }
    `,
    bodyHtml: `
      <div class="website-template">
        <div class="template-page">
          <div class="template-shell">
            <div class="template-shell-inner">
              <div class="template-nav">
                <div class="template-brand">
                  <div class="template-mark">I2S</div>
                  <div class="template-brand-copy">
                    <strong>Insight2Site</strong>
                    <span>Minimal clean template</span>
                  </div>
                </div>
                <div class="template-badge">Quiet, focused design</div>
              </div>

              <section class="template-hero centered">
                <div>
                  <div class="template-badge">Minimal by design</div>
                  <h1 class="template-headline">${headline}</h1>
                  <p class="template-subheadline">${subheadline}</p>
                  <div class="template-cta-row">
                    <a href="#cta" class="template-button primary">${cta}</a>
                    <a href="#benefits" class="template-button secondary">Explore details</a>
                  </div>
                </div>
              </section>

              <section id="benefits" class="template-section">
                <div class="template-section-title">Benefits</div>
                <div class="template-panel">
                  <ul class="template-mini-list">
                    ${(benefits.length ? benefits : ['Simple structure', 'Clear narrative', 'Trustworthy presentation']).map((item) => `
                      <li>
                        <span class="template-mini-dot"></span>
                        <div class="template-mini-copy">
                          <strong>${escapeHtml(item)}</strong>
                          <span>${escapeHtml(item)}</span>
                        </div>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </section>

              <section class="template-section">
                <div class="template-section-title">Testimonials</div>
                <div class="template-grid cols-2">
                  ${buildTestimonials(testimonials.length ? testimonials : ['A calm, minimal layout that still feels complete.', 'The page reads clearly without visual noise.'])}
                </div>
              </section>

              <section id="cta" class="template-section">
                <div class="template-stacked-cta">
                  <h2 class="template-headline" style="margin: 0 auto 12px; font-size: clamp(2rem, 3vw, 3rem);">${escapeHtml(cta)}</h2>
                  <p>Minimal, balanced, and easy to scan. Built to feel direct and professional.</p>
                  <a href="#top" class="template-button primary">Download website</a>
                </div>
              </section>

              <footer class="footer">
                <div class="footer-copy">
                  <strong>Insight2Site</strong>
                  <span>Minimal Clean template</span>
                </div>
                <div class="footer-copy">Content-first layout for focused brands.</div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    `,
  });
};

export const getTemplateName = (tone?: string | null): string => {
  return getTemplateTitle(normalizeTone(tone));
};

export const extractPreviewMarkup = (fullHtml: string): string => {
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch?.[1]?.trim() || fullHtml;
};

export const generateTemplate = (input: TemplateInput): string => {
  const tone = normalizeTone(input.tone);

  switch (tone) {
    case 'bold':
      return renderBoldMarketing(input.website);
    case 'minimal':
      return renderMinimalClean(input.website);
    case 'modern':
    default:
      return renderModernSaaS(input.website);
  }
};
