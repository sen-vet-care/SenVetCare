import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { AnimatePresence, motion } from 'motion/react';
import kolkataBlog1Image from '../assets/images/regenerated_image_1778341585066.png';
import kolkataBlog2Image from '../assets/images/regenerated_image_1778341795597.png';
import kolkataBlog3Image from '../assets/images/regenerated_image_1778341787279.png';
import kolkataBlog4Image from '../assets/images/regenerated_image_1778341791415.png';
import kolkataBlog5Image from '../assets/images/regenerated_image_1778341799544.png';

// Provide a type for our blog post
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  language: string;
  read_time: string;
  is_featured?: boolean;
  image_url?: string;
}

const PLACEHOLDER_BLOGS: BlogPost[] = [
  {
    id: 'kolkata-blog-1',
    title: 'Essential Vaccinations for Pets in Kolkata’s Climate',
    excerpt: 'Protecting your pet goes beyond basic care. Here is your guide to essential vaccinations tailored for the humid and varied climate of Kolkata.',
    content: 'Kolkata\'s humid climate and urban density increase the risk of infectious diseases for our pets. Vaccination isn\'t just about law; it\'s about creating a strong defense system. Core vaccines for dogs in our region include Protections against Canine Distemper, Parvovirus, Infectious Hepatitis (DHLPP), and Rabies. For cats, the FVRCP vaccine (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia) and Rabies vaccine are essential. Depending on your pet\'s lifestyle and exposure, we may also recommend non-core vaccines like those for Leptospirosis, which is highly prevalent in Kolkata due to the monsoon water and open drainage systems. \n\nAlways ensure your pet is up to date on these boosters, as immunity wanes over time. Consult with our clinic to customize a vaccination schedule that best fits your pet’s age, health status, and lifestyle.',
    category: 'Doctor\'s Speak',
    language: 'EN',
    read_time: '4 min read',
    image_url: kolkataBlog1Image,
  },
  {
    id: 'kolkata-blog-2',
    title: 'Managing Your Pet’s Heatstroke Risk During Kolkata Summers',
    excerpt: 'As mercury levels climb in Kolkata, the risk of heatstroke in pets increases dramatically. Here is what to watch for and how to keep them cool.',
    content: 'The intense summer heat in Kolkata is a significant challenge for pets, who don\'t sweat like us. Heatstroke can happen fast. Watch for excessive panting, drooling, bright red gums, incoordination, and collapse. \n\nKey strategies for survival: Walk during the coolest times—very early morning or late night. Keep them indoors in ventilated spaces. Ensure fresh, cool water is ALWAYS available. Use damp towels or cooling mats if needed. Never, EVER leave them in a parked car, even with windows down. If you notice signs, move them to a cooler area, apply cool (not ice-cold) water to their paws and belly, and rush to the clinic immediately.',
    category: 'Pet News',
    language: 'EN',
    read_time: '3 min read',
    image_url: kolkataBlog2Image,
  },
  {
    id: 'kolkata-blog-3',
    title: 'Common Skin Issues in Pets Due to Kolkata\'s Humidity',
    excerpt: 'Dampness and heat in Kolkata are breeding grounds for skin infections. Learn to identify and prevent common dermatological problems in pets.',
    content: 'The high humidity prevalent in Kolkata throughout much of the year makes pets particularly susceptible to fungal and bacterial skin infections, often referred to as "hot spots" or general dermatitis. You might notice your dog or cat intensely licking, scratching, or chewing at specific areas, or developing patchy hair loss, redness, or an unpleasant odor.\n\nPrevention tips: Regular grooming is crucial; ensure your pet’s coat is thoroughly dried after bathing, especially in folds for breeds like Pugs or Bulldogs. Maintain clean bedding and use flea/tick preventatives consistently, as flea bites often cause allergic reactions that lead to secondary skin infections. If you see signs, don\'t wait; it can spread rapidly, leading to increased discomfort and infection. A quick check at our clinic can prevent a small irritation from becoming a major issue.',
    category: 'Doctor\'s Speak',
    language: 'EN',
    read_time: '3 min read',
    image_url: kolkataBlog3Image,
  },
  {
    id: 'kolkata-blog-4',
    title: 'Choosing the Right Diet for Your Pet: Kolkata-Specific Tips',
    excerpt: 'Nutrition plays a massive role in combating local health issues. Learn how to tailor your pet\'s diet for Kolkata conditions.',
    content: 'Nutrition is the foundation of your pet\'s health, and in a climate like Kolkata\'s, it can even help mitigate certain region-specific risks. A high-quality, balanced diet supports a robust immune system and skin health, both of which are under constant pressure from local humidity and seasonal allergens.\n\nWe generally recommend premium, life-stage-appropriate commercial diets that are formulated to meet AAFCO or FEDIAF standards. If you opt for homemade diets, you MUST work with a veterinary nutritionist to ensure it\'s nutritionally complete—a common cause of severe secondary illness here is malnutrition from unbalanced home cooking. Don\'t forget to consider seasonal needs: pets might eat less in peak summer heat, requiring more energy-dense meals during cooler months, or specific formulations for pets dealing with skin issues. Always transition diets slowly over 7-10 days to avoid gastrointestinal upset.',
    category: 'Pet News',
    language: 'EN',
    read_time: '4 min read',
    image_url: kolkataBlog4Image,
  },
  {
    id: 'placeholder-1',
    title: 'Understanding Tick Fever Season in Kolkata',
    excerpt: 'Tick-borne diseases are on the rise this monsoon in Kolkata. Here is what pet owners need to know about prevention, early detection, and treatment to keep your pets safe and healthy.',
    content: 'Tick-borne diseases are a significant threat to pets in Kolkata, especially during the humid monsoon season. The most common tick-borne diseases in our area include Ehrlichiosis, Babesiosis, and Anaplasmosis. Symptoms often include lethargy, loss of appetite, fever, and sometimes pale gums or unexplained bruising. \n\nPrevention is key. We recommend using year-round tick preventatives, which come in various forms such as oral chews, topical spot-ons, and collars. Consistent tick checks after walks, particularly in grassy or wooded areas, are also crucial. If you find a tick, remove it carefully with tweezers, grasping it as close to the skin as possible. Early detection and treatment greatly improve the prognosis for pets infected with tick-borne diseases. If you notice any concerning symptoms in your pet, please contact us immediately for a consultation and potential blood tests.',
    category: 'Pet News',
    language: 'EN',
    read_time: '2 min read',
    is_featured: true,
    image_url: kolkataBlog5Image,
  },
  {
    id: 'placeholder-2',
    title: 'Summer Heat Wave: Protecting Street Dogs and Pets',
    excerpt: 'With temperatures soaring above 40°C in Kolkata, extreme heat is a crisis for animals. Learn how to help.',
    content: 'The intense summer heat in Kolkata poses a severe risk to both pets and street animals. Heatstroke is a life-threatening condition that can occur rapidly in high temperatures. Symptoms of heatstroke include excessive panting, drooling, red gums, vomiting, diarrhea, mental dullness, loss of coordination, and collapse. \n\nTo protect your pets, ensure they have constant access to fresh, cool water and shade. Avoid walking them during the hottest parts of the day; early mornings and late evenings are best. Never leave a pet in a parked car, even with the windows cracked. For street animals, providing bowls of clean water in shaded areas can be a lifesaver. You can also offer water-rich foods like plain yogurt or cucumber. If you suspect an animal is suffering from heatstroke, move them to a cool environment, apply cool (not cold) water to their body, and seek veterinary care immediately.',
    category: 'Pet News',
    language: 'EN',
    read_time: '3 min read',
    image_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'placeholder-3',
    title: 'Daily Update: Rise in Feline Asthma Cases in Kolkata',
    excerpt: 'Dr. Lily AI analyzes recent clinical admissions and identifies a 15% spike in feline respiratory issues due to changing air quality this week.',
    content: 'Our clinical data, analyzed by Dr. Lily AI, has shown a recent 15% increase in cats presenting with respiratory issues, strongly correlating with periods of poor air quality in Kolkata. Feline asthma is thought to be triggered by inhaling allergens or irritants, leading to inflammation and narrowing of the airways. \n\nCommon signs of feline asthma include coughing (often mistaken for hairballs), wheezing, rapid breathing, and open-mouth breathing. If your cat exhibits any of these signs, particularly respiratory distress, it is a medical emergency. Management often involves inhaled or oral medications to reduce inflammation and open the airways. Minimizing environmental triggers—such as cigarette smoke, dusty litter, strong perfumes, and household chemicals—is also an essential part of managing feline asthma.',
    category: 'Pet News',
    language: 'EN',
    read_time: 'Drafted by Dr. Lily AI',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'placeholder-4',
    title: 'Rusty\'s Incredible Journey: Overcoming Parvo',
    excerpt: 'How a 6-week-old Indie pup fought against Canine Parvovirus with our critical care team and went home to a loving family.',
    content: 'Rusty, a tiny 6-week-old Indie pup, was brought to our clinic completely lethargic and suffering from severe gastrointestinal distress. He tested positive for Canine Parvovirus, a highly contagious and often fatal viral disease. His prognosis was guarded.\n\nOur critical care team immediately initiated intensive supportive therapy, including intravenous fluids, anti-nausea medications, antibiotics to prevent secondary infections, and nutritional support. Rusty\'s spirit was incredibly strong. He fought bravely for several days, slowly regaining his strength. Thanks to the round-the-clock care and his own resilience, Rusty beat the odds. He is now fully recovered, playful, and has found a wonderful forever home. Parvovirus is preventable through timely vaccination. Please ensure your puppies receive their complete core vaccination series to protect them from this devastating disease.',
    category: 'Pet Stories',
    language: 'EN',
    read_time: '3 min read',
    image_url: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 'placeholder-5',
    title: 'Why Yearly Diagnostics Save Lives',
    excerpt: 'Senior Veterinarian Dr. Sen discusses the "10-minute head start" and why waiting for visible symptoms is often too late.',
    content: 'Pets are incredibly skilled at hiding illness. In the wild, showing weakness makes an animal vulnerable, and our domestic companions still retain this instinct. By the time a pet shows obvious signs of illness, the disease is often advanced, making treatment more difficult and expensive.\n\nThis is why annual wellness exams and diagnostic testing (blood work, urinalysis, perhaps imaging depending on age and breed) are so critical. These tests establish a baseline for your pet\'s health and allow us to detect subtle changes indicating early organ dysfunction, endocrine diseases, or other issues before symptoms ever appear. Think of it as a "10-minute head start." Early intervention can significantly increase the chances of successful management, improve your pet\'s quality of life, and ultimately extend their lifespan. Do not wait for your pet to get sick; prioritize preventative care.',
    category: 'Doctor\'s Speak',
    language: 'EN',
    read_time: '6 min read',
    image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop',
  }
];

