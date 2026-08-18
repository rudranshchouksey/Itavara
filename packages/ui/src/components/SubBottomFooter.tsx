"use client";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { Globe, DollarSign, Facebook, Twitter, Instagram, Youtube, ChevronUp } from 'lucide-react-native';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Simple initialization for demo/standalone usage
if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: {} },
      fr: { translation: {} },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });
}
const currencies = [
  { code: 'USD', symbol: '$', label: 'USD $' },
  { code: 'INR', symbol: '₹', label: 'INR ₹' },
  { code: 'EUR', symbol: '€', label: 'EUR €' },
  { code: 'GBP', symbol: '£', label: 'GBP £' },
];

export const SubBottomFooter = () => {
  const { t, i18n } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

  const handleLinkPress = (href: string) => {
    if (Platform.OS === 'web') {
      window.location.href = href;
    } else {
      Linking.openURL(href);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <View className="w-full bg-neutralLight py-6 px-6 md:px-12 lg:px-20 border-t border-neutral/20">
      <View className="max-w-7xl mx-auto w-full flex-col lg:flex-row justify-between items-center">
        
        {/* Left Side: Copyright & Legal */}
        <View className="flex-row flex-wrap items-center justify-center lg:justify-start mb-6 lg:mb-0">
          <Text className="text-text mr-4 mb-2 lg:mb-0">
            © {currentYear} Itvara, Inc.
          </Text>
          
          <View className="flex-row items-center flex-wrap justify-center">
            <TouchableOpacity onPress={() => handleLinkPress('/terms')}>
              <Text className="text-text hover:underline mr-4">Terms</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('/sitemap')}>
              <Text className="text-text hover:underline mr-4">Sitemap</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('/privacy')}>
              <Text className="text-text hover:underline mr-4">Privacy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('/company-legal')}>
              <Text className="text-text hover:underline">Company Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Side: Language, Currency, Social */}
        <View className="flex-row items-center flex-wrap justify-center">
          
          {/* Language Selector */}
          <TouchableOpacity 
            onPress={() => setShowLanguageModal(true)}
            className="flex-row items-center mr-6 hover:opacity-70 transition-opacity"
          >
            <Globe size={18} color="#484848" />
            <Text className="text-text font-medium ml-2 hover:underline">
              {i18n.language === 'en' ? 'English (US)' : i18n.language}
            </Text>
          </TouchableOpacity>

          {/* Currency Selector (Simplified Dropdown trigger for demo) */}
          <TouchableOpacity 
            onPress={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="flex-row items-center mr-8 hover:opacity-70 transition-opacity"
          >
            <Text className="text-text font-medium hover:underline mr-1">
              {selectedCurrency.symbol} {selectedCurrency.code}
            </Text>
            <ChevronUp size={16} color="#484848" />
          </TouchableOpacity>

          {/* Social Icons */}
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => handleLinkPress('https://facebook.com')} className="mr-4 hover:opacity-70">
              <Facebook size={20} color="#484848" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('https://twitter.com')} className="mr-4 hover:opacity-70">
              <Twitter size={20} color="#484848" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('https://instagram.com')} className="mr-4 hover:opacity-70">
              <Instagram size={20} color="#484848" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLinkPress('https://youtube.com')} className="hover:opacity-70">
              <Youtube size={20} color="#484848" />
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* Placeholder Modals for UI (Would use real generic Modals in full implementation) */}
      {showLanguageModal && (
        <View className="absolute bottom-16 right-20 bg-white p-4 rounded-lg shadow-lg border border-neutral/10 z-50">
          <Text className="font-bold mb-2">Select Language</Text>
          <TouchableOpacity onPress={() => { i18n.changeLanguage('en'); setShowLanguageModal(false); }}>
            <Text className="py-2">English</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { i18n.changeLanguage('fr'); setShowLanguageModal(false); }}>
            <Text className="py-2">Français</Text>
          </TouchableOpacity>
        </View>
      )}

      {showCurrencyDropdown && (
        <View className="absolute bottom-16 right-40 bg-white p-4 rounded-lg shadow-lg border border-neutral/10 z-50">
          <Text className="font-bold mb-2">Select Currency</Text>
          {currencies.map(c => (
            <TouchableOpacity 
              key={c.code}
              onPress={() => { setSelectedCurrency(c); setShowCurrencyDropdown(false); }}
            >
              <Text className="py-2">{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

    </View>
  );
};
