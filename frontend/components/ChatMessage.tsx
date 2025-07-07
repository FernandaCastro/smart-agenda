import { Text, View, StyleSheet } from 'react-native';
import { Message } from '@/models/messageModel';

export default function ChatMessage({ message }: { message: Message }) {
  return (
    <View style={[styles.message, styles[message.type]]}>
      <Text style={{ fontFamily: 'monospace', fontSize: message.type == 'system' ? 10 : 13 }}>{message.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
    maxWidth: '95%',
  },
  user: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  system: {
    backgroundColor: '#E6E6E6',
    alignSelf: 'flex-start',
  },
  task: {
    backgroundColor: '#FFF9C4',
    alignSelf: 'flex-start',
  },
  error: {
    backgroundColor: '#F8D7DA',
    alignSelf: 'flex-start',
  },
});
