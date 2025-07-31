import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ChatMessage from '@/components/ChatMessage';
import { useMessageStore } from '@/stores/useMessageStore';
import CommandInputBar from '@/components/CommandInputBar';

export default function MainScreen() {
  const messages = useMessageStore((state) => state.messages);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      keyboardVerticalOffset={90}
      behavior={Platform.select({ ios: 'padding', android: 'padding' })}
    >
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      </View>
      <CommandInputBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,},
});
