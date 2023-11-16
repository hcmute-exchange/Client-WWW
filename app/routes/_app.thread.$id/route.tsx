import { QuestionMarkCircleIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react';
import { Item } from 'react-aria-components';
import Message from './Message';
import Input from '@components/Input';
import BoardMessage from './BoardMessage';
import InputMess from './InputMess';

function route() {
  const fakedata = [
    {
      name: 'Quocanh',
      message: "That's great",
      date: 'Yesterday at 11:56 PM',
    },
    {
      name: 'Quocduy',
      message: 'your dumb',
      date: 'Yesterday at 11:56 PM',
    },
    {
      name: 'AnhquocNgo',
      message: 'Suy Tink',
      date: 'Today at 1:23 AM',
    },
    {
      name: 'Duydang',
      message: ['uk', 'dung roi tk ngu'],
      date: 'Today at 1:23 AM',
    },
    {
      name: 'Duydang',
      message: 'uk',
      date: 'Today at 1:23 AM',
    },
    {
      name: 'Duydang',
      message: 'uk',
      date: 'Today at 1:23 AM',
    },
  ];

  const dataownerforum = {
    name: 'QuocAnh@KuteVai~',
    position: 'Owner',
    title: 'Welcome to my forum. In here disscussion for reactjs topic',
    desciption:
      'Explain everything about reactjs you can make sure understand it',
  };
  return (
    <div className="px-[15rem] py-12 flex flex-col gap-10 min-h-screen max-h-fit">
      <BoardMessage dataownerforum={dataownerforum} fakedata={fakedata} />
      <div className="h-10 bottom-0">
        <InputMess />
      </div>
    </div>
  );
}

export default route;
