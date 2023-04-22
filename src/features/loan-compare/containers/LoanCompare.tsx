import Head from 'next/head';

import { LoanForm } from '@features/loan-compare/containers';

export const LoanCompare = () => {
  return (
    <>
      <Head>
        <title key="title">Loan comparison | Property ROI calculator</title>
        <meta
          key="description"
          name="description"
          content="Illustrates mortgage payments over 6 years given 2 loan packages with different spreads."
        />
      </Head>
      <LoanForm />
    </>
  );
};
