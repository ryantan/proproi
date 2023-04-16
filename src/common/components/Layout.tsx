import { ReactNode } from 'react';
import { Outlet } from 'react-router';

import styles from '@/styles/Home.module.css';

export const Layout = ({ children }: { children?: ReactNode }) => {
  return <main className={styles.main}>{children}</main>;
};

export const LayoutWithOutlet = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
