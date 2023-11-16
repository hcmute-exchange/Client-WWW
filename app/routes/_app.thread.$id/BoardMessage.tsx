import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import React, { useEffect } from 'react';
import Message from './Message';

function BoardMessage({ dataownerforum, fakedata }: any) {
  // const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollTop =
  //       scrollContainerRef.current.scrollHeight;
  //   }
  // }, []);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex p-2 flex-col justify-start items-start gap-2 border-b border-solid border-primary-200 pb-4">
        <QuestionMarkCircleIcon className="h-10 aspect-square" />
        <h3>{dataownerforum.title}</h3>
        <p className="text-[0.8rem] w-fit text-accent-500 font-semibold bg-accent-100 p-1 rounded">
          reactjs
        </p>
      </div>
      <div
        className="flex flex-col gap-6 mb-2"
        // ref={scrollContainerRef}
      >
        {fakedata.map((_item: any, idx: number) => (
          <div key={idx}>
            <Message item={_item} idx={idx} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardMessage;
