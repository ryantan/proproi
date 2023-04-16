import Head from 'next/head';

import { RoiForm } from '@features/roi-table/containers';

export const Roi = () => {
  return (
    <>
      <Head>
        <title>ROI | Property ROI calculator</title>
        <meta name="description" content="Tools for comparing loan packages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RoiForm />
    </>
  );
};
