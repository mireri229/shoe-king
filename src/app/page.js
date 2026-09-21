import HeroSection from "@/components/sections/HeroSection";
import FeaturedCategories from "@/components/sections/FeaturedCategories";
import NewArrivals from "@/components/sections/NewArrivals";
import WhyShoeKing from "@/components/sections/WhyShoeKing";
import Testimonials from "@/components/sections/Testimonials";
import Newsletter from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <NewArrivals />
      <WhyShoeKing />
      <Testimonials />
      <Newsletter />
    </>
  );
}
