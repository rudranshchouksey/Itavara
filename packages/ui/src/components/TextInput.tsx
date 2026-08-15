"use client";
import React, { useState } from 'react';
import { View, TextInput as RNTextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';

interface FloatingTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  onClear?: () => void;
}

export const TextInput = ({ label, error, value, onChangeText, onClear, className = '', ...props }: FloatingTextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);

  return (
    <View className={`w-full ${className}`}>
      <View className={`relative border rounded-card px-4 pt-5 pb-2 transition-colors ${error ? 'border-brandDark' : isFocused ? 'border-brand' : 'border-neutral-300'}`}>
        <Text
          className={`absolute left-4 transition-all duration-200 ${
            isFloating ? 'top-2 text-xs text-neutral-500' : 'top-4 text-base text-neutral-400'
          }`}
        >
          {label}
        </Text>
        
        <View className="flex-row items-center justify-between">
          <RNTextInput
            className="flex-1 text-base text-neutralDark p-0 m-0"
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {value && value.length > 0 && onClear && (
            <TouchableOpacity onPress={onClear} className="ml-2 bg-neutral-200 rounded-full p-1 h-5 w-5 items-center justify-center">
              <Text className="text-neutral-500 text-[10px] leading-tight font-bold">✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {error && <Text className="text-brandDark text-sm mt-1 ml-1">{error}</Text>}
    </View>
  );
};
