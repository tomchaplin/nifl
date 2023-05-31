// @refresh reload
import { Suspense } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";

export default function Root() {
  const location = useLocation();
  const active = (path: string) =>
    (path == "/" ? path == location.pathname : location.pathname.startsWith(path))
      ? "bg-slate-800 rounded-t-xl"
      : "hover:bg-slate-800";
  return (
    <Html lang="en">
      <Head>
        <Title>Nifl</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="manifest" href="/manifest.json" />
        <Link rel="preconnect" href="https://fonts.googleapis.com" />
        <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <Link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap" rel="stylesheet" /> 
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <nav class="bg-slate-900 flex justify-center pt-2">
              <ul class="max-w-screen-md flex items-center justify-around text-white text-xl w-full">
                <li class={`rounded-t-xl p-3 pb-2 ${active("/")} mx-6`}>
                  <A href="/">Scan</A>
                </li>
                <li class="bg-slate-900 p-3 text-2xl">
                  <A href="/">Nifl</A>
                </li>
                <li class={`rounded-t-xl p-3 pb-2 ${active("/container")} mx-6`}>
                  <A href="/container">Search</A>
                </li>
              </ul>
            </nav>
            <main class="text-center mx-auto text-gray-700 p-4 max-w-screen-md">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
