import NodeParser from '../../src/nodeParser';

const args = {
  string: 'Some String',
  number: 42,
  arr: [{ a: 'a1' }, { a: 'a2' }],
};

test('_args in object', () => {
  const input = { a: { _args: 'string' } };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual({
    a: 'Some String',
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args full args', () => {
  const input = { _args: true };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(args);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object key', () => {
  const input = {
    _args: {
      key: 'string',
    },
  };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual('Some String');
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object all', () => {
  const input = {
    _args: {
      all: true,
    },
  };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(args);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object all and key', () => {
  const input = {
    _args: {
      all: true,
      key: 'string',
    },
  };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(args);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object invalid', () => {
  const input = {
    _args: {
      other: true,
    },
  };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _args.key must be of type string. Received: {"other":true} at locationId.],
    ]
  `);
});

test('_args param array', () => {
  const input = {
    _args: ['string'],
  };
  const parser = new NodeParser();
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _args params must be of type string or object. Received: ["string"] at locationId.],
    ]
  `);
});

test('_args param object with string default', () => {
  const input = {
    _args: {
      key: 'notFound',
      default: 'defaultValue',
    },
  };
  const parser = new NodeParser({
    args,
  });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual('defaultValue');
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object with zero default', () => {
  const input = {
    _args: {
      key: 'notFound',
      default: 0,
    },
  };
  const parser = new NodeParser({
    args,
  });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(0);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object with false default', () => {
  const input = {
    _args: {
      key: 'notFound',
      default: false,
    },
  };
  const parser = new NodeParser({
    args,
  });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(false);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_args param object with no default', () => {
  const input = {
    _args: {
      key: 'notFound',
    },
  };
  const parser = new NodeParser({
    args,
  });
  const res = parser.parse({ input, args, location: 'locationId' });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});