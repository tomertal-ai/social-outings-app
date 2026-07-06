import { View, Text, Image, StyleSheet } from 'react-native';
import { Experience } from '../../types';
import { getExperienceLogo, getExperienceInitials } from '../../data/experiences';

interface Props {
  club: Experience;
  size: number;
}

export default function ClubAvatar({ club, size }: Props) {
  const logo = getExperienceLogo(club);
  const radius = size / 2;

  if (logo) {
    return (
      <View style={[styles.wrap, { width: size, height: size, borderRadius: radius, backgroundColor: club.color + '20', borderColor: club.color + '50' }]}>
        <Image source={logo} style={{ width: size, height: size, borderRadius: radius }} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, { width: size, height: size, borderRadius: radius, backgroundColor: club.color, borderColor: club.color + '80' }]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{getExperienceInitials(club)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '800',
    color: '#fff',
  },
});
