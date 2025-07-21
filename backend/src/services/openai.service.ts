import axios from 'axios';
import dayjs from 'dayjs';
import { AIDescriptionResponse, AIResponse } from '../models/ai.model.js';
import { AppError } from '../models/error.model.js';

export async function analyseText(text: string) {

  const today = dayjs().format('DD-MM-YYYY');


  const prompt = `
A partir da frase abaixo, identifique se o usuário deseja **criar**, **atualizar** (marcar como resolvida ou cancelada), **remover** ou **consultar** tarefas.

Retorne um JSON puro, sem crases, sem markdown, sem texto adicional, com os seguintes campos:

- intention: "create", "update" (para alteração de status, descrição, data, hora ou notas), "delete" (para remoção de uma tarefa) ou "retrieve" (para consulta de tarefas).
- start: datetime de início, ou null se não especificado.
- end: datetime de término, ou null se não especificado.
- error: apenas se a condição descrita abaixo for verdadeira. Deve conter um JSON puro, sem crases, aspas desnecessárias ou markdown.

- task: Um JSON puro, sem crases, sem markdown, sem texto adicional, que representa os dados a serem buscados, criados ou deletados, com os seguintes campos caso sejam informados, caso contrário -> {}:
  - description: descrição da tarefa com verbo no infinitivo e a primeira letra maiúscula, se aplicável. Em consultas genéricas onde a descrição não é informada, este campo não será incluído.
  - datetime: datatime da tarefa, se especificado. Caso contrário este campo não será incluído
  - notes: texto podendo ter markdown contendo detalhes ou notas sobre a tarefa, se informado. Caso contrário este campo não será incluído.
  - status: "pending", "resolved", "cancelled", se mencionado. Caso contrário este campo não será incluído

- updateTask: Um JSON puro, sem crases, sem markdown, sem texto adicional. Este JSON conterá os dados a serem alterados, com os seguintes campos caso sejam informados, caso contrário -> {}:
  - description: descrição da tarefa com verbo no infinitivo e a primeira letra maiúscula, se aplicável. Se a nova descrição não seja informada, este campo não será incluído.
  - datetime: nova data/hora da tarefa, se especificado. Caso contrário, este campo não será incluído.
  - notes: texto contendo novos detalhes ou novas notas da tarefa, se especificado. Caso contrário, este campo não será incluído. Se houver markdown, mantenha o markdown.
  - status: o novo status se informado, podendo ser "pending", "resolved", "cancelled". Caso o status não seja alterado, este campo não será incluído.

Critérios para preenchimento:

1. **intention**
  - Se a frase indicar que algo deve ser feito → intention = "create"
  - Se indicar que algo foi feito, cancelado ou alterado → intention = "update"
  - Se for uma pergunta ou consulta → intention = "retrieve"
  - Se indicar remoção de uma tarefa → intention = "delete"

2. **status**
  - Se a tarefa ainda deve ser feita → status = "pending"
  - Se a tarefa foi feita → status = "resolved"
  - Se a tarefa foi cancelada → status = "cancelled"
  - Se não houver menção de status → status não será incluído no JSON de task ou updateTask.
  - Se intention for "retrieve" ou "create"ou "delete" ou ("update" sem alteração de status) → status é informado no JSON de task, mas não no de updateTask.
  - Se intention for "update" e for uma alteração de status → status é informado no JSON de updateTask.

3. **description**
  - Deve conter a ação a ser realizada ou realizada, em verbo no infinitivo com a primeira letra maiúscula (ex: "Ir ao médico", "Resolver bug")
  - Em consultas genéricas, se não houver ação clara → description não será incluído no JSON de task ou updateTask.

4. **datetime**
  - Se a frase mencionar uma data/hora específica → usar como datetime.
  - Se a frase mencionar somente data → usar como data/hora com hora 00:00.
  - Caso contrário → datetime = null (não incluir no JSON de task ou updateTask).
  - Se for uma alteração somente de hora → usar a data 1900-01-01 e a hora mencionada e adicionar no JSON de updateTask.

5. **start**
  - Se for uma consulta por período específico → usar como data/hora de início. Caso contrário → start = null

6. **end**
  - Se for uma consulta por período específico → usar como data/hora de término. Caso contrário → end = null

7. **notes**
  - Se a frase mencionar "detalhes", "notas", ou conteúdo adicional → preencher notes com esse conteúdo (mantendo markdown, se houver). Caso contrário → notes = null

8. **Campos ausentes**
  - Qualquer campo não mencionado na frase ou que não possa ser inferido com clareza não será incluído no JSON.

9. **error**
  - Por padrão, error = null.
  - Preencha o campo error **somente** se a seguinte condição lógica for verdadeira:
    description == null && intention in "update" | "delete" | "create"
  - Nesse caso, defina:
    error = {statusCode: 404, message: "Task description was not informed"}
  - Em todos os outros casos, error deve ser null.

Hoje é ${today}.
Frase: "${text}"

Retorne **apenas** o JSON puro, sem crases, sem markdown, sem texto adicional.
`;

  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = res.data.choices[0].message.content;
  if (!content) {
    throw new Error("Invalid response from Openai")
  }

  try {

    const json = JSON.parse(content);
    console.log(json);
    return new AIResponse(
      json.intention,
      json.start,
      json.end,
      json.error ? new AppError(json.error.statusCode, json.error.message) : null,
      json.task,
      json.updateTask
    );


  } catch (error) {
    throw new Error("process: Analysis failed");
  }
};


export async function lookupDescription(text: string, descriptions: string[]) {

  const prompt = `
  A partir da frase abaixo e a lista de tarefas informadas, encontrar as tarefas que mais se assemelham à frase informada, buscando encontrar, se possível, um único item.
  Dada a frase: "${text}"  
  E a lista de tarefas: "${descriptions}"

  Retorne no formato JSON com os campos:
  - descriptions: contendo os itens da lista de tarefas mais próximo da frase informada.
  
  Retorne apenas o JSON puro, sem crases nem markdown.
  `
  const res = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = res.data.choices[0].message.content;
  if (!content) {
    throw new Error("Invalid response from Openai")
  }
  const json = JSON.parse(content);
  return new AIDescriptionResponse(json.descriptions);


}
