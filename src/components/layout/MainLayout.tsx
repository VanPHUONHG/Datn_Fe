import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from 'utils/ScrollToTop';

const MainLayout = () => {
  return (
    <div>
      <ScrollToTop />
      <Header />
      <main className='mt-10'>
        <Outlet />
      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;
