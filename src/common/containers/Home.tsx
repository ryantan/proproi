import { Card, Col, Row } from 'antd';
import Link from 'next/link';

import styles from '@/styles/Home.module.css';

export const Home = () => {
  return (
    <div
      className={'site-layout-content'}
      style={{ background: 'transparent' }}
    >
      <main className={styles.main}>
        <Row gutter={16}>
          <Col sm={24} md={12} lg={8}>
            <Link href="/loan-compare">
              <Card title="Compare loan packages" bordered={false}>
                <p>
                  Illustrates mortgage payments over 6 years given 2 loan
                  packages with different spreads.
                </p>
              </Card>
            </Link>
          </Col>
          <Col sm={24} md={12} lg={8}>
            <Link href="/roi">
              <Card title="ROI calculator" bordered={false}>
                <p>Estimate returns with varying interest rates.</p>
              </Card>
            </Link>
          </Col>
        </Row>
      </main>
    </div>
  );
};
