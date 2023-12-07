import Button from '@components/Button';
import Form from '@components/Form';
import Input from '@components/Input';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import type { Vote } from '@lib/models/Vote';
import { parseSubmission } from '@lib/utils';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
interface FieldValues {
  id: string;
}

export function schemaUpvote(t: TFunction) {
  return z.object({
    id: z.string({}),
  });
}
export function schemaDownvote(t: TFunction) {
  return z.object({
    id: z.string({}),
  });
}
export type Props = {
  votes: Vote[];
  id: string;
};
function VoteComponent({ votes, id }: Props) {
  const { t } = useTranslation();
  const weight = votes.reduce((x, { weight }) => {
    return x + weight;
  }, 0);

  return (
    <div className="flex flex-col items-center">
      <Form<FieldValues>
        className="p-0 m-0 h-[20px]"
        action="?"
        method="post"
        config={{
          defaultValue: {
            id: '',
          },
          onValidate: ({ formData }) =>
            parseSubmission(formData, { schema: schemaUpvote(t) }),
        }}
      >
        <Input className="hidden" value={id} name="id" type="hidden"></Input>
        <Button
          type="submit"
          variant="primary"
          className="p-0 m-0 bg-primary-0 text-primary-950 border border-solid border-primary-500 rounded-full"
          value="upvote"
          name="_action"
        >
          <ChevronUpIcon className="h-5 aspect-square" />
        </Button>
      </Form>
      <div>{weight}</div>
      <Form<FieldValues>
        action="?"
        method="put"
        className="p-0 mt-0"
        config={{
          defaultValue: {
            id: '',
          },
          onValidate: ({ formData }) =>
            parseSubmission(formData, { schema: schemaDownvote(t) }),
        }}
      >
        <Input className="hidden" value={id} name="id" type="hidden"></Input>
        <Button
          type="submit"
          variant="primary"
          className="p-0 m-0 bg-primary-0 text-primary-950 border border-solid border-primary-500 rounded-full"
          value="downvote"
          name="_action"
        >
          <ChevronDownIcon className="h-5 aspect-square" />
        </Button>
      </Form>
    </div>
  );
}

export default VoteComponent;
