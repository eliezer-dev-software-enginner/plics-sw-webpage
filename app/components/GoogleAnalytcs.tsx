import Script from 'next/script';

/**
 * @author Eliezer
 *
 * @description Esse método retorna o script de rastreio do Google Analytcs que é mais performático do que o `<script/>` padrão do Google
 * @returns Tag do Google Analytcs usando `<Script/>` do Next.
 */
export default function GoogleAnalytcs() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  console.log(id);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}

/*
<!-- Google tag (gtag.js) -->
const id = "..."

<script async src="https://www.googletagmanager.com/gtag/js?id=" + id></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', id);
</script>

*/
