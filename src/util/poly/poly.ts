export const arrayRange = (a: number, b: number): Array<number> => {
  return (a >= b) ? [] : 
    Array(b - a + 1)
      .fill(0)
      .map((_, i) => a + i);
};

