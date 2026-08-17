"use client";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { ShieldCheck, Smartphone, KeyRound, QrCode, LogOut, CheckCircle, Copy } from 'lucide-react-native';

export interface Session {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  token?: string; // used for deleting
}

export interface SecurityCheckupDashboardProps {
  sessions: Session[];
  is2FAEnabled: boolean;
  onTerminateSession: (token: string) => Promise<void>;
  onSetup2FA: () => Promise<{ secret: string; qrCodeUrl: string }>;
  onVerify2FA: (token: string) => Promise<{ success: boolean; backupCodes?: string[] }>;
  onChangePassword: (current: string, newPass: string) => Promise<void>;
}

export const SecurityCheckupDashboard = ({
  sessions,
  is2FAEnabled,
  onTerminateSession,
  onSetup2FA,
  onVerify2FA,
  onChangePassword
}: SecurityCheckupDashboardProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [setupStep, setSetupStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetupInit = async () => {
    setIsLoading(true);
    setShow2FAModal(true);
    try {
      const data = await onSetup2FA();
      setQrCodeDataUrl(data.qrCodeUrl);
      setSecretKey(data.secret);
      setSetupStep(1);
    } catch (e) {
      console.error(e);
      setShow2FAModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await onVerify2FA(totpToken);
      if (res.success && res.backupCodes) {
        setBackupCodes(res.backupCodes);
        setSetupStep(2); // Show backup codes
      }
    } catch (e) {
      console.error('Invalid token');
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = newPassword.length === 0 ? 0 : Math.min(100, newPassword.length * 10);
  const getStrengthColor = (strength: number) => {
    if (strength === 0) return '#E5E5E5';
    if (strength < 40) return '#EF4444';
    if (strength < 70) return '#F59E0B';
    return '#10B981';
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900" contentContainerStyle={{ padding: 24 }}>
      <View className="flex-row items-center mb-6">
        <ShieldCheck size={28} color="#FF385C" className="mr-3" />
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">Security Center</Text>
      </View>

      {/* Password Change Section */}
      <View className="mb-8 p-5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
        <View className="flex-row items-center mb-4">
          <KeyRound size={20} color="#222222" className="mr-2" />
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white">Password Settings</Text>
        </View>
        <TextInput 
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          className="bg-white dark:bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-3 text-neutral-900 dark:text-white"
        />
        <TextInput 
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          className="bg-white dark:bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 mb-2 text-neutral-900 dark:text-white"
        />
        {/* Strength Meter */}
        <View className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full mb-4 overflow-hidden">
          <View 
            className="h-full rounded-full transition-all duration-300" 
            style={{ width: `${passwordStrength}%`, backgroundColor: getStrengthColor(passwordStrength) }}
          />
        </View>
        
        <TouchableOpacity 
          className="bg-[#222222] py-3 rounded-xl items-center"
          onPress={() => onChangePassword(currentPassword, newPassword)}
        >
          <Text className="text-white font-bold">Update Password</Text>
        </TouchableOpacity>
      </View>

      {/* 2FA Section */}
      <View className="mb-8 p-5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-neutral-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <QrCode size={24} color="#10B981" className="mr-3" />
            <View>
              <Text className="text-base font-bold text-neutral-900 dark:text-white">Two-Factor Authentication</Text>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {is2FAEnabled ? 'Your account is highly secure.' : 'Add an extra layer of security.'}
              </Text>
            </View>
          </View>
          {!is2FAEnabled && (
            <TouchableOpacity 
              onPress={handleSetupInit}
              className="bg-[#10B981] px-4 py-2 rounded-full"
            >
              <Text className="text-white font-bold text-sm">Enable</Text>
            </TouchableOpacity>
          )}
          {is2FAEnabled && (
            <View className="flex-row items-center bg-[#10B981]/10 px-3 py-1.5 rounded-full">
              <CheckCircle size={16} color="#10B981" className="mr-1" />
              <Text className="text-[#10B981] font-bold text-sm">Active</Text>
            </View>
          )}
        </View>
      </View>

      {/* Active Sessions */}
      <View className="mb-8">
        <View className="flex-row items-center mb-4">
          <Smartphone size={20} color="#222222" className="mr-2" />
          <Text className="text-lg font-semibold text-neutral-900 dark:text-white">Active Sessions</Text>
        </View>
        
        <View className="space-y-3">
          {sessions.map((session, index) => (
            <View key={session.id} className="flex-row items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl">
              <View className="flex-1 mr-4">
                <Text className="text-base font-semibold text-neutral-900 dark:text-white">
                  {session.device} {index === 0 && <Text className="text-[#10B981] text-xs font-bold">(Current)</Text>}
                </Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  {session.ip} • Last active {new Date(session.lastActive).toLocaleDateString()}
                </Text>
              </View>
              {index !== 0 && session.token && (
                <TouchableOpacity 
                  onPress={() => onTerminateSession(session.token!)}
                  className="p-2 bg-red-100 dark:bg-red-500/10 rounded-full"
                >
                  <LogOut size={18} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 2FA Setup Modal */}
      <Modal visible={show2FAModal} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl p-6 relative">
            <TouchableOpacity 
              className="absolute top-4 right-4 z-10" 
              onPress={() => setShow2FAModal(false)}
            >
              <Text className="text-2xl text-neutral-500">×</Text>
            </TouchableOpacity>

            {isLoading && setupStep === 1 && <ActivityIndicator size="large" color="#FF385C" className="my-8" />}
            
            {!isLoading && setupStep === 1 && (
              <View className="items-center">
                <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Setup Authenticator</Text>
                <Text className="text-sm text-neutral-500 text-center mb-6">
                  Scan this QR code with Google Authenticator or Authy.
                </Text>
                
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-48 h-48 mb-4" />
                ) : null}

                <Text className="text-xs text-neutral-400 mb-6 font-mono text-center">{secretKey}</Text>

                <TextInput 
                  placeholder="6-Digit Token"
                  value={totpToken}
                  onChangeText={setTotpToken}
                  keyboardType="number-pad"
                  maxLength={6}
                  className="w-full bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl text-center text-lg tracking-widest font-bold mb-4 text-neutral-900 dark:text-white"
                />

                <TouchableOpacity 
                  className={`w-full py-3 rounded-xl items-center ${totpToken.length === 6 ? 'bg-[#FF385C]' : 'bg-neutral-300'}`}
                  onPress={handleVerify}
                  disabled={totpToken.length !== 6}
                >
                  <Text className="text-white font-bold">Verify & Enable</Text>
                </TouchableOpacity>
              </View>
            )}

            {!isLoading && setupStep === 2 && (
              <View className="items-center">
                <View className="w-16 h-16 rounded-full bg-[#10B981]/20 items-center justify-center mb-4">
                  <CheckCircle size={32} color="#10B981" />
                </View>
                <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-2">2FA Enabled!</Text>
                <Text className="text-sm text-neutral-500 text-center mb-6">
                  Save these backup codes in a secure place. You can use them to sign in if you lose your device.
                </Text>
                
                <View className="w-full bg-neutral-100 dark:bg-neutral-800 p-4 rounded-xl mb-6">
                  <View className="flex-row flex-wrap justify-between">
                    {backupCodes.map((code, idx) => (
                      <Text key={idx} className="w-1/2 font-mono text-base font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                        {code}
                      </Text>
                    ))}
                  </View>
                </View>

                <TouchableOpacity 
                  className="w-full py-3 bg-[#222222] rounded-xl items-center"
                  onPress={() => setShow2FAModal(false)}
                >
                  <Text className="text-white font-bold">I've Saved Them</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
