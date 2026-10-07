import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  GraduationCap,
  Plane,
  CalendarCheck,
  Briefcase,
  Laptop,
  Building2,
  Gift,
  TrendingUp,
  CircleDollarSign,
  Tag,
} from 'lucide-react';

export const CategoryIcon = ({ category, size = 18, className = '' }) => {
  const cat = (category || '').toLowerCase();

  switch (cat) {
    case 'food':
      return <Utensils size={size} className={className} />;
    case 'transport':
      return <Car size={size} className={className} />;
    case 'shopping':
      return <ShoppingBag size={size} className={className} />;
    case 'entertainment':
      return <Film size={size} className={className} />;
    case 'bills':
      return <Receipt size={size} className={className} />;
    case 'health':
      return <HeartPulse size={size} className={className} />;
    case 'education':
      return <GraduationCap size={size} className={className} />;
    case 'travel':
      return <Plane size={size} className={className} />;
    case 'subscriptions':
      return <CalendarCheck size={size} className={className} />;
    case 'salary':
      return <Briefcase size={size} className={className} />;
    case 'freelance':
      return <Laptop size={size} className={className} />;
    case 'business':
      return <Building2 size={size} className={className} />;
    case 'gift':
      return <Gift size={size} className={className} />;
    case 'investment':
      return <TrendingUp size={size} className={className} />;
    default:
      return <Tag size={size} className={className} />;
  }
};
