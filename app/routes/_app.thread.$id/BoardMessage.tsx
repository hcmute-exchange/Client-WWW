import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import React, { useEffect } from 'react';
import type { Post } from '@lib/models/Post';
import MessageComponent from './MessageComponent';
import type { Message } from '@lib/models/Message';

type Props = {
  post: Post;
  messages: Message[] | {};
};

function BoardMessage({ post, messages }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex p-2 flex-col justify-start items-start gap-2 border-b border-solid border-primary-200 pb-4">
        <QuestionMarkCircleIcon className="h-10 aspect-square" />
        <h3>{post.subject}</h3>
        <div className="flex gap-2">
          {post.tags?.map((tag, idx: number) => (
            <div
              className="text-[0.8rem] text-accent-500 font-semibold bg-accent-100 p-1 rounded"
              key={idx}
            >
              {tag.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6 mb-2">
        {messages && Array.isArray(messages) && messages.length > 0
          ? messages.map((_item: any, idx: number) => (
              <div key={idx}>
                <MessageComponent message={_item} />
              </div>
            ))
          : ''}
      </div>
    </div>
  );
}

export default BoardMessage;
