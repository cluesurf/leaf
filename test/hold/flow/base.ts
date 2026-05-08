import type { Node } from '@cluesurf/form'

export const MESSAGE_COUNT_TEMPLATE_TREE: Node[] = [
  {
    form: 'text',
    text: 'You have ',
  },
  {
    form: 'reference',
    name: 'count',
  },
  {
    form: 'text',
    text: ' ',
  },
  {
    form: 'case',
    test: {
      form: 'call',
      name: 'plural',
      value: {
        form: 'reference',
        name: 'count',
      },
    },
    case: [
      {
        form: 'case-value',
        value: 'one',
        flow: [
          {
            form: 'text',
            text: 'message',
          },
        ],
      },
      {
        form: 'case-default',
        flow: [
          {
            form: 'text',
            text: 'messages',
          },
        ],
      },
    ],
  },
  {
    form: 'text',
    text: ', ',
  },
  {
    form: 'reference',
    name: 'name',
  },
]
