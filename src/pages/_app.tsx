/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "react-toastify/dist/ReactToastify.css";
import "reactflow/dist/style.css";
import "../styles/globals.css";

import { ReactFlowProvider } from "reactflow";
import { ToastContainer } from "react-toastify";
import { MainProvider } from "../context/MainCtx";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MainProvider>
        <ReactFlowProvider>
          <Component {...pageProps} />
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            theme="colored"
          />
        </ReactFlowProvider>
      </MainProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
