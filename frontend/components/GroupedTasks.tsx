import { getStatusIcon } from "@/models/constants";
import { Task } from "@/models/taskModel";
import { groupTasksByDate } from "@/utils/taskUtils";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import MiniButton from "./MiniButton";
import { useState } from "react";
import Markdown from 'react-native-markdown-display';

type PropsTableDetails = {
  task: Task;
  show: number;
};

type PropsTable = {
  tasks: Task[];
};

type GroupedTasksViewProps = {
  innitialText?: string,
  tasks: Task[];
};

function TaskDetails({ task, show }: PropsTableDetails) {
 if (show === 0 || show != task.id) return;
  const markdownText = `#### jgvhgvhv 
  hgvh jhgkgvkyf jhvjvg jhbyvyvyfcyfcycy
  ihbuybubububjhkjfhcjf jgvhgvhv hgvh jhgkgvkyf jhvjvgv
  jhbyvyvyfcyfcycyihbuybububub
  jhkjfhcjfc
  * jgvhgvhv 
  * hgvh 
  * jhgkgvkyf 
  * jhvjvgv
  
  **jhbyvyvyfcyfcycy**
  ihbuybububub
  jhkjfhcjfc
  jgvhgvhv hgvh jhgkgvkyf jhvjvgv`;

  return (
    <View style={stylesTable.tableDetails}>
      <View style={stylesTable.rowDetails}>
        <Text style={stylesTable.headerDetails}>Notes: </Text>
        <Markdown style={{body: {color: '#333', fontSize: 13, marginTop: 0, paddingTop: 0,}, paragraph: { marginTop: 0}}} >
          {task.notes}
        </Markdown>
      </View>
    </View>
  )

}

function TaskTable({ tasks }: PropsTable) {

  const [showDetail, setShowDetail] = useState(0);

  return (
    <View style={stylesTable.table}>
      <View style={stylesTable.headerRow}>
        <Text style={[stylesTable.cellStatus, stylesTable.header]} />
        <Text style={[stylesTable.cellStatus, stylesTable.header]} />
        <Text style={[stylesTable.cellTime, stylesTable.header]}>Time</Text>
        <Text style={[stylesTable.cellId, stylesTable.header]}>#</Text>
        <Text style={[stylesTable.cellDescription, stylesTable.header]}>Description</Text>
      </View>

      {tasks.map((task) => (
        <>
          <View key={task.id} style={stylesTable.row}>
            <MiniButton icon="more-vert" onPress={() => !showDetail ? setShowDetail(task.id) : setShowDetail(0)} />
            <Text style={stylesTable.cellStatus}>{getStatusIcon(task.status)}</Text>
            <Text style={stylesTable.cellTime}>{task.time ?? '—'}</Text>
            <Text style={stylesTable.cellId}>{task.id}</Text>
            <Text style={stylesTable.cellDescription} numberOfLines={2} ellipsizeMode="tail">{task.description}</Text>
          </View>
          {<TaskDetails show={showDetail} task={task} />}
        </>
      ))}
    </View>
  )
}

export default function GroupedTasksView({ tasks }: GroupedTasksViewProps) {

  const grouped = groupTasksByDate(tasks);
  const sortedDates = Object.keys(grouped).sort();

  return (
    <View style={styles.container}>
      {sortedDates.map((date) => (
        <View key={date}>
          <Text style={styles.dateTitle}>{date}</Text>
          <TaskTable tasks={grouped[date]} />
        </View>
      ))}
    </View>
  );
}

const stylesTable = StyleSheet.create({
  table: {
    paddingRight: 12,
    overflow: 'hidden',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderColor: '#ddd',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
  },
  cellId: {
    padding: 5,
    width: 30,
    fontSize: 14,
    color: '#333',
  },
  cellStatus: {
    padding: 10,
    width: 40,
    fontSize: 16,
    color: '#333',
  },
  cellTime: {
    padding: 10,
    width: 60,
    fontSize: 14,
    color: '#333',
  },
  cellDescription: {
    padding: 0,
    minWidth: 80,
    fontSize: 14,
    color: '#333',
    flex: Platform.OS != 'web' ? 6 : undefined
  },
  tableDetails: {
    paddingLeft: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowDetails: {
    flexDirection: 'row',
    borderColor: '#ddd',
    alignItems: "flex-start",
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
    paddingBottom: 24,
  },
  dateTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 26,
    marginBottom: 4,
  },
});

