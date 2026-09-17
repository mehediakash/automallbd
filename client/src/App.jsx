import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import RootLayout from "./Components/RootLayout";
import Home from "./pages/home";
import ShopPage from "./pages/shopPage";
import Productpage from "./pages/productPage";
import CartPage from "./pages/cartPage";
import CheckoutPage from "./pages/checkout";
import OrderSuccessPage from "./pages/orderSucces";
import BrandShop from "./pages/brandShop";
import CategoryShop from "./pages/categoryshop";
import SubCategoryShop from "./pages/subCategoryShop";
import About from "./pages/about";
import Contact from "./pages/contact";
import ShippingRates from "./pages/shippingRates";
import RefundsAndReplacements from "./pages/RefundsAndReplacements";
import TermsCondition from "./pages/termsCondition";
import Ourteam from "./pages/ourteam";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="shop" element={<ShopPage />}>
        <Route path="brand" element={<Productpage />} />
      </Route>
      <Route path="product/:id" element={<Productpage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orderSucces" element={<OrderSuccessPage />} />
      <Route path="/brandshop/:id" element={<BrandShop />} />
      <Route path="/category/:id" element={<CategoryShop />} />
      <Route path="/subCategory/:id" element={<SubCategoryShop />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/shipingrates-policy" element={<ShippingRates />} />
      <Route path="/refund-replace" element={<RefundsAndReplacements />} />
      <Route path="/terms-condition" element={<TermsCondition />} />
      <Route path="/ourteam" element={<Ourteam />} />
    </Route>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
