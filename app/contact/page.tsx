import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mimic API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <div>
           <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Let's build something great together.</h1>
           <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
             Have a project in mind? Looking for a partner to scale your brand? Send us a message.
           </p>

           <div className="space-y-8">
             <div className="flex items-start">
               <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg text-primary-600 dark:text-primary-400 mr-4">
                 <Mail size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 dark:text-white">Chat with us</h3>
                 <p className="text-gray-600 dark:text-gray-400">hello@adboost.com</p>
               </div>
             </div>
             <div className="flex items-start">
               <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg text-primary-600 dark:text-primary-400 mr-4">
                 <Phone size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 dark:text-white">Call us</h3>
                 <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                 <a href="#" className="text-green-600 text-sm font-semibold mt-1 inline-block">Chat on WhatsApp</a>
               </div>
             </div>
             <div className="flex items-start">
               <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-lg text-primary-600 dark:text-primary-400 mr-4">
                 <MapPin size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 dark:text-white">Visit us</h3>
                 <p className="text-gray-600 dark:text-gray-400">123 Ad Avenue<br/>Creative City, NY 10012</p>
               </div>
             </div>
           </div>

           {/* Dummy Map */}
           <div className="mt-12 bg-gray-200 dark:bg-gray-700 h-64 rounded-2xl w-full flex items-center justify-center text-gray-500">
             <p>Google Maps Placeholder</p>
           </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
          
          {isSuccess ? (
            <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-6 rounded-xl text-center">
              <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
              <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setIsSuccess(false)} className="mt-4 text-sm font-semibold underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea 
                  rows={5}
                  required 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white transition resize-none"
                  placeholder="Tell us about your goals..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : <span className="flex items-center">Send Message <Send size={18} className="ml-2" /></span>}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;