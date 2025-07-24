import axios from 'axios';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { AIDescriptionResponse, AIResponse } from './ai.model.js';
import { AppError } from '../error/error.model.js';

dayjs.extend(customParseFormat);

export async function analyseText(text: string) {

  const today = dayjs().format('DD-MM-YYYY HH:mm');

  const prompt = `
  Analise a frase fornecida e identifique se a intenção do usuário é criar, atualizar, remover ou consultar tarefas.

  Retorne apenas um JSON válido, sem crases, sem markdown e sem qualquer texto adicional.
  
  A estrutura do JSON deve ser:
  
  {
    "intention": "create" | "update" | "delete" | "retrieve" | null,
    "start": "yyyy-mm-ddTHH:MM:SSZ" | null,
    "end": "yyyy-mm-ddTHH:MM:SSZ" | null,
    "error": {
      "statusCode": número,
      "message": texto
    } | null,
    "task": {
      "taskId": "T-0000" | null,
      "description": texto | null,
      "datetime": "yyyy-mm-ddTHH:MM:SSZ" | null,
      "notes": texto | null,
      "status": "pending" | "resolved" | "cancelled" | null
    },
    "updateTask": {
      "description": texto | null,
      "datetime": "yyyy-mm-ddTHH:MM:SSZ" | null,
      "notes": texto | null,
      "status": "pending" | "resolved" | "cancelled" | null
    }
  }
  
  Observações:
  - Os objetos "task" e "updateTask" devem sempre estar presentes, mesmo se vazios ({}).
  - Campos internos só devem ser incluídos se puderem ser claramente identificados na frase.
  - Use o formato ISO 8601 para datas/hora (ex: 2025-07-21T10:00:00Z).
  - O campo "error" só deve ser preenchido se alguma das regras abaixo for atendida.
  
  Regras para preenchimento:
  
  1. intention:
     - Se a frase indicar algo que será feito → "create"
     - Se indicar algo que foi feito, cancelado ou modificado → "update"
     - Se for uma pergunta ou consulta → "retrieve"
     - Se indicar remoção de uma tarefa → "delete"
     - Se a intenção não puder ser identificada → null
  
  2. taskId:
     - Inclua apenas se for mencionado um ID no formato T-0000
     - Deve aparecer somente no campo "task" (nunca em "updateTask")
  
  3. description:
     - Ação principal da tarefa (ex: "Ir ao médico", "Resolver bug")
     - Deve estar no infinitivo com a primeira letra maiúscula
     - Inclua no campo "task" para create/retrieve/delete
     - Inclua no "updateTask" apenas se estiver sendo alterado
  
  4. status:
     - pending → tarefa ainda a ser feita
     - resolved → tarefa concluída
     - cancelled → tarefa cancelada
     - Inclua no "task" se descritivo
     - Inclua no "updateTask" apenas se for alteração de status
  
  5. datetime:
     - Extraia se a frase mencionar data e/ou hora
     - Se apenas hora for mencionada, usar "1900-01-01THH:MM:00Z"
     - Inclua no "task" ou "updateTask" conforme o caso
  
  6. start / end:
     - Preencha apenas em consultas que envolvem períodos de tempo
     - Caso contrário, defina como null
  
  7. notes:
     - Preencha se a frase incluir informações adicionais como "levar exames", "com urgência", etc.
     - Manter a formatação original (inclusive markdown, se houver)
  
  8. updateTask:
     - Preencher apenas quando intention = "update"
     - Incluir apenas os campos que estão sendo alterados
  
  9. error:
     Deve ser preenchido apenas nas seguintes situações (em ordem de prioridade):
  
     1. Se intention == null:
        error = {
          "statusCode": 422,
          "message": "Unable to understand the intention in your phrase. Please try again with a clearer request."
        }
        → Pare a análise aqui.
  
     2. Se description == null E taskId == null E intention for "update", "delete" ou "create":
        error = {
          "statusCode": 400,
          "message": "Please inform a description for the task."
        }
  
     3. Em todos os outros casos:
        error = null
  
  Exemplos de resposta:
  
  Frase: "Ir ao médico amanhã às 10h e levar exames"
  {
    "intention": "create",
    "start": null,
    "end": null,
    "error": null,
    "task": {
      "description": "Ir ao médico",
      "datetime": "2025-07-25T10:00:00Z",
      "notes": "levar exames",
      "status": "pending"
    },
    "updateTask": {}
  }
  
  Frase: "Resolvi bug Y"
  {
    "intention": "update",
    "start": null,
    "end": null,
    "error": null,
    "task": {
      "description": "Resolver bug Y"
    },
    "updateTask": {
      "status": "resolved"
    }
  }
  
  Frase: "Cancelar Ir ao médico"
  {
    "intention": "update",
    "start": null,
    "end": null,
    "error": null,
    "task": {
      "description": "Ir ao médico"
    },
    "updateTask": {
      "status": "cancelled"
    }
  }
  
  Frase: "Remover tarefa T-0001"
  {
    "intention": "delete",
    "start": null,
    "end": null,
    "error": null,
    "task": {
      "taskId": "T-0001"
    },
    "updateTask": {}
  }
  
  Frase: "Hoje faz calor"
  {
    "intention": null,
    "start": null,
    "end": null,
    "error": {
      "statusCode": 422,
      "message": "It seems you're not talking about tasks, are you? Or maybe your text isn't clear enough. Please try again with a clearer request."
    },
    "task": {},
    "updateTask": {}
  }
  
  Frase: "mudar a hora da tarefa para 10h"
  {
    "intention": "update",
    "start": null,
    "end": null,
    "error": {
      "statusCode": 400,
      "message": "Please inform a description for the task."
    },
    "task": {},
    "updateTask": {
      "datetime": "1900-01-01T10:00:00Z"
    }
  }
  
Hoje é ${today}.
Frase: "${text}"
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
