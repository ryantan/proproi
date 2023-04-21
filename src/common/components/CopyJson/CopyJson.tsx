import { Typography } from 'antd';

import styles from './CopyJson.module.scss';

export const CopyJson = ({ value }: { value: string }) => {
  return (
    <div className={styles.copyValuesContainer}>
      <Typography.Paragraph
        copyable
        style={{
          maxHeight: 160,
          overflowY: 'auto',
          background: '#EEE',
          padding: 8,
          border: '1px solid #BBB',
          fontFamily:
            "'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace",
          fontSize: '85%',
        }}
      >
        {value}
      </Typography.Paragraph>
    </div>
  );
};
