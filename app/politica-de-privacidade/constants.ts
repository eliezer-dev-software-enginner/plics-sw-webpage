//app/politica-de-privacidade/constants.ts

export type PolicyLink = {
  label: string;
  href: string;
};

export type PolicySection = {
  id: string;
  number: number;
  title: string;
  paragraphs?: string[];
  items?: string[];
  paragraphsAfter?: string[];
  links?: PolicyLink[];
};

export const POLICY_UPDATED_AT = '28 de julho de 2026';

export const POLICY_LEAD = [
  'A sua privacidade é importante para nós. Esta Política de Privacidade explica como o Plics SW coleta, utiliza, armazena e protege as informações dos usuários.',
  'Ao utilizar o aplicativo, você concorda com os termos desta Política.',
];

export const POLICY_FOOTER_NOTE =
  'Ao utilizar o Plics SW, o usuário declara ter lido e concordado com esta Política de Privacidade.';

export const policySections: PolicySection[] = [
  {
    id: 'sobre',
    number: 1,
    title: 'Sobre o Plics SW',
    paragraphs: [
      'O Plics SW é um sistema de gestão empresarial (ERP) desenvolvido para auxiliar pequenos e médios negócios no gerenciamento de clientes, fornecedores, produtos, estoque, vendas, financeiro e demais rotinas administrativas.',
    ],
  },
  {
    id: 'informacoes-coletadas',
    number: 2,
    title: 'Informações coletadas',
    paragraphs: [
      'O Plics SW foi desenvolvido para funcionar principalmente de forma local (offline). Os dados cadastrados pelo usuário permanecem armazenados no computador onde o aplicativo está instalado.',
      'Dependendo dos recursos utilizados, o aplicativo poderá coletar as seguintes informações:',
    ],
    items: [
      'Nome do usuário;',
      'Endereço de e-mail;',
      'Informações da licença do software;',
      'Identificador do dispositivo para validação da licença;',
      'Informações técnicas do aplicativo (versão instalada, sistema operacional e registros de erros);',
      'Dados necessários para atualização do aplicativo.',
    ],
  },
  {
    id: 'dados-cadastrados',
    number: 3,
    title: 'Dados cadastrados pelo usuário',
    paragraphs: [
      'As informações inseridas pelo usuário, como:',
    ],
    items: [
      'Clientes;',
      'Fornecedores;',
      'Produtos;',
      'Estoque;',
      'Vendas;',
      'Ordens de serviço;',
      'Informações financeiras;',
      'Demais registros criados dentro do sistema;',
    ],
    paragraphsAfter: [
      'são armazenadas localmente no computador do usuário e pertencem exclusivamente ao próprio usuário.',
      'Esses dados não são enviados aos nossos servidores, exceto quando alguma funcionalidade específica exigir essa comunicação e houver autorização do usuário.',
    ],
  },
  {
    id: 'uso-das-informacoes',
    number: 4,
    title: 'Como utilizamos as informações',
    paragraphs: ['As informações coletadas podem ser utilizadas para:'],
    items: [
      'Validar a licença do software;',
      'Disponibilizar atualizações;',
      'Melhorar a estabilidade do aplicativo;',
      'Corrigir erros;',
      'Oferecer suporte técnico;',
      'Prevenir uso indevido ou fraude.',
    ],
  },
  {
    id: 'compartilhamento',
    number: 5,
    title: 'Compartilhamento de informações',
    paragraphs: [
      'O Plics SW não vende, aluga ou comercializa informações pessoais dos usuários.',
      'As informações somente poderão ser compartilhadas quando:',
    ],
    items: [
      'Houver obrigação legal;',
      'Houver determinação judicial;',
      'For necessário para proteção dos direitos do desenvolvedor;',
      'Houver autorização expressa do usuário.',
    ],
  },
  {
    id: 'seguranca',
    number: 6,
    title: 'Segurança',
    paragraphs: [
      'Adotamos medidas técnicas e organizacionais para proteger as informações contra acesso não autorizado, alteração, divulgação ou destruição.',
      'Apesar dos nossos esforços, nenhum sistema é totalmente seguro. Recomendamos que o usuário mantenha cópias de segurança (backups) de seus dados regularmente.',
    ],
  },
  {
    id: 'atualizacoes',
    number: 7,
    title: 'Atualizações do aplicativo',
    paragraphs: [
      'O Plics SW poderá verificar a existência de novas versões pela internet para oferecer atualizações automáticas ou informar a disponibilidade de uma nova versão.',
      'Durante esse processo poderão ser transmitidas apenas as informações necessárias para identificar a versão instalada e realizar a atualização.',
    ],
  },
  {
    id: 'servicos-terceiros',
    number: 8,
    title: 'Serviços de terceiros',
    paragraphs: ['O aplicativo poderá utilizar serviços de terceiros para funcionalidades específicas, como:'],
    items: [
      'Verificação de licença;',
      'Distribuição de atualizações;',
      'Armazenamento de registros de erros;',
      'Suporte ao usuário.',
    ],
  },
  {
    id: 'direitos-do-usuario',
    number: 9,
    title: 'Direitos do usuário',
    paragraphs: ['O usuário poderá, a qualquer momento:'],
    items: [
      'Solicitar informações sobre os dados eventualmente armazenados;',
      'Solicitar correções;',
      'Solicitar exclusão de informações que estejam sob responsabilidade do desenvolvedor, quando aplicável;',
      'Entrar em contato para esclarecimentos sobre esta Política.',
    ],
  },
  {
    id: 'alteracoes',
    number: 10,
    title: 'Alterações nesta Política',
    paragraphs: [
      'Esta Política poderá ser atualizada periodicamente.',
      'Sempre que houver alterações relevantes, uma nova versão será disponibilizada juntamente com a data de atualização.',
    ],
  },
  {
    id: 'contato',
    number: 11,
    title: 'Contato',
    paragraphs: ['Caso tenha dúvidas sobre esta Política de Privacidade, entre em contato:'],
    items: ['Desenvolvedor: Eliezer Dev'],
    links: [
      {
        label: 'eliezerassuncaocustodio@hotmail.com',
        href: 'mailto:eliezerassuncaocustodio@hotmail.com',
      },
      {
        label: 'plics-sw-webpage.vercel.app',
        href: 'https://plics-sw-webpage.vercel.app/',
      },
    ],
  },
  {
    id: 'legislacao',
    number: 12,
    title: 'Legislação aplicável',
    paragraphs: [
      'Esta Política é regida pelas leis da República Federativa do Brasil, especialmente pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD), sem prejuízo das normas aplicáveis da Microsoft Store e demais legislações eventualmente incidentes.',
    ],
  },
];
