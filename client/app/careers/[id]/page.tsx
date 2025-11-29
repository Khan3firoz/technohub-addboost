import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJob } from '../../../services/api';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

const CareerDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [applied, setApplied] = useState(false);
  
  const { data: job, isLoading } = useQuery({ 
    queryKey: ['job', id], 
    queryFn: () => getJob(id || '') 
  });

  const handleApply = () => {
    // Dummy apply
    setApplied(true);
  };

  if (isLoading) return <div className="p-20 text-center">Loading job...</div>;
  if (!job) return <div className="p-20 text-center">Job not found</div>;

  return (
    <div className="py-16 md:py-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/careers" className="inline-flex items-center text-gray-500 hover:text-primary-600 mb-8 transition">
        <ArrowLeft size={18} className="mr-2" /> Back to Careers
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-wide font-semibold">
           <span>{job.department}</span> • <span>{job.location}</span> • <span>{job.experience}</span>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8">
          <p className="text-lg text-gray-700 dark:text-gray-300">{job.description}</p>
          
          <h3 className="text-xl font-bold mt-8 mb-4">Responsibilities</h3>
          <ul className="space-y-2">
            {job.responsibilities.map((res, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="text-primary-500 w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{res}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4">Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle className="text-primary-500 w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">{req}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
          {!applied ? (
            <Button size="lg" onClick={handleApply} className="w-full md:w-auto">Apply Now</Button>
          ) : (
            <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-4 rounded-lg text-center font-semibold">
              Application Sent! We will contact you soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDetailPage;