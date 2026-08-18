"use client";
import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';

const footerData = [
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Safety Information', href: '/safety' },
      { label: 'Cancellation Options', href: '/cancellations' },
      { label: 'Disability & Accessibility Support', href: '/accessibility' },
      { label: 'Neighborhood Concern Reporting', href: '/report-concern' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Disaster Relief Housing', href: '/relief-housing' },
      { label: 'Combating Discrimination & Equity Policy', href: '/equity' },
      { label: 'Experience Host Hub', href: '/experience-host' },
    ],
  },
  {
    title: 'Hosting',
    links: [
      { label: 'Try Hosting', href: '/host' },
      { label: 'AirCover for Hosts', href: '/host-protection' },
      { label: 'Hosting Resources & Guidelines', href: '/hosting-resources' },
      { label: 'Community Forum', href: '/forum' },
      { label: 'Responsible Hosting Guide', href: '/responsible-hosting' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Newsroom', href: '/newsroom' },
      { label: 'New Platform Releases', href: '/releases' },
      { label: 'Founders\' Letter', href: '/founders-letter' },
      { label: 'Careers', href: '/careers' },
      { label: 'Investors', href: '/investors' },
      { label: 'Travel Admin Portal', href: '/corporate-admin' },
    ],
  },
];

export const UniversalFooter = () => {
  const handleLinkPress = (href: string) => {
    if (Platform.OS === 'web') {
      window.location.href = href;
    } else {
      Linking.openURL(href);
    }
  };

  return (
    <View className="w-full bg-neutralLight py-12 px-6 md:px-12 lg:px-20 border-t border-neutral/20">
      <View className="max-w-7xl mx-auto w-full flex-col md:flex-row flex-wrap justify-between">
        {footerData.map((column, index) => (
          <View key={index} className="w-full md:w-1/2 lg:w-1/4 mb-8 lg:mb-0 pr-4">
            <Text className="font-semibold text-lg mb-4 text-textDark">
              {column.title}
            </Text>
            {column.links.map((link, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleLinkPress(link.href)}
                className="mb-3"
              >
                <Text className="text-text hover:text-textDark hover:underline transition-colors duration-200">
                  {link.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};
