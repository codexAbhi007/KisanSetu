// KisanSetu — Indian Languages Catalog for the Kisan AI Assistant
// Includes all 22 languages in the 8th Schedule (Constitution of India)
// plus major regional, tribal and dialect languages spoken across India.

export interface IndianLanguage {
  code: string;       // BCP-47 style language identifier
  name: string;       // English name
  native: string;     // Endonym (native-script name) shown in the UI
  scheduled: boolean; // true = one of the 22 Scheduled Languages (8th Schedule)
}

export const DEFAULT_LANGUAGE: IndianLanguage = {
  code: 'en',
  name: 'English',
  native: 'English',
  scheduled: false,
};

export const INDIAN_LANGUAGES: IndianLanguage[] = [
  { code: 'en', name: 'English', native: 'English', scheduled: false },

  // ── The 22 Scheduled Languages of India (8th Schedule, Constitution) ──
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', scheduled: true },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', scheduled: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', scheduled: true },
  { code: 'brx', name: 'Bodo', native: 'बड़ो', scheduled: true },
  { code: 'doi', name: 'Dogri', native: 'डोगरी', scheduled: true },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', scheduled: true },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', scheduled: true },
  { code: 'ks', name: 'Kashmiri', native: 'कॉशुर', scheduled: true },
  { code: 'gom', name: 'Konkani', native: 'कोंकणी', scheduled: true },
  { code: 'mai', name: 'Maithili', native: 'मैथिली', scheduled: true },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', scheduled: true },
  { code: 'mni', name: 'Manipuri (Meitei)', native: 'ꯃꯤꯇꯩꯂꯣꯟ', scheduled: true },
  { code: 'mr', name: 'Marathi', native: 'मराठी', scheduled: true },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', scheduled: true },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', scheduled: true },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', scheduled: true },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्', scheduled: true },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ', scheduled: true },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي', scheduled: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', scheduled: true },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', scheduled: true },
  { code: 'ur', name: 'Urdu', native: 'اردو', scheduled: true },

  // ── Major Regional, Tribal & Dialect Languages of India ──
  { code: 'bho', name: 'Bhojpuri', native: 'भोजपुरी', scheduled: false },
  { code: 'awa', name: 'Awadhi', native: 'अवधी', scheduled: false },
  { code: 'raj', name: 'Rajasthani', native: 'राजस्थानी', scheduled: false },
  { code: 'mwr', name: 'Marwari', native: 'मारवाड़ी', scheduled: false },
  { code: 'bgc', name: 'Haryanvi', native: 'हरियाणवी', scheduled: false },
  { code: 'hne', name: 'Chhattisgarhi', native: 'छत्तीसगढ़ी', scheduled: false },
  { code: 'mag', name: 'Magahi', native: 'मगही', scheduled: false },
  { code: 'tcy', name: 'Tulu', native: 'ತುಳು', scheduled: false },
  { code: 'kfa', name: 'Kodava', native: 'ಕೊಡವ', scheduled: false },
  { code: 'kfy', name: 'Kumaoni', native: 'कुमाऊँनी', scheduled: false },
  { code: 'gbm', name: 'Garhwali', native: 'गढ़वळी', scheduled: false },
  { code: 'kha', name: 'Khasi', native: 'কা খাসি', scheduled: false },
  { code: 'grt', name: 'Garo', native: 'আ·চিক কুসিক', scheduled: false },
  { code: 'lus', name: 'Mizo', native: 'Mizo ṭawng', scheduled: false },
  { code: 'lbj', name: 'Ladakhi (Bhoti)', native: 'ལ་དྭགས་སྐད་', scheduled: false },
  { code: 'gon', name: 'Gondi', native: 'गोंडी', scheduled: false },
  { code: 'bhb', name: 'Bhili', native: 'भीली', scheduled: false },
  { code: 'kru', name: 'Kurukh (Oraon)', native: 'कुड़ुख़', scheduled: false },
  { code: 'unr', name: 'Mundari', native: 'मुण्डारी', scheduled: false },
  { code: 'hoc', name: 'Ho', native: 'हो जागर', scheduled: false },
  { code: 'lep', name: 'Lepcha', native: 'ᰕᰫᰳᰰᰵᰱᰪᰱᰲ', scheduled: false },
  { code: 'lif', name: 'Limbu', native: 'ᤕᤠᤰᤌᤢᤱ', scheduled: false },
  { code: 'nag', name: 'Nagamese', native: 'নাগামেছে', scheduled: false },
];

/** Find a language by its code (falls back to English). */
export function findLanguage(code: string | undefined | null): IndianLanguage {
  if (!code) return DEFAULT_LANGUAGE;
  return INDIAN_LANGUAGES.find((l) => l.code === code) || DEFAULT_LANGUAGE;
}
