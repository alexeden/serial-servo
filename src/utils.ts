export const range = (from: number, to: number) => {
  const result = [];
  let n = from - 1;
  while (++n < to) result.push(n);

  return result;
};
