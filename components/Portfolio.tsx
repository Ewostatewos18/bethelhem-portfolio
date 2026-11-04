"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Piece } from "@/components/Pieces";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  PROFILE_CUT,
  PROFILE_PHOTO,
  categories,
  nav,
  services,
  studies,
  type Category,
  type Study,
} from "@/lib/site";

export function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filter, setFilter] = useState<Category>("all");
  const [active, setActive] = useState<Study | null>(null);
  const [current, setCurrent] = useState("#work");
  const [sentName, setSentName] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const heroPhotoRef = useRef<HTMLDivElement>(null);

  const visible = studies.filter((study) => filter === "all" || study.cat === filter);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 12);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const photo = heroPhotoRef.current;
    if (!photo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (event: MouseEvent) => {
      const rect = photo.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      photo.style.setProperty("--mx", `${x * 14}px`);
      photo.style.setProperty("--my", `${y * 10}px`);
    };
    const onLeave = () => {
      photo.style.setProperty("--mx", "0px");
      photo.style.setProperty("--my", "0px");
    };

    photo.addEventListener("mousemove", onMove);
    photo.addEventListener("mouseleave", onLeave);
    return () => {
      photo.removeEventListener("mousemove", onMove);
      photo.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -40% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [filter]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog || dialog.open) return;
    dialog.showModal();
  }, [active]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("sender") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !project || !message) {
      form.reportValidity();
      return;
    }

    setSending(true);
    setFormError("");

    try {
      const web3Key = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
      let ok = false;
      let error = "";

      if (web3Key) {
        // Web3Forms free plan only accepts browser submissions.
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `Portfolio inquiry from ${name}`,
            from_name: name,
            name,
            email,
            project,
            message,
            to: CONTACT_EMAIL,
          }),
        });
        const result = (await response.json().catch(() => null)) as {
          success?: boolean;
          message?: string;
        } | null;
        ok = Boolean(response.ok && result?.success);
        error = result?.message || "Could not send the message. Try again.";
      } else {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, project, message }),
        });
        const result = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
        ok = Boolean(response.ok && result?.ok);
        error = result?.error || "Could not send the message. Try again.";
      }

      if (!ok) {
        setFormError(error);
        return;
      }

      try {
        const saved = JSON.parse(localStorage.getItem("ba-inquiries") || "[]") as unknown[];
        saved.push({ name, email, project, message, at: new Date().toISOString() });
        localStorage.setItem("ba-inquiries", JSON.stringify(saved));
      } catch {
        // Storage can be blocked.
      }

      setSentName(name);
      form.reset();
    } catch {
      setFormError("Could not send the message. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <a className="skip" href="#work">
        Skip to work
      </a>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="shell header-inner">
          <a className="brand-lockup" href="#top" aria-label="Bethelhem Abrham, home">
            <span className="brand-mark" aria-hidden="true">
              <i>A</i>
              <b>B</b>
            </span>
            <span className="brand-divider" aria-hidden="true" />
            <span className="brand-text">
              <span className="brand-first">Bethelhem</span>
              <span className="brand-last">Abrham</span>
            </span>
          </a>
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
          <nav id="site-nav" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={current === item.href ? "true" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a className="header-cta" href="#contact">
            Start a project <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero-stage" aria-labelledby="hero-title">
          <div className="hero-shapes" aria-hidden="true">
            <div className="hero-grain" />
            <div className="hero-wash hero-wash--peach" />
            <div className="hero-wash hero-wash--right" />
            <svg className="hero-ink-svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
              <defs>
                <linearGradient id="inkLeft" x1="0.1" y1="0" x2="0.8" y2="1">
                  <stop offset="0%" stopColor="#2a3448" />
                  <stop offset="100%" stopColor="#1a202c" />
                </linearGradient>
              </defs>
              {/* Soft bottom-left navy wave — matches mockup curve */}
              <path
                fill="url(#inkLeft)"
                d="M-80 920
                   L-80 520
                   C60 455 180 490 310 560
                   C450 640 560 720 720 710
                   C860 700 980 620 1120 660
                   C1220 690 1300 760 1440 820
                   L1440 920
                   Z"
              />
              {/* Orange contour along wave crest */}
              <path
                d="M-50 535
                   C70 470 190 505 320 575
                   C460 655 570 735 730 725
                   C870 715 990 635 1130 675
                   C1230 705 1310 775 1440 835"
                fill="none"
                stroke="#f37335"
                strokeWidth="1.75"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>

          <div className="shell hero">
            <div className="hero-copy">
              <p className="hero-pill anim-rise">
                <span aria-hidden="true" /> Graphics Designer
              </p>
              <h1 id="hero-title">
                <span className="title-line anim-rise delay-1">Bethelhem</span>
                <span className="title-line accent anim-rise delay-2">
                  Abrham
                  <svg className="name-stroke anim-draw" viewBox="0 0 220 18" aria-hidden="true">
                    <path
                      d="M4 11c38-8 78-8 116-2 28 4 58 6 96 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="hero-lead anim-rise delay-3">
                Logos, brand systems, and social graphics with a clear idea and careful craft.
              </p>
              <div className="hero-actions anim-rise delay-4">
                <a className="btn btn-peach" href="#work">
                  View My Work <span aria-hidden="true">→</span>
                </a>
                <a className="btn btn-ghost" href="#about">
                  <span className="play" aria-hidden="true" />
                  About Me
                </a>
              </div>
            </div>

            <div className="hero-visual anim-rise delay-3" ref={heroPhotoRef}>
              <div className="hero-orb" aria-hidden="true" />
              <div className="hero-ghost" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROFILE_CUT} alt="" />
              </div>
              <div className="hero-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROFILE_CUT} alt="Bethelhem Abrham" />
              </div>
              <span className="dot-grid" aria-hidden="true" />
              <p className="hero-script" aria-hidden="true">
                Design
                <br />
                Create
                <br />
                Inspire
              </p>
            </div>
          </div>

          <a className="scroll-cue" href="#work">
            <span className="scroll-mouse" aria-hidden="true">
              <i />
            </span>
            <span>Scroll to explore</span>
            <span className="scroll-arrow" aria-hidden="true">
              ↓
            </span>
          </a>

          <div className="feature-bar reveal">
            {services.map((service) => (
              <article className="feature" key={service.index}>
                <span className={`feature-icon feature-icon--${service.icon}`} aria-hidden="true">
                  <ServiceGlyph kind={service.icon} />
                </span>
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="band" aria-labelledby="work-title">
          <div className="shell">
            <div className="band-head reveal">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 id="work-title">Logo · Branding · Social Media</h2>
              </div>
              <p className="band-note">
                Logos, brand boards, and social graphics from my recent projects.
              </p>
            </div>

            <div className="filters reveal" role="group" aria-label="Filter work">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter${filter === category.id ? " is-on" : ""}`}
                  type="button"
                  aria-pressed={filter === category.id}
                  onClick={() => setFilter(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="work-list" key={filter}>
              {visible.map((study, index) => (
                <article
                  key={study.id}
                  className={`project reveal${index % 2 ? " is-flip" : ""}`}
                  style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                >
                  <button className="project-hit" type="button" onClick={() => setActive(study)}>
                    <div className="project-media">
                      <div className="project-media-inner">
                        <Piece id={study.id} />
                      </div>
                      <span className="project-shade" aria-hidden="true" />
                      <span className="project-index">{study.index}</span>
                    </div>
                    <div className="project-meta">
                      <p className="eyebrow">
                        {study.index} / {study.label}
                      </p>
                      <h3>{study.title}</h3>
                      <p>{study.summary}</p>
                      <span className="project-link">
                        Open project <i aria-hidden="true">→</i>
                      </span>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="band about" aria-labelledby="about-title">
          <div className="about-shapes" aria-hidden="true">
            <div className="about-wash about-wash--peach" />
            <div className="about-wash about-wash--ink" />
            <span className="about-dots" />
            <svg className="about-accent-svg" viewBox="0 0 1200 700" preserveAspectRatio="none">
              <path
                d="M40 560 C220 470 380 520 560 580 C740 640 900 610 1180 520"
                fill="none"
                stroke="rgba(243,115,53,0.35)"
                strokeWidth="1.5"
              />
              <path
                d="M80 600 C260 520 420 560 600 620 C780 670 940 640 1160 560"
                fill="none"
                stroke="rgba(243,115,53,0.18)"
                strokeWidth="1.2"
              />
            </svg>
          </div>

          <div className="shell about-grid">
            <div className="about-visual reveal reveal-left">
              <span className="about-spark" aria-hidden="true" />
              <figure className="about-photo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PROFILE_PHOTO} alt="Portrait of Bethelhem Abrham" />
              </figure>
              <span className="about-chip about-chip--top">
                <AboutIcon kind="person" />
                About Me
              </span>
              <span className="about-chip about-chip--bottom">
                <AboutIcon kind="brush" />
                Graphic Designer & Creative Thinker
              </span>
            </div>

            <div className="about-copy reveal reveal-right">
              <p className="about-kicker">
                About <i />
              </p>
              <h2 id="about-title">
                Design that reads fast and{" "}
                <span className="about-accent">
                  lasts.
                  <svg className="name-stroke" viewBox="0 0 160 14" aria-hidden="true">
                    <path
                      d="M3 9c28-6 58-6 86-1 22 4 42 5 68 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>
              <p className="about-bio">
                I’m Bethelhem Abrham, a graphics designer based in Ethiopia. I design logos and brand
                systems for businesses, and social media graphics for brands and church communities.
              </p>
              <p className="about-focus">
                <AboutIcon kind="target" />
                <span>
                  <strong>Focus:</strong> logo design, branding, and social media graphics.
                </span>
              </p>
              <ul className="facts">
                <li>
                  <span className="fact-icon" aria-hidden="true">
                    <AboutIcon kind="tools" />
                  </span>
                  <div>
                    <strong>Tools</strong>
                    <span>Illustrator, Photoshop, Figma</span>
                  </div>
                </li>
                <li>
                  <span className="fact-icon" aria-hidden="true">
                    <AboutIcon kind="style" />
                  </span>
                  <div>
                    <strong>Style</strong>
                    <span>One clear idea, then the craft</span>
                  </div>
                </li>
                <li>
                  <span className="fact-icon" aria-hidden="true">
                    <AboutIcon kind="work" />
                  </span>
                  <div>
                    <strong>Work</strong>
                    <span>Print and digital · Amharic and English</span>
                  </div>
                </li>
              </ul>
              <p className="about-script" aria-hidden="true">
                Create
                <br />
                Inspire
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="band services" aria-labelledby="services-title">
          <div className="services-shapes" aria-hidden="true">
            <div className="services-wash services-wash--a" />
            <div className="services-wash services-wash--b" />
            <span className="services-dots" />
          </div>

          <div className="shell">
            <div className="services-head reveal">
              <p className="about-kicker">
                Services <i />
              </p>
              <h2 id="services-title">
                What I <span className="about-accent">make</span>
              </h2>
              <p className="services-lead">
                From the first mark to the feed — design that looks clear, feels finished, and works in real use.
              </p>
            </div>

            <div className="service-list">
              {services.map((service, index) => (
                <article
                  className="service reveal"
                  key={service.index}
                  style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
                >
                  <div className="service-top">
                    <span className="service-index">{service.index}</span>
                    <span className="service-icon" aria-hidden="true">
                      <ServiceGlyph kind={service.icon} />
                    </span>
                  </div>
                  <h3>{service.title}</h3>
                  <p className="service-text">{service.text}</p>
                  <p className="service-detail">{service.detail}</p>
                </article>
              ))}
            </div>

            <div className="services-cta reveal">
              <p>Have something in mind?</p>
              <a className="btn btn-peach" href="#contact">
                Start a project <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="band contact" aria-labelledby="contact-title">
          <div className="contact-shapes" aria-hidden="true">
            <div className="contact-wash contact-wash--a" />
            <div className="contact-wash contact-wash--b" />
            <span className="contact-dots" />
            <p className="contact-script">Let’s create</p>
          </div>

          <div className="shell contact-grid">
            <div className="contact-copy reveal reveal-left">
              <p className="about-kicker">
                Contact <i />
              </p>
              <h2 id="contact-title">
                Have a <span className="about-accent">project?</span>
              </h2>
              <p className="contact-lead">
                Tell me what you need — a logo, a brand kit, or social media graphics — and when you need
                it. I’ll get back to you soon.
              </p>

              <ul className="contact-links">
                <li>
                  <span className="contact-link-icon" aria-hidden="true">
                    <ContactIcon kind="mail" />
                  </span>
                  <div>
                    <span>Email</span>
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                  </div>
                </li>
                <li>
                  <span className="contact-link-icon" aria-hidden="true">
                    <ContactIcon kind="phone" />
                  </span>
                  <div>
                    <span>Phone</span>
                    <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>
                  </div>
                </li>
              </ul>

              <p className="contact-note">
                Use the form and your message is emailed to me at {CONTACT_EMAIL}.
              </p>
            </div>

            <div className="contact-panel reveal reveal-right">
              {sentName ? (
                <div className="thanks">
                  <p className="about-kicker">
                    Sent <i />
                  </p>
                  <h3>Thank you, {sentName}.</h3>
                  <p>Your message was sent. I’ll get back to you soon.</p>
                  <button className="btn btn-peach" type="button" onClick={() => setSentName("")}>
                    Write another
                  </button>
                </div>
              ) : (
                <form className="inquiry" onSubmit={onSubmit}>
                  <p className="inquiry-title">Send a note</p>
                  <div className="inquiry-row">
                    <label>
                      <span>Name</span>
                      <input name="sender" type="text" autoComplete="name" placeholder="Your name" maxLength={80} required disabled={sending} />
                    </label>
                    <label>
                      <span>Email</span>
                      <input name="email" type="email" autoComplete="email" placeholder="you@email.com" maxLength={120} required disabled={sending} />
                    </label>
                  </div>
                  <label>
                    <span>Need</span>
                    <select name="project" defaultValue="" required disabled={sending}>
                      <option value="" disabled>
                        Choose one
                      </option>
                      <option>Logo design</option>
                      <option>Branding</option>
                      <option>Poster designs</option>
                      <option>Social media graphics</option>
                      <option>Something else</option>
                    </select>
                  </label>
                  <label>
                    <span>Project</span>
                    <textarea name="message" placeholder="A short note about your project..." maxLength={2000} required disabled={sending} />
                  </label>
                  {formError ? <p className="inquiry-error">{formError}</p> : null}
                  <button className="btn btn-peach" type="submit" disabled={sending}>
                    {sending ? "Sending..." : "Send note"} {!sending ? <span aria-hidden="true">→</span> : null}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p className="footer-name reveal">Bethelhem Abrham</p>
          <div className="footer-contact reveal" style={{ "--reveal-delay": "80ms" } as CSSProperties}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={CONTACT_PHONE_HREF}>{CONTACT_PHONE}</a>
          </div>
          <a className="reveal" style={{ "--reveal-delay": "140ms" } as CSSProperties} href="#top">
            Back to top
          </a>
        </div>
      </footer>

      {active ? (
        <dialog
          ref={dialogRef}
          className="case"
          aria-labelledby={titleId}
          onClose={() => setActive(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <div className="case-bar">
            <button className="case-close" type="button" onClick={() => setActive(null)}>
              Close
            </button>
          </div>
          <div className="case-grid">
            <div className="case-art">
              <Piece id={active.id} mode="case" />
            </div>
            <div className="case-copy">
              <p className="eyebrow">
                {active.index} / {active.label}
              </p>
              <h2 id={titleId}>{active.title}</h2>
              <p className="lede">{active.lede}</p>
              <dl className="spec">
                <div>
                  <dt>Format</dt>
                  <dd>{active.format}</dd>
                </div>
                <div>
                  <dt>Deliverables</dt>
                  <dd>{active.deliverables}</dd>
                </div>
              </dl>
              <p>{active.note}</p>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}

function ContactIcon({ kind }: { kind: "mail" | "phone" }) {
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M4 7l8 6 8-6" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function AboutIcon({
  kind,
}: {
  kind: "person" | "brush" | "target" | "tools" | "style" | "work";
}) {
  if (kind === "person") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.6-3.2 4-4.8 7-4.8s5.4 1.6 7 4.8" />
      </svg>
    );
  }
  if (kind === "brush") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14.5 4.5l5 5-9.2 9.2H5.3v-5L14.5 4.5z" />
        <path d="M13 6.2l4.8 4.8" />
      </svg>
    );
  }
  if (kind === "target") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "tools") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="7" width="16" height="12" rx="2" />
        <path d="M8 7V5.8A2.8 2.8 0 0 1 10.8 3h2.4A2.8 2.8 0 0 1 16 5.8V7" />
      </svg>
    );
  }
  if (kind === "style") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 20l2.2-8.5L18 4l2 2-7.5 9.8L6 20z" />
        <path d="M14.5 6.5l3 3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function ServiceGlyph({ kind }: { kind: "brand" | "poster" | "logo" | "social" }) {
  if (kind === "brand") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14.5 4.5l5 5-9.5 9.5H5v-5L14.5 4.5z" />
        <path d="M13 6l5 5" />
      </svg>
    );
  }
  if (kind === "poster") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 18v2M16 18v2M7 11h4M13 8h4" />
      </svg>
    );
  }
  if (kind === "logo") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
