import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  FolderOutlined,
  AppstoreAddOutlined,
  GiftOutlined,
  PictureOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  type MenuItem = Required<MenuProps>['items'][number];
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: 'sub1',
      label: 'Dashboard',
      icon: <MailOutlined />,
    },
    {
      key: 'sub2',
      label: 'Quản lý sản phẩm',
      icon: <AppstoreOutlined />,
      children: [
        { key: 'productlist', label: 'Danh sách sản phẩm' },
        { key: 'addproduct', label: 'Thêm mới sản phẩm' },
      ],
    },
    {
      key: 'sub6',
      label: 'Quản lý biến thể',
      icon: <AppstoreAddOutlined />,
      children: [
        { key: 'variantlist', label: 'Danh sách biến thể' },
        { key: 'addvariant', label: 'Thêm mới biến thể' },
      ],
    },
    {
      key: 'sub7',
      label: 'Quản lý blog',
      icon: <FolderOutlined />,
      children: [
        { key: 'blog-list', label: 'Danh sách blog' },
        { key: 'blog-add', label: 'Thêm blog' },
      ],
    },
    {
      key: "sub15",
      label: "Quản lý danh mục blog",
      icon: <FolderOutlined />,
      children: [
        { key: "blog-category-list", label: "Danh sách danh mục blog" },
        { key: "blog-category-add", label: "Thêm danh mục blog" },
      ],
    },

    {
      key: 'sub3',
      label: 'Quản lý danh mục',
      icon: <FolderOutlined />,
      children: [
        { key: 'categorylist', label: 'Danh sách danh mục' },
        { key: 'addcategory', label: 'Thêm mới danh mục' },
      ],
    },
    {
      key: 'sub8',
      label: 'Quản lý banner',
      icon: <PictureOutlined />,
      children: [
        { key: 'bannerlist', label: 'Danh sách banner' },
        { key: 'addbanner', label: 'Thêm mới banner' },
      ],
    },
    {
      key: 'sub5',
      label: 'Quản lý tài khoản',
      icon: <UserOutlined />,
      children: [
        { key: 'userlist', label: 'Danh sách người dùng' }
      ],
    },
    {
      key: 'sub9',
      label: 'Quản lý khuyến mãi',
      icon: <GiftOutlined />,
      children: [
        { key: 'couponlist', label: 'Danh sách mã giảm giá' },
        { key: 'addcoupon', label: 'Thêm mã giảm giá' },
      ],
    },
    {
      key: 'sub4',
      label: 'Quản lý đơn hàng',
      icon: <SettingOutlined />,
      children: [
        { key: 'orderlist', label: 'Danh sách đơn hàng' },
      ],
    },
    {
      key: "sub16",
      label: "Quản lý bình luận",
      icon: <FolderOutlined />,
      children: [
        { key: "reviewlist", label: "Danh sách bình luận" },
      ],
    },
    {
      key: "chat",
      label: "Chat tư vấn",
      icon: <MessageOutlined />,
    },
    {
      type: 'divider',
    },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'addproduct':
        navigate('/admin/product-add');
        break;
      case 'productlist':
        navigate('/admin/product-list');
        break;
      case 'variantlist':
        navigate('/admin/variant-list');
        break;
      case 'addvariant':
        navigate('/admin/variant-add');
        break;
      case 'categorylist':
        navigate('/admin/category-list');
        break;
      case 'addcategory':
        navigate('/admin/category-add');
        break;
      case 'userlist':
        navigate('/admin/user-list');
        break;
      case 'adminList':
        navigate('/admin/admin-list');
        break;
      case 'couponlist':
        navigate('/admin/coupon-list');
        break;
      case 'addcoupon':
        navigate('/admin/coupon-add');
        break;
      case 'orderlist':
        navigate('/admin/order-list');
        break;
      case 'blog-list':
        navigate('/admin/blog-list');
        break;
      case 'blog-add':
        navigate('/admin/blog-add');
        break;
      case "blog-category-list":
        navigate("/admin/blog-category-list");
        break;
      case "blog-category-add":
        navigate("/admin/blog-category-add");
        break;
      case "blog-category-deleted":
        navigate("/admin/blog-category-deleted");
        break;
      case "reviewlist":
        navigate("/admin/review-list");
        break;

      case "addbanner":
        navigate("/admin/banner-add");
        break;
      case "bannerlist":
        navigate("/admin/banner-list");
        break;

      case "chat":
        navigate("/admin/chat");
        break;

      default:
        navigate('');
        break;
    }
  };

  return (
    <div className="w-1/5 h-screen bg-white">
      <Menu
        onClick={onClick}
        style={{ width: '100%' }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      />
    </div>
  );
};

export default AdminSidebar;
