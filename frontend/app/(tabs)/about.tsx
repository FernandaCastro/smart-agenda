import { Platform, ScrollView, Text } from "react-native";
import Markdown from 'react-native-markdown-display';

export default function About() {


    const aboutText = ` 
# Instruções

A idéia é escrever de forma natural e o app vai interpretar o texto e executar o pedido, seja criando, alterando, excluindo ou listando tarefas. 

Ao se referir a uma tarefa existente use palavras que remetam ao texto da descrição da tarefa para facilitar a identificação, ou use o número identificador da tarefa. 

\`\`\`
cancelar tarefa 2 
\`\`\`
\`\`\`
cancelar #2 
\`\`\`

### **Criar tarefa**
\`\`\`
Comprar o presente de aniversário amanhã
\`\`\`
\`\`\`
Agendar o local da festa na próxima sexta às 14h
\`\`\`
\`\`\`
Encomendar o bolo hoje com a seguinte nota: Bolo redondo de chocolate com morangos
\`\`\`

### **Alterar tarefa**
\`Alterar a descrição de Comprar presente sala para Comprar presente para a professora da turma\`

\`Alterar a nota da tarefa 3: \"Bolo redondo de \\*\\*abacaxi com doce de leite\\*\\*\" \`

\` Alterar #3 hora 10h \`

\`Encomendei o bolo \` (Altera o status da tarefa 3 para **_resolvido_**)

\` Cancelar #3 \`  (Altera o status da tarefa 3 para **_cancelado_**)


### **Deletar tarefa:**
> Remover #3 (Deleta a tarefa 3)

## Restrições:  

### Notes

Usar **aspas duplas** caso queira armazenar um texto formatado.
Exemplo: Alterar a nota da tarefa 4: \"Bolo redondo de \\*\\*abacaxi com doce de leite\\*\\*\" 
`;

    return (
        <ScrollView>
            <Markdown style={{
                body: {
                    color: '#333',
                    fontSize: 14,
                    margin: 30,
                },
                text: {},
                textgroup: {},
                paragraph: {
                    marginTop: 10,
                    marginBottom: 10,
                    flexWrap: 'wrap',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    width: '100%',
                },
                heading1: {
                    paddingBottom: 20
                },
                heading2: {
                    paddingTop: 20,
                    paddingBottom: 20
                },

                heading3: {
                    paddingTop: 20,
                    paddingBottom: 10
                },
                fence: {
                    alignSelf: 'flex-start', 
                    maxWidth: '100%',
                    fontStyle: "italic",
                    borderWidth: 0,
                    borderColor: '#CCCCCC',
                    backgroundColor: 'lightgray',
                    padding: 7,
                    marginBottom: 2,
                    borderRadius: 4,
                    ...Platform.select({
                        ['ios']: {
                            fontFamily: 'Courier',
                        },
                        ['android']: {
                            fontFamily: 'monospace',
                        },
                    }),
                },
                code_inline: {
                    borderWidth: 0,
                    borderColor: '#CCCCCC',
                    backgroundColor: 'lightgray',
                    fontStyle: "italic",
                    padding: 7,
                    marginBottom: 1,
                    borderRadius: 4,
                    ...Platform.select({
                      ['ios']: {
                        fontFamily: 'Courier',
                      },
                      ['android']: {
                        fontFamily: 'monospace',
                      },
                    }),
                  },
            }}>
                {aboutText}
            </Markdown>
        </ScrollView>
    )
}