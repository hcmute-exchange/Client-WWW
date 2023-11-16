import Link from '@components/Link';
import React from 'react';

function LookFor({ items }: any) {
  return (
    <div className="flex flex-col justify-center gap-12">
      {items.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex flex-col justify-center border-b border-solid pb-5"
        >
          <Link href="/" className="outline-none flex flex-col">
            <div className="font-semibold">{item?.title}</div>
          </Link>
          <div className="flex justify-between items-center">
            <div className="text-[0.8rem] text-accent-500 font-semibold bg-accent-100 p-1 rounded">
              reactjs
            </div>
            <div>
              <div>quocanh</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LookFor;
