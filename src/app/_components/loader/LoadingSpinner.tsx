"use client";

import styles from "@src/app/_components/loader/styles.module.css";

const LoadingSpinner = () => {
  return (
    <div className={`${styles.loaderContainer} ${styles.loaderContainerMiddle}`} id="loaderContainer">
      <svg
        className={styles.loaderSpinner}
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
      >
        <circle cx="32" cy="32" r="32" fill="white"></circle>
        <path
          d="M56 32C56 36.7468 54.5924 41.3869 51.9553 45.3337C49.3181 49.2805 45.5698 52.3566 41.1844 54.1731C36.799 55.9896 31.9734 56.4649 27.3178 55.5388C22.6623 54.6128 18.3859 52.327 15.0294 48.9706C11.673 45.6141 9.3872 41.3377 8.46115 36.6822C7.53511 32.0266 8.01039 27.201 9.82689 22.8156C11.6434 18.4302 14.7195 14.6819 18.6663 12.0447C22.6131 9.40758 27.2532 8 32 8"
          stroke="#005EB8"
          strokeWidth="7"
        ></path>
      </svg>
    </div>
  );
};

export default LoadingSpinner;
