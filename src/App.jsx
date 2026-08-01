import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin, Phone, Star, ArrowRight, Menu, Search, X } from 'lucide-react';
import HeroSlideshow from './components/HeroSlideshow';
import Text3DFlip from './components/Text3DFlip';
import GooeyInput from './components/GooeyInput';
import TiltCard from './components/TiltCard';
import LoadingScreen from './components/LoadingScreen';
import confetti from 'canvas-confetti';
import './index.css';

const allProducts = [
  { name: "Star Shine Diamond Ring", price: "₹41,703.00", img: "/assets/ring_diamond_1785599321001.png", category: "Rings" },
  { name: "Mandira Diamond Wedding Band", price: "₹78,807.00", img: "/assets/ring_wedding_1785599409969.png", category: "Diamond Bands" },
  { name: "Flamingos Diamond Earrings", price: "₹51,732.00", img: "/assets/earrings_studs_1785599421122.png", category: "Earrings" },
  { name: "Jasmine Diamond Wedding Ring", price: "₹69,503.00", img: "https://images.unsplash.com/photo-1603561596112-0a132b757442?q=80&w=1000&auto=format&fit=crop", category: "Rings" },
  { name: "William Sapphire Ring", price: "₹1,45,805.00", img: "/assets/ring_sapphire_1785599493714.png", category: "Rings" },
  { name: "Wonderous Pearl Drops", price: "₹92,325.00", img: "/assets/earrings_drops_1785599430001.png", category: "Earrings" },
  { name: "Sandy Diamond Band", price: "₹40,408.00", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop", category: "Diamond Bands" },
  { name: "Savina Diamond Earrings", price: "₹1,62,521.00", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop", category: "Earrings" },
  { name: "Elegant Gold Necklace", price: "₹2,10,000.00", img: "/assets/necklace_gold_1785599459228.png", category: "Necklace" },
  { name: "Pearl Drop Necklace", price: "₹85,000.00", img: "/assets/necklace_pearl_1785599440532.png", category: "Necklace" },
  { name: "Diamond Tennis Bracelet", price: "₹1,80,500.00", img: "/assets/bracelet_tennis_1785599470178.png", category: "Bracelets" },
  { name: "Classic Gold Bangle", price: "₹1,15,000.00", img: "/assets/bracelet_bangle_1785599482832.png", category: "Bracelets" }
];

const categories = ["All", "Rings", "Earrings", "Necklace", "Bracelets", "Diamond Bands"];

const reviews = [
  { author: "Mr. Sujith", rating: 5, text: "Quality service and Appreciable customer handling by staff." },
  { author: "Anonymous", rating: 5, text: "Nice silver collection, affordable price, good behaviour from the staffs." },
  { author: "Customer", rating: 5, text: "Very good collection of jewellery and good customer service, reasonable pricing." }
];

const ScrollReveal = ({ children, delay = 0, y = 50 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCart = () => {
    setIsCartOpen(true);
    
    // Confetti side cannons
    const end = Date.now() + 3 * 1000;
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1", "#B8860B", "#A91C22"];
    
    const frame = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
      requestAnimationFrame(frame);
    };
    frame();
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    handleOpenCart();
  };

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Navigation */}
      <nav className={`nav-container ${isScrolled ? 'scrolled' : ''}`} style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100, transition: 'all 0.4s ease',
        background: isScrolled ? 'rgba(253, 251, 247, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(184, 134, 11, 0.1)' : 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        {/* Desktop Logo */}
        <div className="desktop-logo" style={{ display: 'flex', alignItems: 'center', gap: '0', cursor: 'pointer', marginLeft: '-1.5rem' }} onClick={() => scrollToSection('home')}>
          <div style={{ height: '40px', overflow: 'hidden', display: 'flex', alignItems: 'flex-start', marginTop: '6px', marginRight: '-26px', zIndex: 2 }}>
            <img src="/logo.png" alt="Kalyan Jewellers Logo" style={{ height: '80px', objectFit: 'contain', objectPosition: 'top' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
            <h1 className="font-serif" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--kalyan-red)', letterSpacing: '3px', margin: 0, lineHeight: 1 }}>KALYAN</h1>
            <span style={{ color: 'var(--text-primary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '4px', marginTop: '8px', fontWeight: 600 }}>Jewellers</span>
          </div>
        </div>

        {/* Mobile Logo */}
        <div className="mobile-logo" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
          <img src="/app-icon.jpg" alt="Kalyan App Icon" />
          <div className="mobile-logo-text">
            <h1>KALYAN</h1>
            <span>Jewellers</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'none', gap: '2.5rem' }} className="nav-links">
            {['Home', 'Legacy', 'Collections', 'Testimonials'].map((item, i) => (
              <button 
                 key={item} 
                 onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))} 
                 style={{ 
                   background: 'none', border: 'none',
                   cursor: 'pointer',
                 }}>
                 <Text3DFlip
                   className="nav-flip-text"
                   flipTextClassName="nav-flip-text-hover"
                 >
                   {item}
                 </Text3DFlip>
              </button>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCart}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', position: 'relative' }}
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--kalyan-red)', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cart.length}
              </span>
            )}
          </motion.button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, backdropFilter: 'blur(4px)' }}
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'var(--bg-primary)', zIndex: 1000, padding: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>Your Bag</h2>
                <X size={24} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setIsCartOpen(false)} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {cart.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Your shopping bag is empty.</p>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                      <img src={item.img} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '2px' }} />
                      <div>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.name}</h4>
                        <p style={{ color: 'var(--kalyan-gold)', fontWeight: 600 }}>{item.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                  <button className="btn-primary" style={{ width: '100%' }}>Checkout</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Clean & Elegant Split Hero Section */}
      <section id="home" style={{ position: 'relative', height: '100vh', display: 'flex', background: 'var(--bg-secondary)' }}>
        
        {/* Left Typography Side */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 8%', zIndex: 10 }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            style={{ color: 'var(--kalyan-gold)', letterSpacing: '6px', textTransform: 'uppercase', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}
          >
            India's Trusted Jeweller
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.2, delay: 0.4 }}
            className="font-serif" 
            style={{ color: 'var(--text-primary)', fontSize: 'clamp(4rem, 6vw, 6rem)', fontWeight: 400, lineHeight: 1.1, marginBottom: '2rem' }}
          >
            Embrace <br/>
            <span style={{ fontStyle: 'italic', color: 'var(--kalyan-gold)' }}>Timeless</span><br/>
            Elegance.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '400px', marginBottom: '3rem' }}
          >
            Adorn yourself with the finest craftsmanship. Explore our exquisite collection of BIS-hallmarked 22K & 18K gold and diamond jewellery.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}>
            <button className="btn-primary" onClick={() => scrollToSection('collections')} style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
              Explore Collections <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>

        {/* Right Image Side */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}
          style={{ flex: '1', position: 'relative', overflow: 'hidden' }}
        >
          <motion.img 
            src="https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Model" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--bg-secondary) 0%, transparent 20%)' }} />
        </motion.div>

      </section>

      {/* Legacy Section */}
      <section id="legacy" style={{ padding: '10rem 3rem', background: 'var(--bg-primary)', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '8rem', alignItems: 'center' }}>
          <div>
            <ScrollReveal>
              <h2 className="font-serif" style={{ fontSize: '3.5rem', marginBottom: '2rem', fontWeight: 400, color: 'var(--text-primary)' }}>A Legacy of <span style={{ fontStyle: 'italic', color: 'var(--kalyan-gold)' }}>Trust</span></h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Established in 1993 by T. S. Kalyanaraman in Thrissur, Kerala, Kalyan Jewellers has grown into one of India’s largest and most trusted jewellery chains. With roots tracing back to a 1908 textile family legacy, we have always put our customers first.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <button className="btn-outline" onClick={() => scrollToSection('collections')}>View The Collection</button>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.3} y={50}>
            <div style={{ position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop" 
                alt="Craftsmanship" 
                style={{ width: '100%', height: 'auto', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}
              />
              <div style={{ position: 'absolute', bottom: '-2rem', right: '-2rem', width: '200px', height: '200px', border: '1px solid var(--kalyan-gold)', zIndex: -1 }} />
              <div style={{ position: 'absolute', top: '-2rem', left: '-2rem', width: '200px', height: '200px', background: 'var(--bg-secondary)', zIndex: -1 }} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Products Section */}
      <section id="collections" style={{ padding: '8rem 3rem', position: 'relative', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', gap: '2rem' }}>
            <ScrollReveal>
              <h2 className="font-serif" style={{ fontSize: '3.5rem', fontWeight: 400, marginBottom: '1rem', color: 'var(--text-primary)' }}>Curated <span style={{ fontStyle: 'italic', color: 'var(--kalyan-gold)' }}>Masterpieces</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Exquisite diamonds and gold crafted for your special moments.</p>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <GooeyInput 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                />
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.3}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
              {categories.map(cat => (
                <button 
                  key={cat} 
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: activeCategory === cat ? 'var(--kalyan-red)' : 'var(--text-secondary)',
                    fontSize: '1rem',
                    fontWeight: activeCategory === cat ? 600 : 400,
                    cursor: 'pointer',
                    position: 'relative',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    padding: '0.5rem 0',
                    transition: 'color 0.3s'
                  }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="underline" style={{ position: 'absolute', bottom: -2, left: 0, width: '100%', height: '2px', background: 'var(--kalyan-red)' }} />
                  )}
                </button>
              ))}
            </div>
          </ScrollReveal>
          
          <motion.div layout className="product-grid">
            <AnimatePresence>
              {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
                <motion.div
                  key={product.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <TiltCard 
                    className="glass"
                    style={{ position: 'relative', cursor: 'pointer', borderRadius: 0, overflow: 'hidden' }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <div style={{ position: 'relative', height: '350px', overflow: 'hidden', background: '#fff' }}>
                      <motion.img 
                        src={product.img} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        variants={{
                          initial: { scale: 1 },
                          hover: { scale: 1.1 }
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                      <motion.div 
                        variants={{
                          initial: { opacity: 0 },
                          hover: { opacity: 1 }
                        }}
                        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(2px)' }}
                      >
                         <button className="btn-outline" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>Add to Cart</button>
                      </motion.div>
                    </div>
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#fff' }}>
                      <h3 className="font-serif" style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{product.name}</h3>
                      <p style={{ color: 'var(--kalyan-red)', fontSize: '1.2rem', fontWeight: 500, letterSpacing: '1px' }}>{product.price}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              )) : (
                <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem', border: '1px dashed var(--border-color)', background: '#fff' }}>
                  <h3 className="font-serif" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>No Masterpieces Found</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Please adjust your search criteria or explore other categories.</p>
                  <button className="btn-outline" style={{ marginTop: '2rem' }} onClick={() => {setSearchQuery(''); setActiveCategory('All');}}>Clear Filters</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1A1105', color: '#fff', padding: '8rem 3rem 2rem', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', marginBottom: '6rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
              <h1 className="font-serif" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--kalyan-red)', letterSpacing: '2px', margin: 0, lineHeight: 1 }}>KALYAN</h1>
            </div>
            <p style={{ color: '#b3a89e', lineHeight: 1.8, fontSize: '1.1rem' }}>Chain retailer with an inventory of exquisite gold and diamond jewelry, and silver ornaments spanning generations.</p>
          </div>
          
          <div>
            <h4 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '2.5rem', color: '#fff' }}>Store Location</h4>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <MapPin size={24} color="var(--kalyan-gold)" strokeWidth={1.5} style={{ flexShrink: 0 }} />
              <p style={{ color: '#b3a89e', lineHeight: 1.6, fontSize: '1.1rem' }}>No.12 B, No.34, Ward, 02, Round North, Thrissur, Kerala 680001</p>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Phone size={24} color="var(--kalyan-gold)" strokeWidth={1.5} />
              <p style={{ color: '#b3a89e', fontSize: '1.1rem' }}>092288 36200</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 400, marginBottom: '2.5rem', color: '#fff' }}>Our Services</h4>
            <ul style={{ listStyle: 'none', color: '#b3a89e', display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1.1rem' }}>
              <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='var(--kalyan-gold)'} onMouseOut={(e)=>e.target.style.color='#b3a89e'}>Gold & Diamond Jewellery</li>
              <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='var(--kalyan-gold)'} onMouseOut={(e)=>e.target.style.color='#b3a89e'}>Bridal Muhurat Collections</li>
              <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='var(--kalyan-gold)'} onMouseOut={(e)=>e.target.style.color='#b3a89e'}>Customized Design Studio</li>
              <li style={{ cursor: 'pointer', transition: 'color 0.2s' }} onMouseOver={(e)=>e.target.style.color='var(--kalyan-gold)'} onMouseOut={(e)=>e.target.style.color='#b3a89e'}>Appraisal & Certification</li>
            </ul>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', color: '#b3a89e', fontSize: '1rem', paddingTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p>© {new Date().getFullYear()} Kalyan Jewellers. All rights reserved.</p>
        </div>
      </footer>
      <style>{`
        @media (min-width: 900px) {
          .nav-links { display: flex !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </div>
    </>
  );
}

export default App;
