import { HeroFeature } from "@/components/widgets/hero-feature";
import { Hero } from "@/components/ui/animated-hero";
import { HeroBackground } from "@/components/widgets/hero-background";
// import { HeroPricing } from "@/components/widgets/hero-pricing";
import SalonFeaturesSection from "@/components/widgets/feature";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Hero />
      <SalonFeaturesSection />
      <HeroBackground />
      <HeroFeature />
      {/* <HeroPricing /> */}
    </div>
  );
}
