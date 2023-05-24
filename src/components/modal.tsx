export default function Modal(props: any) {
  return (
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-col justify-center"
    >
      <div class="relative mx-auto border w-96 shadow-lg rounded-md bg-white">
        {props.children}
      </div>
    </div>
  )
}