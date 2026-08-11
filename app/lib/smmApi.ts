// app/lib/smmApi.ts
//
// Cliente do painel SMM (API v2, formato "key + action" via POST form-urlencoded).
// Porte do SmmAPI.java do usuário — só os métodos usados são portados: services(), order() e status().
// Diferente do PHP/cURL original que essa classe Java já corrigiu, o fetch nativo do Node
// valida certificado TLS por padrão — isso não é desativado aqui.

const DEFAULT_API_URL = 'https://smmoficial.com/api/v2';

function getApiKey(): string {
  const key = process.env.SMM_API_KEY;
  if (!key) throw new Error('SMM_API_KEY não configurado');
  return key;
}

function getApiUrl(): string {
  return process.env.SMM_API_URL || DEFAULT_API_URL;
}

async function connect(post: Record<string, string>): Promise<any> {
  const body = new URLSearchParams(post).toString();

  const response = await fetch(getApiUrl(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
    },
    body,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Painel SMM retornou HTTP ${response.status}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Painel SMM retornou resposta inválida: ${text}`);
  }
}

/** Lista os serviços disponíveis no painel. */
export async function smmServices(): Promise<any> {
  return connect({ key: getApiKey(), action: 'services' });
}

/** Cria um pedido. `data` recebe os campos específicos do serviço (service, link, quantity, etc.). */
export async function smmOrder(data: Record<string, string>): Promise<any> {
  return connect({ key: getApiKey(), action: 'add', ...data });
}

/** Consulta status, charge, remains e start count de um pedido. */
export async function smmStatus(orderId: string): Promise<any> {
  return connect({ key: getApiKey(), action: 'status', order: orderId });
}
