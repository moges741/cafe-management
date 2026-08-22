import { Mail, Phone, MapPin,  Send, ArrowRight } from 'lucide-react'
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedin 
} from 'react-icons/fa6';
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSignup = () => {
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    toast.success('Thanks for subscribing!')
    setEmail('')
  }

  return (
    <footer className="bg-background border-t border-border relative overflow-hidden">
      {/* Subtle background glow effect (optional, matching a golden/espresso theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Logo & Brand */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/30 transition-all duration-500" />
            <img
              src="/logo.svg"
              alt="Mr. Cafe Logo"
              className="relative w-24 h-24 object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h2 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">
            Mr. Cafe
          </h2>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: '#B58B67' }}>
            Good food, honest coffee, made with soul. Experience the perfect blend of
            traditional flavors and modern technology.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['Home', 'Menu', 'About', 'Gallery'].map((item) => (
                <li key={item} className="group">
                  <a
                    href={item === 'Home' ? '/' : item === 'Menu' ? '/menu' : `/${item.toLowerCase().replace(' ', '')}`}
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {['Our Story', 'Careers', 'Blog', 'Press'].map((item) => (
                <li key={item} className="group">
                  <a
                    href="#"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'].map((item) => (
                <li key={item} className="group">
                  <a
                    href="#"
                    className="flex items-center text-sm text-muted-foreground hover:text-primary transition-all duration-300"
                  >
                    <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 mr-2" />
                    <span>{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-6">
              Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 group cursor-pointer">
                <div className="p-2 rounded-lg bg-card border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  <MapPin size={16} />
                </div>
                <p className="text-sm text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
                  Bole Road, Addis Ababa
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-card border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  <Phone size={16} />
                </div>
                <a href="tel:+251924433166" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  +251 92 443 3166
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-card border border-border group-hover:border-primary/50 group-hover:text-primary transition-colors">
                  <Mail size={16} />
                </div>
                <a href="mailto:mogesse741@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  mogesse741@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Newsletter & Socials */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 p-8 rounded-2xl bg-card border border-border/50 shadow-sm mb-12">
          {/* Newsletter */}
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-bold text-foreground mb-2">Stay in the Loop</h3>
            <p className="text-sm mb-4 text-muted-foreground">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewsletterSignup()}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
              />
              <button
                onClick={handleNewsletterSignup}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                Subscribe
                <Send size={16} />
              </button>
            </div>
          </div>

          {/* Social Media & Payments */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-6">
            <div className="flex gap-3">
              {[
                { Icon: FaFacebook, href: 'https://facebook.com/mrcafe' },
                { Icon: FaInstagram, href: 'https://instagram.com/mrcafe' },
                { Icon: FaTwitter, href: 'https://twitter.com/mrcafe' },
                { Icon: FaLinkedin, href: 'https://linkedin.com/company/mrcafe' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-1 transition-all duration-300 shadow-sm"
                >
                  <social.Icon size={18} />
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {['Chapa', 'Telebirr', 'CBE Birr', 'Cash'].map((method) => (
                <span key={method} className="px-3 py-1.5 rounded-lg bg-background border border-border text-xs text-muted-foreground font-medium hover:border-primary/30 transition-colors">
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-muted-foreground font-medium">
            © {new Date().getFullYear()} Mr. Cafe. All rights reserved.
          </p>
          <div className="flex gap-6">
            <p className="text-muted-foreground">
              Crafted by{' '}
              <a href="https://moges741.vercel.app" target='_blank' rel="noopener noreferrer" className="text-foreground hover:text-primary font-semibold transition-colors">
                Moges
              </a>
            </p>
            <div className="hidden sm:flex gap-4 border-l border-border pl-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}