import type { StrapiBlockNode, StrapiTextNode } from '@/lib/cms/types';

function InlineText({ node }: { node: StrapiTextNode }) {
  let el: React.ReactNode = node.text;
  if (node.code) el = <code className="font-mono text-sm">{el}</code>;
  if (node.bold) el = <strong>{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <span className="underline">{el}</span>;
  if (node.strikethrough) el = <span className="line-through">{el}</span>;
  return <>{el}</>;
}

function Block({ block }: { block: StrapiBlockNode }) {
  const children = block.children.map((c, i) => (
    <InlineText key={i} node={c} />
  ));
  switch (block.type) {
    case 'heading': {
      const level = Math.min(Math.max(block.level ?? 2, 1), 6);
      const className =
        'font-headline font-bold uppercase tracking-tighter text-on-surface';
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag className={className}>{children}</Tag>;
    }
    case 'list':
      return (
        <ul className="list-disc space-y-1 pl-6">
          {block.children.map((item, i) => (
            <li key={i}>
              <InlineText node={item} />
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="border-l-2 border-tertiary pl-4 italic">
          {children}
        </blockquote>
      );
    case 'code':
      return (
        <pre className="overflow-x-auto rounded bg-surface-container-lowest p-4 font-mono text-sm">
          {children}
        </pre>
      );
    case 'paragraph':
    default:
      return <p>{children}</p>;
  }
}

export function RichText({ blocks }: { blocks: StrapiBlockNode[] }) {
  return (
    <div className="space-y-4 font-body leading-relaxed">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
