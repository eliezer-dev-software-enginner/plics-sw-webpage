import { PixService } from 'pix-payment';

let pixService: PixService | null = null;

export function getPixService(): PixService {
  if (!pixService) {
    const accessToken = process.env.MP_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN_TEST || '';

    if (!accessToken) {
      throw new Error('MP_ACCESS_TOKEN_PROD/MP_ACCESS_TOKEN_TEST não configurado');
    }

    const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

    pixService = new PixService({
      accessToken,
      emulator: {
        enabled: process.env.NODE_ENV === 'development',
        url: process.env.PIX_EMULATOR_URL,
      },
    });
  }

  return pixService;
}
