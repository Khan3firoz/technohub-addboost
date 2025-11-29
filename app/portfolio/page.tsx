import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPortfolio } from '../../services/api';
import { ArrowUpRight } from 'lucide-react';

const PortfolioPage = () => {
  const { data: portfolio, isLoading } = useQuery({ queryKey: ['portfolio'], queryFn: getPortfolio });

  if (isLoading) return <div className="p-20 text-center">Loading projects...</div>;

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          A showcase of our best work and the results we delivered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {portfolio?.map((item) => (
          <Link to={`/portfolio/${item.id}`} key={item.id} className="group block">
            <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="bg-white text-black px-6 py-2 rounded-full font-bold flex items-center">
                   View Case Study <ArrowUpRight size={18} className="ml-2" />
                 </div>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-1 block">{item.category}</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">{item.title}</h3>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                 <ArrowUpRight className="text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;