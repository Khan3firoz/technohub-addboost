import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getJobs } from '../../services/api';
import { MapPin, Briefcase, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const CareersPage = () => {
  const { data: jobs, isLoading } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });

  return (
    <div className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Join AdBoost</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          We are looking for creative minds and data wizards to join our growing team.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center">Loading positions...</p>
      ) : (
        <div className="space-y-6">
          {jobs?.map((job) => (
            <div key={job.id} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                     <span className="flex items-center"><Briefcase size={16} className="mr-1" /> {job.department}</span>
                     <span className="flex items-center"><MapPin size={16} className="mr-1" /> {job.location}</span>
                     <span className="flex items-center"><Clock size={16} className="mr-1" /> {job.experience}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{job.description}</p>
                </div>
                <div className="shrink-0">
                  <Link to={`/careers/${job.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CareersPage;