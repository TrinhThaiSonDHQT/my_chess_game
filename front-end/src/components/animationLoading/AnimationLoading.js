import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import clsx from 'clsx';
import styles from './AnimationLoading.module.scss';

function AminationLoading({ children }) {
  let isFetching = useSelector((state) => state.auth?.login?.isFetching);

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    setShowLoader(isFetching);
  }, [isFetching]);

  return (
    <div className={styles.animationLoading}>
      <div className={styles.bounceLoader}>
        <BounceLoader color="rgb(127,174,76)" loading={showLoader} size={50} />
      </div>
      <div className={clsx({ [styles.opacity]: showLoader })}>{children}</div>
    </div>
  );
}

export default AminationLoading;
