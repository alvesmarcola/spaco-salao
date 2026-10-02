import { useEffect, useState, type FormEvent } from "react";
import { content as t, site } from "./data/site";

type IconName = "hair" | "hand" | "sparkle" | "pin" | "clock" | "arrow" | "whatsapp";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const shared = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "hair") {
    return (
      <svg {...shared}>
        <path d="M12 3.5c-4 0-6.5 3.1-6.5 7.3 0 2.2.9 3.8 2.3 5.1-.2 1.8.1 3.5 1 4.6" />
        <path d="M12 3.5c4 0 6.5 3.1 6.5 7.3 0 2.2-.9 3.8-2.3 5.1.2 1.8-.1 3.5-1 4.6" />
        <path d="M8.5 13.5c1.1.8 2.3 1.2 3.5 1.2s2.4-.4 3.5-1.2" />
        <path d="M9.5 10h.01M14.5 10h.01" />
      </svg>
    );
  }
  if (name === "hand") {
    return (
      <svg {...shared}>
        <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11 4.5a1.5 1.5 0 0 1 3 0V11 6a1.5 1.5 0 0 1 3 0v6-2a1.5 1.5 0 0 1 3 0v5a5 5 0 0 1-5 5h-4a5 5 0 0 1-4.2-2.3L4.5 14a1.6 1.6 0 0 1 2.5-2Z" />
        <path d="M8 12v2" />
      </svg>
    );
  }
  if (name === "pin") {
    return (
      <svg {...shared}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg {...shared}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    );
  }
  if (name === "arrow") {
    return (
      <svg {...shared}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    );
  }
  if (name === "whatsapp") {
    return (
      <svg {...shared} fill="currentColor" stroke="none">
        <path d="M12.04 2a9.86 9.86 0 0 0-8.48 14.9L2.25 22l5.23-1.37A9.92 9.92 0 1 0 12.04 2Zm0 18.1c-1.46 0-2.89-.39-4.15-1.13l-.3-.18-3.1.81.83-3.02-.2-.31A8.16 8.16 0 1 1 12.04 20.1Zm4.48-6.11c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.02-.39.11-.52.11-.11.25-.29.38-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.21-.49-.41-.42-.57-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.23.9 2.42 1.03 2.59.12.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.44.52.61.2 1.16.17 1.6.1.49-.07 1.48-.6 1.69-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.29Z" />
      </svg>
    );
  }
  return (
    <svg {...shared}>
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z" />
    </svg>
  );
}

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

