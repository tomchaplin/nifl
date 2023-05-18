import { Navigate } from "solid-start";
import BarcodeScanner from "~/components/BarcodeScanner"
import { createSignal, Show } from "solid-js";

export default function Home() {

  const [code, setCode] = createSignal<string | null>(null)

  function reportCode(code: string) {
    const b64_encoded = btoa(code);
    setCode(b64_encoded)
  }

  function reportError(_msg: string) { }


  return (
    <>
      <BarcodeScanner
        onSuccess={reportCode}
        onError={reportError}
      />
      <Show when={code() !== null}>
        <Navigate href={`/container/${code()}`} />
      </Show>
    </>
  );
}
