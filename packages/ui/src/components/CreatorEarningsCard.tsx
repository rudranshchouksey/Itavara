import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Wallet, TrendingUp, ArrowRight } from 'lucide-react-native';

export interface CreatorEarningsCardProps {
  totalReferrals: number;
  walletBalance: number;
  onRequestPayout: () => void;
  currency?: string;
}

export const CreatorEarningsCard: React.FC<CreatorEarningsCardProps> = ({
  totalReferrals,
  walletBalance,
  onRequestPayout,
  currency = '₹',
}) => {
  return (
    <View style={styles.card} className="rounded-3xl p-5 shadow-lg border border-neutral-800">
      <View className="flex-row justify-between items-start mb-6">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3">
            <Wallet size={20} color="#FF385C" />
          </View>
          <View>
            <Text className="text-neutral-400 text-xs font-semibold tracking-wider uppercase mb-1">
              Available Balance
            </Text>
            <Text className="text-white text-3xl font-bold tracking-tight">
              {currency}{walletBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center bg-neutral-800/50 rounded-2xl p-4 mb-6">
        <View className="w-8 h-8 rounded-full bg-emerald-500/10 items-center justify-center mr-3">
          <TrendingUp size={16} color="#10B981" />
        </View>
        <View className="flex-1">
          <Text className="text-neutral-300 text-sm font-medium">Total Referrals</Text>
          <Text className="text-emerald-400 text-xs mt-0.5">Keep sharing your itineraries!</Text>
        </View>
        <Text className="text-white text-xl font-bold">{totalReferrals}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onRequestPayout}
        className="bg-[#FF385C] rounded-full py-4 flex-row justify-center items-center"
      >
        <Text className="text-white font-bold text-base mr-2">Request Payout</Text>
        <ArrowRight size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1E', // Apple dark mode elevated surface
  },
});
