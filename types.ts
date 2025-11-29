
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  description: string;
  result: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  avatar: string;
  visible: boolean;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}