function getCanelaTime() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  return {
    weekday: (parts.find((part) => part.type === "weekday")?.value ?? "").replace("-feira", ""),
    minutes:
      Number(parts.find((part) => part.type === "hour")?.value ?? "0") * 60 +
      Number(parts.find((part) => part.type === "minute")?.value ?? "0"),
  };
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [now, setNow] = useState(getCanelaTime);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(getCanelaTime()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedImage === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
      if (event.key === "ArrowRight") {
        setSelectedImage((current) =>
          current === null ? null : (current + 1) % site.galleryPlaceholders.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setSelectedImage((current) =>
          current === null
            ? null
            : (current - 1 + site.galleryPlaceholders.length) % site.galleryPlaceholders.length,
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage]);

  const today = site.hours.find((item) => item.day === now.weekday);
  const isOpen =
    today?.open !== null &&
    today?.open !== undefined &&
    today.close !== null &&
    now.minutes >= Number(today.open.slice(0, 2)) * 60 &&
    now.minutes < Number(today.close.slice(0, 2)) * 60;
  const beforeOpening =
    today?.open !== null &&
    today?.open !== undefined &&
    now.minutes < Number(today.open.slice(0, 2)) * 60;
  const navItems = [
    ["services", t.navServices],
    ["about", t.navAbout],
    ["gallery", t.navGallery],
    ["reviews", t.navReviews],
    ["contact", t.navContact],
  ];

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = [
      `${t.person}: ${String(form.get("name")).trim()}`,
      `${t.preferredService}: ${String(form.get("service"))}`,
      `${t.preferredDay}: ${String(form.get("day")).trim()}`,
      `${t.preferredShift}: ${String(form.get("shift"))}`,
    ];
    window.open(getWhatsAppUrl(`${t.bookingMessage}\n\n${values.join("\n")}`), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--cream)] text-[var(--ink)]">
      <header className="site-header fixed inset-x-0 top-0 z-40">
        <div className="header-inner mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
          <a className="brand" href="#home" aria-label={site.name}>
            <span className="brand-name">Spaço</span>
            <span className="brand-sub">DE BELEZA</span>
          </a>
          <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Navegação principal">
            {navItems.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a className="mobile-book button button-dark" href={getWhatsAppUrl(t.whatsappDefault)}>
              {t.book}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </nav>
          <div className="header-actions">
            <a className="button button-dark header-book" href={getWhatsAppUrl(t.whatsappDefault)}>
              {t.book}
              <Icon name="arrow" className="h-4 w-4" />
            </a>
            <button
              className="menu-toggle"
              type="button"
              aria-label={menuOpen ? t.closeLabel : t.menuLabel}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section relative" id="home">
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-inner mx-auto grid max-w-7xl items-center gap-9 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1fr_0.92fr] lg:gap-14 lg:pb-24 lg:pt-36">
            <div className="hero-copy relative z-10">
              <div className="eyebrow"><span className="eyebrow-line" />{t.heroEyebrow}</div>
              <h1>{t.heroTitle}</h1>
              <p className="hero-description">{t.heroText}</p>
              <div className="hero-buttons">
                <a className="button button-dark" href={getWhatsAppUrl(t.whatsappDefault)}>
                  {t.bookWhatsApp}
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
                <a className="button button-outline" href="#services">{t.seeServices}</a>
              </div>
              <div className="hero-trust">
                <div className="trust-stars" aria-label={t.starsLabel}>★★★★★</div>
                <div>
                  <span className="trust-score">{site.rating}</span>
                  <span className="trust-copy"> {t.ratingLabel}</span>
                </div>
              </div>
              <a className="hero-location" href={site.mapsUrl} target="_blank" rel="noreferrer">
                <Icon name="pin" className="h-4 w-4" />
                {t.locationNote}
              </a>
            </div>
            <div className="hero-visual" aria-label="Espaço reservado para foto do salão">
              <div className="visual-frame">
                <div className="visual-art" aria-hidden="true">
                  <div className="visual-sun" />
                  <div className="visual-petal petal-a" />
                  <div className="visual-petal petal-b" />
                  <div className="visual-petal petal-c" />
                  <div className="visual-petal petal-d" />
                  <div className="visual-center" />
                  <span className="visual-sparkle sparkle-a">✳</span>
                  <span className="visual-sparkle sparkle-b">✧</span>
                </div>
                <div className="photo-placeholder">
                  <span className="placeholder-mark"><Icon name="sparkle" className="h-4 w-4" /></span>
                  <span>{t.heroPhotoPlaceholder}</span>
                </div>
              </div>
              <div className="visual-caption"><span>CANELA</span><span>·</span><span>{t.heroCaption}</span></div>
              <div className="floating-stamp" aria-hidden="true">
                <span>SEU MOMENTO</span>
                <Icon name="sparkle" className="h-5 w-5" />
                <span>DE CUIDADO</span>
              </div>
            </div>
          </div>
          <div className="hero-bottom-rule" />
        </section>

        <section className="section services-section" id="services">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="section-heading reveal">
              <div className="eyebrow"><span className="eyebrow-line" />{t.servicesEyebrow}</div>
              <h2>{t.servicesTitle}</h2>
              <p>{t.servicesText}</p>
            </div>
            <div className="service-grid mt-11">
              {site.services.map((service, index) => (
                <article className="service-card reveal" key={service.title} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="service-card-top">
                    <span className="service-icon"><Icon name={service.icon} className="h-7 w-7" /></span>
                    <span className="service-number">0{index + 1}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <a className="text-link" href={getWhatsAppUrl(service.message)}>
                    {t.askService}<Icon name="arrow" className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
            <p className="catalog-note reveal">{t.catalogNote}</p>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="about-inner mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-28">
            <div className="about-image reveal">
              <div className="about-art">
                <div className="about-arch" />
                <div className="about-stem stem-one" />
                <div className="about-stem stem-two" />
                <div className="about-leaf leaf-one" />
                <div className="about-leaf leaf-two" />
                <div className="about-leaf leaf-three" />
                <div className="about-leaf leaf-four" />
                <div className="about-image-label">
                  <Icon name="sparkle" className="h-4 w-4" />
                  <span>{t.aboutPhotoPlaceholder}</span>
                </div>
              </div>
              <span className="about-image-index">01 — 04</span>
            </div>
            <div className="about-copy reveal">
              <div className="eyebrow"><span className="eyebrow-line" />{t.aboutEyebrow}</div>
              <h2>{t.aboutTitle}</h2>
              <p>{t.aboutText}</p>
              <div className="about-note">
                <span className="note-icon"><Icon name="sparkle" className="h-5 w-5" /></span>
                <span>{t.aboutNote}</span>
              </div>
              <a className="text-link about-link" href={getWhatsAppUrl(t.whatsappDefault)}>
                {t.bookWhatsApp}<Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="section gallery-section" id="gallery">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="section-heading reveal">
              <div className="eyebrow"><span className="eyebrow-line" />{t.galleryEyebrow}</div>
              <h2>{t.galleryTitle}</h2>
              <p>{t.galleryText}</p>
            </div>
            <div className="gallery-grid mt-11">
              {site.galleryPlaceholders.map((caption, index) => (
                <button
                  type="button"
                  className={`gallery-card gallery-card-${index + 1} reveal`}
                  key={caption}
                  onClick={() => setSelectedImage(index)}
                  aria-label={`${t.galleryAlt}${caption}`}
                  style={{ transitionDelay: `${index * 75}ms` }}
                >
                  <span className={`gallery-art gallery-art-${index + 1}`}>
                    <span className="gallery-symbol" aria-hidden="true">{index % 2 === 0 ? "✳" : "✧"}</span>
                    <span className="gallery-caption">{caption}</span>
                  </span>
                  <span className="gallery-view">{t.imageDetail} ↗</span>
                </button>
              ))}
            </div>
            <div className="gallery-action reveal">
              <a className="button button-outline" href={site.instagramUrl} target="_blank" rel="noreferrer">
                {t.instagramButton}<Icon name="arrow" className="h-4 w-4" />
              </a>
              <span>{site.instagram}</span>
            </div>
          </div>
        </section>

        <section className="reviews-section section" id="reviews">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="section-heading reveal">
              <div className="eyebrow"><span className="eyebrow-line" />{t.reviewsEyebrow}</div>
              <h2>{t.reviewsTitle}</h2>
              <p>{t.reviewsText}</p>
            </div>
            <div className="review-grid mt-11">
              {site.testimonials.map((review, index) => (
                <article className="review-card reveal" key={review} style={{ transitionDelay: `${index * 90}ms` }}>
                  <div className="review-stars" aria-label={t.starsLabel}>★★★★★</div>
                  <span className="review-quote" aria-hidden="true">“</span>
                  <blockquote>{review}</blockquote>
                  <div className="review-source">
                    <span className="google-g">G</span>
                    <span>{t.googleReviews}</span>
                    <span className="review-rating">{site.rating}</span>
                  </div>
                </article>
              ))}
            </div>
            <div className="reviews-link reveal">
              <a className="text-link" href={site.googleReviewsUrl} target="_blank" rel="noreferrer">
                {t.googleLink}<Icon name="arrow" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section className="booking-section" id="booking">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="booking-top reveal">
              <div className="eyebrow"><span className="eyebrow-line" />{t.bookingEyebrow}</div>
              <h2>{t.bookingTitle}</h2>
              <p>{t.bookingText}</p>
            </div>
            <div className="booking-layout mt-12">
              <div className="steps-list">
                {[t.stepOne, t.stepTwo, t.stepThree].map((step, index) => (
                  <div className="step reveal" key={step} style={{ transitionDelay: `${index * 80}ms` }}>
                    <span className="step-number">0{index + 1}</span>
                    <span>{step}</span>
                    {index < 2 && <span className="step-rule" />}
                  </div>
                ))}
                <div className="fast-reply reveal">
                  <span className="fast-dot" />
                  <span>Resposta rápida, atendimento com carinho.</span>
                </div>
              </div>
              <form className="booking-form reveal" onSubmit={submitBooking}>
                <h3>{t.formTitle}</h3>
                <p>{t.formText}</p>
                <label>
                  <span>{t.nameLabel}</span>
                  <input name="name" type="text" placeholder={t.namePlaceholder} autoComplete="name" required />
                </label>
                <div className="form-row">
                  <label>
                    <span>{t.serviceLabel}</span>
                    <select name="service" defaultValue="" required>
                      <option value="" disabled>{t.servicePlaceholder}</option>
                      <option>{t.serviceHair}</option>
                      <option>{t.serviceManicure}</option>
                      <option>{t.serviceNails}</option>
                      <option>{t.serviceOther}</option>
                    </select>
                  </label>
                  <label>
                    <span>{t.shiftLabel}</span>
                    <select name="shift" defaultValue="" required>
                      <option value="" disabled>{t.shiftPlaceholder}</option>
                      <option>{t.shiftMorning}</option>
                      <option>{t.shiftAfternoon}</option>
                      <option>{t.shiftEvening}</option>
                    </select>
                  </label>
                </div>
                <label>
                  <span>{t.dayLabel}</span>
                  <input name="day" type="text" placeholder={t.dayPlaceholder} required />
                </label>
                <button className="button button-dark form-submit" type="submit">
                  {t.submitForm}<Icon name="arrow" className="h-4 w-4" />
                </button>
                <span className="form-privacy">{t.formPrivacy}</span>
              </form>
            </div>
          </div>
        </section>

        <section className="contact-section section" id="contact">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
            <div className="section-heading contact-heading reveal">
              <div className="eyebrow"><span className="eyebrow-line" />{t.contactEyebrow}</div>
              <h2>{t.contactTitle}</h2>
              <p>{t.contactText}</p>
            </div>
            <div className="contact-layout mt-12">
              <div className="contact-details reveal">
                <div className="contact-block">
                  <span className="contact-icon"><Icon name="pin" className="h-5 w-5" /></span>
                  <div><h3>{t.addressLabel}</h3><p>{site.address}</p></div>
                </div>
                <div className="contact-block hours-block">
                  <span className="contact-icon"><Icon name="clock" className="h-5 w-5" /></span>
                  <div className="hours-content">
                    <div className="hours-title-row">
                      <h3>{t.hoursLabel}</h3>
                      <span className={`open-indicator ${isOpen ? "is-open" : "is-closed"}`}>
                        <span />{isOpen ? t.openNow : t.closedNow}
                      </span>
                    </div>
                    <div className="hours-list">
                      {site.hours.map((item) => {
                        const activeDay = item.day === now.weekday;
                        return (
                          <div className={`hours-row ${activeDay ? "today" : ""}`} key={item.day}>
                            <span>{item.day}</span>
                            <span>{item.open ? `${item.open} – ${item.close}` : t.closedToday}</span>
                          </div>
                        );
                      })}
                    </div>
                    {!isOpen && beforeOpening && today?.open && (
                      <span className="opening-note">{t.openingNote} {today.open}</span>
                    )}
                  </div>
                </div>
                <div className="contact-socials">
                  <a className="button button-dark" href={getWhatsAppUrl(t.whatsappDefault)}>
                    <Icon name="whatsapp" className="h-4 w-4" />{t.bookWhatsApp}
                  </a>
                  <a className="instagram-link" href={site.instagramUrl} target="_blank" rel="noreferrer">
                    Instagram <span>{site.instagram}</span> ↗
                  </a>
                </div>
              </div>
              <div className="map-wrap reveal">
                <iframe
                  title={t.mapTitle}
                  src={site.mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <a className="map-directions" href={site.mapsUrl} target="_blank" rel="noreferrer">
                  <Icon name="pin" className="h-4 w-4" />{t.directions}<Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="footer-brand">
            <a className="brand" href="#home" aria-label={site.name}>
              <span className="brand-name">Spaço</span>
              <span className="brand-sub">DE BELEZA</span>
            </a>
            <span>{t.footerLine}</span>
          </div>
          <div className="footer-info">
            <span>{site.addressShort}</span>
            <span>Terça a sábado · 8h às 20h</span>
          </div>
          <div className="footer-social">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a>
            <span>© 2026 {site.name}</span>
          </div>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={getWhatsAppUrl(t.whatsappDefault)}
        target="_blank"
        rel="noreferrer"
        aria-label={t.floatingLabel}
      >
        <Icon name="whatsapp" className="h-6 w-6" />
        <span>{t.book}</span>
      </a>

      {selectedImage !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={site.galleryPlaceholders[selectedImage]}
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedImage(null);
          }}
        >
          <button className="lightbox-close" type="button" onClick={() => setSelectedImage(null)} aria-label={t.closeLabel}>×</button>
          <button
            className="lightbox-arrow lightbox-prev"
            type="button"
            aria-label={t.previousPhoto}
            onClick={() => setSelectedImage((selectedImage - 1 + site.galleryPlaceholders.length) % site.galleryPlaceholders.length)}
          >‹</button>
          <div className={`lightbox-art gallery-art-${selectedImage + 1}`}>
            <span className="gallery-symbol" aria-hidden="true">✳</span>
            <span className="gallery-caption">
              {site.galleryPlaceholders[selectedImage]}
            </span>
          </div>
          <button
            className="lightbox-arrow lightbox-next"
            type="button"
            aria-label={t.nextPhoto}
            onClick={() => setSelectedImage((selectedImage + 1) % site.galleryPlaceholders.length)}
          >›</button>
        </div>
      )}

      <span className="sr-only" aria-live="polite">
        {isOpen ? t.openNow : t.closedNow}
      </span>
    </div>
  );
}

export default App;
