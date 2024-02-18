export const prettifyTitle = (title: string) => {
  return title.replaceAll(/(\W?\d?)+/g, "");
};
