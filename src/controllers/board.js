import TaskComponent from "../components/TaskCardTemplate.js";
import SortComponent from "../components/sort.js";
import NoTasksComponent from "../components/noTasksTemplate.js";
import TasksComponent from "../components/tasks.js";
import TaskEditComponent from "../components/EditCardTemplate.js";
import LoadMoreBtnComponent from "../components/loadMoreButtonTemplate.js";
import {render, remove, replace, RenderPosition} from "../utils/render.js";

const SHOWING_TASKS_ON_START = 8;
const SHOWING_TASKS_BY_BUTTON = 4;

const renderTask = (tasksListElement, task) => {

  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const taskComponent = new TaskComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeydown);
  });

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeydown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeydown);
    }
  };

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeydown);
  });

  render(tasksListElement, taskComponent, RenderPosition.BEFOREEND);

};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();
  }

  render(tasks) {

    const isAllTasksArchived = tasks.every((task) => task.isArchive);
    const container = this._container.getElement();

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const tasksListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_ON_START;

    const renderTasksOnStart = () => {
      tasks.slice(0, SHOWING_TASKS_ON_START).forEach((task) => {
        renderTask(tasksListElement, task);
      });
    };

    renderTasksOnStart();

    render(container, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
        renderTask(tasksListElement, task);
      });

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreBtnComponent);
      }
    });
  }
}
