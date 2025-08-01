export const categories = {
    alimentação: [
        'ifood', 'restaurante', 'mc donalds', 'mcdonalds', 'ubereats', 'bar', 'almoço',
        'padaria', 'lanchonete', 'pizza', 'burguer', 'burger', 'sushi', 'mercado',
        'supermercado', 'açaí', 'café', 'padoca', 'lanches', 'comida', 'food', 'snack',
        'kfc', 'bob’s', 'subway', 'habib’s', 'bk', 'coca cola', 'delivery', 'refeição',
        'pastelaria', 'pizzaria', 'esfiha', 'doceria', 'sorveteria', 'gelato', 'acai',
        'hortifruti', 'sacolão', 'sacolao', 'restô', 'brunch', 'jantar'
    ],

    transporte: [
        'uber', '99', 'gasolina', 'etanol', 'álcool', 'diesel', 'posto', 'metrô', 'metro',
        'ônibus', 'onibus', 'combustível', 'pedágio', 'pedagio', 'passagem', 'transporte',
        'taxi', 'rodoviária', 'rodoviaria', 'locadora', 'estacionamento', 'patinete',
        'bicicleta', 'bilhete único', 'bilhete unico', 'ticket transporte', 'carro',
        'moto', 'bus', 'train', 'bike', 'transcol', 'brt', 'vt'
    ],

    moradia: [
        'aluguel', 'condomínio', 'condominio', 'luz', 'água', 'agua', 'energia', 'internet',
        'telefone', 'net', 'vivo', 'claro', 'tim', 'oi', 'gás', 'gas', 'manutenção',
        'iptu', 'conta', 'imóvel', 'imovel', 'residência', 'residencia', 'domínio',
        'domestico', 'celular', 'tv a cabo', 'streaming', 'faxina', 'zelador', 'porteiro',
        'limpeza', 'síndico', 'boleto aluguel', 'boleto condominio'
    ],

    pagamento: [
        'salário', 'salario', 'pagamento', 'provento', 'pix recebido', 'depósito',
        'deposito', 'rendimento', 'transferência recebida', 'transferencia recebida',
        'recebimento', 'remuneração', 'remuneracao', 'folha de pagamento', 'pensão',
        'pensao', 'reembolso', 'pix entrada', 'entrada', 'comissão', 'comissao',
        'restituição', 'restituicao', 'prolabore', 'cashback', 'devolução', 'devolucao',
        'dinheiro recebido', 'renda', 'lucro', 'venda recebida'
    ],

    lazer: [
        'netflix', 'cinema', 'spotify', 'show', 'evento', 'teatro', 'ingresso',
        'prime video', 'youtube premium', 'loja geek', 'disney+', 'playstation', 'xbox',
        'steam', 'epic games', 'jogo', 'game', 'hbo', 'star+', 'paramount', 'ingresso.com',
        'popcorn', 'funko', 'livro', 'comic', 'quadrinhos', 'assinatura', 'cinemark',
        'cinépolis', 'cinepolis', 'games', 'psn', 'nintendo', 'shopping', 'tour',
        'viagem', 'passeio', 'clube', 'balada', 'pub', 'karaokê', 'karaoke'
    ],

    saúde: [
        'farmácia', 'farmacia', 'remédio', 'remedio', 'medicamento', 'consulta',
        'hospital', 'clínica', 'clinica', 'exame', 'médico', 'medico', 'dentista',
        'plano de saúde', 'convênio', 'convenio', 'laboratório', 'laboratorio',
        'psicólogo', 'psicologa', 'terapia', 'vacina', 'check-up', 'checkup',
        'oftalmologista', 'otorrino', 'fisioterapia', 'nutricionista', 'cirurgia',
        'receita médica', 'consulta online', 'telemedicina', 'unimed', 'amil', 'hapvida',
        'notredame', 'droga raia', 'drograsil', 'pague menos', 'panvel', 'medprev'
    ],

    wellness: [
        'academia', 'smart fit', 'bluefit', 'selfit', 'just fit', 'bio ritmo', 'gympass',
        'personal', 'musculação', 'treino', 'atividade física', 'atividade fisica',
        'crossfit', 'esporte', 'pilates', 'yoga', 'spinning', 'zumba', 'fit dance',
        'corrida', 'natação', 'boxe', 'jiu-jitsu', 'muay thai', 'judô', 'tenis',
        'alongamento', 'ginástica', 'ginastica', 'kickboxing', 'calistenia',
        'treinamento funcional', 'recreação esportiva', 'plano academia', 'mensalidade academia'
    ],

    educacao: [
        'mensalidade escolar', 'mensalidade faculdade', 'curso', 'cursos online', 'ead',
        'ensino', 'escola', 'faculdade', 'universidade', 'colégio', 'colegio',
        'pós-graduação', 'pos graduacao', 'graduação', 'graduacao', 'aula', 'aulão',
        'reforço escolar', 'reforco escolar', 'apostila', 'material escolar',
        'mochila', 'livros didáticos', 'livro didático', 'vestibular', 'enem', 'idiomas',
        'inglês', 'ingles', 'espanhol', 'aula particular', 'plataforma de estudo',
        'alura', 'rocketseat', 'udemy', 'coursera', 'khan academy', 'senai',
        'senac', 'sesi', 'material didático', 'edtech', 'ensino técnico',
        'ensino médio', 'ensino fundamental', 'educação infantil', 'biblioteca',
        'educação', 'educacao', 'ensino superior', 'plano educacional'
    ]
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
