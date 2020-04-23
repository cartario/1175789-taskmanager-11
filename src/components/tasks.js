import AbstractComponent from "./abstract-component.js";

const createTasksListTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Tasks extends AbstractComponent {
  getTemplate() {
    return createTasksListTemplate();
  }
}
