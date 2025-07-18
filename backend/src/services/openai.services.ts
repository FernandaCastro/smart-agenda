import axios from 'axios';
import dayjs from 'dayjs';
import { AIDescriptionResponse, AITaskResponse } from '../models/openai.models.js';
import { AppError } from '../models/error.models.js';

export async function analyseText(text: string) {

  const today = dayjs().format('DD-MM-YYYY');


  const prompt = `
A partir da frase abaixo, identifique se o usuário deseja **criar**, **atualizar** (marcar como resolvida ou cancelada), **remover** ou **consultar** tarefas.

Retorne um JSON com os seguintes campos:

- intention: "create", "update" (para alteração de status, descrição, data, hora ou notas), "delete" (para remoção de uma tarefa) ou "retrieve" (para consulta de tarefas).
- id: número inteiro que identifica a tarefa, ou null se não informado.
- description: descrição da tarefa com verbo no infinitivo e a primeira letra maiúscula, se aplicável. Em consultas genéricas, este campo deve ser null.
- newDescription: nova descrição da tarefa (com verbo no infinitivo e primeira letra maiúscula), somente se for uma alteração explícita da descrição. Caso contrário, null.
- date: data da tarefa no formato DD-MM-AAAA, ou null se não especificado.
- time: hora da tarefa no formato HH:MM, ou null se não especificado.
- start: data e hora de início no formato DD-MM-AAAA HH:MM, ou null se não especificado.
- end: data e hora de término no formato DD-MM-AAAA HH:MM, ou null se não especificado.
- notes: texto contendo detalhes ou notas sobre a tarefa, ou null se não mencionado. Se houver markdown, mantenha o markdown.
- status: "pending", "resolved", "cancelled", ou null se não mencionado.
- error: apenas se a condição descrita abaixo for verdadeira. Deve conter um JSON puro, sem crases, aspas desnecessárias ou markdown.

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
  - Se não houver menção de status → status = null

3. **id**
  - Se a frase mencionar "tarefa 3", "tarefa número 3" ou "a terceira tarefa", extraia o número correspondente: id = 3

4. **description**
  - Deve conter a ação a ser realizada ou realizada, em verbo no infinitivo com a primeira letra maiúscula (ex: "Ir ao médico", "Resolver bug")
  - Em consultas genéricas, se não houver ação clara → description = null

5. **newDescription**
  - Apenas se a frase indicar alteração explícita da descrição. Caso contrário → newDescription = null

6. **start**
  - Se for uma consulta por período específico → usar como data/hora de início. Caso contrário → start = null

7. **end**
  - Se for uma consulta por período específico → usar como data/hora de término. Caso contrário → end = null

8. **notes**
  - Se a frase mencionar "detalhes", "notas", ou conteúdo adicional → preencher notes com esse conteúdo (mantendo markdown, se houver). Caso contrário → notes = null

9. **Campos ausentes**
  - Qualquer campo não mencionado na frase ou que não possa ser inferido com clareza deve ser preenchido com null.

10. **error**
  - Por padrão, error = null.
  - Preencha o campo error **somente** se a seguinte condição lógica for verdadeira:
    id == null && description == null && intention == "update"
  - Nesse caso, defina:
    error = {statusCode: 404, message: "Task Id and description were not informed"}
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
    return new AITaskResponse(
      json.intention,
      json.newDescription,
      json.start,
      json.end,
      json.error ? new AppError(json.error.statusCode, json.error.message) : null,
      {
        id: json.id,
        description: json.description,
        notes: json.notes,
        date: json.date,
        time: json.time,
        status: json.status
      });

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
