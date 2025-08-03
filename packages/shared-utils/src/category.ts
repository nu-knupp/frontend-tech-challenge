export const categories = {
    alimentação: [
        'ifood', 'restaurante', 'mc donalds', 'ubereats', 'bar', 'almoço', 'padaria',
        'lanchonete', 'pizza', 'burguer', 'sushi', 'mercado', 'supermercado', 'açaí', 'café'
    ],
    transporte: [
        'uber', '99', 'gasolina', 'posto', 'metrô', 'ônibus', 'combustível', 'pedágio',
        'passagem', 'transporte', 'taxi', 'rodoviária'
    ],
    moradia: [
        'aluguel', 'condomínio', 'luz', 'água', 'energia', 'internet', 'telefone',
        'net', 'vivo', 'claro', 'tim', 'gás', 'manutenção', 'iptu', 'conta'
    ],
    pagamento: [
        'salário', 'pagamento', 'provento', 'pix recebido', 'depósito', 'rendimento',
        'transferência recebida', 'recebimento'
    ],
    lazer: [
        'netflix', 'cinema', 'spotify', 'show', 'evento', 'teatro', 'ingresso',
        'prime video', 'youtube premium', 'loja geek', 'disney+', 'playstation', 'xbox'
    ],
};

export function suggestCategories(value: string): string[] {
    const lower = value.toLowerCase();
    const suggests: string[] = [];

    for (const [category, words] of Object.entries(categories)) {
        if (words.some((words) => lower.includes(words))) {
            suggests.push(category);
        }
    }

    return suggests;
}
