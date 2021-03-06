import AbstractSmartComponent from "./abstract-smart-component.js";
import {timeFormat} from "../utils/common.js";
import {MONTH_NAMES, DAYS, COLORS} from "../const.js";

const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

const createEditCardTemplate = (task, options = {}) => {

  const {color, dueDate, description} = task;
  const {isDateShowing, isRepeatingClass, activeRepeatingDays} = options;
  const repeatClass = isRepeatingClass ? `card--repeat` : ``;
  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isBlockSaveButton = (isDateShowing && isRepeatingClass) || (isRepeatingClass && !isRepeating(activeRepeatingDays));

  const date = (isDateShowing && dueDate) ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = (isDateShowing && dueDate) ? `${timeFormat(dueDate)}` : ``;
  const deadLineClass = isExpired ? `card--deadline` : ``;

  const createColorsMarkup = (colors, currentColor) => {
    return colors.map((colore, index) => {
      return `<input type="radio"
              id="color-${colore}-${index}"
              class="card__color-input card__color-input--${colore} visually-hidden"
              name="color"
              value="${colore}"
              ${currentColor === colore ? `checked` : ``}>
            <label
            for="color-${colore}-${index}"
              class="card__color card__color--${colore}">${colore}
            </label>`;
    }).join(`\n`);
  };

  const createRepeatingDaysMarkup = (days, repeatingdays) => {
    return days
      .map((day, index) => {
        const isChecked = repeatingdays[day];
        return `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${isChecked ? `checked` : ``}
        >
      <label
        class="card__repeat-day"
        for="repeat-${day}-${index}">${day}
      </label>`;
      }).join(`\n`);
  };

  const repeatingDaysMarkup = createRepeatingDaysMarkup(DAYS, activeRepeatingDays);
  const colorsMarkup = createColorsMarkup(COLORS, color);

  return (`<article class="card card--edit card--${color} ${repeatClass} ${deadLineClass}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>

                <div class="card__textarea-wrap">
                  <label>
                    <textarea class="card__text" placeholder="Start typing your text here..." name="text">${description}</textarea>
                  </label>
                </div>

                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                      </button>

                      ${isDateShowing ? `
                      <fieldset class="card__date-deadline">
                        <label class="card__input-deadline-wrap">
                          <input class="card__date" type="text" placeholder="" name="date" value="${date} ${time}">
                        </label>
                      </fieldset>` : `` }

                      <button class="card__repeat-toggle" type="button">
                        repeat:<span class="card__repeat-status">${isRepeatingClass ? `yes` : `no`}</span>
                      </button>

                      <fieldset class="card__repeat-days">
                        <div class="card__repeat-days-inner">
                          ${repeatingDaysMarkup}
                        </div>
                      </fieldset>
                    </div>
                  </div>

                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      ${colorsMarkup}
                    </div>
                  </div>
                </div>

                <div class="card__status-btns">
                  <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
                  <button class="card__delete" type="button">delete</button>
                </div>
              </div>
            </form>
          </article>`
  );
};

export default class TaskEdit extends AbstractSmartComponent {
  constructor(task) {
    super();
    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingClass = isRepeating(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);

    this._submitHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditCardTemplate(this._task, {
      isDateShowing: this._isDateShowing,
      isRepeatingClass: this._isRepeatingClass,
      activeRepeatingDays: this._activeRepeatingDays,
    });

  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);

    this._submitHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.card__date-deadline-toggle`)
      .addEventListener(`click`, () => {
        this._isDateShowing = !this._isDateShowing;

        this.rerender();
      });

    element.querySelector(`.card__repeat-toggle`)
      .addEventListener(`click`, () => {
        this._isRepeatingClass = !this._isRepeatingClass;

        this.rerender();
      });

    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (evt) => {
        this._activeRepeatingDays[evt.target.value] = evt.target.checked;
        this.rerender();

      });
    }
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    const task = this._task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingClass = Object.values(task.repeatingDays).some(Boolean);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this.rerender();
  }
}
