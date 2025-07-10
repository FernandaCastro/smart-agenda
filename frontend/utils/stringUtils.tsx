export const pad = (text: string, length: number) => text.padEnd(length, ' ');

export const padMiddle = (text: string, length: number): string => {
  if (text.length >= length) return text;

  const totalPadding = length - text.length;
  const paddingLeft = Math.floor(totalPadding / 2);
  const paddingRight = Math.floor(totalPadding / 2);

  return ' '.repeat(paddingLeft) + text + ' '.repeat(paddingRight);
};