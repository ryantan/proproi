import Head from 'next/head';

import { RoiForm } from '@features/roi-table/containers';

export const Roi = () => {
  return (
    <>
      <Head>
        <title key="title">ROI | Property ROI calculator</title>
        <meta
          key="description"
          name="description"
          content="Estimate returns with varying interest rates."
        />
      </Head>
      <RoiForm />
    </>
  );
};
