'use client';

import { Button } from '@mui/material';
import Image from 'next/image';
import s from './childpresentation.module.css';

export default function ChildPresentation() {
  return (
    <div className={s.container}>
      <div>
        <h1>O ERP QUE SIMPLIFICA A GESTÃO DO SEU NEGÓCIO!</h1>
        <p>
          Controle estoque, financeiro, vendas, clientes e relatórios em um
          único sistema rápido, intuitivo e desenvolvido para empresas que
          precisam de eficiência
        </p>
      </div>
      <div>
        <Button variant='contained'>Solicitar Demosntração</Button>
        <Button variant='outlined'>Adquirir Licença</Button>
      </div>
      <Image
        src='/imghero.png'
        alt='Imagem do hero do sistema de gestão Plics SW'
        width='300'
        height={300}
      />
    </div>
  );
}
