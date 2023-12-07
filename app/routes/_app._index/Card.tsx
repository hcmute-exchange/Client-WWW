import Link from '@components/Link';
import type { GetPostResult } from './type';
import { useEffect, useState } from 'react';
import { formatRelative, addDays } from 'date-fns';
import { z } from 'zod';
import { t, type TFunction } from 'i18next';
export type CardPostProps = GetPostResult;
function Card(props: { item: CardPostProps; idx: number }) {
  const [tags, setTags] = useState<string[]>();
  useEffect(() => {
    if (props.item) {
      setTags(props.item.tags.map((x) => x.name));
    }
  }, [props.item]);
  function DetachedString(email: string): string {
    const parts: string[] = email.split('g');
    return parts[0];
  }
  return (
    <div
      className="h-[8rem] grid grid-cols-[1fr_4fr] border-solid border-primary-300 border rounded"
      key={props.idx}
    >
      <div className="flex flex-col justify-center items-center">
        <div>{props.item.initialMessage.votes.length}: Votes</div>
        <div>{props.item.views.length}: Views</div>
      </div>
      <div className="flex flex-col justify-center px-4 gap-3">
        <Link
          href={`/thread/${props.item.id}`}
          className="outline-none flex flex-col"
        >
          <h5 className="font-semibold">{props.item.subject}</h5>
        </Link>
        <div className="flex w-[95%] justify-between items-center">
          <div className="flex gap-2">
            {tags?.map((tag: string, idx: number) => (
              <div
                className="text-[0.8rem] text-accent-500 font-semibold bg-accent-100 p-1 rounded"
                key={idx}
              >
                {tag}
              </div>
            ))}
          </div>

          <div className="flex gap-3 items-center mt-1">
            <div className="">
              {DetachedString(props.item.initialMessage.user.email)}
            </div>
            <span className="text-[0.7rem]">
              {formatRelative(
                addDays(new Date(props.item.createdTime), 0),
                new Date()
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
