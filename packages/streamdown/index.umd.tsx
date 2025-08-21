'use client';

import type { ComponentProps } from 'react';
import ReactMarkdown, { type Options } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import hardenReactMarkdownImport from 'harden-react-markdown';
import { components as defaultComponents } from './lib/components';
import { parseMarkdownIntoBlocks } from './lib/parse-blocks';
import { parseIncompleteMarkdown } from './lib/parse-incomplete-markdown';
import { cn } from './lib/utils';

// Safely access React from window with fallbacks
function getReact() {
  if (typeof window !== 'undefined' && window.React) {
    return window.React;
  }
  if (typeof globalThis !== 'undefined' && globalThis.React) {
    return globalThis.React;
  }
  throw new Error('React not found on window or globalThis');
}

const React = getReact();

// Safe hook extraction with fallbacks
const memo = React.memo || ((component: any) => component);
const useMemo = React.useMemo || ((fn: () => any, deps: any[]) => fn());
const useId = React.useId || (() => `id-${Math.random().toString(36).substr(2, 9)}`);

type HardenReactMarkdownProps = Options & {
  defaultOrigin?: string;
  allowedLinkPrefixes?: string[];
  allowedImagePrefixes?: string[];
};

// Handle both ESM and CJS imports
const hardenReactMarkdown =
  (hardenReactMarkdownImport as any).default || hardenReactMarkdownImport;

// Create a hardened version of ReactMarkdown
const HardenedMarkdown: ReturnType<typeof hardenReactMarkdown> =
  hardenReactMarkdown(ReactMarkdown);

export type StreamdownProps = HardenReactMarkdownProps & {
  parseIncompleteMarkdown?: boolean;
  className?: string;
};

type BlockProps = HardenReactMarkdownProps & {
  content: string;
  shouldParseIncompleteMarkdown: boolean;
};

const Block = memo(
  ({ content, shouldParseIncompleteMarkdown, ...props }: BlockProps) => {
    const parsedContent = useMemo(
      () =>
        typeof content === 'string' && shouldParseIncompleteMarkdown
          ? parseIncompleteMarkdown(content.trim())
          : content,
      [content, shouldParseIncompleteMarkdown]
    );

    return React.createElement(HardenedMarkdown, props, parsedContent);
  },
  (prevProps, nextProps) => prevProps.content === nextProps.content
);

export const Streamdown = memo(
  ({
    children,
    allowedImagePrefixes,
    allowedLinkPrefixes,
    defaultOrigin,
    parseIncompleteMarkdown: shouldParseIncompleteMarkdown = true,
    components,
    rehypePlugins,
    remarkPlugins,
    className,
    ...props
  }: StreamdownProps) => {
    // Parse the children to remove incomplete markdown tokens if enabled
    const generatedId = useId();
    const blocks = useMemo(
      () =>
        parseMarkdownIntoBlocks(typeof children === 'string' ? children : ''),
      [children]
    );

    return React.createElement(
      'div',
      { className: cn('space-y-4', className), ...props },
      blocks.map((block, index) =>
        React.createElement(Block, {
          allowedImagePrefixes: allowedImagePrefixes ?? ['*'],
          allowedLinkPrefixes: allowedLinkPrefixes ?? ['*'],
          components: {
            ...defaultComponents,
            ...components,
          },
          content: block,
          defaultOrigin,
          key: `${generatedId}-block_${index}`,
          rehypePlugins: [rehypeKatex, ...(rehypePlugins ?? [])],
          remarkPlugins: [remarkGfm, remarkMath, ...(remarkPlugins ?? [])],
          shouldParseIncompleteMarkdown,
        })
      )
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Streamdown.displayName = 'Streamdown';

export default Streamdown;

// Global assignment for UMD
if (typeof window !== 'undefined') {
  (window as any).Streamdown = Streamdown;
}
