import { Task } from "@/models/taskModel";
import TaskView from "./TaskView";
import { FlatList, Platform, SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
    tasks: Task[];
};

export default function TaskViewList({ tasks }: Props) {

    const grouped = tasks.reduce((acc: Record<string, Task[]>, task) => {
        if (!acc[task.date]) acc[task.date] = [];
        acc[task.date].push(task);
        return acc;
    }, {});

    const dates = Object.keys(grouped).sort();

    //Sort by time into each data group
    for (const date of dates) {
        grouped[date].sort((a, b) => (a.time || '').localeCompare(b.time || ''));
      }

    return (
        <FlatList
            data={dates}
            keyExtractor={(date) => date}
            renderItem={({ item: date }) => (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{date}</Text>
                    {grouped[date].map((task) => (
                       <TaskView key={task.id} task={task}/>
                    ))}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 16,
        paddingHorizontal: 12,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
        color: '#43ccbc'
    },
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 10,
        marginBottom: 4,
    },
    description: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    detail: {
        fontSize: 14,
        color: '#555',
        marginRight: 8,
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    action: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    // Status by color
    pending: {
        borderLeftColor: '#f39c12',
        borderLeftWidth: 4,
    },
    resolved: {
        borderLeftColor: '#27ae60',
        borderLeftWidth: 4,
    },
    cancelled: {
        borderLeftColor: '#e74c3c',
        borderLeftWidth: 4,
    },
});



