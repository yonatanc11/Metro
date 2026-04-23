import type { StrapiBlockNode, StrapiTextNode } from '@/lib/cms/types';

function HeadingText({ node }: { node: StrapiTextNode }) {
  if (node.bold) return <span className="text-primary">{node.text}</span>;
  return <>{node.text}</>;
}

export function RichHeading({ blocks }: { blocks: StrapiBlockNode[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <span key={i} className="block">
          {block.children.map((child, j) => (
            <HeadingText key={j} node={child} />
          ))}
        </span>
      ))}
    </>
  );
}
