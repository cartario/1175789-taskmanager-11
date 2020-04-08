
const TOTAL_TASKS = 3;

// переношу куски разметки в js
import {createSiteMenuTemplate} from "./components/SiteMenuTemplate.js";
import {createSiteFilterTemplate} from "./components/SiteFilterTemplate.js";
import {createBoardTemplate} from "./components/BoardTemplate.js";
import {createEditCardTemplate} from "./components/EditCardTemplate.js";
import {createTaskCardTemplate} from "./components/TaskCardTemplate.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";

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

const boardTasks = main.querySelector(`.board__tasks`);


render(boardTasks, createEditCardTemplate(tasks[0]), `afterbegin`);

const renderTasks = () => {
  for (let i = 0; i < tasks.length - 1; i++) {
    render(boardTasks, createTaskCardTemplate(tasks[i]), `beforeend`);
  }
};

renderTasks();


