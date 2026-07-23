import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
// import StatsSection from '@/components/home/StatsSection'
import AboutSection from '@/components/home/AboutSection'
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection'
import FeaturedMenuSection from '@/components/home/FeaturedMenuSection'
import AiFeaturesSection from '@/components/home/AiFeaturesSection'
import CustomerFavoritesSection from '@/components/home/CustomerFavoritesSection'
import GallerySection from '@/components/home/GallerySection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
// import ReservationSection from '@/components/home/ReservationSection'
// import EventsSection from '@/components/home/EventsSection'
// import TeamSection from '@/components/home/TeamSection'
import TeamAndEventsSection from '@/components/home/TeamAndEventSection'
// import NewsletterSection from '@/components/home/NewsletterSection'
// import LocationSection from '@/components/home/LocationSection'
import FaqSection from '@/components/home/FaqSection'

export default function HomePage() {
  return (
    <div className="bg-background">
     

      <HeroSection />
      {/* <StatsSection /> */}
      <AboutSection />
      <WhyChooseUsSection />
      <FeaturedMenuSection />
      <AiFeaturesSection />
      <CustomerFavoritesSection />
      <GallerySection />
      <TestimonialsSection />
      {/* <ReservationSection /> */}
      <TeamAndEventsSection />
      {/* <NewsletterSection /> */}
      {/* <LocationSection /> */}
      <FaqSection />
      <Footer />
    </div>
  )
}