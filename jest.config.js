module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    setupFiles: ['<rootDir>/jest.setup.js'],
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};
