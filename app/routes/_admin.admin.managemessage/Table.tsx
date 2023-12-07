import Button from '@components/Button';
import Cell from '@components/Cell';
import Column from '@components/Column';
import Form from '@components/Form';
import { Listbox } from '@components/Listbox';
import { PaginationBar } from '@components/PaginationBar';
import Row from '@components/Row';
import Table from '@components/Table';
import TableBody from '@components/TableBody';
import TableHeader from '@components/TableHeader';
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { useSearchParamsOr } from '@lib/hooks/searchParams';
import type { Message } from '@lib/models/Message';
import { searchParams } from '@lib/utils/searchParams.server';
import { useNavigation } from '@remix-run/react';
import clsx from 'clsx';
import React, { useState } from 'react';
const sizes = [
  { key: 1, value: 5 },
  { key: 2, value: 10 },
  { key: 3, value: 20 },
  { key: 4, value: 50 },
  { key: 5, value: 100 },
];
function ThreadTable(props: { items: Message[] }) {
  const [{ name, size }] = useSearchParamsOr({ name: '', size: 10 });
  const [selectedSize, setSelectedSize] = useState(
    sizes.find(({ value }) => value === size) ?? sizes[1]
  );
  const [statetable, setStateTable] = useState({
    id: 'Id',
    createdTime: 'CreatedTime',
    body: 'Body',
    user: 'User',
  });
  const { state } = useNavigation();
  const submitting = state === 'submitting';
  return (
    <>
      <div className="min-h-[32rem] min-w-[32rem] overflow-y-auto mt-4">
        <Table className="table-auto w-full">
          <TableHeader className="">
            <Row className="align-top lg:align-middle">
              {Object.values(statetable).map((values, index) => (
                <Column key={index}>{values}</Column>
              ))}
              <Column key={123}>{}</Column>
            </Row>
          </TableHeader>
          <TableBody className="overflow-hidden">
            {props.items.map((item, index) => (
              <Row key={index}>
                <Cell className="w-[20%]">{item.id}</Cell>
                <Cell className="w-[20%]">{item.createdTime}</Cell>
                <Cell className="w-[20%]">{item.body.length}</Cell>
                <Cell className="w-[20%]">{item.user.email}</Cell>
                <Cell className="mr-2 flex gap-2">
                  <Button variant="accent" className="p-1">
                    <InformationCircleIcon className="h-5 aspect-square"></InformationCircleIcon>
                  </Button>
                  <Button variant="negative" className="p-1">
                    <XCircleIcon className="h-5 aspect-square"></XCircleIcon>
                  </Button>
                </Cell>
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
      <div
        className={clsx('flex justify-between gap-8 mt-4 items-center', {
          'animate-twPulse pointer-events-none': submitting,
        })}
      >
        <div className="flex gap-2 items-center min-w-max">
          <span>Displaying</span>
          <Listbox
            items={sizes}
            value={selectedSize}
            onChange={(x) => {
              setSelectedSize(x);
              searchParams.set('size', x.value + '');
              submit(searchParams, { replace: true });
            }}
            placement="top"
            render={({ value }) => value}
            className="w-16"
          />
          <span className="min-w-max">out of {props.items.length}.</span>
        </div>
        <Form method="get" preventScrollReset>
          <PaginationBar totalCount={props.items.length} />
        </Form>
      </div>
    </>
  );
}

export default ThreadTable;
