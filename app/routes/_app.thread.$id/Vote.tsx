import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';

function Vote() {
  return (
    <div className="flex flex-col">
      <ChevronUpIcon className="h-5 aspect-square" />
      <ChevronDownIcon className="h-5 aspect-square" />
    </div>
  );
}

export default Vote;
