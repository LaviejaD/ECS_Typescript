export interface CreateComponent<t> {
  component_name: string;
  data: t;
}
export function Component<t>(
  component_name: string,
  data: t
): CreateComponent<t> {
  return { component_name, data };
}

