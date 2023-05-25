import { For } from "solid-js";
import { A, useRouteData, useSearchParams } from "solid-start";
import { createServerData$ } from "solid-start/server";
import Container from "~/models/container";
import { Op } from "sequelize";
import sequelize from "~/models/db";

const DEFAULT_QUERY = "";
const DEFAULT_ORDER = ["date_added", "DESC"]

export function routeData() {
  const [searchParams] = useSearchParams();
  return createServerData$(async ([query, order]) => {
    let sql_query;
    let nulls_last_order = [
      [sequelize.literal(`CASE WHEN ${order[0]} = '' THEN 0 ELSE 1 END`), 'DESC'],
      order,
    ]
    if (query == "") {
      sql_query = {
        order: nulls_last_order

      }
    } else {
      sql_query = {
        order: nulls_last_order,
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
    key: () => {
      let query = searchParams.query == undefined ? DEFAULT_QUERY : searchParams.query;
      let order = searchParams.order == undefined ? DEFAULT_ORDER : JSON.parse(searchParams.order);
      return [query, order]
    }
  })
}


export default function ContainerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const containers = useRouteData<typeof routeData>();

  const query = () => searchParams.query == undefined ? DEFAULT_QUERY : searchParams.query;
  const setQuery = (newQuery: string) => {
    setSearchParams({ ...searchParams, query: newQuery })
  };

  const order = () => searchParams.order == undefined ? DEFAULT_ORDER : JSON.parse(searchParams.order);
  const setOrder = (newOrder: string[]) => {
    setSearchParams({ ...searchParams, order: JSON.stringify(newOrder) })
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
    const current_field = order()[0];
    const current_direction = order()[1]

    const arrowOnClick = (e) => {
      const current_field = order()[0];
      const current_direction = order()[1]
      e.preventDefault();
      const direction = current_field == field ? (
        current_direction == "ASC" ? "DESC" : "ASC"
      ) : "ASC";
      const new_order = [field, direction];
      setOrder(new_order);
    }

    const contents = field == current_field
      ? (current_direction == "DESC" ? "↑" : "↓")
      : "–"

    return (<div class={div_class} onclick={arrowOnClick}>{contents}</div>)
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
          value={query()}
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
            {buildTh('Date Added', 'date_added')}
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
