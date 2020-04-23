const castTimeFormat = (value) => {
  // если меньеше 10, добавляет ноль перед числом
  return value < 10 ? `0${value}` : value;
};

export const timeFormat = (date) => {
  // 12-hour format
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());
  return `${hours}:${minutes}`;
};
