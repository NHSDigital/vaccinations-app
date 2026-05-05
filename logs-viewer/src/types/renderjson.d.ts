declare module "renderjson-2" {
  interface RenderJson {
    (json: JsonObject): HTMLElement;
    set_icons(show: string, hide: string): RenderJson;
    set_show_to_level(level: number | "all"): RenderJson;
    set_max_string_length(length: number | "none"): RenderJson;
    set_sort_objects(sort_bool: boolean): RenderJson;
    set_replacer(replacer: (key: string, value: never) => never): RenderJson;
    set_collapse_msg(collapse_msg: (len: number) => string): RenderJson;
    set_property_list(prop_list: string[]): RenderJson;
    set_show_by_default(show: boolean): RenderJson;
  }
  const renderjson: RenderJson;
  export default renderjson;
}
