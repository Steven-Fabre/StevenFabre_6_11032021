class Image {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
    this.image = data.image;
    this.likes = data.likes;
    this.photographerId = data.photographerId;
    this.price = data.price;
    this.tags = data.tags;
    this.title = data.title;
  }

  render() {
    return `
      <div  id="${this.id}" class="mediaCard">
      <img tabindex="0" class="media" alt=${this.title} id="media${
      this.id
    }" src="./img/${getUrlParameter("name")}/${this.image}">
          <div class="photoDescription">
              <p>${this.title}</p>
              <div tabindex="0" class="likesCount">
                  <p class="numberLike" aria-label="${this.likes} likes">${
      this.likes
    }</p>
                  <i class="fas fa-heart" aria-label="likes" aria-hidden="true"></i>
              </div>
          </div>
      </div>`;
  }

  renderViewer(media) {
    return `<img src="./img/${getUrlParameter("name")}/${media.image}" id=${
      media.id
    } alt=${media.title}>
      <p>${media.title}</p`;
  }
}
