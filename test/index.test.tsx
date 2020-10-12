import { useEasyCache } from '../src';
import { renderHook } from '@testing-library/react-hooks';

const mockFetch = (ok: boolean, mockData: any) => {
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(mockData),
    })
  );
};

const mockFetchError = (error: any) => {
  global.fetch = jest.fn().mockImplementation(() => Promise.reject(error));
};

const mockFetchCleanUp = () => {
  // @ts-ignore
  global.fetch.mockClear();
  // @ts-ignore
  delete global.fetch;
};

process.env.NODE_ENV = 'production';

describe('useEasyCache', () => {
  it('should be considered up to date', async () => {
    mockFetch(true, { version: '1.0.0' });
    // @ts-ignore
    global.__DEV__ = false;
    jest.useFakeTimers();

    const { result, waitForNextUpdate } = renderHook(() =>
      useEasyCache('1.0.0')
    );

    await waitForNextUpdate();
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.isUpToDate).toBe(true);

    mockFetchCleanUp();
  });

  it("shouldn't be considered up to date", async () => {
    mockFetch(true, { version: '2.0.0' });
    // @ts-ignore
    global.__DEV__ = false;
    jest.useFakeTimers();
    const { location } = window;
    // @ts-ignore
    delete window.location;
    // @ts-ignore
    window.location = { reload: jest.fn() };

    const { result, waitForNextUpdate } = renderHook(() =>
      useEasyCache('1.0.0')
    );
    await waitForNextUpdate();
    jest.runAllTimers();

    expect(window.location.reload).toHaveBeenCalled();
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
    expect(result.current.isUpToDate).toBe(false);

    mockFetchCleanUp();
    window.location = location;
  });

  it('should fail properly', async () => {
    mockFetchError(new Error('Error during fetch'));
    // @ts-ignore
    global.__DEV__ = false;
    jest.useFakeTimers();

    const { result, waitForNextUpdate } = renderHook(() =>
      useEasyCache('1.0.0')
    );

    await waitForNextUpdate();
    expect((result.current.error as Error).message).toBe('Error during fetch');
    expect(result.current.loading).toBe(false);
    expect(result.current.isUpToDate).toBe(false);

    mockFetchCleanUp();
  });
});
