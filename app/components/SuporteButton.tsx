"use client";

import Link from "next/link";

export function SuporteButton() {
  return (
    <Link
      href={process.env.NEXT_PUBLIC_SUPORTE_CONTATO!}
      //className={styles.suporteLink}
      target="_blank"
    >
      Falar com suporte
    </Link>
  );
}
