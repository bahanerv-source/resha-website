import { islands, type IslandName } from '../islands/registry';

/**
 * Server-renders an interactive component and marks it for hydration in the browser.
 * Everything outside islands is plain HTML with no JavaScript.
 */
export function Island<N extends IslandName>({ name, props }: { name: N; props: Parameters<(typeof islands)[N]>[0] }) {
  const Comp = islands[name] as (p: typeof props) => React.ReactNode;
  return (
    <div data-island={name} data-props={JSON.stringify(props)} style={{ display: 'contents' }}>
      <Comp {...props} />
    </div>
  );
}
