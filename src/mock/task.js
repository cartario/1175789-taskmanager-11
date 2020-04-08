const generateTask = () => {
  return {
    color: `yellow`,
    description: `heyExample default task with default color.`,
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5,
    repeatingDays: null,
    dueDate: Math.random() > 0.5 ? new Date() : null,
  };

};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTask, generateTasks};
