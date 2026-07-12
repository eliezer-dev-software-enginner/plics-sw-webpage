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
