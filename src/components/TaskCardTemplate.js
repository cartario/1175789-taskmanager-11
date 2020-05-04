import AbstractComponent from "./abstract-component.js";
import {formatTime, formatDate} from "../utils/common.js";

const createButtonMarkup = (name, isActive = true) => {
  return `<button type="button" class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}">
                  ${name}
                </button>`;
};

const createTaskCardTemplate = (task) => {
  const {color, dueDate, description, repeatingDays} = task;

  const isDateShowing = !!dueDate;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();

  const isRepeatingClass = Object.values(repeatingDays).some(Boolean);
  const repeatClass = isRepeatingClass ? `card--repeat` : ``;

  const deadLineClass = isExpired ? `card--deadline` : ``;
  const date = isDateShowing ? formatDate(dueDate) : ``;

  const time = isDateShowing ? formatTime(dueDate) : ``;

  const editButton = createButtonMarkup(`edit`);
  const archiveButton = createButtonMarkup(`archive`, !task.isArchive);
  const favoriteButton = createButtonMarkup(`favorite`, !task.isFavorite);

  return (`<article class="card card--${color} ${repeatClass} ${deadLineClass}">
          <div class="card__form">
            <div class="card__inner">
              <div class="card__control">
                ${editButton}
                ${archiveButton}
                ${favoriteButton}
              </div>
              <div class="card__color-bar">
                <svg class="card__color-bar-wave" width="100%" height="10">
                  <use xlink:href="#wave"></use>
                </svg>
              </div>

              <div class="card__textarea-wrap">
                <p class="card__text">${description}</p>
              </div>

              <div class="card__settings">
                <div class="card__details">
                  <div class="card__dates">
                    <div class="card__date-deadline">
                      <p class="card__input-deadline-wrap">
                        <span class="card__date">${date}</span>
                        <span class="card__time">${time}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>`
  );
};

export default class Task extends AbstractComponent {
  constructor(task) {
    super();
    this._task = task;
  }

  getTemplate() {
    return createTaskCardTemplate(this._task);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
    .addEventListener(`click`, handler);
  }

  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`)
    .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorite`)
    .addEventListener(`click`, handler);
  }
}
