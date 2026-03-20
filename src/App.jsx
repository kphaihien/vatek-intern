import { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import { SyncOutlined } from '@ant-design/icons';
import { ConfigProvider, FloatButton } from 'antd';
import { useTranslation } from 'react-i18next';
import i18n from './i18n/i18n';
function App() {
  const { t } = useTranslation();
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#8100D1',
          },
        }}
      >
        <FloatButton
          icon={<SyncOutlined />}
          tooltip={t('mainPage.changeLanguage')}
          onClick={() => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi')}
        />
        <Outlet />
      </ConfigProvider>
    </>
  );
}

export default App;
