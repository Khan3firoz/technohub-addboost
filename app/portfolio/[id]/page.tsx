import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPortfolioItem } from '../../../services/api';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const PortfolioDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useQuery({ 
    queryKey: ['portfolio', id], 
    queryFn: () => getPortfolioItem(id || '') 
  });

  if (isLoading) return <div className="p-20 text-center">Loading project...</div>;
  if (!project) return <div className="p-20 text-center">Project not found</div>;

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/portfolio" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition">
          <ArrowLeft size={18} className="mr-2" /> Back to Portfolio
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <span className="inline-block px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4">
              {project.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {project.description}
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-accent-500">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">The Result</h3>
               <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">{project.result}</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 md:p-12">
           <h2 className="text-2xl font-bold mb-6 dark:text-white">Project Highlights</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start">
                   <CheckCircle2 className="text-primary-500 mr-3 mt-1" />
                   <p className="text-gray-600 dark:text-gray-400">Strategic implementation of data-driven insights to maximize audience reach.</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailPage;