// app/comprar-inscritos-instagram/testMode.ts
//
// Modo de teste ativado manualmente pelo console do navegador — digite
// `habilitarTeste()` (ou `desabilitarTeste()`) no devtools. Enquanto ativo,
// o pedido de inscritos NÃO é enviado ao painel SMM real (ver smmApiMock.ts).

const TEST_MODE_KEY = 'plics_ig_test_mode';

export function isTestModeEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(TEST_MODE_KEY) === 'true';
}

export function installTestModeConsoleFlag(): void {
  if (typeof window === 'undefined') return;

  const enable = () => {
    localStorage.setItem(TEST_MODE_KEY, 'true');
    console.log(
      '%c✅ Modo de teste ativado — pedidos NÃO serão enviados ao painel SMM real. Recarregando...',
      'color:#d946ef;font-weight:bold;font-size:12px;',
    );
    window.location.reload();
  };

  const disable = () => {
    localStorage.removeItem(TEST_MODE_KEY);
    console.log(
      '%c❌ Modo de teste desativado. Recarregando...',
      'color:#f87171;font-weight:bold;font-size:12px;',
    );
    window.location.reload();
  };

  (window as any).habilitarTeste = enable;
  (window as any).desabilitarTeste = disable;
  (window as any)['habilitar-teste'] = enable;
  (window as any)['desabilitar-teste'] = disable;
}
