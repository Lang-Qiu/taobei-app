import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

// Mock axios for all tests
import { vi } from 'vitest';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));