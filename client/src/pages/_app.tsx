import { PrivateLayout } from "@/containers/PrivateLayout/PrivateLayout";
import { PublicLayout } from "@/containers/PublicLayout/PublicLayout";
import { ThemeContextWrapper } from "@/hooks";
import { AuthProvider } from "@/hooks/useAuth/useAuth";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const Layout = router.pathname.startsWith("/auth/")
    ? PublicLayout
    : PrivateLayout;

  return (
    <AuthProvider>
      <ThemeContextWrapper>
        <Layout className={`${inter.className}`}>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </ThemeContextWrapper>
    </AuthProvider>
  );
}
