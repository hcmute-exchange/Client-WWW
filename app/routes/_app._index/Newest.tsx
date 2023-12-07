import Card, { type CardPostProps } from './Card';

function Newest({ items }: { items: CardPostProps[] }) {
  items.map((item: CardPostProps, idx: number) => console.log(item.subject));
  return (
    <div className="flex gap-4 flex-col">
      {items.map((item: CardPostProps, idx: number) => (
        <Card item={item} idx={idx} />
      ))}
    </div>
  );
}

export default Newest;
