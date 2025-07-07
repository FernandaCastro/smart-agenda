import axios from 'axios';
import dayjs from 'dayjs';
import { AIDescriptionResponse, AITaskResponse } from '../models/openai.models';

export async function analyseText(text: string) {

  const today = dayjs().format('DD-MM-YYYY');


  const prompt = `
  A partir da frase abaixo, identifique se o usuário deseja **criar**, **atualizar** (marcar como resolvida ou cancelada) ou **consultar** tarefas.

  Retorne um JSON com os seguintes campos:

  - intention: "create", "update" (para "resolved" ou "cancelled"), "delete"(para remover uma tarefa) ou "retrieve" (para consultar tarefas)
  - id: número inteiro que identifica a tarefa, se não informado.
  - description: o que deve ou foi feito (verbo no infinitivo, se aplicável) ou null em caso de consulta genérica
  - date: no formato DD-MM-AAAA, ou null se não especificado
  - time: no formato HH:MM, ou null se não especificado
  - start:
  - end:
  - assignee: quem está envolvido, se mencionado, ou null
  - status: "pending", "resolved" ou "cancelled", ou null em caso de consulta genérica
  
  Critérios para preenchimento:

  1. **intention**:
   - Se a frase indicar que algo deve ser feito → "create"
   - Se indicar que algo foi feito, cancelado, ou a tarefa deve ser alterada → "update"
   - Se for uma pergunta ou consulta sobre tarefas → "retrieve"

   2. **status**:
   - Se a tarefa ainda deve ser feita → "pending"
   - Se a tarefa foi feita → "resolved"
   - Se foi cancelada → "cancelled"
   - Se for uma consulta e o status não foi mencionado → null

   3. **id**:
   - Considere que a expressão "tarefa 3", "tarefa número 3" ou "a terceira tarefa" representa o campo "id": 3. Sempre que encontrar esse padrão, extraia o número como valor de id

   4. **description**:
   - Use o verbo no infinitivo e com a primeira letra maiúscula(ex: "Ir ao médico", "Resolver bug") se aplicável
   - Em caso de consulta, se não houver uma ação clara, use null, caso contrário infira a possível descrição
   - Em caso de update, se o id da tarefa foi identificado, use null, caso contrário infira a possível descrição

   5. **Campos ausentes ou não mencionados** devem ser preenchidos com null.

  Hoje é "${today}.
  Frase: "${text}"
  Retorne apenas o JSON puro, sem crases nem markdown.
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
      {
        id: json.id,
        description: json.description,
        assignee: json.assignee,
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
  Dada a frase: "${text}"  
  E a lista de tarefas: "${descriptions}"

  Retorne no formato JSON com os campos:
  - description: Contendo exatamente qual item da lista tem o significado mais próximo da frase.
  
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
  return new AIDescriptionResponse(json.description);


}
