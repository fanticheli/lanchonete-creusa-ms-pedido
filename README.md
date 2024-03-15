# lanchonete-creusa-ms-pedido
Sistema de pedidos para lanchonetes. Cadastro de clientes, gestão de produtos e acompanhamento em tempo real. Desenvolvido em Nodejs e MongoDB utilizando Clean Arch. Melhore o atendimento e satisfação dos clientes.

## SAGA COREOGRADADA
    Nossa escolha foi baseada na simplicidade de implementação, facilidade de manutenção e escalabilidade. Já que nosso sistema é composto por
    funcionalidades de baixa complexidade, acreditamos que a Saga Coreografada é a melhor escolha para garantir a consistência dos dados.

    Nossa aplicação é composta por três microserviços, fazendo a comunicação entre eles por Filas e Webhooks. Essa comunicação são transações
    atomicas, para garantir que seja executado tudo ou nada, garantindo assim a consistência dos dados.

    As transações atomicas vão garantir que: 
        nenhum pedido seja criado sem uma intenção de pagamento; 
        nenhum pagamento seja aprovado sem a confirmação de recebimento da produção do pedido;
        nenhum pedido fique pronto sem existir um pagamento aprovado;
        nenhum pedido seja entregue sem estar pronto;
    
    Beneficios Saga Coreografada:
        1. Resiliência e Tolerância a Falhas
            Um dos principais benefícios do padrão Saga Coreografada é a sua capacidade de lidar com falhas de forma elegante. Ao dividir uma transação em várias etapas menores, cada uma delas pode ser revertida individualmente em caso de falha, mantendo a integridade dos dados e evitando efeitos colaterais indesejados. Isso torna o sistema mais resiliente e capaz de se recuperar de falhas sem comprometer a consistência dos dados.
        
        2. Escalabilidade e Desempenho
            Com a crescente adoção de arquiteturas distribuídas e microserviços, a escalabilidade tornou-se uma preocupação central no desenvolvimento de software. O padrão Saga Coreografada se alinha perfeitamente a essas arquiteturas, permitindo que as transações sejam distribuídas entre os diferentes serviços de forma eficiente. Isso não só melhora o desempenho do sistema, mas também facilita a escalabilidade horizontal, permitindo que novos serviços sejam adicionados conforme necessário.
        
        3. Flexibilidade e Manutenibilidade
            Ao adotar o padrão Saga Coreografada, os desenvolvedores ganham uma maior flexibilidade no design do sistema. As transações podem ser modeladas de forma granular, permitindo que novas operações sejam adicionadas ou modificadas com facilidade. Além disso, a separação das operações em etapas individuais facilita a manutenção do código, tornando-o mais legível e modular.
        
        4. Consistência e Atomicidade
            Um dos princípios fundamentais do padrão Saga Coreografada é a garantia da atomicidade das transações. Isso significa que uma transação é tratada como uma unidade indivisível, garantindo que todas as operações sejam concluídas com sucesso ou revertidas completamente em caso de falha. Isso ajuda a manter a consistência dos dados, mesmo em sistemas distribuídos e altamente concorrentes.        

## Instalação

```bash
npm install
```

## Execução

```bash
npm start
```

## Testes

```bash
npm test
```

## Documentação

Para acessar swagger da aplicação, acesse: http://localhost:PORT/api-docs/