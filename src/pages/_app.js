import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'react-quill-new/dist/quill.snow.css';

export default function App({ Component, pageProps }) {
  return (
    <>
    <ToastContainer
      theme="light"
      position="top-right"
      autoClose={4000}
      closeOnClick
      pauseOnHover={false}
    /> 
    <Component {...pageProps} />
    </>
  );
}
