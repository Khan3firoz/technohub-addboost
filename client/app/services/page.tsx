import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '../../services/api';
import { Globe, Share2, MousePointer, PenTool, Search, Video, Box } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'globe': <Globe size={32} />,
  'share-2': <Share2 size={32} />,
  'mouse-pointer': <MousePointer size={32} />,
  'pen-tool': <PenTool size={32} />,
  'search': <Search size={32} />,
  'video': <Video size={32} />,
};

const ServicesPage = () => {
  const { data: services, isLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });

  if (isLoading) return <div className="p-20 text-center">Loading services...</div>;

  return (
    <div className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
           <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h1>
           <p className="text-gray-600 dark:text-gray-400">
             We offer a holistic suite of digital services designed to work together to maximize your market impact.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 dark:hover:border-primary-900">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg">
                {iconMap[service.icon] || <Box size={32} />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {service.description}
              </p>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>Strategy & Planning</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>Execution & Management</li>
                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-accent-500 rounded-full mr-2"></span>Analytics & Reporting</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;