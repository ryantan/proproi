import Head from 'next/head';

import { LoanForm } from '@features/loan-compare/containers';

export const LoanCompare = () => {
  return (
    <>
      <Head>
        <title>Loan comparison | Property ROI calculator</title>
        <meta name="description" content="Tools for comparing loan packages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoanForm />
    </>
  );
};
