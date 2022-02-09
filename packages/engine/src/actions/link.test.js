/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import testContext from '../../test/testContext.js';

const lowdefy = {
  _internal: {
    actions: {
      Link: ({ methods: { link }, params }) => {
        return link(params);
      },
    },
    blockComponents: {
      Button: { meta: { category: 'display' } },
      List: { meta: { category: 'list' } },
      TextInput: { meta: { category: 'input' } },
    },
    link: jest.fn(),
  },
};

const RealDate = Date;
const mockDate = jest.fn(() => ({ date: 0 }));
mockDate.now = jest.fn(() => 0);

// Comment out to use console
console.log = () => {};
console.error = () => {};

beforeEach(() => {
  global.Date = mockDate;
  lowdefy._internal.link.mockReset();
});

afterAll(() => {
  global.Date = RealDate;
});

test('Link with string pageId params', async () => {
  const rootBlock = {
    id: 'block:root:root:0',
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      blocks: [
        {
          id: 'block:root:button:0',
          blockId: 'button',
          type: 'Button',
          meta: {
            category: 'display',
            valueType: 'string',
          },
          events: {
            onClick: [{ id: 'a', type: 'Link', params: 'pageId' }],
          },
        },
      ],
    },
  };
  const context = await testContext({
    lowdefy,
    rootBlock,
  });
  const button = context._internal.RootBlocks.map['block:root:button:0'];
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(lowdefy._internal.link.mock.calls).toEqual([['pageId']]);
  expect(res.success).toBe(true);
});

test('Link with object params', async () => {
  const rootBlock = {
    id: 'block:root:root:0',
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      blocks: [
        {
          id: 'block:root:button:0',
          blockId: 'button',
          type: 'Button',
          meta: {
            category: 'display',
            valueType: 'string',
          },
          events: {
            onClick: [{ id: 'a', type: 'Link', params: { pageId: 'pageId', newTab: true } }],
          },
        },
      ],
    },
  };
  const context = await testContext({
    lowdefy,
    rootBlock,
  });
  const button = context._internal.RootBlocks.map['block:root:button:0'];
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(lowdefy._internal.link.mock.calls).toEqual([
    [
      {
        pageId: 'pageId',
        newTab: true,
      },
    ],
  ]);
  expect(res.success).toBe(true);
});

test('Link error', async () => {
  const rootBlock = {
    id: 'block:root:root:0',
    blockId: 'root',
    meta: {
      category: 'container',
    },
    areas: {
      blocks: [
        {
          id: 'block:root:button:0',
          blockId: 'button',
          type: 'Button',
          meta: {
            category: 'display',
            valueType: 'string',
          },
          events: {
            onClick: [{ id: 'a', type: 'Link', params: { invalid: true } }],
          },
        },
      ],
    },
  };
  const context = await testContext({
    lowdefy,
    rootBlock,
  });
  lowdefy._internal.link.mockImplementationOnce(() => {
    throw new Error('Link test error');
  });
  const button = context._internal.RootBlocks.map['block:root:button:0'];
  const res = await button.triggerEvent({ name: 'onClick' });
  expect(lowdefy._internal.link.mock.calls).toEqual([
    [
      {
        invalid: true,
      },
    ],
  ]);
  expect(res).toEqual({
    blockId: 'button',
    bounced: false,
    event: undefined,
    eventName: 'onClick',
    error: {
      action: {
        id: 'a',
        params: {
          invalid: true,
        },
        type: 'Link',
      },
      error: {
        error: new Error('Link test error'),
        index: 0,
        type: 'Link',
      },
    },
    responses: {
      a: {
        type: 'Link',
        error: new Error('Link test error'),
        index: 0,
      },
    },
    success: false,
    startTimestamp: { date: 0 },
    endTimestamp: { date: 0 },
  });
});
