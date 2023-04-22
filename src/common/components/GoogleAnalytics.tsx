import { useRouter } from 'next/router';
import Script from 'next/script';
import { memo, useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_MEASUREMENT_ID;

const GoogleAnalyticsInternal = () => {
  const router = useRouter();

  // Send page views when users gets to the landing page.
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || router.isPreview) return;
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, //manually send page views to have full control
    });
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      send_to: GA_MEASUREMENT_ID,
    });
  }, []);

  // Send page views on route change.
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!GA_MEASUREMENT_ID || router.isPreview) return;
      // manually send page views
      gtag('event', 'page_view', {
        page_path: url,
        send_to: GA_MEASUREMENT_ID,
      });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events, router.isPreview]);

  // Prevent rendering scripts if there is no GA_MEASUREMENT_ID or if it's preview mode.
  if (!GA_MEASUREMENT_ID || router.isPreview) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      ></Script>
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `,
        }}
      />
    </>
  );
};

export const GoogleAnalytics = memo(GoogleAnalyticsInternal);
