import TaskComponent from "../components/TaskCardTemplate.js";
import TaskEditComponent from "../components/EditCardTemplate.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class TaskController {
  constructor(container) {
    this._container = container;
    this._taskComponent = null;
    this._taskEditComponent = null;
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(task) {
    this._taskComponent = new TaskComponent(task);
    this._taskEditComponent = new TaskEditComponent(task);

    this._taskComponent.setEditButtonClickHandler(() => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeydown);
    });

    this._taskEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeydown);
    });

    render(this._container, this._taskComponent, RenderPosition.BEFOREEND);
  }

  _replaceTaskToEdit() {
    replace(this._taskEditComponent, this._taskComponent);
  }

  _replaceEditToTask() {
    replace(this._taskComponent, this._taskEditComponent);
  }

  _onEscKeydown(evt) {

    const isEscKey = evt.key === `Escape` || evt.key === `esc`;
    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeydown);
    }
  }
}
