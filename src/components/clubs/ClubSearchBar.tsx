import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  inputRef?: React.RefObject<TextInput | null>;
}

export default function ClubSearchBar({ value, onChangeText, onClear, inputRef }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={18}
        color={value.length > 0 ? '#7B61FF' : '#9ca3af'}
        style={styles.icon}
      />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="חפש מועדון..."
        placeholderTextColor="#4b5563"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={Keyboard.dismiss}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={20} color="#6b7280" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161622',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#2A2A3C',
    paddingHorizontal: 14,
    paddingVertical: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    padding: 0,
    textAlign: 'right',
  },
  clear: { padding: 3, marginLeft: 6 },
});
