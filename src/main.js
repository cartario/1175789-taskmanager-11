import BoardComponent from "./components/BoardTemplate.js";
import SiteMenuComponent from "./components/SiteMenuTemplate.js";
import FilterComponent from "./components/SiteFilterTemplate.js";
import BoardController from "./controllers/board.js";
import {generateFilters} from "./mock/filter.js";
import {generateTasks} from "./mock/task.js";
import {render, RenderPosition} from "./utils/render.js";

const TOTAL_TASKS = 22;

// находит ключевые узлы
const main = document.querySelector(`.main`);
const mainControl = main.querySelector(`.main__control`);

const filters = generateFilters();
const tasks = generateTasks(TOTAL_TASKS);

render(mainControl, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(main, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(main, boardComponent, RenderPosition.BEFOREEND);

boardController.render(tasks);
