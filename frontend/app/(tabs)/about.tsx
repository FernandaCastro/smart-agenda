import { Text } from "react-native";
import Markdown from 'react-native-markdown-display';

export default function About() {


    const aboutText = ` 
# Instruções
A idéia é escrever de forma natural e o app vai interpretar o texto e executar o pedido, seja criando, alterando, excluindo ou listando tarefas. 

### **Criar uma tarefa:**
 
> Comprar o presente de aniversário amanhã 
> Agendar o local da festa na próxima sexta às 14h
> Encomendar o bolo hoje com a seguinte nota: Bolo redondo de chocolate com morangos

### **Alterar uma tarefa:**
> Alterar a nota da tarefa 4: \"Bolo redondo de \\*\\*abacaxi com doce de leite\\*\\*\"
> Encomendei o bolo 

## Restrições:  

### Notes

Usar **aspas duplas** caso queira armazenar um texto formatado.
Exemplo: Alterar a nota da tarefa 4: \"Bolo redondo de \\*\\*abacaxi com doce de leite\\*\\*\" 
`;

    return (
        <Markdown style={{
            body: {
                color: '#333',
                fontSize: 14,
                margin: 30,
            },
            heading2:{
                paddingTop: 15,
                paddingBottom: 10
            },
            heading3:{
                paddingTop: 10,
                paddingBottom: 10
            },

            paragraph: {
                marginTop: 10,
                padding: 10
            }
        }}>
            {aboutText}
        </Markdown>
    )
}