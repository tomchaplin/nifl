import { Navigate } from "solid-start";
import BarcodeScanner from "~/components/BarcodeScanner"
import { createSignal, Show } from "solid-js";

export default function Home() {

  const [code, setCode] = createSignal<string | null>(null)

  const [manualCode, setManualCode] = createSignal<string>('');

  function reportCode(code: string) {
    const b64_encoded = btoa(code);
    console.log(b64_encoded)
    setCode(b64_encoded)
  }

  function reportError(_msg: string) { }

  const input_class = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-2";
  const button_class = "text-white font-bold py-2 px-4 rounded"
  const positive_extra = " bg-sky-600 hover:bg-sky-800"

  return (
    <>
      <BarcodeScanner
        onSuccess={reportCode}
        onError={reportError}
      />
      <form>
        <div class="my-4 flex">
          <input
            class={input_class}
            type="text"
            placeholder="Manual entry"
            value={manualCode()}
            oninput={(e) => {
              setManualCode(e.target.value);
            }}
          />
          <button
            class={button_class + positive_extra + " ml-4"}
            type="submit"
            onclick={(e) => {
              e.preventDefault();
              reportCode(manualCode())
            }}
          >
            Go
          </button>
        </div>
      </form>
      <Show when={code() !== null}>
        <Navigate href={`/container/${code()}`} />
      </Show>
    </>
  );
}
