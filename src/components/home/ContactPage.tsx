import { Mail, Phone, MapPin, Send, Code2, Sparkles, CheckCircle2 } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa6'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    
    setIsSubmitting(true)
    // Simulate form submission (e.g. EmailJS or backend API)
    setTimeout(() => {
      toast.success('Message sent successfully! I will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-20 px-6 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Let's Build Together</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500">Touch</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Have a project in mind, a collaboration opportunity, or want to explore my work? Let's connect and create something exceptional.
          </p>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Bio & Direct Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Bio Card */}
            <div className="bg-card/40 border border-border/60 backdrop-blur-xl rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Code2 size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Moges Sisay</h2>
                  <p className="text-xs text-primary font-semibold uppercase tracking-wider">Full-Stack MERN Developer</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                I am a passionate software developer specializing in full-stack MERN stack development (MongoDB, Express, React, Node.js). I love building scalable, production-ready web applications that solve real-world problems with a high-end user experience.
              </p>

              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>Available for Full-Stack Projects & Roles</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                  <span>Custom Web Apps & Digital Platforms</span>
                </div>
              </div>
            </div>

            {/* Direct Contact & Social Cards */}
            <div className="bg-card/40 border border-border/60 backdrop-blur-xl rounded-3xl p-6 space-y-4 shadow-lg">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Direct Contact</h3>
              
              <a href="mailto:mogesse741@gmail.com" className="flex items-center gap-4 p-3 rounded-2xl bg-background/50 border border-border/40 hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="text-sm font-semibold text-foreground truncate">mogesse741@gmail.com</p>
                </div>
              </a>

              <a href="tel:+251924433166" className="flex items-center gap-4 p-3 rounded-2xl bg-background/50 border border-border/40 hover:border-primary/50 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="text-sm font-semibold text-foreground">+251 92 443 3166</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-3 rounded-2xl bg-background/50 border border-border/40">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-semibold text-foreground">Addis Ababa, Ethiopia</p>
                </div>
              </div>

              {/* Portfolio & Social Links */}
              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Profiles</span>
                <div className="flex gap-2">
                  <a href="https://github.com/Moges741" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                    <FaGithub size={18} />
                  </a>
                  <a href="http://www.linkedin.com/in/moges741" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-background/80 border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all">
                    <FaLinkedin size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-card/40 border border-border/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-xl">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Send a Message</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Fill out the form below and I'll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Name</label>
                    <input
                      type="text"
                      placeholder="Moges Sisay"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your Email</label>
                    <input
                      type="email"
                      placeholder="moges@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject / Opportunity</label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Job Opportunity"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm tracking-wider uppercase hover:bg-primary/90 active:scale-[0.99] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}