import { PixService } from 'pix-payment';

const pixService = new PixService({
  accessToken: process.env.MP_ACCESS_TOKEN_PROD || process.env.MP_ACCESS_TOKEN_TEST || '',
  emulator: {
    enabled: process.env.NODE_ENV === 'development',
    url: process.env.PIX_EMULATOR_URL,
  },
});

export { pixService };
