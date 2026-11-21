import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/layout/Layout";
import RequireEntry from "@/app/RequireEntry";
import ScrollToTop from "@/components/common/ScrollToTop";
import Home from "@/pages/Home";
import MyPage from "@/pages/MyPage";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import Login from "@/pages/Login";

const ComponentGallery = import.meta.env.DEV
  ? lazy(() => import("@/pages/ComponentGallery"))
  : null;

export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireEntry />}>
            <Route path="/" element={<Home />} />
            <Route path="/me" element={<MyPage />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
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
