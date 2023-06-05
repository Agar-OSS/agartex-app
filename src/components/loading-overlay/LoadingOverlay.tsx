import { ReactNode } from 'react';
import styles from './LoadingOverlay.module.less';

interface Props {
  className?: string,
  show: boolean,
  loadingIndicator: ReactNode,
  children?: ReactNode | ReactNode[]
}

const LoadingOverlay = (props: Props) => (
  <>
    {
      props.show ? (
        <div className={`${styles.loadingOverlay} ${props.className}`}>
          { props.children }
          <div className={styles.loadingIndicator}>
            { props.loadingIndicator }
          </div>
          <div className={styles.background} />
        </div>
      ) : props.children 
    }
  </>
);

export default LoadingOverlay;
