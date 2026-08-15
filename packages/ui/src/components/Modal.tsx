"use client";
import React from 'react';
import { Modal as RNModal, View, TouchableOpacity, Text } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal = ({ visible, onClose, title, children }: ModalProps) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        {/* Glassmorphism backdrop */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          activeOpacity={1}
          onPress={onClose}
        />
        
        {/* Modal content */}
        <View className="bg-white rounded-t-[24px] min-h-[40%] p-6 shadow-stay-card">
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-neutral-300 rounded-full" />
          </View>
          
          {title && (
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-neutral-100">
              <Text className="text-xl font-bold text-neutralDark">{title}</Text>
              <TouchableOpacity onPress={onClose} className="p-2">
                <Text className="text-neutral-500 font-bold">✕</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View className="flex-1">
            {children}
          </View>
        </View>
      </View>
    </RNModal>
  );
};
