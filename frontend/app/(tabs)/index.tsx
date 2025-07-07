import { translateTextToTask } from "@/services/taskService";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { TaskResponse } from '@/models/taskModel';
import IconButton from "@/components/IconButton";
import { useRouter } from "expo-router";
import { useTaskResponseStore } from '@/stores/useTaskStore';
import TextArea from "@/components/TextArea";

export default function Index() {

  const router = useRouter();
  const { setTaskResponse, clearTaskResponse } = useTaskResponseStore();

  const [input, setEntrada] = useState('');
  const [error, setError] = useState('');

  const submitText = async () => {
    setError('');
    clearTaskResponse();

    try {
      const resultado: TaskResponse = await translateTextToTask(input);
      setTaskResponse(resultado);
      console.log(resultado);

      router.push({
        pathname: '/result',
      });

    } catch (e) {
      console.error(e);
      setError('Erro ao interpretar a tarefa. Tente novamente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <TextInput
        multiline
        value={input}
        onChangeText={setEntrada}
        placeholder="Agendar dentista para João na quarta às 15h"
        placeholderTextColor={'gray'}
        style={styles.input}
        onKeyPress={(e) => {
          if (e.nativeEvent.key === 'Enter') {
            e.preventDefault?.();
            console.log('Enter pressionado');
          }
        }}
      /> */}
      <TextArea
        value={input}
        onChangeText={setEntrada}
        placeholder="Agendar dentista para João na quarta às 15h"
        placeholderTextColor={'gray'}
        onEnterPress={submitText}
        />
      <IconButton icon={"send"} label="Send" onPress={submitText} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { color: '#43ccbc', fontWeight: 'bold', marginBottom: 5 },
  resultado: { marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 },
  error: { color: 'red', marginTop: 10 },
})