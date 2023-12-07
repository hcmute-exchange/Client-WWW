import Button from '@components/Button';
import Form from '@components/Form';
import Input from '@components/Input';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import type { Message } from '@lib/models/Message';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { formatRelative, addDays } from 'date-fns';
import enGB from 'date-fns/locale/en-GB';
import { type TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import VoteComponent from './VoteComponent';

type Props = {
  message: Message;
};

interface FieldValues {
  id: string;
}

export function schemaMess(t: TFunction) {
  return z.object({
    id: z.string({}),
  });
}
function MessageComponent({ message }: Props) {
  const { t } = useTranslation();
  function createMarkup() {
    return {
      __html: message.body,
    };
  }
  const formatRelativeLocale: any = {
    lastWeek: "'Last' eeee",
    yesterday: "'Yesterday'",
    today: "'Today'",
    tomorrow: "'Tomorrow'",
    nextWeek: "'Next' eeee",
    other: 'dd.MM.yyyy',
  };

  const locale = {
    ...enGB,
    formatRelative: (token: any) => formatRelativeLocale[token],
  };
  const text = formatRelative(new Date(message.createdTime), new Date(), {
    locale,
  });
  return (
    <div className="w-full flex flex-col">
      <div className="flex items-start gap-3 hover:bg-primary-50 pt-2 px-2 group relative">
        <div className="flex items-center gap-2">
          <VoteComponent id={message.id} votes={message.votes} />
          <div className="h-14 bg-primary-950 aspect-square rounded-full" />
        </div>
        <div className="flex flex-col w-full ml-2">
          <div className="flex gap-6 items-center font-semibold mt-1">
            <div className="">{message.user.email}</div>
            <p className="text-xs text-primary-700">
              {formatRelative(
                addDays(new Date(message.createdTime), 0),
                new Date()
              )}
            </p>
          </div>

          <div dangerouslySetInnerHTML={createMarkup()} />
        </div>
        <div className="right-8 -top-3 absolute group-hover:block hidden">
          <Form<FieldValues>
            action="?"
            method="delete"
            className="flex flex-col gap-6"
            config={{
              defaultValue: {
                id: '',
              },
              onValidate: ({ formData }) =>
                parseSubmission(formData, { schema: schemaMess(t) }),
            }}
          >
            <Input
              className="hidden"
              value={message.id}
              name="id"
              type="hidden"
            ></Input>
            <Button
              type="submit"
              value="delete"
              name="_action"
              variant="negative"
              className="p-0"
            >
              <XCircleIcon className="h-5 w-5 text-primary-0" />
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default MessageComponent;
// export async function action({
//   request,
//   context: { session },
// }: ActionFunctionArgs) {
//   if (!(await authenticate(session))) {
//     throw redirect('/login');
//   }
//   const t = await i18next.getFixedT(request);
//   const formData = await request.formData();
//   if (formData.get('_action') === 'delete') {
//     const submission = await parseSubmissionAsync(formData, {
//       schema: schema(t),
//     });
//     console.log(submission);
//     // if (!submission.ok) {
//     //   console.log(submission);
//     //   return json(submission);
//     // }

//     // const result = await SessionApiClient.from(session).delete(
//     //   `messages/${submission.value.id}`
//     // );
//     // console.log(result);
//     // if (result.isErr()) {
//     //   return json({
//     //     ok: false,
//     //     error: await toActionErrorsAsync(result.error),
//     //   });
//     // }
//   }
//   return json({ ...submission, ok: true });
// }
