import Link from '@components/Link';
import React from 'react';
import type { CardPostProps } from './Card';

function LookFor({ items }: { items: CardPostProps[] }) {
  console.log('asdsad', items.length);
  return (
    <div className="flex flex-col justify-center gap-12">
      {items.map((item: CardPostProps, idx: number) => (
        <div
          key={idx}
          className="flex flex-col justify-center border-b border-solid pb-5"
        >
          <Link
            href={`thread/${item.id}`}
            className="outline-none flex flex-col"
          >
            <div className="font-semibold">{item.subject}</div>
          </Link>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {item.tags.map((tag, idx: number) => (
                <div
                  className="text-[0.8rem] text-accent-500 font-semibold bg-accent-100 p-1 rounded"
                  key={idx}
                >
                  {tag.name}
                </div>
              ))}
            </div>
            <div>
              <div>{item.initialMessage.user.email}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LookFor;
