import dynamic from 'next/dynamic';

export const RoiForm = dynamic(
  () => import('./RoiForm').then((mod) => mod.RoiForm),
  {
    ssr: false,
  },
);
