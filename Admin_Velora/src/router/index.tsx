import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../component/layout/AdminLayout";
import Dasborad from "../pages/Dasboard/Dashboard";

import ProductList from "pages/Product/ProductList";
import ProductAdd from "pages/Product/ProductAdd";
import ProductEdit from "pages/Product/ProductEdit";
import ProductDelete from "pages/Product/ProductDelete";

import CategoryList from "pages/Category/CategoryList";
import CategoryAdd from "pages/Category/CategoryAdd";
import CategoryEdit from "pages/Category/CategoryEdit";
import CategoryInProduct from "pages/Category/CategoryInProduct";
import CategoryDelete from "pages/Category/CategoryDelete";

import VariantList from "pages/Variant/VariantList";
import VariantAdd from "pages/Variant/VariantAdd";
import VariantEdit from "pages/Variant/VariantEdit";
import VariantDelete from "pages/Variant/VariantDelete";

import BlogList from "pages/Blog/BlogList";
import BlogAdd from "pages/Blog/BlogAdd";
import BlogEdit from "pages/Blog/BlogEdit";
import BlogDeleted from "pages/Blog/BlogDeleted";

import BlogCategoryList from "pages/blogcategory/BlogCategoryList";
import BlogCategoryAdd from "pages/blogcategory/BlogCategoryAdd";
import BlogCategoryEdit from "pages/blogcategory/BlogCategoryEdit";
import BlogCategoryDeleted from "pages/blogcategory/BlogCategoryDeleted";

import CouponList from "pages/Coupon/CouponList";
import CouponAdd from "pages/Coupon/CouponAdd";
import CouponEdit from "pages/Coupon/CouponEdit";
import CouponDelete from "pages/Coupon/CouponDelete";

import OrderList from "pages/Order/OrderList";
import OrderDetail from "pages/Order/OrderDetail";
import OrderUpdate from "pages/Order/OrderUpdate";

import UserList from "pages/Account/UserList";
import UserDetail from "pages/Account/UserDetail";

import AdminLogin from "pages/Login/Login";
import RequireAdmin from "pages/Login/RequireAdmin";

import ReviewList from "pages/Review/ReviewList";

import BannerList from "pages/Banner/BannerList";
import BannerAdd from "pages/Banner/BannerAdd";
import BannerEdit from "pages/Banner/BannerEdit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, element: <Dasborad /> },

      // Product
      { path: "product-list", element: <ProductList /> },
      { path: "product-add", element: <ProductAdd /> },
      { path: "product-edit/:id", element: <ProductEdit /> },
      { path: "product-delete", element: <ProductDelete /> },

      // Category
      { path: "category-list", element: <CategoryList /> },
      { path: "category-add", element: <CategoryAdd /> },
      { path: "category-edit/:id", element: <CategoryEdit /> },
      { path: "category-in-product/:id", element: <CategoryInProduct /> },
      { path: "category-delete", element: <CategoryDelete /> },

      // Variant
      { path: "variant-list", element: <VariantList /> },
      { path: "variant-add", element: <VariantAdd /> },
      { path: "variant-edit/:id", element: <VariantEdit /> },
      { path: "variant-delete", element: <VariantDelete /> },

      // Blog
      { path: "blog-list", element: <BlogList /> },
      { path: "blog-add", element: <BlogAdd /> },
      { path: "blog-edit/:slug", element: <BlogEdit /> },
      { path: "blog-deleted", element: <BlogDeleted /> },

      // Blog Category
      { path: "blog-category-list", element: <BlogCategoryList /> },
      { path: "blog-category-add", element: <BlogCategoryAdd /> },
      { path: "blog-category-edit/:slug", element: <BlogCategoryEdit /> },
      { path: "blog-category-deleted", element: <BlogCategoryDeleted /> },

      // Coupon
      { path: "coupon-list", element: <CouponList /> },
      { path: "coupon-add", element: <CouponAdd /> },
      { path: "coupon-edit/:id", element: <CouponEdit /> },
      { path: "coupon-delete", element: <CouponDelete /> },

      // Order
      { path: "order-list", element: <OrderList /> },
      { path: "order-detail/:id", element: <OrderDetail /> },
      { path: "order-update/:id", element: <OrderUpdate /> },

      // User
      { path: "user-list", element: <UserList /> },
      { path: "user-detail/:id", element: <UserDetail /> },

      // comment
      { path: "review-list", element: <ReviewList /> },

        //Banner
        { path: "banner-list", element: <BannerList /> },
      { path: "banner-add", element: <BannerAdd /> },
            { path: "banner-edit/:id", element: <BannerEdit /> },
    ],
  },
]);
