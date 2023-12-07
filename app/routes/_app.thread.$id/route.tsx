import BoardMessage from './BoardMessage';
import InputMess from './InputMess';
import { useActionData, useLoaderData, useNavigation } from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { ApiClient } from '@lib/services/api-client.server';
import type { GetPostResult } from '../_app._index/type';
import type { TFunction } from 'i18next';
import { z } from 'zod';
import Form from '@components/Form';
import { parseSubmission, parseSubmissionAsync } from '@lib/utils';
import { useTranslation } from 'react-i18next';
import Button from '@components/Button';
import i18next from '@lib/i18n/index.server';
import { authenticate } from '@lib/utils/auth.server';
import { SessionApiClient } from '@lib/services/session-api-client.server';
import { toActionErrorsAsync } from '@lib/utils/error.server';
import type { GetMessResult, GetVoteResult } from './type';
import { schemaMess } from './MessageComponent';

interface FieldValues {
  body: string;
}

function schema(t: TFunction) {
  return z.object({
    body: z.string({ required_error: t('body.required') }),
  });
}
export async function loader({
  request,
  params,
  context: { session },
}: LoaderFunctionArgs) {
  const addview = await ApiClient.instance.post('views', {
    body: {
      PostId: params.id,
    },
  });
  const postDetail = (await ApiClient.instance.get(`post/${params.id}`).match(
    (x) => (x.ok ? x.json() : {}),
    () => ({})
  )) as GetPostResult;
  const messages = (await ApiClient.instance
    .get(`messagesPost?PostId=${params.id}`)
    .match(
      (x) => (x.ok ? x.json() : {}),
      () => ({})
    )) as GetMessResult[];
  const id = session.id;
  return json({ postDetail, messages, id });
}
function route() {
  const { t } = useTranslation('newthread');
  const { postDetail, messages, id } = useLoaderData<typeof loader>();
  const lastSubmission = useActionData<typeof action>();
  const { state } = useNavigation();
  return (
    <div className="px-[15rem] py-12 flex flex-col gap-10 min-h-screen max-h-fit">
      {messages && Array.isArray(messages) && messages.length > 0 ? (
        <BoardMessage
          post={postDetail}
          messages={messages.map((x) => ({
            id: x.id,
            body: x.body,
            createdTime: x.createdTime,
            updatedTime: x.updatedTime,
            user: x.user,
            votes: x.votes,
          }))}
        />
      ) : (
        <BoardMessage post={postDetail} messages={messages} />
      )}
      <Form<FieldValues>
        action="?"
        method="post"
        className="flex flex-col gap-6"
        config={{
          defaultValue: {
            body: '',
          },
          onValidate: ({ formData }) =>
            parseSubmission(formData, { schema: schema(t) }),
        }}
      >
        <div className="h-10 bottom-0">
          <InputMess isOk={lastSubmission?.ok} />
        </div>
        <Button type="submit" className="hidden" value="post" name="_action">
          asdad
        </Button>
      </Form>
    </div>
  );
}

export default route;
export async function action({
  request,
  context: { session },
  params,
}: ActionFunctionArgs) {
  if (!(await authenticate(session))) {
    throw redirect('/login');
  }
  const t = await i18next.getFixedT(request);
  const formData = await request.formData();
  let submission;
  if (formData.get('_action') === 'delete') {
    submission = await parseSubmissionAsync(formData, {
      schema: schemaMess(t),
    });
    let result: any;
    try {
      result = await SessionApiClient.from(session).delete(
        `messages/${formData.get('id')}`
      );
    } catch (e) {
      console.log('exception', e);
    }
    console.dir(result, { depth: null });
    if (result.isErr()) {
      return json({
        ok: false,
        error: await toActionErrorsAsync(result.error),
      });
    }
  }
  if (formData.get('_action') === 'post') {
    submission = await parseSubmissionAsync(formData, {
      schema: schema(t),
    });
    if (!submission.ok) {
      return json(submission);
    }
    const result = await SessionApiClient.from(session).post('messages', {
      body: {
        Body: submission.value.body,
        PostId: params.id,
      },
      headers: {
        // 'Content-Type': 'application/json',
      },
    });
    if (result.isErr()) {
      return json({
        ...submission,
        ok: false,
        error: await toActionErrorsAsync(result.error),
      });
    }
  }
  if (formData.get('_action') === 'upvote') {
    submission = await parseSubmissionAsync(formData, {
      schema: schemaMess(t),
    });
    if (!submission.ok) {
      return json(submission);
    }
    console.log(submission.value.id);

    const getVote = (await SessionApiClient.from(session)
      .get(`votes/${submission.value.id}`)
      .match(
        (x) => (x.ok ? x.json() : {}),
        () => ({})
      )) as GetVoteResult;
    console.log('getVote', getVote);
    console.dir(getVote, { depth: null });
    if (getVote.weight == 1) {
      const resultdelete = await SessionApiClient.from(session).delete(
        'votes',
        {
          body: {
            MessageId: submission.value.id,
          },
        }
      );
      if (resultdelete.isErr()) {
        return json({
          ok: false,
          error: await toActionErrorsAsync(resultdelete.error),
        });
      }
    } else if (getVote.weight == -1) {
      const resultdelete = await SessionApiClient.from(session).delete(
        'votes',
        {
          body: {
            MessageId: submission.value.id,
          },
        }
      );
      if (resultdelete.isErr()) {
        return json({
          ok: false,
          error: await toActionErrorsAsync(resultdelete.error),
        });
      } else {
        const resultPost = await SessionApiClient.from(session).post(
          'messageupvotes',
          {
            body: {
              MessageId: submission.value.id,
            },
          }
        );
        if (resultPost.isErr()) {
          return json({
            ok: false,
            error: await toActionErrorsAsync(resultPost.error),
          });
        }
      }
    } else {
      const resultPost = await SessionApiClient.from(session).post(
        'messageupvotes',
        {
          body: {
            MessageId: submission.value.id,
          },
        }
      );
      if (resultPost.isErr()) {
        return json({
          ok: false,
          error: await toActionErrorsAsync(resultPost.error),
        });
      }
    }
  }
  if (formData.get('_action') === 'downvote') {
    submission = await parseSubmissionAsync(formData, {
      schema: schemaMess(t),
    });
    if (!submission.ok) {
      return json(submission);
    }
    console.log(submission.value.id);
    const result = await SessionApiClient.from(session).head(
      `votes/${submission.value.id}`
    );
    if (result.isOk()) {
      const resultPost = await SessionApiClient.from(session).post(
        'messageupvotes',
        {
          body: {
            MessageId: submission.value.id,
          },
        }
      );
      if (resultPost.isErr()) {
        return json({
          ok: false,
          error: await toActionErrorsAsync(resultPost.error),
        });
      } else {
        const resultPut = await SessionApiClient.from(session).put('votes', {
          body: {
            MessageId: submission.value.id,
          },
        });
        console.log('put');
        console.dir(resultPut, { depth: null });
        if (resultPut.isErr()) {
          return json({
            ok: false,
            error: await toActionErrorsAsync(resultPut.error),
          });
        }
      }
    } else {
      const resultPut = await SessionApiClient.from(session).put('votes', {
        body: {
          MessageId: submission.value.id,
        },
      });
      if (resultPut.isErr()) {
        const resultdelete = await SessionApiClient.from(session).delete(
          'votes',
          {
            body: {
              MessageId: submission.value.id,
            },
          }
        );
        if (resultdelete.isErr()) {
          return json({
            ok: false,
            error: await toActionErrorsAsync(resultdelete.error),
          });
        }
      }
    }
  }
  return json({ ...submission, ok: true });
}
