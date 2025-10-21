import React from 'react';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the STO Application</h1>
      <Link href="/dashboard">
        <button>PWA Application</button>
      </Link>
      {/* Other content */}
    </div>
  );
};

export default HomePage;
