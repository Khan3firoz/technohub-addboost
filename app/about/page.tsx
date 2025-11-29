import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeam } from '../../services/api';
import { Target, Eye, Heart } from 'lucide-react';

const AboutPage = () => {
  const { data: team, isLoading } = useQuery({ queryKey: ['team'], queryFn: getTeam });

  return (
    <div className="py-16 md:py-24">
      {/* Intro */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">We are the growth engine for ambitious brands.</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Founded in 2018, AdBoost began with a simple mission: to stop marketing waste and start generating real revenue. We combine data science with world-class creative to deliver campaigns that don't just look good—they convert.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16 mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center md:text-left">
            <div className="bg-white dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm mb-4 mx-auto md:mx-0">
              <Target className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Mission</h3>
            <p className="text-gray-600 dark:text-gray-400">To democratize access to high-performance advertising strategies for brands of all sizes.</p>
          </div>
          <div className="text-center md:text-left">
            <div className="bg-white dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm mb-4 mx-auto md:mx-0">
              <Eye className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Vision</h3>
            <p className="text-gray-600 dark:text-gray-400">A world where advertising adds value to consumer lives rather than interrupting them.</p>
          </div>
          <div className="text-center md:text-left">
             <div className="bg-white dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center shadow-sm mb-4 mx-auto md:mx-0">
              <Heart className="text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Our Values</h3>
            <p className="text-gray-600 dark:text-gray-400">Transparency, relentless optimization, and creative courage.</p>
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Meet The Squad</h2>
        {isLoading ? (
          <p className="text-center">Loading team...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team?.map((member) => (
              <div key={member.id} className="group text-center">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-square max-w-sm mx-auto">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">{member.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutPage;