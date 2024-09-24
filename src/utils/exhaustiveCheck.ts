export default function exhaustiveCheck(param: never, errorMessage: string) {
  throw new Error(errorMessage);
}
