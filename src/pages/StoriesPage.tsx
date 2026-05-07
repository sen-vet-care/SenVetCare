import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

// Provide a type for our blog post
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  language: string;
  read_time: string;
  is_featured?: boolean;
  image_url?: string;
}

const PLACEHOLDER_BLOGS: BlogPost[] = [
  {
    id: 'placeholder-1',
    title: 'Understanding Tick Fever Season in Kolkata',
    excerpt: 'Tick-borne diseases are on the rise this monsoon in Kolkata. Here is what pet owners need to know about prevention.',
    category: 'Pet News',
    language: 'EN',
    read_time: '2 min read',
    is_featured: true,
    image_url: 'https://image.pollinations.ai/prompt/veterinarian%20checking%20dog%20for%20ticks%20kolkata%20realistic%20high%20quality%20photo?width=800&height=400&nologo=true',
  },
  {
    id: 'placeholder-2',
    title: 'Summer Heat Wave: Protecting Street Dogs and Pets',
    excerpt: 'With temperatures soaring above 40°C in Kolkata, extreme heat is a crisis for animals. Learn how to help.',
    category: 'Pet News',
    language: 'EN',
    read_time: '3 min read',
    image_url: 'https://image.pollinations.ai/prompt/street%20dog%20drinking%20water%20summer%20heat%20kolkata%20realistic%20high%20quality%20photo?width=800&height=400&nologo=true',
  },
  {
    id: 'placeholder-3',
    title: 'Daily Update: Rise in Feline Asthma Cases in Kolkata',
    excerpt: 'Dr. Lily AI analyzes recent clinical admissions and identifies a 15% spike in feline respiratory issues due to changing air quality this week.',
    category: 'Pet News',
    language: 'EN',
    read_time: 'Drafted by Dr. Lily AI',
    image_url: 'https://image.pollinations.ai/prompt/feline%20asthma%20cat%20clinic%20realistic%20photo?width=800&height=400&nologo=true',
  },
  {
    id: 'placeholder-4',
    title: 'Rusty\'s Incredible Journey: Overcoming Parvo',
    excerpt: 'How a 6-week-old Indie pup fought against Canine Parvovirus with our critical care team and went home to a loving family.',
    category: 'Pet Stories',
    language: 'EN',
    read_time: '3 min read',
    image_url: 'https://image.pollinations.ai/prompt/healthy%20indie%20pup%20happy%20recovery%20realistic%20photo?width=800&height=400&nologo=true',
  },
  {
    id: 'placeholder-5',
    title: 'Why Yearly Diagnostics Save Lives',
    excerpt: 'Senior Veterinarian Dr. Sen discusses the "10-minute head start" and why waiting for visible symptoms is often too late.',
    category: 'Doctor\'s Speak',
    language: 'EN',
    read_time: '6 min read',
    image_url: 'https://image.pollinations.ai/prompt/veterinary%20diagnostics%20lab%20realistic%20photo?width=800&height=400&nologo=true',
  }
];

export const StoriesPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(PLACEHOLDER_BLOGS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages");

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
             category: item.category || 'General News',
             language: item.language || 'EN',
             read_time: 'Drafted by Dr. Lily AI',
             is_featured: item.is_featured || false,
             image_url: item.image_url || `https://image.pollinations.ai/prompt/${encodeURIComponent(item.title + " realistic photo")}?width=800&height=400&nologo=true`,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
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
              <article 
                key={blog.id} 
                className={`${isFeatured ? 'lg:col-span-2' : 'col-span-1'} bg-surface-container-low rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 border border-outline-variant/30 group cursor-pointer flex flex-col overflow-hidden`}
              >
                {blog.image_url && (
                  <div className={`w-full overflow-hidden ${isFeatured ? 'h-64' : 'h-48'}`}>
                    <img 
                      src={blog.image_url} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className="px-3 py-1 bg-surface border border-outline-variant/50 rounded-full font-inter font-bold text-[10px] uppercase tracking-widest text-primary shadow-sm">{blog.category}</div>
                    <div className="px-2 py-1 bg-surface border border-outline-variant/50 rounded text-outline font-inter font-bold text-[10px] tracking-widest">{blog.language}</div>
                  </div>

                  <h3 className={`${isFeatured ? 'text-3xl' : 'text-2xl'} font-manrope font-bold text-ink-depth mb-4 group-hover:text-primary transition-colors tracking-tight leading-tight`}>{blog.title}</h3>
                  <p className={`font-inter text-base text-on-surface-variant leading-relaxed mb-8 flex-grow ${isFeatured ? 'line-clamp-3' : 'line-clamp-4'}`}>{blog.excerpt}</p>
                  
                  <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-outline-variant/80 font-inter font-bold text-[10px] tracking-widest uppercase">
                          <span className="material-symbols-outlined text-[16px] text-dr-lily-glow">smart_toy</span>
                          <span>{blog.read_time}</span>
                      </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