export const StoriesPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(PLACEHOLDER_BLOGS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");
  
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const q = query(collection(db, 'blogs'), orderBy('published_at', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (data && data.length > 0) {
          const formattedBlogs: BlogPost[] = data.map((item: any) => ({
             id: item.id || Math.random().toString(),
             title: item.title || 'Untitled Post',
             excerpt: item.excerpt || (item.content || '').substring(0, 120),
             content: item.content || item.excerpt || 'Full story content is coming soon...',
             category: item.category || 'General News',
             language: item.language || 'EN',
             read_time: 'Drafted by Dr. Lily AI',
             is_featured: item.is_featured || false,
             image_url: item.image_url || `https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop`,
          }));
          setBlogs(formattedBlogs);
        } else {
          setBlogs(PLACEHOLDER_BLOGS);
        }
      } catch (err) {
        console.warn('Failed to fetch from blogs collection:', err);
        setBlogs(PLACEHOLDER_BLOGS);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    const searchMatch =
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query);

    const categoryMatch =
      selectedCategory === "All Topics" || blog.category === selectedCategory;

    const languageMatch =
      selectedLanguage === "All Languages" ||
      (selectedLanguage === "English" && blog.language === "EN") ||
      (selectedLanguage === "Bengali" && blog.language === "BN") ||
      (selectedLanguage === "Hindi" && blog.language === "HI");

    return searchMatch && categoryMatch && languageMatch;
  });

  return (
    <section id="blog" className="py-32 max-w-[1280px] mx-auto px-6 relative">
      {/* Background Decor */}
      <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>

      <header className="mb-20">
        <h2 className="font-manrope font-extrabold text-[48px] md:text-[64px] tracking-tight text-ink-depth leading-tight mb-6">
          Veterinary <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-waiting-gold">Stories.</span>
        </h2>
        <p className="font-inter text-xl text-on-surface-variant font-light max-w-2xl mb-12 leading-relaxed">
          Daily pet care insights, local veterinary news, and analytical guidance drafted by Dr. Lily® AI. Optimized to provide you reliable knowledge right when you need it.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/80 backdrop-blur-xl p-4 rounded-3xl border border-outline-variant/30 shadow-sm relative z-10">
            <div className="relative w-full md:w-1/3">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  type="text" 
                  placeholder="Ask or search topics..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-2xl border border-outline-variant/50 focus:ring-1 focus:ring-primary focus:border-primary font-inter outline-none transition-all" 
                />
            </div>
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface-container border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-sm text-on-surface focus:border-primary outline-none cursor-pointer shadow-sm"
                >
                    <option>All Topics</option>
                    <option>Pet News</option>
                    <option>Pet Stories</option>
                    <option>Doctor's Speak</option>
                </select>
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-surface-container border border-outline-variant/50 rounded-2xl px-4 py-3 font-inter text-sm text-on-surface focus:border-primary outline-none cursor-pointer shadow-sm"
                >
                    <option>All Languages</option>
                    <option>English</option>
                    <option>Bengali</option>
                    <option>Hindi</option>
                </select>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
        {loading ? (
          <div className="col-span-full py-20 text-center text-on-surface-variant font-inter flex flex-col items-center">
             <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></span>
             Loading insights...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="col-span-full py-20 text-center text-on-surface-variant font-inter">No insights found matching your search.</div>
        ) : (
          filteredBlogs.map((blog, index) => {
            const isFeatured = blog.is_featured || (index === 0 && filteredBlogs.length > 2);
            return (
              <motion.article 
                layoutId={`card-${blog.id}`}
                key={blog.id} 
                onClick={() => setSelectedBlog(blog)}
                className={`${isFeatured ? 'lg:col-span-2' : 'col-span-1'} bg-surface rounded-[2rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-outline-variant/50 group cursor-pointer flex flex-col overflow-hidden`}
              >
                {blog.image_url && (
                  <motion.div layoutId={`image-${blog.id}`} className={`w-full overflow-hidden ${isFeatured ? 'h-72 md:h-80' : 'h-56'} relative`}>
                    <img 
                      src={blog.image_url} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 rounded-t-3xl"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </motion.div>
                )}
                
                <div className="p-8 md:p-10 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-3 py-1 bg-surface-container border border-outline-variant/50 rounded-full font-inter font-bold text-[10px] uppercase tracking-widest text-primary shadow-sm">{blog.category}</span>
                    <span className="px-2 py-1 bg-surface-container border border-outline-variant/50 rounded text-on-surface-variant font-inter font-bold text-[10px] tracking-widest">{blog.language}</span>
                  </div>

                  <motion.h3 layoutId={`title-${blog.id}`} className={`${isFeatured ? 'text-3xl lg:text-4xl' : 'text-2xl'} font-manrope font-bold text-ink-depth mb-4 group-hover:text-primary transition-colors tracking-tight leading-[1.2]`}>{blog.title}</motion.h3>
                  <p className={`font-inter text-[15px] text-on-surface-variant leading-relaxed mb-8 flex-grow ${isFeatured ? 'line-clamp-3 lg:line-clamp-4' : 'line-clamp-4'}`}>{blog.excerpt}</p>
                  
                  <div className="pt-6 border-t border-outline-variant/50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-on-surface-variant font-inter font-bold text-[11px] tracking-widest uppercase">
                          <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
                          <span>{blog.read_time}</span>
                      </div>
                      <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedBlog(null)}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedBlog(null)}
            />
            
            <motion.div 
              layoutId={`card-${selectedBlog.id}`}
              className="bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedBlog(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {selectedBlog.image_url && (
                <motion.div layoutId={`image-${selectedBlog.id}`} className="w-full h-64 md:h-96 relative shrink-0">
                  <img src={selectedBlog.image_url} alt={selectedBlog.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                </motion.div>
              )}
              
              <div className="p-8 md:p-12 -mt-10 relative z-10 bg-surface rounded-t-3xl border-t border-white/10 shrink-0">
                <div className="flex flex-wrap gap-3 items-center mb-6">
                  <span className="px-3 py-1 bg-surface-container border border-outline-variant/50 rounded-full font-inter font-bold text-[10px] uppercase tracking-widest text-primary shadow-sm">{selectedBlog.category}</span>
                  <span className="px-3 py-1 bg-surface-container border border-outline-variant/50 rounded-full font-inter font-bold text-[10px] uppercase tracking-widest text-on-surface-variant shadow-sm">{selectedBlog.read_time}</span>
                </div>
                <motion.h2 layoutId={`title-${selectedBlog.id}`} className="font-manrope font-extrabold text-3xl md:text-5xl text-ink-depth leading-tight tracking-tight mb-8">
                  {selectedBlog.title}
                </motion.h2>
                
                <div className="prose prose-lg prose-zinc max-w-none font-inter text-on-surface-variant leading-relaxed">
                  <p className="text-xl font-medium text-ink-depth mb-6">{selectedBlog.excerpt}</p>
                  <p className="whitespace-pre-line">{selectedBlog.content}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

