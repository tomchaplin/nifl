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
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <Html lang="en">
      <Head>
        <Title>Nifl</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="manifest" href="/manifest.json" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <nav class="bg-sky-800 flex justify-center">
              <ul class="container flex items-center justify-center p-3 text-gray-200">
                <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
                  <A href="/">Scan</A>
                </li>
                <li class={`border-b-2 ${active("/container")} mx-1.5 sm:mx-6`}>
                  <A href="/container">Search</A>
                </li>
              </ul>
            </nav>
            <main class="text-center mx-auto text-gray-700 p-4">
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
