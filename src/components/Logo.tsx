import React from 'react';
import { View, ViewStyle, Image } from 'react-native';

type LogoProps = {
  size?: number;
  showBackground?: boolean;
  style?: ViewStyle;
};

export default function Logo({ size = 120, style }: LogoProps) {
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Image
        source={require('../../assets/logo-original.png')}
        style={{ width: size, height: size, borderRadius: size * 0.16 }}
        resizeMode="cover"
      />
    </View>
  );
}
