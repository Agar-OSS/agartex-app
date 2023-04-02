import { AiOutlineCheckCircle } from 'react-icons/ai';

import styles from './CreateAccountSuccessBox.module.less';

const CreateAccountSuccessBox = () => (
  <div className={styles.boxContainer}>
    <AiOutlineCheckCircle size={48} />

    <div className={styles.boxHeader}>
      Account successfully created!
    </div>

    <div className={styles.boxMessage}>
      You can go back and sign in
    </div>
  </div>
);

export { CreateAccountSuccessBox };
