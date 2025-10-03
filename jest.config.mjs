export default  {
    testEnvironment: 'node',
    transform: {},
    roots: ['./tests'],
    moduleFileExtensions: ['js', '.mjs'],
    setupFilesAfterEnv: ['./tests/setup/jest.setup.js'],
};