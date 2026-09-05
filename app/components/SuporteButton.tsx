"use client";

import { MessageCircleQuestionMark } from 'lucide-react';


export function SuporteButton() {
 

  const handleClick = () => {
    const link = process.env.NEXT_PUBLIC_SUPORTE_CONTATO;
    if (!link) return;
    window.open(link, '_blank');
  };

  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem 2rem',
    borderRadius: '0.5rem',
    fontWeight: 600,
    fontSize: '1.125rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'transform 200ms, background-color 200ms',
  };

  const styles = { ...baseStyle, backgroundColor: 'var(--accent)', color: '#000' };

  return (
    <button style={styles} onClick={handleClick}>
        <MessageCircleQuestionMark size={20} />
       Falar com suporte
    </button>
  );
}

