
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getServices, getPortfolio, getTestimonials, toggleTestimonialVisibility } from '../services/api';
import { useApp } from '../context/AppContext';

const HomePage = () => {
  const { isAdmin } = useApp();
  const queryClient = useQueryClient();

  const { data: services } = useQuery({ queryKey: ['services'], queryFn: getServices });
  const { data: portfolio } = useQuery({ queryKey: ['portfolio'], queryFn: getPortfolio });
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });

  // Mutation to toggle visibility
  const toggleVisibilityMutation = useMutation({
    mutationFn: toggleTestimonialVisibility,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });

  const handleToggleVisibility = (id: string) => {
    toggleVisibilityMutation.mutate(id);
  };

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16 bg-white dark:bg-gray-950 transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="relative bg-gray-50 dark:bg-gray-950 py-24 md:py-40 overflow-hidden">
        {/* Neon Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:opacity-5"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-8">
            Boosting Brands <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-neon-blue to-neon-purple text-neon">
              Beyond Limits
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Data-driven strategies meets <span className="text-primary-500 font-semibold text-neon">Neon-future aesthetics</span>. We engineer exponential growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/contact">
              <Button size="lg" className="w-full sm:w-auto shadow-neon hover:shadow-neon-strong text-lg px-10 py-4">
                Start Your Campaign
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button variant="outline" size="lg" className="w-full sm:w-auto box-neon text-lg px-10 py-4">
                View Our Work
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-neon-white">Our Expertise</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">Dominating the digital landscape with precision.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services?.slice(0, 3).map((service) => (
            <div key={service.id} className="group p-8 bg-white dark:bg-gray-900 rounded-3xl transition-all duration-300 border border-gray-100 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-neon relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-primary-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <TrendingUp size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/services" className="text-primary-600 dark:text-primary-400 font-bold hover:text-neon-blue transition-colors inline-flex items-center text-lg">
            View All Services <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="bg-gray-900 dark:bg-black py-20 border-y border-gray-800 dark:border-primary-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-white text-neon-white">Featured Work</h2>
              <p className="text-gray-400 mt-2 text-lg">Results that echo in the market.</p>
            </div>
            <Link to="/portfolio" className="hidden md:inline-flex items-center text-primary-400 hover:text-white hover:text-neon-blue transition">
              See All Projects <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio?.slice(0, 2).map((item) => (
              <Link to={`/portfolio/${item.id}`} key={item.id} className="group relative overflow-hidden rounded-2xl aspect-video box-neon">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90 transition-opacity flex flex-col justify-end p-8">
                  <span className="text-primary-400 text-sm font-bold uppercase tracking-widest mb-2">{item.category}</span>
                  <h3 className="text-3xl font-bold text-white group-hover:text-primary-400 transition-colors">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
             <Link to="/portfolio" className="text-primary-400 hover:text-white transition">See All Projects</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-neon-white">Client Feedback</h2>
          <p className="text-gray-500 mt-4 text-center max-w-2xl">See what our partners have to say about working with us.</p>
          {isAdmin && (
            <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
              <Eye size={16} /> Admin Mode: You can see hidden comments.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials
            ?.filter(t => isAdmin || t.visible) // Show all if admin, otherwise only visible
            .map((t) => (
            <div key={t.id} className={`bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl relative border transition-all duration-300 ${!t.visible ? 'opacity-60 border-red-500 border-dashed' : 'border-transparent hover:border-primary-500/30'}`}>
              
              {/* Admin Control */}
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={() => handleToggleVisibility(t.id)}
                    className={`p-2 rounded-full transition-colors ${t.visible ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                    title={t.visible ? "Hide Comment" : "Show Comment"}
                  >
                    {t.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              )}

              <div className="text-primary-500 mb-4 opacity-50 text-6xl font-serif leading-none absolute top-4 left-6">"</div>
              <p className="text-gray-600 dark:text-gray-300 italic mb-6 relative z-10 pt-4">{t.feedback}</p>
              
              <div className="flex items-center space-x-4 border-t border-gray-200 dark:border-gray-800 pt-6">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                  <p className="text-sm text-primary-600 dark:text-primary-400">{t.role}, {t.company}</p>
                </div>
              </div>
              
              {isAdmin && !t.visible && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="bg-red-500 text-white px-3 py-1 text-xs font-bold uppercase rounded transform -rotate-12 shadow-lg">Hidden</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!testimonials?.filter(t => isAdmin || t.visible).length && (
           <div className="text-center py-12 text-gray-500">No testimonials available.</div>
        )}
      </section>
      
      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-gray-900 rounded-[2rem] p-12 md:p-20 text-white shadow-neon-strong relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/30 rounded-full blur-[80px] pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/30 rounded-full blur-[80px] pointer-events-none"></div>
           
           <h2 className="text-4xl md:text-5xl font-black mb-6 relative z-10">Ready to explode your growth?</h2>
           <p className="mb-10 text-gray-300 text-xl relative z-10 max-w-2xl mx-auto">Let's build a strategy customized for your brand's future.</p>
           <Link to="/contact" className="relative z-10">
             <button className="bg-white text-primary-900 font-bold py-4 px-10 rounded-full shadow-lg hover:bg-primary-50 transition transform hover:-translate-y-1 hover:shadow-neon">
               Get Free Consultation
             </button>
           </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
