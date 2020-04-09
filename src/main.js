import {createSiteMenuTemplate} from "./components/SiteMenuTemplate.js";
import {createSiteFilterTemplate} from "./components/SiteFilterTemplate.js";
import {createBoardTemplate} from "./components/BoardTemplate.js";
import {createEditCardTemplate} from "./components/EditCardTemplate.js";
import {createTaskCardTemplate} from "./components/TaskCardTemplate.js";
import {createloadMoreButtonTemplate} from "./components/loadMoreButtonTemplate.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";

const TOTAL_TASKS = 23;
const SHOWING_TASKS_ON_START = 8;
const SHOWING_TASKS_BY_BUTTON = 4;

// ф-я отрисовки в доме
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// находит ключевые узлы
const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);
const filters = generateFilters();
const tasks = generateTasks(TOTAL_TASKS);

// отрисовывает
render(mainControl, createBoardTemplate(), `afterend`);
render(mainControl, createSiteFilterTemplate(filters), `afterend`);
render(mainControl, createSiteMenuTemplate(), `beforeend`);

// находит ключевые узлы
const boardTasks = main.querySelector(`.board__tasks`);

// отрисовывает taskEdit
render(boardTasks, createEditCardTemplate(tasks[0]), `afterbegin`);

let showingTasksCount = SHOWING_TASKS_ON_START;

const renderTasksOnStart = () => {
  tasks.slice(1, SHOWING_TASKS_ON_START).forEach((task) => {
    render(boardTasks, createTaskCardTemplate(task), `beforeend`);
  });
};

// отрисовывает tasks
renderTasksOnStart();

// отрисовывает loadMore
render(boardTasks, createloadMoreButtonTemplate(), `afterend`);

// находит клчевой узел после отрисовки
const loadMoreButtonElement = document.querySelector(`.load-more`);

// обработчик loadMore
loadMoreButtonElement.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => {
    render(boardTasks, createTaskCardTemplate(task), `beforeend`);
  });

  if (showingTasksCount >= tasks.length) {
    loadMoreButtonElement.remove();
  }
});
