export const BlogInsights = () => {
  return (
    <section id="blog" className="py-[120px] max-w-[1280px] mx-auto px-6 relative">
      <header className="mb-16">
        <h2 className="font-manrope font-black text-[48px] text-ink-depth mb-4">Editorial Insights</h2>
        <p className="font-inter text-[18px] text-on-surface-variant max-w-2xl mb-8">Expert articles, preventive care guides, and nutritional advice from our clinical team to ensure your pet's optimal health and longevity.</p>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container-low p-4 rounded-3xl border border-outline-variant/30">
            <div className="relative w-full md:w-1/3">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input type="text" placeholder="Search clinical topics..." className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant/50 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary font-inter text-[16px] text-on-surface outline-none transition-shadow" />
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select className="bg-surface border border-outline-variant/50 rounded-2xl px-4 py-2 font-inter font-bold text-[12px] tracking-widest text-on-surface focus:ring-primary outline-none cursor-pointer uppercase">
                    <option>All Topics</option>
                    <option>Diseases</option>
                    <option>Nutrition</option>
                    <option>Preventive Care</option>
                </select>
                <select className="bg-surface border border-outline-variant/50 rounded-2xl px-4 py-2 font-inter font-bold text-[12px] tracking-widest text-on-surface focus:ring-primary outline-none cursor-pointer uppercase">
                    <option>All Languages</option>
                    <option>English</option>
                    <option>Bengali</option>
                    <option>Hindi</option>
                </select>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Article */}
        <article className="lg:col-span-2 bg-surface rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/20 group cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUF0tx2RVI-81HnX1WpYagNJwlq5eaohajJ-sYWwU_ymZUumu4qH5sVlb86bIA_0Eqlm_sIkDZ9-cDkvDDA_FeI2e9NtPXqv9Okf-WasZ3uC1PGoaHqLD5po_q7iIgyLwgntOoJ2UuECJjo1yJNrMNq7cUpw_9wcdB3RbpBfDjkcwnjcRybGkl7ISyO463QXYG3IY770Gu0WuQ6MWF17-Kao8gtE1wdaSmipuybMA_yZ5kWD1CQjbQuNL3cJuW9-d_ecxo5LhiWCI" className="w-full h-full object-cover grayscale-transition" alt="Preventive care" />
                <div className="absolute top-4 left-4 bg-primary text-on-primary font-inter font-bold text-[12px] tracking-widest px-3 py-1 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90 uppercase">Preventive Care</div>
                <div className="absolute top-4 right-4 bg-surface/90 text-on-surface font-inter font-bold text-[12px] tracking-widest px-2 py-1 rounded shadow-sm backdrop-blur-sm border border-outline-variant/30">EN</div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 text-outline font-inter font-bold text-[12px] tracking-widest mb-3 uppercase">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>8 min read</span>
                </div>
                <h3 className="font-manrope font-semibold text-[24px] text-ink-depth mb-3 group-hover:text-primary transition-colors">The Complete Guide to Senior Pet Cardiac Health</h3>
                <p className="font-inter text-[16px] text-on-surface-variant line-clamp-3">Understanding the early signs of cardiovascular distress in aging pets can significantly extend their quality of life. Learn our clinical protocol for early detection.</p>
            </div>
        </article>

        {/* Standard Article */}
        <article className="col-span-1 bg-surface rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-outline-variant/20 group cursor-pointer">
            <div className="relative aspect-square overflow-hidden">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDabpPnO9N1jPgjzn0mjZQBnsDdbpZK0hJVgzueznVzOdI8wfeQnsO9VnDh7W-xCj9KYSp8h7XvBPdrIuzBqe57cXY4hEcj3f9875KCBBfLR2TIbslCLwkKHRdaK-t6FeuK_AYQRKq_Wk85Fx3OFI5MzT_tx9LUHmbiC9DaFgmU6IthyH2msNS7jOvlzlIHFr1tWZYBNJqiRNAQ_Q-JDdJXnyX8vytWfZpKztfSYxirnRco3R8-X2PjUkbtHJ5viSKYNlV2mQNzk7s" className="w-full h-full object-cover grayscale-transition" alt="Feline diet" />
                <div className="absolute top-4 left-4 bg-pharmacy-green text-on-primary font-inter font-bold text-[12px] tracking-widest px-3 py-1 rounded-full shadow-sm backdrop-blur-sm bg-opacity-90 uppercase">Nutrition</div>
                <div className="absolute top-4 right-4 bg-surface/90 text-on-surface font-inter font-bold text-[12px] tracking-widest px-2 py-1 rounded shadow-sm backdrop-blur-sm border border-outline-variant/30">BN</div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-2 text-outline font-inter font-bold text-[12px] tracking-widest mb-3 uppercase">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    <span>5 min read</span>
                </div>
                <h3 className="font-manrope font-semibold text-[20px] text-ink-depth mb-3 group-hover:text-primary transition-colors">বিড়ালদের জন্য সঠিক খাদ্য তালিকা</h3>
                <p className="font-inter text-[16px] text-on-surface-variant line-clamp-2">কীভাবে আপনার বিড়ালের বয়স এবং ওজন অনুযায়ী সঠিক পুষ্টি নিশ্চিত করবেন।</p>
            </div>
        </article>
      </div>
      
      <div className="mt-12 flex justify-center">
            <button className="bg-surface border border-outline-variant/50 text-primary font-inter font-bold text-[12px] tracking-widest uppercase px-6 py-3 rounded-full hover:bg-surface-container-low transition-colors shadow-sm flex items-center gap-2">
                <span>Load More Insights</span>
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>
        </div>
    </section>
  );
};
