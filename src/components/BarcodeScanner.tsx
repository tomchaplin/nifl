import { v4 as uuidv4 } from 'uuid';
import { Html5QrcodeScanner } from "html5-qrcode";
import { onCleanup, onMount } from 'solid-js'

export default function BarcodeScanner(props: any) {

  let qrCodeScannerRef: HTMLDivElement;

  onMount(async () => {
    const id = qrCodeScannerRef.id || uuidv4();
    qrCodeScannerRef.id = id;

    const scanner = new Html5QrcodeScanner(id, { fps: 10, qrbox: 250 }, false);

    onCleanup(() => { scanner.clear() })

    function onScanSuccess(decodedText: string, _decodedResult: any) {
      props.onSuccess(decodedText);
    }

    function onScanError(errorMessage: string) {
      props.onError(errorMessage)
    }

    scanner.render(onScanSuccess, onScanError)

  })


  return (
    <div ref={qrCodeScannerRef}></div>
  );
}
