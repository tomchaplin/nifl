import { RouteDataArgs, useRouteData } from "solid-start";
import { createServerAction$, createServerData$, redirect } from "solid-start/server";
import Container from "~/models/container";
import Modal from "~/components/modal";
import { createSignal, Show } from "solid-js";

export function routeData({ params }: RouteDataArgs) {
  const container = createServerData$(async ([_, code]) => {
    const container = await Container.findOne({ where: { b64_code: code } })
    if (container == null) {
      let new_container = Container.build({ b64_code: code, contents: '' })
      return new_container.toJSON()
    } else {
      return container.toJSON()
    }
  }, { key: () => ["container", params.code] })

  return { container }
}

export default function ContainerViewer() {

  const [_submitting, { Form }] = createServerAction$(async (form: FormData, _event) => {
    const action = form.get("action") as string;
    const code = form.get("b64_code");
    const container = await Container.findOne({ where: { b64_code: code } })
    if (action == "delete") {
      if (container != null) {
        await container.destroy();
      }
    } else if (action == "submit") {
      let new_container_data = {
        b64_code: code,
        contents: form.get("contents"),
        date_added: new Date(form.get("date_added_iso_string")),
        description: form.get("description")
      }
      const servings = form.get("servings")
      if (!isNaN(servings)) {
        new_container_data.servings = servings;
      }
      if (container == null) {
        let new_container = Container.build(new_container_data);
        await new_container.save();
      } else {
        container.set(new_container_data)
        await container.save();
      }
    }
    return redirect("/container")
  })


  const { container } = useRouteData<typeof routeData>();

  const [modalShowing, setModalShowing] = createSignal(false);

  const label_class = "block text-gray-700 text-sm font-bold mb-2";
  const input_class = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-2";
  const display_class = input_class + " bg-slate-200"
  const button_class = "text-white font-bold py-2 px-4 rounded"
  const small_button_class = button_class + " text-xs"
  const positive_extra = " bg-blue-500 hover:bg-blue-700"
  const negative_extra = " bg-red-500 hover:bg-red-700"

  return (
    <>
      <Form class="text-left mx-auto">
        <input type="hidden" name="b64_code" value={container()?.b64_code} />
        <div class="mb-4 group">
          <label for="barcode_string" class={label_class}>Barcode</label>
          <input
            type="text"
            name="barcode_string"
            value={container()?.barcode_string}
            class={display_class}
            disabled />
        </div>
        <div class="mb-4 group">
          <label for="contents" class={label_class}>Contents</label>
          <input
            type="text"
            name="contents"
            value={container()?.contents}
            class={input_class} />
        </div>
        <div class="mb-4 group">
          <label for="date_added_iso_string" class={label_class}>Date added</label>
          <input
            type="date"
            name="date_added_iso_string"
            value={container()?.date_added_iso_string}
            class={input_class} />
        </div>
        <div class="mb-4 group">
          <label for="servings" class={label_class}>Servings</label>
          <input
            type="number"
            name="servings"
            value={container()?.servings}
            class={input_class} />
        </div>
        <div class="mb-4 group">
          <label for="description" class={label_class}>Description</label>
          <textarea
            name="description"
            class={input_class}
            rows={4}
          >
            {container()?.description}
          </textarea>
        </div>
        <div class="grid grid-cols-2 gap-6">
          {/* We want submit to appear first in markup so that forms submit with Enter*/}
          <div class="row-start-1 col-start-2 w-full mb-6 flex justify-center">
            <button
              class={button_class + positive_extra}
              type="submit"
              name="action"
              value="submit"
            >
              Submit
            </button>
          </div>
          <div class="row-start-1 col-start-1 w-full mb-6 flex justify-center">
            <button
              class={button_class + negative_extra}
              onclick={e => {
                e.preventDefault();
                setModalShowing(true);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <Show when={modalShowing()}>
          <Modal>
            <h1 class="text-xl text-center font-bold my-6">Are you sure?</h1>
            <div class="grid grid-cols-2 gap-6">
              <div class="w-full mb-6 flex justify-center">
                <button
                  class={small_button_class + negative_extra}
                  type="submit"
                  name="action"
                  value="delete"
                >
                  Delete
                </button>
              </div>
              <div class="w-full mb-6 flex justify-center">
                <button
                  class={small_button_class + positive_extra}
                  onclick={e => {
                    e.preventDefault();
                    setModalShowing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        </Show>
      </Form>
    </>
  );
}
