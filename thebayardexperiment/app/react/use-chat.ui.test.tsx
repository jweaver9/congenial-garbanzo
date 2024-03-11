import '@testing-library/jest-dom/vitest';
import { cleanup, findByText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import {
  mockFetchDataStream,
  mockFetchDataStreamWithGenerator,
  mockFetchError,
} from '../../../ai/packages/core/tests/utils/mock-fetch';
import { useChat } from './use-chat';

const TestComponent = () => {
  const [id, setId] = React.useState<string>('first-id');
  const { messages, append, error, data, isLoading } = useChat({ id });

  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      {error && <div data-testid="error">{error.toString()}</div>}
      {data && <div data-testid="data">{JSON.stringify(data)}</div>}
      {messages.map((m, idx) => (
        <div data-testid={`message-${idx}`} key={m.id}>
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <button
        data-testid="do-append"
        onClick={() => {
          append({ role: 'user', content: 'hi' });
        }}
      />
      <button
        data-testid="do-change-id"
        onClick={() => {
          setId('second-id');
        }}
      />
    </div>
  );
};

beforeEach(() => {
  render(<TestComponent />);
});

afterEach(() => {
  vi.restoreAllMocks();
  cleanup();
});

test('Shows streamed complex text response', async () => {
  mockFetchDataStream({
    url: 'https://example.com/api/chat',
    chunks: ['0:"Hello"\n', '0:","\n', '0:" world"\n', '0:"."\n'],
  });

  await userEvent.click(screen.getByTestId('do-append'));

  await screen.findByTestId('message-0');
  expect(screen.getByTestId('message-0')).toHaveTextContent('User: hi');

  await screen.findByTestId('message-1');
  expect(screen.getByTestId('message-1')).toHaveTextContent(
    'AI: Hello, world.',
  );
});

test('Shows streamed complex text response with data', async () => {
  mockFetchDataStream({
    url: 'https://example.com/api/chat',
    chunks: ['2:[{"t1":"v1"}]\n', '0:"Hello"\n'],
  });

  await userEvent.click(screen.getByTestId('do-append'));

  await screen.findByTestId('data');
  expect(screen.getByTestId('data')).toHaveTextContent('[{"t1":"v1"}]');

  await screen.findByTestId('message-1');
  expect(screen.getByTestId('message-1')).toHaveTextContent('AI: Hello');
});

test('Shows error response', async () => {
  mockFetchError({ statusCode: 404, errorMessage: 'Not found' });

  await userEvent.click(screen.getByTestId('do-append'));

  // TODO bug? the user message does not show up
  // await screen.findByTestId('message-0');
  // expect(screen.getByTestId('message-0')).toHaveTextContent('User: hi');

  await screen.findByTestId('error');
  expect(screen.getByTestId('error')).toHaveTextContent('Error: Not found');
});

describe('loading state', () => {
  test('should show loading state', async () => {
    let finishGeneration: ((value?: unknown) => void) | undefined;
    const finishGenerationPromise = new Promise(resolve => {
      finishGeneration = resolve;
    });

    mockFetchDataStreamWithGenerator({
      url: 'https://example.com/api/chat',
      chunkGenerator: (async function* generate() {
        const encoder = new TextEncoder();
        yield encoder.encode('0:"Hello"\n');
        await finishGenerationPromise;
      })(),
    });

    await userEvent.click(screen.getByTestId('do-append'));

    await screen.findByTestId('loading');
    expect(screen.getByTestId('loading')).toHaveTextContent('true');

    finishGeneration?.();

    await findByText(await screen.findByTestId('loading'), 'false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  test('should reset loading state on error', async () => {
    mockFetchError({ statusCode: 404, errorMessage: 'Not found' });

    await userEvent.click(screen.getByTestId('do-append'));

    await screen.findByTestId('loading');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });
});

describe('id', () => {
  it('should clear out messages when the id changes', async () => {
    mockFetchDataStream({
      url: 'https://example.com/api/chat',
      chunks: ['0:"Hello"\n', '0:","\n', '0:" world"\n', '0:"."\n'],
    });

    await userEvent.click(screen.getByTestId('do-append'));

    await screen.findByTestId('message-1');
    expect(screen.getByTestId('message-1')).toHaveTextContent(
      'AI: Hello, world.',
    );

    await userEvent.click(screen.getByTestId('do-change-id'));

    expect(screen.queryByTestId('message-0')).not.toBeInTheDocument();
  });
});
