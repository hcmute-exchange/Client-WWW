import React from 'react';
import Vote from './Vote';

function Message(props: any) {
  return (
    <div key={props.idx} className="w-full flex flex-col">
      <div className="flex items-start gap-3 hover:bg-primary-50 pt-2 px-2 group relative">
        <div className="flex flex-col">
          <div className="h-10 bg-primary-950 aspect-square rounded-full" />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex gap-6 items-center font-semibold">
            <div className="">{props.item.name}</div>
            <p className="text-xs text-primary-700">{props.item.date}</p>
          </div>
          <p>{props.item.message}</p>
        </div>
        <div className="right-8 -top-5 absolute group-hover:block hidden">
          sad
        </div>
      </div>
    </div>
  );
}

export default Message;
