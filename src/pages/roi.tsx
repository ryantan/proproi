import Head from 'next/head';

import { RoiForm } from '@features/roi-table/containers';

import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Loan comparison | Property ROI calculator</title>
        <meta name="description" content="Tools for comparing loan packages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <RoiForm />
      </main>
    </>
  );
}
