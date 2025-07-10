import { Task } from "@/models/taskModel";
import { MaterialIcons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, Text, TextStyle, View } from "react-native"

type Props = {
    action?: string;
    task: Task;
};

export default function TaskView({ action, task }: Props) {

    const Data = ({ labelStyle, icon, label }: { labelStyle: StyleProp<TextStyle>, icon: string; label: string }) => (
        <View style={styles.row}>
            <MaterialIcons name={icon} size={20} color="#333" />
            <Text style={labelStyle}>{label}</Text>
        </View>
    );

    const Status = ({ task }: { task: Task }) => (

        <View style={styles.row}>
            <MaterialIcons
                name={getStatusIcon(task.status)}
                size={20}
                color={getStatusColor(task.status)} />
            <Text style={{ color: getStatusColor(task.status) }}>{task.status}</Text>
        </View>
    );

    const getStatusColor = (status: 'pending' | 'resolved' | 'cancelled'): string => {
        switch (status) {
            case 'pending':
                return '#f39c12';
            case 'resolved':
                return '#27ae60';
            case 'cancelled':
                return '#e74c3c';
            default:
                return '#333';
        }
    };

    const getStatusIcon = (status: 'pending' | 'resolved' | 'cancelled'): string => {
        switch (status) {
            case 'pending':
                return 'hourglass-empty';
            case 'resolved':
                return 'check-circle';
            case 'cancelled':
                return 'cancel';
            default:
                return 'question';
        }
    };
    const taskName = task.id + ' : ' + task.description;

    return (
        <View key={task.id} style={[styles.card, styles[task.status]]}>

            <Data icon="assignment" labelStyle={styles.title} label={task.description} />

            <View style={styles.row}>
                {task.date && <Data icon="calendar-today" labelStyle={styles.detail} label={task.date} />}
                {task.time && <Data icon="schedule" labelStyle={styles.detail} label={task.time} />}
            </View>

            <View style={styles.row}>
                {task.notes && <Data icon="co-present" labelStyle={styles.detail} label={task.notes} />}
            </View>

            <Status task={task} />

        </View>
    )

}

const styles = StyleSheet.create({

    erro: { color: 'red', marginTop: 10 },

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
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 4,
    },
    detail: {
        fontSize: 14,
        color: '#555',
        marginRight: 8,
    },
    action: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    // Status by color
    pending: {
        borderLeftColor: '#f39c12',
        borderLeftWidth: 8,
        color: '#f39c12'
    },
    resolved: {
        borderLeftColor: '#27ae60',
        borderLeftWidth: 8,
    },
    cancelled: {
        borderLeftColor: '#e74c3c',
        borderLeftWidth: 8,
    },
})

