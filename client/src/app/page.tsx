import Header from '@/components/layout/Header';
import HeroBanner from '@/components/home/HeroBanner';
import FeatureBar from '@/components/home/FeatureBar';
import FlashSale from '@/components/home/FlashSale';
import ProductGrid from '@/components/home/ProductGrid';
import CategorySection from '@/components/home/CategorySection';
import AppDownloadBanner from '@/components/home/AppDownloadBanner';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Feature Bar */}
        <FeatureBar />

        {/* Flash Sale Section */}
        <FlashSale />

        {/* Product Grid */}
        <ProductGrid />

        {/* Category Section */}
        <CategorySection />

        {/* App Download Banner */}
        <AppDownloadBanner />
      </main>
    </div>
  );
}
