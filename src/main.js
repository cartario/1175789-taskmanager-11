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
import {render, RenderPosition} from "./utils.js";

const TOTAL_TASKS = 22;
const SHOWING_TASKS_ON_START = 8;
const SHOWING_TASKS_BY_BUTTON = 4;

// находит ключевые узлы
const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TOTAL_TASKS);

render(mainControl, new SiteMenuComponent().getElement(), RenderPosition.BEFOREEND);
render(main, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const renderTask = (tasksListElement, task) => {
  const replaceTaskToEdit = () => {
    tasksListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeydown);
  });

  const replaceEditToTask = () => {
    tasksListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeydown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `esc`;
    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeydown);
    }
  };

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeydown);
  });

  render(tasksListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
  // render(tasksListElement, new TaskEditComponent(task).getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.AFTERBEGIN);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const tasksListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_ON_START;

  const renderTasksOnStart = () => {
    tasks.slice(0, SHOWING_TASKS_ON_START).forEach((task) => {
      renderTask(tasksListElement, task);
    });
  };

  renderTasksOnStart();

  // отрисовка и логика кнопки load-more
  const loadMoreBtnComponent = new LoadMoreBtnComponent();
  render(boardComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

  loadMoreBtnComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
      renderTask(tasksListElement, task);
    });

    if (showingTasksCount >= tasks.length) {
      loadMoreBtnComponent.getElement().remove();
      loadMoreBtnComponent.removeElement();
    }
  });
};

const boardComponent = new BoardComponent();
render(main, boardComponent.getElement(), RenderPosition.BEFOREEND);

renderBoard(boardComponent);
