import Script from "next/script";

/**
 * Optional analytics — rendered only when the corresponding env var is set.
 * Plausible is cookieless (recommended). GA4 loads with IP anonymisation and
 * ad personalisation signals disabled; add a consent banner if you enable it for EU visitors.
 */
export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <>
      {plausible && <Script defer data-domain={plausible} src="https://plausible.io/js/script.js" strategy="afterInteractive" />}
      {ga && /^G-[A-Z0-9]+$/.test(ga) && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true,allow_google_signals:false,allow_ad_personalization_signals:false});`}
          </Script>
        </>
      )}
    </>
  );
}
