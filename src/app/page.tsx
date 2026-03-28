"use client";
import { useState } from 'react';

const team = [
  { name: 'Jim LaMarca', title: 'MASTER BARBER', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm5HfTEpz2c0nLHBuz8Hjh9QPCFcByGh_Lcc2xMrP0OFo0HpkTDNzNIkw2gPl3Ue-gLAVw9eDQgr3mToBDNqwUrv5F3hUyyLail1bRIa9U2OwDaA6YzwmpKzoOsgMRq3vpsDAUpONUPhrL-BmUVgurS_9-9OHEDkLNyhqcwggrDJxq_BARWV1gHPxTdjbH-Mj9qc393Op4jWhuY8umA8aMeLk8fHGfMaWtAuBS-Q78_HVEIOPKJpxFnf1oUH1MinBy1xgH1-vo_bBS' },
  { name: 'Pierre Wright', title: 'MASTER BARBER', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_27hvj7uZVxWOlfmzv29iOTx_26lz8Y295EBAjb6RYOm0RiL88L0sZLny3Mp8DTEgSIHQJtcyxWO721-MOTV09BL3KFiWZZqnu2PrJ-eoqO4plWLBg1ek9_YMN-PkCyOvCVYswNeIVF6CnlcLLD0vytucEFic3v5gUiU8WCmP7UIu6tpuvcxOxuURaR9bCckYOgLLNbffsKRuzJXG3z1zVYmlncWdcu33ygBcRkpDL4bPoZkJABLshjuLP7rtNRfsyRiZa9EMNemh' },
  { name: 'Matt Hayes', title: 'MASTER BARBER', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIZOLaAejczLQYNdv2Mo4mau76lpsxbB3WXUMz6zE7JXXNsHTVRZjyzR6BXVan7b8fO1HTE2IF86bu_UpZ4RmaaUsMcBbHxr480spS5BZeFCEW7K7KOHvI65tONx6ttPf1m3_KSNi878te3ZPdtLU5wSEJAXu3zjaIHNGif0CtDHXNmLpp7JrhluPgowcyDKiHIGURa7vHrmCKDnI4m2zE8y8elNO-R9eBn92KQ8Py0uQs3MGZXyueOIpNg8_Zj_ikqCpQEzFQJY2C' },
  { name: 'Ticia Husak', title: 'MASTER STYLIST', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcJ4T24L3249928aQmHCE1LpkM9IYTkKS92KnrQApBDwM9vEBcf9vXARLOdFI4aK6QP2sa3_OhytYJz04FSrHC6NAtggrfMEA7TFBFjZER8mUdpIR3Y5GTIqiecjZ5lexeI9jymIas2I4LAZcXzJM9XwuPfqemVhr4X0_HngYgEwisyoHkB_oiUlSem3ogR5qsqjaCfG0EnGqDvZyk1_F9oViyLcFVcyELNLxVHK8Sv78DjNY2yGFcVrpSlvHpvFjJb8Wx55uV-MI_' },
  { name: 'Krista Foecking', title: 'STYLIST', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1PSnrUHktjhZ2AYSV32gDz9ikdxdO5fkZo9KNNvC3hI-59k4a3DOqiCQKRmY53wLSedFg9-pia5fIY7iRUgSyLpuJ_edJI9nT_lxblXSdZZaWaXoMOg9v_AUDwDxG7YVWkenG1wCnQZNbSQV5DI8IYNNC21vt50bAMPmcG4iymo_e9xm3FLUKVCOd1i8TI79KjdSJrrXMVEG1Vjhzk9gXJdnSOgyKEB7aB-OgN37voQ4mbV-NhgG4Gh2RlEd46i-XPulv4WBF3wbE' },
  { name: 'Patrick Muranko', title: 'BARBER', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiP_gG1kjRZGgkRkliycXIFuGnIhYfZo1_RQCTN4WPtKCSgpxQyLY73KdUhz68O9g9XvestUHYcWor8k6sp-fIZYSmUjZg6XEbxJNowV5UbamAcCO8H1Pb5e8IWbeTLGVzjMBrrQTO0SqvIQ43gwH3RPRHfrIn5DqsgCN-XRGGrONZ6hFmypn0KIGx_j2D_SfqwFQ-bUnkNH9ZbsLFp88Sn_PE-Kf9C8SnHVgLW1EBfzo8H52QqYnyblX_Rc7fn5oTgnmT0dPHPxPY' },
  { name: 'Will Dillon', title: 'BARBER', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDLSCiVt_taJsL0IF8ozCW3xaO8k1bYLScGOsDsLdRdo1StKCrcU2sbb4mMpID69WsU2Zk5lPyHkDiaN9dS6YaTsOd4tgUl1479iz28_RRuM98mJ69UaEqbPcvKdXPMEiQ1m6u2zACv80_SAj6kHlF-CYZhLaB1dIZ1aDzLF02GVSm4jj8itS9e7SQTJf5QBsO7kGv78kyOqWPTkdgm5-kQAcjHsgvX7twgtOMpu24qucQy_XQaFWHBhTD__0-d1HbYxfBdfDRjNqJ' },
  { name: 'Shannon Hadick', title: 'MASTER BARBER', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7vmjqpb74rgs1eS5O5OxvlTi5PRUuer-cm8ajJwjmeTXWt6eXGYrbWJTG94lB4DSJD9eb5Whk_RMCQe85m6w5HcTOuSp1kLQRZN7hS8eKyMlpn6PwMG9-U4MOz2p7HLjR-gTBC_LtGabqdKYE-GJhVGPH3FlTxLQuaFuBwEl3JV6EdBno5Tnf3N55e2LawMPJZlr1kMpRdFhcFdgWN9Se8V2Z1X6n5y8Nqq6GOvgOMb3bgjl93OHEs7Xw9ksVbZ0Ond8SyzzgoaLE' },
];

const services = [
  { name: 'Haircuts', price: '$24' },
  { name: 'Razor/Foil Fade', price: '$30' },
  { name: 'Haircut + Beard Trim', price: '$34' },
  { name: 'Haircut + Face Shave', price: '$55' },
  { name: 'Haircut Reservation', price: '$32' },
  { name: 'Beard Trim', price: '$21' },
  { name: 'Full Service Shaves', price: '$36' },
  { name: 'Razor Line-ups', price: '$20' },
  { name: 'Head Shave', price: '$32' },
  { name: 'Haircut + Beard Trim Reservation', price: '$42' },
  { name: "Women's Cut/Rough Dry", price: '$25+' },
  { name: 'Eyebrow/Lip/Chin', price: '$15+' },
  { name: 'Shampoo', price: '$5' },
  { name: 'Shampoo + Style', price: '$25+' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      {/* Top Nav */}
      <nav className="fixed top-0 z-50 w-full bg-[#131313]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="font-headline text-xl md:text-2xl font-black tracking-tighter text-white">SIEDEL'S BARBERSHOP</div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#home" className="font-headline uppercase tracking-tighter font-bold text-[#E31B23] border-b-2 border-[#E31B23] pb-1">Home</a>
            <a href="#team" className="font-headline uppercase tracking-tighter font-bold text-white/70 hover:text-white transition">Team</a>
            <a href="#services" className="font-headline uppercase tracking-tighter font-bold text-white/70 hover:text-white transition">Services</a>
            <a href="#shop" className="font-headline uppercase tracking-tighter font-bold text-white/70 hover:text-white transition">The Shop</a>
            <a href="#contact" className="font-headline uppercase tracking-tighter font-bold text-white/70 hover:text-white transition">Contact</a>
          </div>
          <button className="hidden md:inline-block bg-[#ffb4ac] text-[#690006] font-headline font-bold uppercase tracking-tighter px-6 py-2 hover:brightness-110 active:scale-95 duration-200">BOOK NOW</button>
          <button onClick={() => setMobileMenuOpen((open) => !open)} className="md:hidden text-white">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#131313] border-t border-white/10">
            <a href="#home" className="block px-6 py-3 border-b border-white/10 text-white">Home</a>
            <a href="#team" className="block px-6 py-3 border-b border-white/10 text-white">Team</a>
            <a href="#services" className="block px-6 py-3 border-b border-white/10 text-white">Services</a>
            <a href="#shop" className="block px-6 py-3 border-b border-white/10 text-white">The Shop</a>
            <a href="#contact" className="block px-6 py-3 text-white">Contact</a>
          </div>
        )}
      </nav>

      <main className="pt-24">
        {/* Hero */}
        <section id="home" className="relative h-screen overflow-hidden bg-[#0e0e0e]">
          <div className="absolute inset-0 opacity-40">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIydmIe31LO7CxNm-BAPI0Ch5cWvGWnPmNk5mRgsK7oy3otv7kP-snMe-8EMSc1Nk_OZ02PvfdNCjbM_k5aHLua1iA7W-xkMtUq9CGIGMNoRXXjnpmhRxX88Mr76j1-_9RzQ484h0RjtIddVtXrOoXsCkdCdTAzFpwKCVvHxJt_jKPt6L6my6FGHbWvjJcZmf36c9jwzhbZw1gkVu-bVM9onJR0HaKpbvBWgv1KleFqLljpZcV2N600CM8ZKE2ad61IH7PtawAqCw-" alt="barber tools" className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-[#131313]/90 to-transparent" />
          </div>
          <div className="relative z-10 flex h-full items-center px-6 md:px-24">
            <div className="max-w-4xl">
              <p className="font-label text-primary-container tracking-[0.3em] uppercase mb-4 text-sm font-bold">ESTABLISHED IN MEDINA</p>
              <h1 className="font-headline text-[12vw] md:text-[8rem] leading-[0.85] font-black tracking-tighter uppercase mb-6">
                STAY<br />
                <span className="text-transparent" style={{ WebkitTextStroke: '2px white' }}>SHARP</span>
              </h1>
              <p className="font-body text-xl md:text-2xl max-w-xl text-[#e7bdb8] font-light leading-relaxed">
                Northeast Ohio's premier barbershop. A sanctuary for elite craftsmanship and surgical precision.
              </p>
              <div className="mt-12 flex flex-col md:flex-row gap-6">
                <a href="#contact" className="bg-[#ffb4ac] text-[#690006] uppercase font-headline font-bold px-12 py-5 text-lg hover:brightness-110 transition-all">SECURE APPOINTMENT</a>
                <a href="#services" className="border border-[#5d3f3c]/20 text-white uppercase font-headline font-bold px-12 py-5 text-lg hover:bg-white/5 transition-all">EXPLORE SERVICES</a>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="py-32 px-6 md:px-8 bg-[#131313]">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-24 border-b border-white/5 pb-8">
            <h2 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter">THE TEAM</h2>
            <p className="font-label tracking-[0.2em] text-[#e7bdb8]">MASTER CRAFTSMEN</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
            {team.map((member, idx) => (
              <div key={idx} className="group bg-[#201f1f] p-8 aspect-[3/4] flex flex-col justify-end relative overflow-hidden">
                <img src={member.image} alt={member.name} className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                <div className="relative z-10">
                  <p className="font-label text-xs text-[#ffb4ac] mb-2">{member.title}</p>
                  <h3 className="font-headline text-3xl font-bold uppercase tracking-tighter text-white">{member.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap gap-8 justify-center text-white/50 font-headline font-bold uppercase text-2xl">
            <span>Chris Hodge</span>
            <span>Billy Rodriguez</span>
            <span>Sam Sickle</span>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-32 px-6 md:px-8 bg-[#0e0e0e]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
              <div>
                <h2 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">SERVICES</h2>
                <p className="font-label tracking-[0.2em] text-[#e7bdb8] uppercase mb-8">PRECISION & STEEL</p>
              </div>
              <div className="space-y-4">
                {services.map((service, idx) => (
                  <div key={idx} className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[#e7bdb8]">{service.name}</span>
                    <span className="text-white font-bold">{service.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Shop */}
        <section id="shop" className="py-28 px-6 md:px-8 bg-[#131313] border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-headline text-6xl md:text-7xl font-black uppercase tracking-tighter mb-6">THE SHOP</h2>
            <p className="max-w-3xl mx-auto text-[#e7bdb8] text-lg md:text-xl">State-of-the-art workspace, sterilized equipment, and an atmosphere designed for focus. Every chair is a performance stage.</p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32 px-6 md:px-8 bg-[#0e0e0e]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline text-6xl md:text-7xl font-black uppercase tracking-tighter mb-8">CONTACT</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="font-headline text-3xl uppercase">Location</h3>
                <p>982 N Court Street<br />Medina, Ohio 44256</p>
                <h3 className="font-headline text-3xl uppercase mt-8">Phone</h3>
                <p>(330) 952-0777</p>
              </div>
              <div className="space-y-4">
                <h3 className="font-headline text-3xl uppercase">Hours</h3>
                <div className="space-y-2 text-[#e7bdb8]">
                  <div className="flex justify-between"><span>Monday</span><span>8 AM - 8 PM</span></div>
                  <div className="flex justify-between"><span>Tuesday</span><span>8 AM - 6 PM</span></div>
                  <div className="flex justify-between"><span>Wednesday</span><span>8 AM - 6 PM</span></div>
                  <div className="flex justify-between"><span>Thursday</span><span>8 AM - 8 PM</span></div>
                  <div className="flex justify-between"><span>Friday</span><span>8 AM - 6 PM</span></div>
                  <div className="flex justify-between"><span>Saturday</span><span>8 AM - 3 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                </div>
                <div className="pt-6">
                  <a href="https://maps.google.com/?q=982+N+Court+Street+Medina+OH" className="inline-block px-8 py-3 bg-[#ffb4ac] text-[#690006] font-bold uppercase tracking-wider">Get Directions</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-[#131313] border-t border-white/5 py-12">
          <div className="max-w-7xl mx-auto text-center text-white/60">
            <p>© 2026 Siedel's Barbershop. All rights reserved.</p>
            <p className="mt-1">982 N Court Street, Medina, OH 44256 | (330) 952-0777</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
