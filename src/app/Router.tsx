import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout/Layout";
import ScrollToTop from "@/components/common/ScrollToTop";
import Home from "@/pages/Home";
import MyPage from "@/pages/MyPage";
import NotFound from "@/pages/NotFound";

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/me" element={<MyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
