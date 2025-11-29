import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './providers/Providers';
import Layout from './components/Layout';
import HomePage from './app/page';
import AboutPage from './app/about/page';
import ServicesPage from './app/services/page';
import PortfolioPage from './app/portfolio/page';
import PortfolioDetailPage from './app/portfolio/[id]/page';
import CareersPage from './app/careers/page';
import CareerDetailPage from './app/careers/[id]/page';
import ContactPage from './app/contact/page';

function App() {
  return (
    <Providers>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:id" element={<PortfolioDetailPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/careers/:id" element={<CareerDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </Router>
    </Providers>
  );
}

export default App;