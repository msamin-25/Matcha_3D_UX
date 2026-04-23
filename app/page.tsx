import MatchaAnimation from '@/components/MatchaAnimation';

export const metadata = {
  title: 'Matcha Espresso Latte | Premium Scrollytelling',
  description: 'Experience the perfect union of ceremonial matcha and bold espresso.',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#050505]">
      {/* 
        The MatchaAnimation component handles its own sticky container 
        and scrollytelling beats across its 400vh height.
      */}
      <MatchaAnimation />
      
      {/* Optional Footer or Next Section */}
      <section className="h-screen w-full flex items-center justify-center bg-[#050505] relative z-10">
        <div className="text-center">
          <p className="text-[#A8C69F] text-sm uppercase tracking-[0.4em] mb-8">
            Handcrafted with Passion
          </p>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-12">
            READY TO TASTE THE FUTURE?
          </h3>
          <button className="px-12 py-4 bg-[#A8C69F] text-[#050505] font-bold rounded-full hover:bg-white transition-colors duration-300">
            ORDER NOW
          </button>
          
          <div className="mt-24 text-white/20 text-xs tracking-widest flex justify-center gap-12">
            <span>SUSTAINABLY SOURCED</span>
            <span>CEREMONIAL GRADE</span>
            <span>ARTISAN ROASTED</span>
          </div>
        </div>
      </section>
    </main>
  );
}
