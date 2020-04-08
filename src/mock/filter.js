const filterNames = [`All`, `Overdue`, `favorites`, `today`, `repeating`, `archive`];

// генерит данные с нужной структурой
export const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 100),
    };
  });
};


