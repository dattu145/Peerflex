import { Language } from '../types';

export const TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    services: 'Services',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    signup: 'Sign Up',
    dashboard: 'Dashboard',
    orders: 'Orders',
    
    // Hero Section
    heroTitle: 'Build Your Professional Future with AI',
    heroSubtitle: 'Get ATS-friendly portfolios, and optimized profiles that land you your dream job',
    getStarted: 'Get Started',
    
    // Services
    ourServices: 'Our Services',
    servicesDescription: 'Professional career tools powered by AI to accelerate your success',
    viewDetails: 'View Details',
    orderNow: 'Order Now',
    
    // Authentication
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    collegeName: 'College Name',
    cityName: 'City Name',
    selectRole: 'Select Role',
    student: 'Student',
    professional: 'Professional',
    referralCode: 'Referral Code (Optional)',
    
    // Orders
    orderStatus: 'Order Status',
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    delivered: 'Delivered',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit'
  },
  ta: {
    home: 'முகப்பு',
    services: 'சேவைகள்',
    about: 'பற்றி',
    contact: 'தொடர்பு',
    login: 'உள்நுழைவு',
    signup: 'பதிவு செய்யுங்கள்',
    dashboard: 'டாஷ்போர்டு',
    orders: 'ஆர்டர்கள்',
    
    heroTitle: 'AI உடன் உங்கள் தொழில்முறை எதிர்காலத்தை உருவாக்குங்கள்',
    heroSubtitle: 'உங்கள் கனவு வேலையைப் பெற ATS-நட்பு ரெஸ்யூம்கள், அற்புதமான போர்ட்ஃபோலியோக்கள் மற்றும் மேம்படுத்தப்பட்ட சுயவிவரங்களைப் பெறுங்கள்',
    getStarted: 'தொடங்குங்கள்',
    
    ourServices: 'எங்கள் சேவைகள்',
    servicesDescription: 'உங்கள் வெற்றியை விரைவுபடுத்த AI ஆல் இயக்கப்படும் தொழில்முறை தொழிலாளர் கருவிகள்',
    viewDetails: 'விவரங்களைக் காண்க',
    orderNow: 'இப்போது ஆர்டர் செய்யுங்கள்'
  },
  te: {
    home: 'హోమ్',
    services: 'సేవలు',
    about: 'గురించి',
    contact: 'సంపర్కం',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    dashboard: 'డాష్‌బోర్డ్',
    orders: 'ఆర్డర్లు',
    
    heroTitle: 'AI తో మీ వృత్తిపరమైన భవిష్యత్తును నిర్మించండి',
    heroSubtitle: 'మీ కల ఉద్యోగాన్ని పొందే ATS-స్నేహపూర్వక రెజ్యూమ్‌లు, అద్భుతమైన పోర్ట్‌ఫోలియోలు మరియు అనుకూలీకరించిన ప్రొఫైల్‌లను పొందండి',
    getStarted: 'ప్రారంభించండి',
    
    ourServices: 'మా సేవలు',
    servicesDescription: 'మీ విజయాన్ని వేగవంతం చేయడానికి AI ద్వారా శక్తివంతమైన వృత్తిపరమైన కెరీర్ సాధనాలు',
    viewDetails: 'వివరాలను చూడండి',
    orderNow: 'ఇప్పుడు ఆర్డర్ చేయండి'
  },
  hi: {
    home: 'होम',
    services: 'सेवाएं',
    about: 'के बारे में',
    contact: 'संपर्क',
    login: 'लॉगिन',
    signup: 'साइन अप',
    dashboard: 'डैशबोर्ड',
    orders: 'ऑर्डर',
    
    heroTitle: 'AI के साथ अपना व्यावसायिक भविष्य बनाएं',
    heroSubtitle: 'ATS-अनुकूल रिज्यूमे, शानदार पोर्टफोलियो, और अनुकूलित प्रोफाइल प्राप्त करें जो आपको आपकी सपनों की नौकरी दिलाएं',
    getStarted: 'शुरू करें',
    
    ourServices: 'हमारी सेवाएं',
    servicesDescription: 'आपकी सफलता को तेज़ करने के लिए AI द्वारा संचालित पेशेवर करियर उपकरण',
    viewDetails: 'विवरण देखें',
    orderNow: 'अभी ऑर्डर करें'
  }
};

export const getTranslation = (key: string, language: Language): string => {
  return TRANSLATIONS[language][key] || TRANSLATIONS.en[key] || key;
};