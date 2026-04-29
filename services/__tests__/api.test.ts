jest.mock('@/stores/auth', () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

jest.mock('@/lib/config', () => ({
  config: {
    apiUrl: 'http://test.api',
    apiVersion: 'v1',
    getBaseUrl: () => 'http://test.api/api/v1',
  },
}));

import { ApiError } from '../api';

describe('ApiError', () => {
  it('creates an error with status and message', () => {
    const error = new ApiError(404, 'Not found');
    expect(error.status).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.name).toBe('ApiError');
  });

  it('stores optional error data', () => {
    const data = { field: 'email', message: 'Invalid' };
    const error = new ApiError(400, 'Bad request', data);
    expect(error.data).toEqual(data);
  });

  it('is an instance of Error', () => {
    const error = new ApiError(500, 'Server error');
    expect(error).toBeInstanceOf(Error);
  });
});
