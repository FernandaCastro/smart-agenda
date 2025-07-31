import { getStatusIcon } from "@/models/constants";
import { Task } from "@/models/taskModel";
import { groupTasksByDate } from "@/utils/taskUtils";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import MiniButton from "./MiniButton";
import { useState } from "react";
import Markdown from 'react-native-markdown-display';
import dayjs from "dayjs";

type PropsTableDetails = {
  task: Task;
  show: string;
};

type PropsTable = {
  groupKey: string,
  tasks: Task[];
};

type GroupedTasksViewProps = {
  initialText?: string,
  tasks: Task[];
};

function TaskDetails({ task, show }: PropsTableDetails) {
  if (show === '0' || show !== task.taskId) return;

  return (
    <View style={stylesTable.tableDetails}>
      <View style={stylesTable.rowDetails}>
        <Text style={stylesTable.headerDetails}>Notes: </Text>
        <Markdown style={{ body: { color: '#333', fontSize: 13, marginTop: 0, paddingTop: 0, }, paragraph: { marginTop: 0 } }} >
          {task.notes ? task.notes : ''}
        </Markdown>
      </View>
    </View>
  )

}

function TaskTable({ groupKey, tasks }: PropsTable) {

  const [showDetail, setShowDetail] = useState('0');

  return (
    <View key={groupKey} style={stylesTable.table}>
      <View style={stylesTable.headerRow}>
        <Text style={[stylesTable.cellGroupData, stylesTable.header]}>{groupKey}</Text>
        <Text style={[stylesTable.cellTime, stylesTable.header]}></Text>
        <Text style={[stylesTable.cellId, stylesTable.header]}></Text>
        <Text style={[stylesTable.cellDescription, stylesTable.header]}></Text>
      </View>

      {tasks.map((task) => (
        <View key={task.taskId}>
          <View style={stylesTable.row}>
            <MiniButton icon="more-vert" onPress={() => showDetail !== task.taskId ? setShowDetail(task.taskId) : setShowDetail('0')} />
            <Text style={stylesTable.cellStatus}>{getStatusIcon(task.status)}</Text>
            <Text style={stylesTable.cellTime}>{dayjs(task.datetime).format('HH:mm') ?? '—'}</Text>
            <Text style={stylesTable.cellId}>{task.taskId}</Text>
            <Text style={stylesTable.cellDescription} numberOfLines={2} ellipsizeMode="tail">{task.description}</Text>
          </View>
          {<TaskDetails show={showDetail} task={task} />}
        </View>
      ))}
    </View>
  )
}

export default function GroupedTasksView({ initialText, tasks }: GroupedTasksViewProps) {

  const grouped = groupTasksByDate(tasks);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <View style={styles.container}>
      {sortedDates.map((date) => (
        <View key={"main-" + date}>
          <Text style={styles.initialText}>{initialText}</Text>
          <TaskTable groupKey={date} tasks={grouped[date]} />
        </View>
      ))}
    </View>
  );
}

const stylesTable = StyleSheet.create({
  table: {
    paddingRight: 12,
    paddingBottom: 10,
    overflow: 'hidden',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    borderColor: '#ddd',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
  },
  cellGroupData: {
    minWidth: 80,
    fontSize: 15,
    color: '#54B7AC', //'#333',
    // backgroundColor: '#fffa92',
  },
  cellId: {
    paddingTop: 5,
    minWidth: 60,
    fontSize: 14,
    color: '#333',
  },
  cellStatus: {
    paddingTop: 5,
    marginLeft: 25,
    marginRight: 5,
    minWidth: 30,
    fontSize: 14,
    color: '#333',
  },
  cellTime: {
    paddingTop: 5,
    marginLeft: 6,
    minWidth: 50,
    fontSize: 14,
    color: '#333',
  },
  cellDescription: {
    paddingTop: 5,
    alignContent: "flex-end",
    minWidth: 80,
    fontSize: 14,
    color: '#333',
    flex: Platform.OS != 'web' ? 6 : undefined
  },
  tableDetails: {
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowDetails: {
    flexDirection: 'row',
    borderColor: '#ddd',
    alignItems: "flex-start",
    paddingTop: 5
  },
  headerDetails: {
    fontWeight: 'bold',
    paddingRight: 5,
  },
  cellDetails: {
    flexShrink: 0,
    fontSize: 14,
    color: '#333',
    flex: 1
  },
  markdown: {
    fontSize: 14,
    color: '#333',
  }
});

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  initialText: {
    fontSize: 16,
    marginBottom: 0,
    paddingBottom: 0
  }

});

