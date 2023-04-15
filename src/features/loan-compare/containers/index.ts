import dynamic from 'next/dynamic';

export const LoanForm = dynamic(
  () => import('./LoanForm').then((mod) => mod.LoanForm),
  {
    ssr: false,
  },
);
