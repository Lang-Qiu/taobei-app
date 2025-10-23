/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';
import type { MockedFunction } from 'vitest';
import type { AxiosStatic } from 'axios';

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  }
}

declare module 'vitest' {
  interface MockedFunction<T extends (...args: any[]) => any> {
    mockResolvedValue: (value: Awaited<ReturnType<T>>) => MockedFunction<T>;
    mockResolvedValueOnce: (value: Awaited<ReturnType<T>>) => MockedFunction<T>;
    mockRejectedValue: (value: any) => MockedFunction<T>;
    mockRejectedValueOnce: (value: any) => MockedFunction<T>;
    mockImplementationOnce: (fn: T) => MockedFunction<T>;
  }
}