
import React from 'react';
import { Briefcase, Instagram, Linkedin, Twitter, Facebook, Shield, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Footer = () => {
  const { isAdmin, toggleAdmin } = useApp();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-600 p-1.5 rounded-lg shadow-neon">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">AdBoost</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Boosting Brands Beyond Limits. We are a full-service digital agency dedicated to your growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 hover:text-neon transition"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-500 hover:text-neon transition"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-500 hover:text-neon transition"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary-500 hover:text-neon transition"><Facebook size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neon-white">Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/services" className="hover:text-primary-400 transition">Digital Marketing</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition">SEO & Content</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition">PPC Advertising</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition">Social Media</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neon-white">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-primary-400 transition">About Us</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary-400 transition">Portfolio</Link></li>
              <li><Link to="/careers" className="hover:text-primary-400 transition">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neon-white">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>123 Ad Avenue, Creative City</li>
              <li>hello@adboost.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AdBoost Agency. All rights reserved.</p>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-xs uppercase tracking-wider font-semibold">Admin Mode:</span>
            <button 
              onClick={toggleAdmin}
              className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-300 ${isAdmin ? 'bg-primary-600 text-white shadow-neon' : 'bg-gray-800 text-gray-400'}`}
            >
              {isAdmin ? <ShieldCheck size={14} /> : <Shield size={14} />}
              {isAdmin ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
