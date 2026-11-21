import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout/Layout";
import ScrollToTop from "@/components/common/ScrollToTop";
import Home from "@/pages/Home";
import MyPage from "@/pages/MyPage";
import NotFound from "@/pages/NotFound";

const ComponentGallery = import.meta.env.DEV
  ? lazy(() => import("@/pages/ComponentGallery"))
  : null;

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/me" element={<MyPage />} />
          {ComponentGallery && (
            <Route
              path="/dev/components"
              element={
                <Suspense fallback={null}>
                  <ComponentGallery />
                </Suspense>
              }
            />
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
