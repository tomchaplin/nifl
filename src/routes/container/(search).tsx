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
      sql_query = {
        order: [['date_added', 'DESC']]
      }
    } else {
      sql_query = {
        order: [['date_added', 'DESC']],
        where: {
          contents: {
            [Op.substring]: query
          }
        }
      }
    }
    const all_containers = await Container.findAll(sql_query);
    const as_json = all_containers.map((c: any) => c.toJSON());
    return as_json;
  }, {
    key: () =>
      searchParams.query == undefined ? "" : searchParams.query
  })
}


export default function ContainerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const containers = useRouteData<typeof routeData>();

  const query = searchParams.query == undefined ? "" : searchParams.query;
  const setQuery = (newQuery: string) => {
    setSearchParams({ ...searchParams, query: newQuery })
  };

  const input_class = "appearance-none border w-full rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-2";
  const basic_class = "py-2 px-2";
  const th_class = basic_class;
  const th_div_class = "flex justify-start items-center"

  const buildTd = (container: any, contents: any, full_width: boolean) => (
    <td class={full_width ? "sm:w-3/5" : ""}>
      <A href={`/container/${container.b64_code}`} class={basic_class + " block w-full h-full"}>
        {contents}
      </A>
    </td>
  )

  // TODO: Make this reactive to query params and add links
  const buildArrow = (field: string) => {
    const div_class = "block text-lg cursor-pointer bg-sky-900 px-1 rounded-xl ml-2"
    return field == 'date_added_iso_string'
      ? (<div class={div_class}>&darr;</div>)
      : (<div class={div_class}>&ndash;</div>)
  }

  const buildTh = (title: string, field: string) => (
    <th class={th_class}>
      <div class={th_div_class}>
        <span>{title}</span>
        {buildArrow(field)}
      </div>
    </th>
  )

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
          class="bg-sky-800 text-gray-200">
          <tr>
            {buildTh('Contents', 'contents')}
            {buildTh('Servings', 'servings')}
            {buildTh('Date Added', 'date_added_iso_string')}
          </tr>
        </thead>
        <tbody>
          <For each={containers()}>
            {(container) =>
              <tr class="hover:bg-sky-100 border-t border-slate-200">
                {buildTd(container, container.contents, true)}
                {buildTd(container, container.servings, false)}
                {buildTd(container, container.date_added_iso_string, false)}
              </tr>
            }
          </For>
        </tbody>
      </table>
    </>
  );
}
