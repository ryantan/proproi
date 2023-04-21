import { Layout, Menu, MenuProps } from 'antd';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { SafeHydrate } from '@/common/components/SafeHydrate';
import '@/styles/globals.css';

const { Header, Content } = Layout;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(router.asPath);

  // Set open menu key when route changes.
  useEffect(() => {
    setCurrent(router.asPath);
  }, [router.asPath]);

  // Set open menu key when menu items are clicked.
  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    router.push(key).then();
  };

  return (
    <SafeHydrate>
      <Layout className={'layout'}>
        <Header>
          <div className={'logo'}>
            <Link href="/">Prop Calculators</Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['/']}
            selectedKeys={[current]}
            onClick={onMenuClick}
            items={[
              { key: '/loan-compare', label: 'Compare loan packages' },
              { key: '/roi', label: 'ROI calculator' },
            ]}
          />
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Component {...pageProps} />
        </Content>
      </Layout>
    </SafeHydrate>
  );
}
