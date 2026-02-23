import { createPixPayment } from './actions';
import PixPayment from './PixPayment';

export const dynamic = 'force-dynamic';

async function getPixData() {
  const userId = 'guest_' + Date.now();
  const result = await createPixPayment(userId);
  return result;
}

export default async function Comprar() {
  const pixData = await getPixData();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Realize já a compra do seu aplicativo
          </h1>
          <h2 className="text-xl text-gray-400">
            Você recebe a licença na hora junto com o aplicativo
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <PixPayment pixData={pixData} />
        </div>
      </div>

      <footer className="w-full bg-gray-950 text-white py-6 px-6 text-center text-sm">
        <p>&copy; 202 PLICs. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
