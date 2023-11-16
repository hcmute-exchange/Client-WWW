import Card from './Card';

function Popular({ items }: any) {
  return (
    <div className="flex gap-4 flex-col">
      {items.map((item: any, idx: number) => (
        <Card item={item} idx={idx} />
      ))}
    </div>
  );
}

export default Popular;
