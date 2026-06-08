import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const Home = lazy(() => import("./Pages/Home"));
const About = lazy(() => import("./Pages/About"));
const Services = lazy(() => import("./Pages/Services"));
const Contacts = lazy(() => import("./Pages/Contacts"));
const Blogs = lazy(() => import("./Pages/Blogs"));
const BlogDetail = lazy(() => import("./Pages/BlogDetail"));
const Membership = lazy(() => import("./Pages/Membership"));
const AdminLogin = lazy(() => import("./Pages/Admin/Login"));
const AdminDashboard = lazy(() => import("./Pages/Admin/Dashboard"));
const CreatePost = lazy(() => import("./Pages/Admin/CreatePost"));
const EditPost = lazy(() => import("./Pages/Admin/EditPost"));
const Coworking = lazy(() => import("./Pages/Coworking"));
const Policypage = lazy(() => import("./Pages/Policypage"));

function ScrollManager({ lenisRef }) {
  const location = useLocation();

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    const frameIds = [];

    const scrollToTop = () => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.stop?.();
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.start?.();
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    scrollToTop();

    const resetAcrossFrames = (framesRemaining) => {
      const frameId = window.requestAnimationFrame(() => {
        scrollToTop();
        if (framesRemaining > 1) {
          resetAcrossFrames(framesRemaining - 1);
        } else {
          lenisRef.current?.resize?.();
          ScrollTrigger.refresh();
        }
      });
      frameIds.push(frameId);
    };

    resetAcrossFrames(3);

    return () => frameIds.forEach((id) => window.cancelAnimationFrame(id));
  }, [location.pathname, location.search, location.hash, location.key, lenisRef]);

  return null;
}

function App() {
  const location = useLocation();
  const lenisRef = useRef(null);
  const isAdminPage = location.pathname.startsWith("/admin");

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      lerp: 0.12,
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.75,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;
    window.history.scrollRestoration = "manual";

    const onScroll = () => ScrollTrigger.update();
    const onResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };

    lenis.on("scroll", onScroll);
    window.addEventListener("resize", onResize);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(raf);
      lenis.off("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, []);

  return (
    <>
      <ScrollManager lenisRef={lenisRef} />
      {!isAdminPage && <Navbar />}
      <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contacts />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-post" element={<CreatePost />} />
          <Route path="/admin/edit-post/:id" element={<EditPost />} />
          <Route path="/coworking" element={<Coworking />} />
          <Route path="/:policySlug" element={<Policypage />} />
        </Routes>
      </Suspense>
      {!isAdminPage && <Footer />}
    </>
  );
}

function RootApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default RootApp;
