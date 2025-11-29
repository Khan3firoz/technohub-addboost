
import { Service, TeamMember, PortfolioItem, Testimonial, Job } from '../types';

// Utility delay to mimic network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- DATA ---

const services: Service[] = [
  { id: '1', title: 'Digital Marketing', description: 'Comprehensive strategies to grow your online presence.', icon: 'globe' },
  { id: '2', title: 'Social Media Ads', description: 'Targeted campaigns on FB, IG, LinkedIn, and TikTok.', icon: 'share-2' },
  { id: '3', title: 'PPC / Google Ads', description: 'Maximize ROI with data-driven search engine marketing.', icon: 'mouse-pointer' },
  { id: '4', title: 'Branding & Creative', description: 'Logo design, brand identity, and visual storytelling.', icon: 'pen-tool' },
  { id: '5', title: 'SEO & Content', description: 'Rank higher and engage users with quality content.', icon: 'search' },
  { id: '6', title: 'Video & Motion', description: 'Captivating video ads and motion graphics.', icon: 'video' },
];

const team: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', role: 'CEO & Founder', image: 'https://picsum.photos/id/1005/400/400', bio: 'Visionary leader with 15 years in AdTech.' },
  { id: '2', name: 'Sarah Lee', role: 'Creative Director', image: 'https://picsum.photos/id/1011/400/400', bio: 'Award-winning designer obsessed with typography.' },
  { id: '3', name: 'Mike Chen', role: 'Head of Strategy', image: 'https://picsum.photos/id/1025/400/400', bio: 'Data nerd who loves converting clicks to customers.' },
];

const portfolio: PortfolioItem[] = [
  { 
    id: '1', 
    title: 'Neon Energy Launch', 
    category: 'Branding', 
    image: 'https://picsum.photos/id/136/800/600', 
    client: 'Neon Energy Drink', 
    description: 'A high-voltage campaign for a new energy drink entering the market.',
    result: '200% Increase in brand awareness in Q1.'
  },
  { 
    id: '2', 
    title: 'TechNova SaaS Scale', 
    category: 'PPC', 
    image: 'https://picsum.photos/id/180/800/600', 
    client: 'TechNova', 
    description: 'Aggressive Google Ads strategy for a B2B SaaS platform.',
    result: 'Generated 500+ qualified leads per month.'
  },
  { 
    id: '3', 
    title: 'EcoWear Fashion', 
    category: 'Social Media', 
    image: 'https://picsum.photos/id/250/800/600', 
    client: 'EcoWear', 
    description: 'Instagram and TikTok influencer campaign for sustainable fashion.',
    result: 'Sold out inventory within 2 weeks.'
  },
  { 
    id: '4', 
    title: 'Urban Coffee App', 
    category: 'App Marketing', 
    image: 'https://picsum.photos/id/425/800/600', 
    client: 'Urban Brews', 
    description: 'Launch strategy for a new coffee ordering app.',
    result: '50k Downloads in first month.'
  },
];

// Mutable testimonials for Admin demo
let testimonials: Testimonial[] = [
  { id: '1', name: 'John Doe', role: 'CEO', company: 'BrandX', feedback: 'AdBoost transformed our marketing! Highly recommended.', avatar: 'https://picsum.photos/id/64/100/100', visible: true },
  { id: '2', name: 'Jane Smith', role: 'CMO', company: 'TechFlow', feedback: 'The best ROI we have seen in years. The team is fantastic.', avatar: 'https://picsum.photos/id/65/100/100', visible: true },
  { id: '3', name: 'Robert Fox', role: 'Founder', company: 'StartUp Inc', feedback: 'They truly understand how to scale a modern brand.', avatar: 'https://picsum.photos/id/91/100/100', visible: true },
  { id: '4', name: 'Hidden User', role: 'Manager', company: 'StealthMode', feedback: 'This comment should only be seen by admins until approved.', avatar: 'https://picsum.photos/id/103/100/100', visible: false },
];

const careers: Job[] = [
  { 
    id: '1', 
    title: 'Senior Graphic Designer', 
    department: 'Creative', 
    location: 'Remote', 
    experience: '5+ Years', 
    description: 'We are looking for a visual storyteller to lead our design projects.',
    responsibilities: ['Lead design conceptualization', 'Mentor junior designers', 'Collaborate with copywriters'],
    requirements: ['Adobe Creative Suite Mastery', 'Portfolio of digital ad work', 'Strong communication skills']
  },
  { 
    id: '2', 
    title: 'PPC Specialist', 
    department: 'Marketing', 
    location: 'New York, NY', 
    experience: '3+ Years', 
    description: 'Manage and optimize large-scale Google Ads campaigns.',
    responsibilities: ['Campaign Setup', 'Keyword Research', 'Performance Analysis'],
    requirements: ['Google Ads Certified', 'Analytical mindset', 'Excel/Sheets proficiency']
  },
  { 
    id: '3', 
    title: 'Account Manager', 
    department: 'Client Success', 
    location: 'London, UK', 
    experience: '2+ Years', 
    description: 'Be the bridge between our clients and our internal teams.',
    responsibilities: ['Client communication', 'Project management', 'Upselling services'],
    requirements: ['Experience in agency environment', 'Organizational skills', 'People person']
  },
];

// --- API FUNCTIONS ---

export async function getServices(): Promise<Service[]> {
  await delay(500);
  return services;
}

export async function getTeam(): Promise<TeamMember[]> {
  await delay(600);
  return team;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  await delay(700);
  return portfolio;
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
  await delay(400);
  return portfolio.find(p => p.id === id);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay(500);
  return testimonials;
}

export async function toggleTestimonialVisibility(id: string): Promise<Testimonial> {
  await delay(300); // Simulate server write
  const index = testimonials.findIndex(t => t.id === id);
  if (index !== -1) {
    testimonials[index] = { ...testimonials[index], visible: !testimonials[index].visible };
    return testimonials[index];
  }
  throw new Error("Testimonial not found");
}

export async function getJobs(): Promise<Job[]> {
  await delay(600);
  return careers;
}

export async function getJob(id: string): Promise<Job | undefined> {
  await delay(400);
  return careers.find(j => j.id === id);
}
