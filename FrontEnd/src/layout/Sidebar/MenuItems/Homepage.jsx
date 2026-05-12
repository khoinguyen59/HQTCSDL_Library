import { Assessment, Home, PlayCircle } from '@mui/icons-material';

const Homepage = {
  id: 'general',
  title: 'Quản lý thư viện',
  type: 'group',
  children: [
    {
      id: 'home',
      title: 'Trang chủ',
      type: 'item',
      url: '/',
      icon: <Home />,
      breadcrumbs: false,
    },
    {
      id: 'hqtcsdl',
      title: 'Tổng quan',
      type: 'item',
      url: '/hqtcsdl',
      icon: <Assessment />,
      breadcrumbs: false,
    },
    {
      id: 'hqtcsdl-actions',
      title: 'Giao dịch thư viện',
      type: 'item',
      url: '/hqtcsdl/actions',
      icon: <PlayCircle />,
      breadcrumbs: false,
    },
  ],
};

export default Homepage;
