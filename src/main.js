
const TOTAL_TASKS = 3;

// переношу куски разметки в js
import {createSiteMenuTemplate} from "./components/SiteMenuTemplate.js";
import {createSiteFilterTemplate} from "./components/SiteFilterTemplate.js";
import {createBoardTemplate} from "./components/BoardTemplate.js";
import {createEditCardTemplate} from "./components/EditCardTemplate.js";
import {createTaskCardTemplate} from "./components/TaskCardTemplate.js";


// ф-я отрисовки в доме
const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// находит ключевые узлы
const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

// отрисовывает
render(mainControl, createBoardTemplate(), `afterend`);
render(mainControl, createSiteFilterTemplate(), `afterend`);
render(mainControl, createSiteMenuTemplate(), `beforeend`);

const boardTasks = main.querySelector(`.board__tasks`);


render(boardTasks, createEditCardTemplate(), `afterbegin`);

const renderTasks = () => {
  for (let i = 0; i <= TOTAL_TASKS; i++) {
    render(boardTasks, createTaskCardTemplate(), `beforeend`);
  }
};

renderTasks();

