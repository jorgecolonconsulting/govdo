export const UTCToLocalDate = (date: number | string | Date) =>
    new Date(date).toLocaleDateString();
