import TaskView from "@/components/TaskView";
import { StyleSheet, Text, View } from "react-native";
import { useTaskResponseStore } from "@/stores/useTaskStore";
import TaskViewList from "@/components/TaskViewList";

export default function Result() {

    const taskResponse = useTaskResponseStore((state) => state.taskResponse);

    if (!taskResponse || !taskResponse.tasks) {
        return (
            <View style={styles.container}>
                <Text>No tasks found!</Text>
            </View>
        )
    }

    if (taskResponse.tasks.length == 1) {
        return (
            <View style={styles.container}>
                <TaskView action={taskResponse.intention} task={taskResponse.tasks[0]} />
            </View>
        )
    }

    if (taskResponse.tasks.length > 1) {
        return (
            <View style={styles.container}>
                <TaskViewList tasks={taskResponse.tasks} />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
})