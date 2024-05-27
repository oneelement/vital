module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['<rootDir>/src/**/*.(test|spec).[jt]s?(x)']
}