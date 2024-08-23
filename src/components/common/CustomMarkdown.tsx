import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Components } from 'react-markdown';

type CustomMarkdownProps = {
  markdown: string;
};

const component: Partial<Components> = {
  h1(props) {
    const { children } = props;
    return (
      <>
        <h1 className="text-3xl">{children}</h1>
        <hr className="my-3" />
      </>
    );
  },
  h2(props) {
    const { children } = props;
    return <h2 className="mb-3 text-2xl">{children}</h2>;
  },
  h3(props) {
    const { children } = props;
    return <h3 className="mb-3 text-xl">{children}</h3>;
  },
  h4(props) {
    const { children } = props;
    return <h3 className="mb-3 text-lg">{children}</h3>;
  },
  h5(props) {
    const { children } = props;
    return <h3 className="mb-3 text-base">{children}</h3>;
  },
  h6(props) {
    const { children } = props;
    return <h3 className="mb-3 text-sm">{children}</h3>;
  },
  hr() {
    return <hr className="my-5" />;
  },
  a(props) {
    const { href, children } = props;
    return (
      <a href={href} className="text-cyan-700">
        {children}
      </a>
    );
  },
  img(props) {
    const { src, alt } = props;
    return <img src={src} alt={alt} className="m-auto" />;
  },
  blockquote(props) {
    const { children } = props;
    return <blockquote className="border-l-[3px] border-[#20C997] bg-[#F8F9FA] p-4">{children}</blockquote>;
  },
  table(props) {
    const { children } = props;
    return <table className="border-collapse overflow-hidden rounded-md shadow-md">{children}</table>;
  },
  th(props) {
    const { children, style } = props;
    return (
      <th style={style} className="bg-[#4CAF50] p-5 font-bold uppercase text-white">
        {children}
      </th>
    );
  },
  td(props) {
    const { children, style } = props;
    return (
      <td style={style} className="last:border-b-none border-b border-[#dddddd] p-5">
        {children}
      </td>
    );
  },
  tr(props) {
    const { children, style } = props;
    return (
      <tr style={style} className="border-b border-[#dddddd] transition duration-300 even:bg-[#f4f4f4]">
        {children}
      </tr>
    );
  },
  ol(props) {
    const { children } = props;
    const timeKey = Date.now();
    return (
      <ol key={timeKey} className="ml-10 list-decimal">
        {children}
      </ol>
    );
  },
  ul(props) {
    const { children } = props;
    const timeKey = Date.now();
    return (
      <ul key={timeKey} className="ml-10 list-disc">
        {children}
      </ul>
    );
  },
  section(props) {
    const { children, className } = props;

    if (className === 'footnotes') {
      const newChildren = React.Children.toArray(children).slice(2) as React.ReactElement[];
      return (
        <section className={`${className} mt-10 border-t border-[#ddd] bg-[#f9f9f9] p-5`}>
          <h3 className="mb-2 font-bold">각주 모음</h3>
          {newChildren}
        </section>
      );
    }
    return <section className={className}>{children}</section>;
  },
  code(props) {
    const { children, className } = props;
    return <code className={`${className} rounded-sm border-none bg-[#E9ECEF] px-2`}>{children}</code>;
  },
};

export default function CustomMarkdown({ markdown }: CustomMarkdownProps) {
  return (
    <section className="rounded-md border border-input p-10 text-sm">
      <Markdown components={component} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {markdown}
      </Markdown>
    </section>
  );
}
