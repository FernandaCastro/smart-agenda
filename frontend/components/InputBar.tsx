import React, { useState } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData, Platform } from 'react-native';
import { useMessageStore } from '@/stores/useMessageStore';
import { Message } from '@/models/messageModel';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { TaskResponse } from '@/models/taskModel';
import { translateTextToTask } from '@/services/taskService';
import IconButton from './IconButton';
import GroupedTasksView from './GroupedTasks';

export default function InputBar() {
    const [text, setText] = useState('');
    const addMessage = useMessageStore((state) => state.addMessage);

    const extractReply = (taskResponse: TaskResponse) => {

        if (!taskResponse || !taskResponse.tasks) {
            throw { message: 'No task found!' }
        }

        let intentionMessage = '';
        switch (taskResponse.intention) {
            case 'create':
                intentionMessage = 'Task created!\n\n'
                break;

            case 'update':
                intentionMessage = 'Task updated!\n\n'
                break;

            case 'retrieve':
                intentionMessage = '📋 Tasks:\n\n'
                break;

            default:
                break;
        }


        if (taskResponse.tasks.length > 0) {

            const tasksView = <GroupedTasksView innitialText={intentionMessage} tasks={taskResponse.tasks} />;
            const reply: Message = {
                id: uuidv4(),
                type: 'task',
                content: tasksView
            };

            return reply;
        }

        throw { message: 'Unexpected error occured!' }

    }

    const handleSend = async () => {
        if (!text.trim()) return;

        const id = uuidv4();

        const userMessage: Message = {
            id: id,
            type: 'user',
            content: text,
        };
        addMessage(userMessage);

        // Add temporary loading bubble
        const loadingId = uuidv4();
        addMessage({
            id: loadingId,
            type: 'system',
            content: '⏳ Thinking...',
        });

        setText('');

        try {
            const response: TaskResponse = await translateTextToTask(text);
            const reply: Message = extractReply(response);
            addMessage(reply);

        } catch (e: any) {
            console.log(e);
            addMessage({
                id: uuidv4(),
                type: 'error',
                content: `${e.message}`,
            });
        }
    };

    const handleKEnterPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>
    ) => {
        if (e.nativeEvent.key === 'Enter') {
            if (Platform.OS !== 'ios') {
                e.preventDefault?.();
                handleSend?.();
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Enter your task..."
                placeholderTextColor='#ccc'
                value={text}
                onChangeText={setText}
                style={styles.input}
                multiline
                onKeyPress={handleKEnterPress}
            />
            <IconButton icon={"send"} onPress={handleSend} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        backgroundColor: '#25292e',
    },
    input: {
        flex: 1,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        color: '#ccc'
    },
});
