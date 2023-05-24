import { For } from "solid-js";
import { A, useRouteData, useSearchParams } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Container from "~/models/container";
import { Op } from "sequelize";

export function routeData() {
  const [searchParams] = useSearchParams();
  return createServerData$(async (query: string) => {
    let sql_query;
    if (query == "") {
      sql_query = {}
    } else {
      sql_query = {
        where: {
          contents: {
            [Op.substring]: query
          }
        }
      }
    }
    const all_containers = await Container.findAll(sql_query);
    const as_json = all_containers.map(c => c.toJSON());
    console.log(all_containers)
    return as_json;
  }, {
    key: () => {
      if (searchParams.query == undefined) {
        return ""
      } else {
        return searchParams.query
      }
    }
  })
}

export default function ContainerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const containers = useRouteData<typeof routeData>();
  const input_class = "appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-2";

  const query = searchParams.query == undefined ? "" : searchParams.query;
  const setQuery = (newQuery: string) => {
    setSearchParams({ ...searchParams, query: newQuery })
  };

  return (
    <>
      <div class="mb-4 group">
        <input
          type="text"
          name="barcode_string"
          value={query}
          placeholder="Search term"
          class={input_class}
          oninput={(e) => { setQuery(e.target.value) }}
        />
      </div>
      <table class="min-w-full text-left border-collapse table-fixed">
        <thead
          class="border-b">
          <tr>
            <th>Contents</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          <For each={containers()}>
            {(container) =>
              <tr class="hover:bg-slate-200">
                <td>
                  <A href={`/container/${container.b64_code}`}>
                    {container.contents}
                  </A>
                </td>
                <td>{container.date_added_iso_string}</td>
              </tr>
            }
          </For>
        </tbody>
      </table>
    </>
  );
}
