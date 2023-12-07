import Button from '@components/Button';
import Cell from '@components/Cell';
import Column from '@components/Column';
import Row from '@components/Row';
import Table from '@components/Table';
import TableBody from '@components/TableBody';
import TableHeader from '@components/TableHeader';
import { InformationCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';
import type { Post } from '@lib/models/Post';
import React, { useState } from 'react';

function ThreadTable(props: { items: Post[] }) {
  const [statetable, setStateTable] = useState({
    id: 'Id',
    createdTime: 'CreatedTime',
    subject: 'Subject',
    initialMessage: 'Message',
    tags: 'Tags',
  });
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
                <Cell className="w-[20%]">{item.subject.length}</Cell>
                <Cell className="w-[20%]">
                  {item.initialMessage.user.email}
                </Cell>
                <Cell className="w-[20%]">{item.tags.length}</Cell>
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
    </>
  );
}

export default ThreadTable;
