import { Text, View, StyleSheet, Platform } from 'react-native';
import { Message } from '@/models/messageModel';

export default function ChatMessage({ message }: { message: Message }) {

  return (
    <View style={[styles.message, styles[message.type]]}>
      {typeof message.content === 'string' ? (
        <Text style={{ fontFamily: 'monospace', fontSize: message.type == 'system' ? 10 : 13 }}>
          {message.content}
        </Text>
      ) : (
        <View style={styles.embedded}>
          {message.content}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 20,
    maxWidth: '98%',
    alignSelf: 'flex-start',
  },
  embedded: {
    flexShrink: 1,
    minWidth: '100%',
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
