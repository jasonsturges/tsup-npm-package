// Main library exports - these are packaged in your distributable
export { default as Example } from "./components/Example";

export const isOdd = (n: number): boolean => !!(n & 1);
