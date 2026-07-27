import { useState } from 'react'
import ScrollSequence from './components/ScrollSequence'
import DoorSequence from './components/DoorSequence'
import Interactive3DGrid from './components/Interactive3DGrid'

interface PharaohDetails {
  name: string;
  reign: string;
  monuments: string[];
  description: string;
}

interface EraData {
  title: string;
  years: string;
  pharaohs: PharaohDetails[];
}

export default function App() {
  const [activeEra, setActiveEra] = useState<number>(0);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--spotlight-radius', '60px');
    e.currentTarget.style.setProperty('--spotlight-opacity', '1');
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--spotlight-radius', '0px');
    e.currentTarget.style.setProperty('--spotlight-opacity', '0');
  };

  const eras: EraData[] = [
    {
      title: "Old Kingdom",
      years: "2686–2181 BCE",
      pharaohs: [
        {
          name: "Djoser",
          reign: "19 years",
          monuments: ["Step Pyramid of Saqqara"],
          description: "Commissioned the world's first large-scale stone structure, transforming royal burial customs forever."
        },
        {
          name: "Khufu",
          reign: "23 years",
          monuments: ["Great Pyramid of Giza"],
          description: "Built the tallest man-made structure for over 3,800 years, a monument of unmatched geometric precision."
        }
      ]
    },
    {
      title: "Middle Kingdom",
      years: "2055–1650 BCE",
      pharaohs: [
        {
          name: "Mentuhotep II",
          reign: "51 years",
          monuments: ["Mortuary Temple at Deir el-Bahari"],
          description: "Unified Egypt after the chaotic First Intermediate Period, initiating a renaissance in classical art and literature."
        },
        {
          name: "Senusret III",
          reign: "39 years",
          monuments: ["Fortresses of Semna & Uronarti"],
          description: "A warrior-king who secured southern borders and dug a canal through the Nile cataracts to facilitate trade."
        }
      ]
    },
    {
      title: "New Kingdom",
      years: "1550–1069 BCE",
      pharaohs: [
        {
          name: "Hatshepsut",
          reign: "21 years",
          monuments: ["Djeser-Djeseru temple at Deir el-Bahari"],
          description: "One of Egypt's most successful pharaohs, she re-established trade networks and ruled as a full male king."
        },
        {
          name: "Ramesses II",
          reign: "66 years",
          monuments: ["Abu Simbel", "Ramesseum", "Karnak Hypostyle Hall"],
          description: "Known as 'Ramesses the Great', he led military campaigns, signed the first peace treaty, and built prodigiously."
        }
      ]
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-bg-color z-10">
      {/* Background aesthetic shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] rounded-[50%_10%_70%_30%] bg-[radial-gradient(circle,rgba(197,168,128,0.08)_0%,rgba(250,249,246,0)_70%)] border border-[rgba(197,168,128,0.12)] -rotate-10 filter blur-[80px] pointer-events-none"></div>
        <div className="absolute top-[15%] right-[-5%] w-[45vw] h-[45vw] rounded-[40%_60%_30%_70%] bg-[radial-gradient(circle,rgba(197,168,128,0.05)_0%,rgba(250,249,246,0)_70%)] border border-[rgba(197,168,128,0.06)] rotate-35 filter blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[40vw] bg-[radial-gradient(circle,rgba(197,168,128,0.04)_0%,rgba(250,249,246,0)_80%)] filter blur-[80px] pointer-events-none"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-6 md:px-[60px] py-[30px] z-20 box-border">
        <div className="flex flex-col">
          <span className="font-serif text-[20px] font-extrabold tracking-[4px] text-text-dark">KHEMET</span>
          <span className="text-[8px] font-mono tracking-[2px] text-text-muted mt-[2px]">ARCHIVES // TELEMETRY</span>
        </div>
        <nav className="hidden md:flex gap-10">
          <a href="#hero" className="text-[11px] font-semibold tracking-[2px] text-text-muted hover:text-text-dark transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">PHARAOH</a>
          <a href="#timeline" className="text-[11px] font-semibold tracking-[2px] text-text-muted hover:text-text-dark transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">CHRONICLES</a>
          <a href="#gallery" className="text-[11px] font-semibold tracking-[2px] text-text-muted hover:text-text-dark transition-all duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold after:transition-all after:duration-300 hover:after:w-full">COLLECTIONS</a>
        </nav>
        <button className="flex items-center gap-2 bg-transparent border border-border-color px-4 py-2 rounded-[20px] text-[10px] font-bold tracking-[1.5px] cursor-pointer transition-all duration-300 hover:bg-[rgba(31,30,26,0.04)] hover:border-text-dark text-text-dark">
          <span className="w-[6px] height-[6px] bg-[#55c583] rounded-full animate-pulse-glow"></span>
          ACCESS TERMINAL
        </button>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[700px] md:h-screen w-full flex flex-col justify-center items-center px-6 md:px-[60px] py-24 md:py-0 z-10 overflow-hidden box-border">
        {/* Interactive 3D Tile Grid Background */}
        <Interactive3DGrid />

        {/* Large background typography behind the image */}
        <div className="absolute w-full text-center z-0 select-none pointer-events-none">
          <h1 className="font-serif text-[14vw] font-black text-[rgba(31,30,26,0.035)] tracking-[0.12em] leading-none uppercase">PHARAOH</h1>
        </div>

        {/* Central interactive image reveal container */}
        <div className="z-10 relative mt-[-40px]">
          <div 
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="spotlight-container relative w-[360px] h-[540px] md:w-[480px] md:h-[720px] bg-transparent cursor-pointer group"
          >
            <img 
              src="/white-mg.png" 
              className="absolute inset-0 w-full h-full object-cover select-none z-[3]" 
              alt="Egyptian pharaoh sculpture - minimalist white edition" 
            />
            <img 
              src="/mixed-img.png" 
              className="spotlight-gold-img absolute inset-0 w-full h-full object-cover select-none z-[4]" 
              alt="Egyptian pharaoh sculpture - gold and lapis mixed edition" 
            />
            {/* Custom mouse cursor dot */}
            <div className="spotlight-cursor-dot" />
            
            <div className="absolute bottom-[-28px] left-0 w-full text-center font-mono text-[8px] tracking-[2px] text-text-muted opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
              <span>MOVE MOUSE OVER IMAGE FOR SPOTLIGHT REVEAL</span>
            </div>
          </div>
        </div>

        {/* Editorial Text Placement - Left Bottom */}
        <div className="relative md:absolute md:bottom-[60px] md:left-[60px] z-10 text-center md:text-left max-w-[280px] mt-16 md:mt-0 flex flex-col items-center md:items-start">
          <p className="font-serif text-[24px] leading-tight text-text-dark font-medium">Preserving relics</p>
          <p className="font-serif text-[24px] leading-tight text-text-dark font-medium">beyond</p>
          <p className="font-serif text-[24px] leading-tight text-gold-dark font-medium italic">time's reach.</p>
          <a href="#timeline" className="group/link inline-flex items-center gap-2 mt-[15px] font-mono text-[9px] font-bold tracking-[2px] text-text-muted transition-colors duration-300 hover:text-gold-dark">
            EXPLORE CHRONICLES 
            <svg viewBox="0 0 24 24" className="w-3 h-3 transition-transform duration-300 group-hover/link:translate-x-1"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        {/* Editorial Text Placement - Right Bottom */}
        <div className="relative md:absolute md:bottom-[60px] md:right-[60px] z-10 text-center md:text-left max-w-[280px] mt-8 md:mt-0 flex flex-col items-center md:items-start">
          <p className="text-[13px] leading-relaxed text-text-muted mb-5">
            Every sacred dynasty begins with a quiet whisper. Discover ancient secrets under Giza.
          </p>
          <div className="inline-block">
            <a href="#gallery" className="inline-block px-6 py-2.5 rounded-[30px] border border-text-dark text-[10px] font-bold tracking-[2px] text-text-dark bg-transparent transition-all duration-300 hover:bg-text-dark hover:text-bg-color hover:shadow-[0_10px_20px_-8px_rgba(31,30,26,0.2)]">
              EXPLORE COLLECTIONS
            </a>
          </div>
        </div>
      </section>

      {/* Scroll Sequence Section */}
      <ScrollSequence />

      {/* Door Sequence Section */}
      <DoorSequence />

      {/* Interactive Timeline Section */}
      <section id="timeline" className="py-20 px-6 md:py-[120px] md:px-20 border-t border-border-color bg-bg-color relative z-10">
        <div className="mb-[60px] text-left">
          <span className="font-mono text-[10px] tracking-[3px] text-gold-dark font-bold block mb-2.5">02 // HISTORICAL ERA CHRONICLES</span>
          <h2 className="font-serif text-[32px] font-extrabold tracking-[1px] text-text-dark">THE THREE GOLDEN AGE KINGDOMS</h2>
          <div className="w-[60px] h-[2px] bg-gold mt-[15px]"></div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex w-full border-b border-border-color">
            {eras.map((era, index) => (
              <button 
                key={index} 
                className={`flex-1 bg-none border-none p-[24px_20px] flex flex-col items-center cursor-pointer relative transition-all duration-300 after:absolute after:-bottom-[1px] after:left-0 after:w-0 after:h-[2px] after:bg-gold-dark after:transition-[width] after:duration-400 after:ease-out ${activeEra === index ? 'after:w-full' : ''}`}
                onClick={() => setActiveEra(index)}
              >
                <span className="font-mono text-[11px] tracking-[2px] text-gold-dark mb-2">0{index + 1}</span>
                <span className={`font-serif text-[18px] font-bold transition-colors duration-300 ${activeEra === index ? 'text-text-dark' : 'text-text-muted hover:text-text-dark'}`}>{era.title}</span>
                <span className="text-[12px] text-text-muted mt-1">{era.years}</span>
              </button>
            ))}
          </div>

          <div className="bg-white border border-border-color rounded-2xl p-[30px] md:p-[50px] grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-[50px] text-left">
            <div className="era-summary">
              <h3 className="font-serif text-[24px] mb-5 text-text-dark">{eras[activeEra].title} Overview</h3>
              <p className="text-[14px] leading-[1.8] text-text-muted">
                A golden age defined by remarkable architectural leaps, geopolitical stability, and standardizations in religion and royal art.
              </p>
            </div>

            <div className="border-t lg:border-t-0 lg:border-l border-border-color pt-8 lg:pt-0 lg:pl-[50px]">
              <h4 className="font-mono text-[10px] tracking-[3px] text-gold-dark mb-[30px]">PROMINENT DYNASTS & BUILDERS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px]">
                {eras[activeEra].pharaohs.map((p, idx) => (
                  <div key={idx} className="flex flex-col justify-between bg-[#FCFBFA] p-[24px] rounded-xl border border-[rgba(31,30,26,0.04)] transition-transform duration-300 hover:-translate-y-1">
                    <div>
                      <h5 className="font-serif text-[16px] font-bold text-text-dark">{p.name}</h5>
                      <span className="font-mono text-[9px] text-gold-dark block mt-1">Reigned: {p.reign}</span>
                      <p className="text-[12px] leading-relaxed text-text-muted my-[15px]">{p.description}</p>
                    </div>
                    <div className="border-t border-[rgba(31,30,26,0.06)] pt-[15px]">
                      <span className="font-mono text-[8px] tracking-[1px] text-text-muted">KEY MONUMENTS:</span>
                      <ul className="list-none text-[11px] font-bold text-text-dark mt-1">
                        {p.monuments.map((m, mIdx) => (
                          <li key={mIdx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relic Grid/Collections Gallery */}
      <section id="gallery" className="py-20 px-6 md:py-[120px] md:px-20 border-t border-border-color bg-bg-color relative z-10">
        <div className="mb-[60px] text-left">
          <span className="font-mono text-[10px] tracking-[3px] text-gold-dark font-bold block mb-2.5">03 // ARCHIVE ARTIFACTS</span>
          <h2 className="font-serif text-[32px] font-extrabold tracking-[1px] text-text-dark">DIGITALIZED MUSEUM RECONSTRUCTIONS</h2>
          <div className="w-[60px] h-[2px] bg-gold mt-[15px]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Relic Card 1 */}
          <div className="bg-white border border-border-color rounded-2xl overflow-hidden text-left transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_50px_-20px_rgba(197,168,128,0.12)] group">
            <div className="relative w-full aspect-[4/5] bg-[#F5F4F0] overflow-hidden">
              <img src="/white-mg.png" className="absolute inset-0 w-full h-full object-cover transition-all duration-600 ease-out group-hover:scale-105 z-[1]" alt="Relic sculpture" />
              <img src="/mixed-img.png" className="absolute inset-0 w-full h-full object-cover transition-all duration-600 ease-out group-hover:scale-105 z-[2] opacity-0 group-hover:opacity-100" alt="Relic sculpture detail" />
            </div>
            <div className="p-[30px]">
              <div className="flex justify-between font-mono text-[9px] text-gold-dark font-bold mb-3">
                <span>ID: KHM-902</span>
                <span>2580 BCE</span>
              </div>
              <h4 className="font-serif text-[16px] font-extrabold text-text-dark mb-2.5">PHARAOH SCULPTURE // PROFILE A</h4>
              <p className="text-[12px] leading-relaxed text-text-muted">
                The primary sarcophagus mask outline showing the hybrid plaster layers used for custom cast modeling.
              </p>
            </div>
          </div>

          {/* Relic Card 2 */}
          <div className="bg-white border border-border-color rounded-2xl overflow-hidden text-left transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_50px_-20px_rgba(197,168,128,0.12)] group">
            <div className="relative w-full aspect-[4/5] bg-[#F5F4F0] overflow-hidden flex justify-center items-center p-10">
              <div className="w-[80%] h-[80%] opacity-85 transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-[1.03]">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <polygon points="50,5 95,85 5,85" fill="none" stroke="rgba(197, 168, 128, 0.2)" strokeWidth="1" />
                  <polygon points="50,15 85,80 15,80" fill="none" stroke="rgba(197, 168, 128, 0.1)" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="50" y1="5" x2="50" y2="85" stroke="rgba(197, 168, 128, 0.1)" strokeWidth="0.5" />
                  <line x1="5" y1="85" x2="95" y2="85" stroke="rgba(197, 168, 128, 0.4)" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(197, 168, 128, 0.4)" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <div className="p-[30px]">
              <div className="flex justify-between font-mono text-[9px] text-gold-dark font-bold mb-3">
                <span>ID: KHM-221</span>
                <span>2600 BCE</span>
              </div>
              <h4 className="font-serif text-[16px] font-extrabold text-text-dark mb-2.5">THE STEP PYRAMID MANDALA</h4>
              <p className="text-[12px] leading-relaxed text-text-muted">
                Sacred architectural layouts tracing mathematical proportions found within early dynasty stepped mounds.
              </p>
            </div>
          </div>

          {/* Relic Card 3 */}
          <div className="bg-white border border-border-color rounded-2xl overflow-hidden text-left transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_30px_50px_-20px_rgba(197,168,128,0.12)] group">
            <div className="relative w-full aspect-[4/5] bg-[#F5F4F0] overflow-hidden">
              <img src="/mixed-img.png" className="absolute inset-0 w-full h-full object-cover transition-all duration-600 ease-out group-hover:scale-105 z-[1]" alt="Relic sculpture" />
              <img src="/white-mg.png" className="absolute inset-0 w-full h-full object-cover transition-all duration-600 z-[2] [clip-path:circle(0%_at_50%_50%)] transition-[clip-path] duration-800 ease-out group-hover:[clip-path:circle(100%_at_50%_50%)]" alt="Relic sculpture detail" />
            </div>
            <div className="p-[30px]">
              <div className="flex justify-between font-mono text-[9px] text-gold-dark font-bold mb-3">
                <span>ID: KHM-884</span>
                <span>2490 BCE</span>
              </div>
              <h4 className="font-serif text-[16px] font-extrabold text-text-dark mb-2.5">GOLD & LAPIS ROYAL CAST</h4>
              <p className="text-[12px] leading-relaxed text-text-muted">
                A highly preserved colored relief overlay highlighting the divine celestial authority of the ruling pharaoh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141311] text-[#D0CFC9] p-8 md:p-[80px_80px_40px] relative z-10 border-t border-[rgba(197, 168, 128, 0.15)]">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-[80px] mb-[60px] text-left">
          <div>
            <h3 className="font-serif text-[28px] font-black tracking-[6px] text-bg-color mb-5">KHEMET</h3>
            <p className="text-[13px] leading-[1.8] text-[#8C8A84] max-w-[400px]">
              An immersive digital repository documenting the chronological artifacts and subterranean telemetry of ancient Egypt.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[10px] tracking-[3px] text-gold mb-[15px]">SUBSCRIBE TO INTEL REPORTS</h4>
            <p className="text-[12px] text-[#8C8A84] mb-6">Get notified when fresh radar telemetry and tomb scans are cataloged.</p>
            {subscribed ? (
              <div className="bg-[rgba(85,197,131,0.1)] text-[#55c583] border border-[rgba(85,197,131,0.3)] p-4 rounded-lg font-mono text-[10px] tracking-[1px]">
                <span className="text-[10px] font-bold">✓</span> ACCESS REQUEST LOGGED. WELCOME TO THE ARCHIVE.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3 border-b border-[rgba(255,255,255,0.15)] pb-2 transition-all duration-300 focus-within:border-gold">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER ACCESS EMAIL" 
                  required 
                  className="flex-1 bg-transparent border-none text-bg-color font-sans text-xs outline-none placeholder-[#55534F] placeholder:tracking-[1.5px]" 
                />
                <button type="submit" className="bg-transparent border-none text-gold font-mono text-[10px] font-bold tracking-[1.5px] cursor-pointer transition-colors duration-300 hover:text-bg-color">
                  REQUEST ACCESS
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-[rgba(255,255,255,0.05)] pt-10 font-mono text-[8px] tracking-[1px] text-[#55534F] text-left gap-5 md:gap-0">
          <p>© 2026 KHEMET ARCHIVES SYSTEM. ALL ACCESS LOGGED & RECORDED UNDER THE SUPREME COUNCIL OF ANTIQUITIES.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors duration-300">TERMINAL ENCRYPTION</a>
            <a href="#" className="hover:text-gold transition-colors duration-300">ARCHIVE INDEX</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
