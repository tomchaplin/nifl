import { For } from "solid-js";
import { A, useRouteData } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Container from "~/models/container";

export function routeData() {
  return createServerData$(async () => {
    const all_containers = await Container.findAll();
    console.log(all_containers);
    return all_containers;
  })
}

export default function ContainerSearch() {
  const containers = useRouteData<typeof routeData>();

  return (
    <>
      <h1 class="max-6-xs text-6xl text-sky-700 fon-thin uppercase my-16">
        Search
      </h1>
      <ul class="text-left">
        <For each={containers()}>
          {(container) =>
            <li>
              <A href={`/container/${container.b64_code}`}>{container.contents}</A>
            </li>
          }
        </For>
      </ul>
    </>
  );
}
