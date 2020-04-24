import TaskComponent from "../components/TaskCardTemplate.js";
import SortComponent, {SortType} from "../components/sort.js";
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

const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {

  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);

      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
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

    renderTasks(tasksListElement, tasks.slice(0, showingTasksCount));

    const renderLoadMoreButton = () => {
      render(container, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

      this._loadMoreBtnComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_BY_BUTTON;
        const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTasksCount, showingTasksCount);
        renderTasks(tasksListElement, sortedTasks);
        if (showingTasksCount >= tasks.length) {
          remove(this._loadMoreBtnComponent);
        }
      });
    };

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_ON_START;
      tasksListElement.innerHTML = ``;
      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);
      renderTasks(tasksListElement, sortedTasks);
      renderLoadMoreButton();
    });
  }
}

