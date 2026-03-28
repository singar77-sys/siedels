"use client";
import { useState, useEffect, useRef } from 'react';

const team = [
  { name: 'Jim LaMarca', title: 'Master Barber', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm5HfTEpz2c0nLHBuz8Hjh9QPCFcByGh_Lcc2xMrP0OFo0HpkTDNzNIkw2gPl3Ue-gLAVw9eDQgr3mToBDNqwUrv5F3hUyyLail1bRIa9U2OwDaA6YzwmpKzoOsgMRq3vpsDAUpONUPhrL-BmUVgurS_9-9OHEDkLNyhqcwggrDJxq_BARWV1gHPxTdjbH-Mj9qc393Op4jWhuY8umA8aMeLk8fHGfMaWtAuBS-Q78_HVEIOPKJpxFnf1oUH1MinBy1xgH1-vo_bBS' },
  { name: 'Pierre Wright', title: 'Master Barber', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_27hvj7uZVxWOlfmzv29iOTx_26lz8Y295EBAjb6RYOm0RiL88L0sZLny3Mp8DTEgSIHQJtcyxWO721-MOTV09BL3KFiWZZqnu2PrJ-eoqO4plWLBg1ek9_YMN-PkCyOvCVYswNeIVF6CnlcLLD0vytucEFic3v5gUiU8WCmP7UIu6tpuvcxOxuURaR9bCckYOgLLNbffsKRuzJXG3z1zVYmlncWdcu33ygBcRkpDL4bPoZkJABLshjuLP7rtNRfsyRiZa9EMNemh' },
  { name: 'Matt Hayes', title: 'Master Barber', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZOLaAejczLQYNdv2Mo4mau76lpsxbB3WXUMz6zE7JXXNsHTVRZjyzR6BXVan7b8fO1HTE2IF86bu_UpZ4RmaaUsMcBbHxr480spS5BZeFCEW7K7KOHvI65tONx6ttPf1m3_KSNi878te3ZPdtLU5wSEJAXu3zjaIHNGif0CtDHXNmLpp7JrhluPgowcyDKiHIGURa7vHrmCKDnI4m2zE8y8elNO-R9eBn92KQ8Py0uQs3MGZXyueOIpNg8_Zj_ikqCpQEzFQJY2C' },
  { name: 'Ticia Husak', title: 'Master Stylist', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcJ4T24L3249928aQmHCE1LpkM9IYTkKS92KnrQApBDwM9vEBcf9vXARLOdFI4aK6QP2sa3_OhytYJz04FSrHC6NAtggrfMEA7TFBFjZER8mUdpIR3Y5GTIqiecjZ5lexeI9jymIas2I4LAZcXzJM9XwuPfqemVhr4X0_HngYgEwisyoHkB_oiUlSem3ogR5qsqjaCfG0EnGqDvZyk1_F9oViyLcFVcyELNLxVHK8Sv78DjNY2yGFcVrpSlvHpvFjJb8Wx55uV-MI_' },
  { name: 'Krista Foecking', title: 'Stylist', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1PSnrUHktjhZ2AYSV32gDz9ikdxdO5fkZo9KNNvC3hI-59k4a3DOqiCQKRmY53wLSedFg9-pia5fIY7iRUgSyLpuJ_edJI9nT_lxblXSdZZaWaXoMOg9v_AUDwDxG7YVWkenG1wCnQZNbSQV5DI8IYNNC21vt50bAMPmcG4iymo_e9xm3FLUKVCOd1i8TI79KjdSJrrXMVEG1Vjhzk9gXJdnSOgyKEB7aB-OgN37voQ4mbV-NhgG4Gh2RlEd46i-XPulv4WBF3wbE' },
  { name: 'Patrick Muranko', title: 'Barber', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiP_gG1kjRZGgkRkliycXIFuGnIhYfZo1_RQCTN4WPtKCSgpxQyLY73KdUhz68O9g9XvestUHYcWor8k6sp-fIZYSmUjZg6XEbxJNowV5UbamAcCO8H1Pb5e8IWbeTLGVzjMBrrQTO0SqvIQ43gwH3RPRHfrIn5DqsgCN-XRGGrONZ6hFmypn0KIGx_j2D_SfqwFQ-bUnkNH9ZbsLFp88Sn_PE-Kf9C8SnHVgLW1EBfzo8H52QqYnyblX_Rc7fn5oTgnmT0dPHPxPY' },
  { name: 'Will Dillon', title: 'Barber', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDLSCiVt_taJsL0IF8ozCW3xaO8k1bYLScGOsDsLdRdo1StKCrcU2sbb4mMpID69WsU2Zk5lPyHkDiaN9dS6YaTsOd4tgUl1479iz28_RRuM98mJ69UaEqbPcvKdXPMEiQ1m6u2zACv80_SAj6kHlF-CYZhLaB1dIZ1aDzLF02GVSm4jj8itS9e7SQTJf5QBsO7kGv78kyOqWPTkdgm5-kQAcjHsgvX7twgtOMpu24qucQy_XQaFWHBhTD__0-d1HbYxfBdfDRjNqJ' },
  { name: 'Shannon Hadick', title: 'Master Barber', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7vmjqpb74rgs1eS5O5OxvlTi5PRUuer-cm8ajJwjmeTXWt6eXGYrbWJTG94lB4DSJD9eb5Whk_RMCQe85m6w5HcTOuSp1kLQRZN7hS8eKyMlpn6PwMG9-U4MOz2p7HLjR-gTBC_LtGabqdKYE-GJhVGPH3FlTxLQuaFuBwEl3JV6EdBno5Tnf3N55e2LawMPJZlr1kMpRdFhcFdgWN9Se8V2Z1X6n5y8Nqq6GOvgOMb3bgjl93OHEs7Xw9ksVbZ0Ond8SyzzgoaLE' },
];

const services = [
  { name: 'Haircuts', price: '$24' },
  { name: 'Razor / Foil Fade', price: '$30' },
  { name: 'Haircut + Beard Trim', price: '$34' },
  { name: 'Haircut + Face Shave', price: '$55' },
  { name: 'Haircut Reservation', price: '$32' },
  { name: 'Beard Trim', price: '$21' },
  { name: 'Full Service Shaves', price: '$36' },
  { name: 'Razor Line-ups', price: '$20' },
  { name: 'Head Shave', price: '$32' },
  { name: 'Haircut + Beard Trim Reservation', price: '$42' },
  { name: "Women's Cut / Rough Dry", price: '$25+' },
  { name: 'Eyebrow / Lip / Chin', price: '$15+' },
  { name: 'Shampoo', price: '$5' },
  { name: 'Shampoo + Style', price: '$25+' },
];

const hours = [
  { day: 'Monday', time: '8 AM – 8 PM' },
  { day: 'Tuesday', time: '8 AM – 6 PM' },
  { day: 'Wednesday', time: '8 AM – 6 PM' },
  { day: 'Thursday', time: '8 AM – 8 PM' },
  { day: 'Friday', time: '8 AM – 6 PM' },
  { day: 'Saturday', time: '8 AM – 3 PM' },
  { day: 'Sunday', time: 'Closed' },
];

/* ── Fade-in on scroll hook ──────────────────────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#2C2825]">

      {/* ── Navigation ──────────────────────────── */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'bg-[#F5F0EB]/95 backdrop-blur-md shadow-[0_1px_0_rgba(181,169,154,0.3)]'
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#home" className="font-headline text-xl md:text-2xl font-bold text-[#2C2825] tracking-tight">
            Siedel&apos;s
          </a>
          <div className="hidden md:flex items-center gap-8">
            {['Team', 'Services', 'The Shop', 'Visit'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
                className="font-body text-sm font-medium text-[#4A4541] hover:text-[#E8550F] transition-colors duration-300"
              >
                {label}
              </a>
            ))}
          </div>
          <a
            href="tel:3309520777"
            className="hidden md:inline-flex items-center gap-2 bg-[#2C2825] text-[#F5F0EB] font-body font-medium text-sm px-5 py-2.5 rounded-full hover:bg-[#E8550F] transition-colors duration-300"
          >
            <span className="material-symbols-outlined text-base">call</span>
            (330) 952-0777
          </a>
          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden text-[#2C2825] p-1"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F5F0EB] border-t border-[#D1C9BE]">
            {['Team', 'Services', 'The Shop', 'Visit'].map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-6 py-4 text-[#2C2825] font-body border-b border-[#EDE7E0] hover:bg-[#EDE7E0] transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="tel:3309520777"
              className="block px-6 py-4 font-body font-semibold text-[#E8550F]"
            >
              Call (330) 952-0777
            </a>
          </div>
        )}
      </nav>

      <main>
        {/* ── Hero ──────────────────────────────── */}
        <section id="home" className="relative min-h-screen flex items-center texture-grain overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIydmIe31LO7CxNm-BAPI0Ch5cWvGWnPmNk5mRgsK7oy3otv7kP-snMe-8EMSc1Nk_OZ02PvfdNCjbM_k5aHLua1iA7W-xkMtUq9CGIGMNoRXXjnpmhRxX88Mr76j1-_9RzQ484h0RjtIddVtXrOoXsCkdCdTAzFpwKCVvHxJt_jKPt6L6my6FGHbWvjJcZmf36c9jwzhbZw1gkVu-bVM9onJR0HaKpbvBWgv1KleFqLljpZcV2N600CM8ZKE2ad61IH7PtawAqCw-"
              alt="Inside Siedel's Barbershop"
              className="w-full h-full object-cover opacity-15"
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 md:pt-0 md:pb-0">
            <div className="max-w-3xl">
              <FadeIn>
                <p className="font-label uppercase text-sm font-semibold text-[#6B7C5E] tracking-[0.15em] mb-6">
                  Medina, Ohio &mdash; Est. on Court Street
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="font-headline text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-bold leading-[0.92] tracking-tight mb-8">
                  Your<br />
                  neighborhood<br />
                  <span className="text-[#E8550F] italic">barber shop.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="font-body text-lg md:text-xl text-[#4A4541] max-w-xl leading-relaxed mb-10">
                  Walk-ins welcome. Cleveland sports on the TV.
                  Good conversation in the chair. That&apos;s the whole pitch.
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#visit"
                    className="inline-flex items-center justify-center gap-2 bg-[#2C2825] text-[#F5F0EB] font-body font-semibold px-8 py-4 rounded-full hover:bg-[#E8550F] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Come See Us
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </a>
                  <a
                    href="tel:3309520777"
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#2C2825] text-[#2C2825] font-body font-semibold px-8 py-4 rounded-full hover:bg-[#2C2825] hover:text-[#F5F0EB] transition-all duration-300"
                  >
                    Call for Appointment
                  </a>
                </div>
              </FadeIn>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B5A99A] to-transparent" />
        </section>

        {/* ── About / Vibe ─────────────────────── */}
        <section className="py-20 md:py-28 bg-[#EDE7E0] texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <FadeIn>
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-[#6B7C5E] tracking-[0.2em] mb-4">About the Shop</p>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                    Not fancy.<br />
                    <span className="italic text-[#E8550F]">Just right.</span>
                  </h2>
                  <div className="space-y-4 text-[#4A4541] font-body text-base md:text-lg leading-relaxed">
                    <p>
                      Siedel&apos;s is a real barbershop. The kind where the Browns game is on,
                      there&apos;s a pile of Sports Illustrated on the table, and the barbers
                      actually know your name.
                    </p>
                    <p>
                      We&apos;ve been on Court Street in Medina for years — same chairs, same crew,
                      same commitment to getting the cut right. No pretense. No bottle service.
                      Just skilled hands and honest conversation.
                    </p>
                  </div>
                </div>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#D1C9BE]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIydmIe31LO7CxNm-BAPI0Ch5cWvGWnPmNk5mRgsK7oy3otv7kP-snMe-8EMSc1Nk_OZ02PvfdNCjbM_k5aHLua1iA7W-xkMtUq9CGIGMNoRXXjnpmhRxX88Mr76j1-_9RzQ484h0RjtIddVtXrOoXsCkdCdTAzFpwKCVvHxJt_jKPt6L6my6FGHbWvjJcZmf36c9jwzhbZw1gkVu-bVM9onJR0HaKpbvBWgv1KleFqLljpZcV2N600CM8ZKE2ad61IH7PtawAqCw-"
                      alt="Barber tools at Siedel's"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#D1C9BE] mt-8">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm5HfTEpz2c0nLHBuz8Hjh9QPCFcByGh_Lcc2xMrP0OFo0HpkTDNzNIkw2gPl3Ue-gLAVw9eDQgr3mToBDNqwUrv5F3hUyyLail1bRIa9U2OwDaA6YzwmpKzoOsgMRq3vpsDAUpONUPhrL-BmUVgurS_9-9OHEDkLNyhqcwggrDJxq_BARWV1gHPxTdjbH-Mj9qc393Op4jWhuY8umA8aMeLk8fHGfMaWtAuBS-Q78_HVEIOPKJpxFnf1oUH1MinBy1xgH1-vo_bBS"
                      alt="Jim LaMarca at work"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Team ─────────────────────────────── */}
        <section id="team" className="py-20 md:py-28 bg-[#F5F0EB]">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <div className="mb-14">
                <p className="font-label uppercase text-xs font-semibold text-[#6B7C5E] tracking-[0.2em] mb-3">The Crew</p>
                <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
                  Good people with<br />
                  <span className="italic text-[#E8550F]">sharp skills.</span>
                </h2>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {team.map((member, idx) => (
                <FadeIn key={idx} delay={idx * 0.06}>
                  <div className="group cursor-default">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#EDE7E0] mb-3">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="font-headline text-lg font-semibold tracking-tight">{member.name}</h3>
                    <p className="font-body text-sm text-[#6B7C5E]">{member.title}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
            {/* Extended crew */}
            <FadeIn delay={0.3}>
              <div className="mt-10 pt-8 border-t border-[#D1C9BE]">
                <p className="font-body text-sm text-[#B5A99A] mb-2">Also on the team —</p>
                <p className="font-headline text-lg md:text-xl text-[#4A4541]">
                  Chris Hodge &nbsp;&middot;&nbsp; Billy Rodriguez &nbsp;&middot;&nbsp; Sam Sickle
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Services ─────────────────────────── */}
        <section id="services" className="py-20 md:py-28 bg-[#2C2825] text-[#F5F0EB] texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
              <div className="lg:col-span-2">
                <FadeIn>
                  <p className="font-label uppercase text-xs font-semibold text-[#6B7C5E] tracking-[0.2em] mb-3">What We Do</p>
                  <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    Services<br />
                    <span className="italic text-[#E8550F]">&amp; prices.</span>
                  </h2>
                  <p className="font-body text-[#B5A99A] text-base leading-relaxed mb-8">
                    Straight-up pricing. No surprises.
                    Walk-ins welcome or call ahead to reserve your spot.
                  </p>
                  <a
                    href="tel:3309520777"
                    className="inline-flex items-center gap-2 bg-[#E8550F] text-white font-body font-semibold px-6 py-3 rounded-full hover:bg-[#FF3C00] transition-colors duration-300"
                  >
                    <span className="material-symbols-outlined text-lg">call</span>
                    Book by Phone
                  </a>
                </FadeIn>
              </div>
              <div className="lg:col-span-3">
                <div className="space-y-0">
                  {services.map((service, idx) => (
                    <FadeIn key={idx} delay={idx * 0.03}>
                      <div className="flex justify-between items-baseline py-4 border-b border-white/10 group hover:border-[#E8550F]/30 transition-colors duration-300">
                        <span className="font-body text-base md:text-lg text-[#EDE7E0] group-hover:text-white transition-colors">{service.name}</span>
                        <span className="font-headline text-lg md:text-xl font-semibold text-[#E8550F]">{service.price}</span>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── The Shop ─────────────────────────── */}
        <section id="the-shop" className="py-20 md:py-28 bg-[#F5F0EB]">
          <div className="max-w-6xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="font-label uppercase text-xs font-semibold text-[#6B7C5E] tracking-[0.2em] mb-3">Come Hang Out</p>
                <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
                  The shop <span className="italic text-[#E8550F]">feels like home.</span>
                </h2>
                <p className="font-body text-[#4A4541] text-base md:text-lg max-w-2xl mx-auto">
                  Cleveland memorabilia on the walls. A comfortable waiting area where
                  you actually want to sit. The game&apos;s always on.
                </p>
              </div>
            </FadeIn>
            {/* Feature cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: 'sports_football',
                  title: 'Cleveland Proud',
                  text: 'Browns flag flying, Guardians prints on the wall, and conversations about the next big game.',
                },
                {
                  icon: 'content_cut',
                  title: 'Real Barber Chairs',
                  text: 'Classic setup. Dark cabinets, good mirrors, and barbers who know what they\'re doing.',
                },
                {
                  icon: 'weekend',
                  title: 'Comfortable Waiting',
                  text: 'Olive chairs, sports gallery wall, TV mounted up. You won\'t mind the wait.',
                },
              ].map((card, idx) => (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="bg-[#EDE7E0] rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                    <span className="material-symbols-outlined text-4xl text-[#E8550F] mb-4 block">{card.icon}</span>
                    <h3 className="font-headline text-xl font-bold mb-2">{card.title}</h3>
                    <p className="font-body text-[#4A4541] text-sm leading-relaxed">{card.text}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ── Visit / Contact ──────────────────── */}
        <section id="visit" className="py-20 md:py-28 bg-[#3D322B] text-[#F5F0EB] texture-grain">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <FadeIn>
                <div>
                  <p className="font-label uppercase text-xs font-semibold text-[#6B7C5E] tracking-[0.2em] mb-3">Stop By</p>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-8">
                    Find us on<br />
                    <span className="italic text-[#E8550F]">Court Street.</span>
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-body text-sm font-semibold text-[#B5A99A] uppercase tracking-wider mb-2">Address</h3>
                      <p className="font-body text-lg">982 N Court Street<br />Medina, Ohio 44256</p>
                    </div>
                    <div>
                      <h3 className="font-body text-sm font-semibold text-[#B5A99A] uppercase tracking-wider mb-2">Phone</h3>
                      <a href="tel:3309520777" className="font-body text-lg text-[#E8550F] hover:text-[#FF3C00] transition-colors">(330) 952-0777</a>
                    </div>
                    <div className="pt-4">
                      <a
                        href="https://maps.google.com/?q=982+N+Court+Street+Medina+OH+44256"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#E8550F] text-white font-body font-semibold px-6 py-3 rounded-full hover:bg-[#FF3C00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="material-symbols-outlined text-lg">directions</span>
                        Get Directions
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div>
                  <h3 className="font-body text-sm font-semibold text-[#B5A99A] uppercase tracking-wider mb-6">Hours</h3>
                  <div className="space-y-0">
                    {hours.map((h, idx) => (
                      <div key={idx} className={`flex justify-between py-3 border-b border-white/10 ${
                        h.day === 'Sunday' ? 'text-[#B5A99A]' : ''
                      }`}>
                        <span className="font-body">{h.day}</span>
                        <span className="font-body font-medium">{h.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cleveland pride callout */}
                  <div className="mt-10 p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-2xl text-[#E8550F] mt-0.5">sports_football</span>
                      <div>
                        <p className="font-headline text-base font-semibold mb-1">Game day? We&apos;re here.</p>
                        <p className="font-body text-sm text-[#B5A99A]">
                          Get cleaned up before kickoff. The shop runs on Cleveland time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────── */}
        <footer className="bg-[#2C2825] text-[#B5A99A] py-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="font-headline text-lg text-[#F5F0EB] font-semibold mb-1">Siedel&apos;s Barbershop</p>
                <p className="font-body text-sm">982 N Court Street, Medina, OH 44256</p>
              </div>
              <div className="text-center md:text-right">
                <a href="tel:3309520777" className="font-body text-sm text-[#E8550F] hover:text-[#FF3C00] transition-colors">(330) 952-0777</a>
                <p className="font-body text-xs mt-1">&copy; {new Date().getFullYear()} Siedel&apos;s Barbershop</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
