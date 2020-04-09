const defaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

const generateTask = () => {
  return {
    color: `blue`,
    description: `heyExample default task with default color.`,
    isFavorite: Math.random() > 0.5,
    isArchive: Math.random() > 0.5,
    repeatingDays: Object.assign({}, defaultRepeatingDays, {"mo": Math.random() > 0.5}),
    dueDate: Math.random() > 0.5 ? new Date() : null,
  };

};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTask, generateTasks};
