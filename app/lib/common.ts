export function isProductionMode() {
  return process.env.NODE_ENV === 'production';
}

export function getPriceFormatado(price: string) {
  return 'R$ ' + price?.replace('.', ',');
}

export function getPriceFormatadoArray(price: string) {
  //34.50
  //34
  //,50
  const arr = price.split('.'); //[34, 50]
  const decimalValue = arr[1];

  arr[1] = ',' + decimalValue;

  return arr;
}

export type UTM = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
};

export function getUtmFromSearchParams(params: {
  userId?: string;
  test?: string;
  paymentId?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}) {
  const source = params.utm_source;
  const medium = params.utm_medium;
  const campaign = params.utm_campaign;
  const content = params.utm_content;

  const utm: UTM = {
    source,
    medium,
    campaign,
    content,
  };

  return utm;
}
