import Head from 'next/head';

import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Property ROI calculator</title>
        <meta name="description" content="Tools for determining ROI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}></main>
    </>
  );
}
