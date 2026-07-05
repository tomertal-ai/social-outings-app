import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Club } from '../../types';
import ClubAvatar from './ClubAvatar';

interface Props {
  club: Club;
  selected: boolean;
  onPress: () => void;
  onDetails?: () => void;
}

export default function ClubCard({ club, selected, onPress, onDetails }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && { borderColor: club.color, backgroundColor: club.color + '12' },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ClubAvatar club={club} size={52} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{club.name}</Text>
        <Text style={styles.city}>{club.city}</Text>
        <View style={styles.meta}>
          <Text style={[styles.rating, { color: club.color }]}>★ {club.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.price}>{club.priceRange}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDetails ?? onPress} hitSlop={8} activeOpacity={0.7}>
        <Ionicons name="chevron-back" size={18} color="#6b7280" style={styles.arrow} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: 260,
    backgroundColor: '#161622',
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 3 },
  city: { fontSize: 12, color: '#9ca3af', marginBottom: 6 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rating: { fontSize: 12, fontWeight: '700' },
  dot: { fontSize: 12, color: '#6b7280' },
  price: { fontSize: 12, color: '#d1d5db', fontWeight: '600' },
  arrow: { marginLeft: 4 },
});
