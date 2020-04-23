import AbstractComponent from "./abstract-component.js";

const createloadMoreButtonTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreBtn extends AbstractComponent {
  getTemplate() {
    return createloadMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
