import Link from '@components/Link';

function Card({ item, idx }: any) {
  return (
    <div className="h-[9rem] grid grid-cols-[1fr_4fr] border-solid border-primary-300 border rounded">
      <div className="flex flex-col justify-center items-center">
        <div>0: Votes</div>
        <div>0: Messages</div>
      </div>
      <div className="flex flex-col justify-center px-4">
        <Link href={`/thread/${idx}`} className="outline-none flex flex-col">
          <div className="font-semibold">{item?.title}</div>
        </Link>
        <div className="flex w-[95%] justify-between items-center">
          <div className="text-[0.8rem] text-accent-500 font-semibold bg-accent-100 p-1 rounded">
            reactjs
          </div>
          <div>
            <div>asdsa</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
