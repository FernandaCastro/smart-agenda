import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    PanResponder,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    StyleSheet,
} from 'react-native';

import {
    GestureHandlerRootView,
    GestureDetector,
    Gesture,
} from 'react-native-gesture-handler';
import IconButton from './IconButton';
import GroupedTasksView from './GroupedTasks';
import { Message } from '@/models/messageModel';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useMessageStore } from '@/stores/useMessageStore';
import { Task, TaskResponse, isTask, isTaskArray } from '@/models/taskModel';
import { analyse } from '@/services/taskService';
import { AppError } from '@/models/errorModel';

export default function CommandInputBar() {

    const [text, setText] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);

    const addMessage = useMessageStore((state) => state.addMessage);

    // Add command to the history, limited to 30 commands
    const addToHistory = (newCommand: string) => {
        setHistory(prev => {
            const updated = [...prev, newCommand];
            return updated.length > 30 ? updated.slice(updated.length - 30) : updated;
        });
    };

    const handleSend = () => {

        if (text.trim() === '' || text.length < 4) return;

        sendCommand(text);
        addToHistory(text);
        setHistoryIndex(null);
        setText('');
    };

    // navigate history list using the keybord (Web or iOS/Android with keybord)
    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === 'ArrowUp') {
            if (history.length > 0) {
                setHistoryIndex(prev => {
                    const newIndex = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
                    setText(history[newIndex]);
                    return newIndex;
                });
            }
        } else if (e.nativeEvent.key === 'ArrowDown') {
            if (history.length > 0 && historyIndex !== null) {
                setHistoryIndex(prev => {
                    const newIndex = Math.min(prev + 1, history.length - 1);
                    setText(history[newIndex] || '');
                    return newIndex;
                });
            }
        } else if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
            e.preventDefault?.(); // to web
            handleSend();
        }
    };

    //Swipe to mobile
    const panResponse = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) =>
                Math.abs(gestureState.dy) > 20 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
            onPanResponderEnd: (_, gestureState) => {
                if (gestureState.dy < -10) {
                    // Swipe up
                    if (history.length > 0) {
                        setHistoryIndex(prev => {
                            const newIndex = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
                            setText(history[newIndex]);
                            return newIndex;
                        });
                    }
                } else if (gestureState.dy > 10) {
                    // Swipe down
                    if (history.length > 0 && historyIndex !== null) {
                        setHistoryIndex(prev => {
                            const newIndex = Math.min(prev + 1, history.length - 1);
                            setText(history[newIndex] || '');
                            return newIndex;
                        });
                    }
                }
            },
        })
    ).current;

    const showPreviousCommand = () => {
        console.log("swipe up")

        // Swipe up
        if (history.length > 0) {
            setHistoryIndex(prev => {
                const newIndex = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
                setText(history[newIndex]);
                return newIndex;
            });
        }
    }

    const showNextCommand = () => {
        console.log("swipe down")
        // Swipe down
        if (history.length > 0 && historyIndex !== null) {
            setHistoryIndex(prev => {
                const newIndex = Math.min(prev + 1, history.length - 1);
                setText(history[newIndex] || '');
                return newIndex;
            });
        }
    }


    // gesture
    const swipeGesture = Gesture.Pan().onEnd((e) => {
        console.log("swipe gesture: " + e.translationY)

        if (Math.abs(e.translationY) > 5) {
            if (e.translationY < 0) {
                // swipe up
                showPreviousCommand();
            } else {
                // swipe down
                showNextCommand();
            }
        }
    });


    const extractReply = (taskResponse: TaskResponse) => {


        let content: string | JSX.Element = taskResponse.message;

        if (taskResponse.result) {
            const tasks = isTaskArray(taskResponse.result) ? (taskResponse.result as Task[]) : isTask(taskResponse.result) ? [taskResponse.result as Task] : [];
            content = <GroupedTasksView initialText={taskResponse.message} tasks={tasks} />;
        }

        const reply: Message = {
            id: uuidv4(),
            type: 'task',
            content: content
        };

        return reply;

    }


    const sendCommand = async (command?: string) => {
        if (!command || command.length < 4) return;

        const id = uuidv4();

        const userMessage: Message = {
            id: id,
            type: 'user',
            content: command,
        };
        addMessage(userMessage);

        // Add temporary loading bubble
        const loadingId = uuidv4();
        addMessage({
            id: loadingId,
            type: 'system',
            content: '⏳ Analysing...',
        });

        try {
            const response: TaskResponse = await analyse(command);
            const reply: Message = extractReply(response);
            addMessage(reply);

        } catch (e: any) {
            console.log(e);

            const details: string = e.details && typeof e.details === 'string' ? e.details :
                e.details && typeof e.details === 'object' ? (e.details as AppError).message
                : undefined;

            addMessage({
                id: uuidv4(),
                type: 'error',
                content: !e.details ? `${e.message}` : `${e.message}\n\n`.concat(details)
            });
        }
    };

    return (
        // <View style={styles.container} {...(Platform.OS !== 'web' ? panResponse.panHandlers : {})}>
        <GestureHandlerRootView style={{ width: '100%' }}>
            <GestureDetector gesture={swipeGesture}>
                <View style={styles.container}>

                    <TextInput style={styles.input}
                        placeholder="Enter your task..."
                        placeholderTextColor='#ccc'
                        value={text}
                        onChangeText={setText}
                        onKeyPress={handleKeyPress}
                        multiline={false}
                        onSubmitEditing={handleSend}
                    />
                    <IconButton icon={"send"} onPress={handleSend} />
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#25292e',
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        color: '#ccc',
        marginRight: 8,
    },
});
