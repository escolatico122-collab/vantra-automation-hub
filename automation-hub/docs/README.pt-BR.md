# Vantra Automation Hub — Guia para novas pessoas contribuidoras

O Vantra Automation Hub é uma biblioteca de código aberto com receitas de automação que priorizam a privacidade e demonstrações de webhooks do n8n que podem ser executadas e testadas. O projeto ajuda pequenas empresas e pessoas que estão aprendendo automação a trabalhar com exemplos claros, revisáveis e seguros, sem depender de credenciais externas nem de dados reais de clientes.

O projeto ainda está em fase inicial, mas já pode ser usado para aprendizado e testes. Pessoas em sua primeira contribuição a um projeto de código aberto são bem-vindas.

## Como você pode contribuir

Não é necessário ter experiência avançada. Contribuições úteis incluem:

- workflows do n8n importáveis, desativados por padrão e testados com dados sintéticos;
- novas receitas para um caso de uso real e específico de uma pequena empresa;
- testes dos validadores, correções de bugs e melhorias nas verificações de qualidade;
- documentação e traduções precisas;
- melhorias de privacidade, segurança e acessibilidade;
- melhorias no catálogo público de workflows em `docs/`.

Cada pull request deve trazer uma melhoria significativa e bem delimitada. Alterações artificiais, duplicadas ou meramente cosméticas, feitas apenas para aumentar estatísticas de contribuição, serão rejeitadas.

## Início rápido

É necessário usar Node.js 18 ou mais recente. Os validadores usam apenas módulos nativos do Node.js.

```bash
git clone https://github.com/escolatico122-collab/vantra-automation-hub.git
cd vantra-automation-hub/automation-hub
npm test
```

O comando valida as receitas e os workflows do n8n. Ele rejeita campos obrigatórios ausentes, IDs ou caminhos de webhook duplicados, workflows enviados como ativos, credenciais incorporadas e padrões que possam indicar segredos.

## Regras para receitas

Para adicionar uma receita de automação:

1. Copie um arquivo JSON existente de `automation-hub/recipes/`.
2. Defina um `id` exclusivo em kebab-case que seja igual ao nome do arquivo.
3. Descreva um caso de uso empresarial real e específico, não apenas uma ideia genérica.
4. Informe os dados ou as fontes configuradas de que a automação precisa.
5. Inclua pelo menos três etapas ordenadas, com descrições relevantes.
6. Explique com honestidade se dados pessoais são armazenados e como os riscos são reduzidos.
7. Inclua pelo menos duas verificações concretas usando dados sintéticos.
8. Adicione encaminhamento para atendimento humano quando a automação puder ficar incerta ou apresentar risco.
9. Execute `npm test` antes de abrir o pull request.

Consulte o [`automation-hub/docs/recipe-guide.md`](recipe-guide.md) para conhecer todos os campos e critérios de qualidade.

## Segurança e privacidade

- Nunca faça commit de chaves de API, tokens, senhas, arquivos `.env`, dados reais de clientes, conversas, números de telefone, endereços, URLs privadas — incluindo URLs de webhook — ou detalhes de exploração.
- Use somente dados sintéticos e placeholders evidentes, como `YOUR_ACCESS_TOKEN`, `TEST_ORDER_001`, `customer@example.test` e `https://example.invalid/webhook`.
- Minimize a coleta e o armazenamento de informações pessoais e documente regras de retenção quando houver armazenamento.
- Mantenha workflows importados desativados por padrão e nunca inclua credenciais em um workflow exportado.
- Use APIs oficiais das plataformas e respeite seus termos.
- Adicione limitação de taxa e encaminhamento para atendimento humano quando houver possibilidade de abuso, incerteza ou risco.
- Não afirme que uma integração funciona se o material enviado não puder ser testado.
- Não reutilize exports proprietários, a menos que a licença permita explicitamente sua redistribuição.

As demonstrações incluídas não são implantações prontas para produção. Um uso real também exige autenticação, limitação de taxa, fontes de dados aprovadas, regras de retenção, monitoramento, tratamento de erros, análise jurídica quando aplicável e um processo aprovado de encaminhamento para atendimento humano.

Se encontrar uma vulnerabilidade ou um segredo exposto, não abra um Issue público. Entre em contato de forma privada pelo método indicado no perfil do proprietário do repositório. Informe o arquivo ou workflow afetado, descreva o risco, forneça etapas seguras de reprodução com dados de teste e sugira uma correção, se souber. Siga as orientações de [`SECURITY.md`](../../SECURITY.md).

## Como escolher um bom primeiro Issue

1. Procure um Issue aberto e sem responsável com a label [`good first issue`](https://github.com/escolatico122-collab/vantra-automation-hub/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).
2. Prefira um Issue com objetivo claro, critérios de aceitação verificáveis e escopo que caiba em um único pull request.
3. Confirme que você consegue testar a mudança sem usar dados reais, credenciais privadas ou serviços pagos obrigatórios.
4. Leia a conversa existente para verificar se ninguém já está trabalhando na tarefa.
5. Comente antes de começar e aguarde a atribuição quando o Issue solicitar isso.
6. Leia [`CONTRIBUTING.md`](../../CONTRIBUTING.md) e [`CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md).

Depois de concluir a mudança, execute `cd automation-hub && npm test` e abra um pull request com `Closes #ISSUE_NUMBER`. Explique o que mudou, por que a contribuição é útil e como foi testada. Responda às solicitações de revisão no mesmo pull request.
