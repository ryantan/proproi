import type { AppProps } from 'next/app';

import { SafeHydrate } from '@/common/components/SafeHydrate';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SafeHydrate>
      <Component {...pageProps} />
    </SafeHydrate>
  );
}
