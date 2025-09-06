"use client";
import Hero from "../homes/Hero";
import Feature from "../homes/Feature";
import GeneratedPrompts from "../homes/GeneratedPrompts";
import Reviews from "../homes/Reviews";
import CtaFooter from "../homes/CtaFooter";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import Navbar from "../homes/Navbar";
import Faq from "../homes/Faq";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-pink-400/80 via-yellow-400/60 to-orange-400/80 text-white">
      {/* <Loading> */}
          <Navbar />
          <Hero />
          <Feature />
          <GeneratedPrompts />
          <Reviews />
          <Faq />
          <CtaFooter />
          <Footer />
      {/* </Loading> */}
    </div>
  );
}
