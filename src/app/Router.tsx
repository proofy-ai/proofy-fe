import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import RequireEntry from "@/app/RequireEntry";
import ScrollToTop from "@/components/common/ScrollToTop";
import Layout from "@/layout/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MyPage from "@/pages/MyPage";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";

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
