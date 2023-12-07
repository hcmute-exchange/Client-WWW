import Card, { type CardPostProps } from './Card';

function Popular({ items }: { items: CardPostProps[] }) {
  if (items.length == 0) {
    return <div>Dont Have Post !!!!</div>;
  }
  return (
    <div className="flex gap-4 flex-col">
      {items.map((item: CardPostProps, idx: number) => (
        <Card item={item} idx={idx} />
      ))}
    </div>
  );
}

export default Popular;
