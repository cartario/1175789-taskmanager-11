import BoardComponent from "./components/BoardTemplate.js";
import TasksComponent from "./components/tasks.js";
import SiteMenuComponent from "./components/SiteMenuTemplate.js";
import SortComponent from "./components/sort.js";
import FilterComponent from "./components/SiteFilterTemplate.js";
import TaskEditComponent from "./components/EditCardTemplate.js";
import TaskComponent from "./components/TaskCardTemplate.js";
import LoadMoreBtnComponent from "./components/loadMoreButtonTemplate.js";
import NoTasksComponent from "./components/noTasksTemplate.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";
import {render, replace, remove, RenderPosition} from "./utils/render.js";

const TOTAL_TASKS = 22;
const SHOWING_TASKS_ON_START = 8;
const SHOWING_TASKS_BY_BUTTON = 4;

// находит ключевые узлы
const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TOTAL_TASKS);

render(mainControl, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(main, new FilterComponent(filters), RenderPosition.BEFOREEND);

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

const renderBoard = (boardComponent) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent(), RenderPosition.AFTERBEGIN);
  render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

  const tasksListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_ON_START;

  const renderTasksOnStart = () => {
    tasks.slice(0, SHOWING_TASKS_ON_START).forEach((task) => {
      renderTask(tasksListElement, task);
    });
  };

  renderTasksOnStart();

  const loadMoreBtnComponent = new LoadMoreBtnComponent();
  render(boardComponent.getElement(), loadMoreBtnComponent, RenderPosition.BEFOREEND);

  loadMoreBtnComponent.setClickHandler(() => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
      renderTask(tasksListElement, task);
    });

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreBtnComponent);
    }
  });
};

const boardComponent = new BoardComponent();
render(main, boardComponent, RenderPosition.BEFOREEND);

renderBoard(boardComponent);
