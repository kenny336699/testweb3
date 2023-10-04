import { CrowdFundingPrivider } from "@/Context/Crowdfunding";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <CrowdFundingPrivider>
        <Navbar />
        <Component {...pageProps} />
        <Footer />
      </CrowdFundingPrivider>
    </>
  );
}
