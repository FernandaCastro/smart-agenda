import { create } from 'zustand';
import { Message } from '@/models/messageModel';

type MessageState = {
    messages: Message[];
    addMessage: (msg: Message) => void;
    updateMessage: (id: string, newContent: string, newType?: Message['type']) => void;
};

export const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    addMessage: (msg) =>
        set((state) => ({
            messages: [...state.messages, msg],
        })),
    updateMessage: (id, newContent, newType) =>
        set((state) => ({
            messages: state.messages.map((m) =>
                m.id === id ? { ...m, content: newContent, type: newType || m.type } : m
            ),
        })),
}));

