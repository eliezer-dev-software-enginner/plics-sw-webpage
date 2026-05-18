//app/lib/mercadoPago.ts

import { MercadoPagoConfig } from "mercadopago";
import { isProductionMode } from "@/app/lib/common";

const isProd = isProductionMode();

// const client = new MercadoPagoConfig({
//   accessToken: isProd
//     ? process.env.MP_ACCESS_TOKEN_PROD || ""
//     : process.env.MP_ACCESS_TOKEN_TEST || "",
// });

// console.log("------cliente-------------");
// console.log(client);

// export default client;

export function getMpClient(): MercadoPagoConfig {
  const isProd = isProductionMode();
  const accessToken = isProd
    ? process.env.MP_ACCESS_TOKEN_PROD
    : process.env.MP_ACCESS_TOKEN_TEST;

  if (!accessToken) {
    throw new Error(
      `Variável ${isProd ? "MP_ACCESS_TOKEN_PROD" : "MP_ACCESS_TOKEN_TEST"} não definida`,
    );
  }

  return new MercadoPagoConfig({ accessToken });
}
