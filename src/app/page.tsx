'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css'; // Import the CSS module for styling

const Page = () => {
  return (
    <div className={styles.cover}>
      <div className={styles.logoContainer}>
        <Image src="/path/to/logo.png" alt="PT Fuji Seat Indonesia" width={150} height={50} />
      </div>
      <Link href="/dashboard">
        <button className={styles.enterButton}>Enter</button>
      </Link>
    </div>
  );
};

export default Page;
