'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'EN' | 'HI';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Landing Page
    'landing.title': 'Discover Your Ideal Career Path with AI',
    'landing.subtitle': 'Get a personalized roadmap, Ikigai analysis, study plan, networking opportunities, and growth strategy in minutes.',
    'landing.cta.start': 'Get Started Free',
    'landing.cta.demo': 'Try Demo',
    'landing.features': 'Features',
    'landing.howItWorks': 'How It Works',
    'landing.successStories': 'Success Stories',
    'landing.pricing': 'Pricing',
    'landing.faq': 'FAQ',
    'landing.footer': '© 2026 CareerMate AI. All rights reserved.',

    // Onboarding
    'onboarding.title': 'Create Your Career Profile',
    'onboarding.step1': 'Personal Details',
    'onboarding.step2': 'Skills Assessment',
    'onboarding.step3': 'Personality Assessment',
    'onboarding.step4': 'Purpose Assessment',
    'onboarding.step5': 'AI Description',
    'onboarding.next': 'Next Step',
    'onboarding.prev': 'Previous',
    'onboarding.submit': 'Generate Career Blueprint',

    // Dashboard Headers
    'dashboard.title': 'CareerMate AI',
    'dashboard.menu.overview': 'Overview',
    'dashboard.menu.matches': 'Career Matches',
    'dashboard.menu.roadmap': 'Career Roadmap',
    'dashboard.menu.ikigai': 'Ikigai Generator',
    'dashboard.menu.planner': 'Study Planner',
    'dashboard.menu.tracker': 'Study Tracker',
    'dashboard.menu.books': 'Books',
    'dashboard.menu.courses': 'Courses',
    'dashboard.menu.events': 'Events & Networking',
    'dashboard.menu.community': 'Community Hub',
    'dashboard.menu.coach': 'AI Coach',
    'dashboard.menu.settings': 'Settings',
    'dashboard.menu.admin': 'Admin Panel',

    // Overview Tab
    'overview.welcome': 'Welcome back, {name}!',
    'overview.card.streak': 'Study Streak',
    'overview.card.hours': 'Hours Completed',
    'overview.card.skills': 'Skills Unlocked',
    'overview.card.roadmapProgress': 'Roadmap Progress',
    'overview.emergencyBtn': 'Emergency Motivation!',

    // Common Buttons
    'btn.save': 'Save Changes',
    'btn.export': 'Export Career Plan',
    'btn.loading': 'Processing...',
  },
  HI: {
    // Landing Page
    'landing.title': 'AI के साथ अपने आदर्श करियर पथ की खोज करें',
    'landing.subtitle': 'कुछ ही मिनटों में व्यक्तिगत रोडमैप, इकिगाई विश्लेषण, अध्ययन योजना, नेटवर्किंग के अवसर और विकास रणनीति प्राप्त करें।',
    'landing.cta.start': 'मुफ्त में शुरू करें',
    'landing.cta.demo': 'डेमो देखें',
    'landing.features': 'विशेषताएं',
    'landing.howItWorks': 'यह कैसे काम करता है',
    'landing.successStories': 'सफलता की कहानियां',
    'landing.pricing': 'मूल्य निर्धारण',
    'landing.faq': 'सामान्य प्रश्न',
    'landing.footer': '© 2026 करियरमेट AI। सभी अधिकार सुरक्षित।',

    // Onboarding
    'onboarding.title': 'अपना करियर प्रोफ़ाइल बनाएं',
    'onboarding.step1': 'व्यक्तिगत विवरण',
    'onboarding.step2': 'कौशल मूल्यांकन',
    'onboarding.step3': 'व्यक्तित्व मूल्यांकन',
    'onboarding.step4': 'उद्देश्य मूल्यांकन',
    'onboarding.step5': 'AI विवरण',
    'onboarding.next': 'अगला कदम',
    'onboarding.prev': 'पिछला',
    'onboarding.submit': 'करियर ब्लूप्रिंट बनाएं',

    // Dashboard Headers
    'dashboard.title': 'करियरमेट AI',
    'dashboard.menu.overview': 'अवलोकन',
    'dashboard.menu.matches': 'करियर मिलान',
    'dashboard.menu.roadmap': 'करियर रोडमैप',
    'dashboard.menu.ikigai': 'इकिगाई जनरेटर',
    'dashboard.menu.planner': 'अध्ययन योजनाकार',
    'dashboard.menu.tracker': 'अध्ययन ट्रैकर',
    'dashboard.menu.books': 'पुस्तकें',
    'dashboard.menu.courses': 'पाठ्यक्रम',
    'dashboard.menu.events': 'कार्यक्रम और नेटवर्किंग',
    'dashboard.menu.community': 'सामुदायिक हब',
    'dashboard.menu.coach': 'AI कोच',
    'dashboard.menu.settings': 'सेटिंग्स',
    'dashboard.menu.admin': 'एडमिन पैनल',

    // Overview Tab
    'overview.welcome': 'वापसी पर स्वागत है, {name}!',
    'overview.card.streak': 'अध्ययन की निरंतरता',
    'overview.card.hours': 'कुल अध्ययन घंटे',
    'overview.card.skills': 'अनलॉक किए गए कौशल',
    'overview.card.roadmapProgress': 'रोडमैप प्रगति',
    'overview.emergencyBtn': 'आपातकालीन प्रेरणा!',

    // Common Buttons
    'btn.save': 'परिवर्तन सहेजें',
    'btn.export': 'करियर योजना डाउनलोड करें',
    'btn.loading': 'प्रक्रिया जारी है...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('careermate_lang') as Language;
    if (saved && (saved === 'EN' || saved === 'HI')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('careermate_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
