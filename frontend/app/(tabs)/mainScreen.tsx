import React, { useEffect, useRef } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ChatMessage from '@/components/ChatMessage';
import InputBar from '@/components/InputBar';
import { useMessageStore } from '@/stores/useMessageStore';

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
      style={styles.container}
      keyboardVerticalOffset={80}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatMessage message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <InputBar />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
});
