
import SortComponent, {SortType} from "../components/sort.js";
import NoTasksComponent from "../components/noTasksTemplate.js";
import TasksComponent from "../components/tasks.js";

import LoadMoreBtnComponent from "../components/loadMoreButtonTemplate.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import TaskController from "./task.js";

const SHOWING_TASKS_ON_START = 8;
const SHOWING_TASKS_BY_BUTTON = 4;

const renderTasks = (taskListElement, tasks) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement);
    taskController.render(task);
    return taskController;
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
    this._tasks = [];
    this._container = container;
    this._showedTaskControllers = [];
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._showingTasksCount = SHOWING_TASKS_ON_START;
    this._loadMoreBtnComponent = new LoadMoreBtnComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;

    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    const container = this._container.getElement();

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const tasksListElement = this._tasksComponent.getElement();


    const newTasks = renderTasks(tasksListElement, this._tasks.slice(0, this._showingTasksCount));
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

    this._loadMoreBtnComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount = this._showingTasksCount + SHOWING_TASKS_BY_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);

      const newTasks = renderTasks(taskListElement, sortedTasks);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreBtnComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_ON_START;
    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);

    const tasksListElement = this._tasksComponent.getElement();
    tasksListElement.innerHTML = ``;

    const newTasks = renderTasks(tasksListElement, sortedTasks);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }
}
