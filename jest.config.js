module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/react-native/matchers.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@testing-library|expo-|@expo|@better-auth)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  collectCoverageFrom: ['lib/**/*.ts', 'hooks/**/*.ts', 'services/**/*.ts'],
};
