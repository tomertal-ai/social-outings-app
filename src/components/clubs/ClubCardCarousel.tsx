import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Club } from '../../types';
import ClubCard from './ClubCard';

interface Props {
  clubs: Club[];
  selectedClubId?: number;
  onSelectClub: (club: Club) => void;
  onDetailsClub?: (club: Club) => void;
}

export default function ClubCardCarousel({ clubs, selectedClubId, onSelectClub, onDetailsClub }: Props) {
  if (clubs.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="search-outline" size={28} color="#4b5563" />
        <Text style={styles.emptyText}>לא נמצאו מועדונים</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {clubs.map(club => (
        <ClubCard
          key={club.id}
          club={club}
          selected={selectedClubId === club.id}
          onPress={() => onSelectClub(club)}
          onDetails={onDetailsClub ? () => onDetailsClub(club) : undefined}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 16, gap: 10, flexDirection: 'row' },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  emptyText: { fontSize: 14, color: '#4b5563', fontWeight: '600' },
});
