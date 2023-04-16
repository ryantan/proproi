import { ReactNode, useEffect, useState } from 'react';

// To disable server-side rendering.
export function SafeHydrate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div id="hydrationContainer" suppressHydrationWarning></div>;
  }

  return (
    <div id="hydrationContainer" suppressHydrationWarning>
      {children}
    </div>
  );
}
