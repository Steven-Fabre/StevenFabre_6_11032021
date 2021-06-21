class Media {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
    this.image = data.image;
    this.video = data.video;
    this.likes = data.likes;
    this.photographerId = data.photographerId;
    this.price = data.price;
    this.tags = data.tags;
    this.title = data.title;
  }

  render() {
    return `
    <div  id="${this.id}" class="mediaCard">
        ${this.includeMedia()}
        <div class="photoDescription">
            <p>${this.title}</p>
            <div tabindex="0" class="likesCount">
                <p class="numberLike">${this.likes}</p>
                <i class="fas fa-heart" aria-label="likes" aria-hidden="true"></i>
            </div>
        </div>
    </div>`;
  }

  includeMedia() {
    if (this.image) {
      return `<img tabindex="0" class="media" alt=${this.title} id="media${
        this.id
      }" src="./img/${getUrlParameter("name")}/${this.image}">`;
    } else {
      return `<video tabindex="0" class="media" title="${
        this.title
      }" id="media${this.id}" src="./img/${getUrlParameter("name")}/${
        this.video
      }"> 
              <p>Votre navigateur ne supporte pas la lecture du média, voici à la place un <a href="./img/${getUrlParameter(
                "name"
              )}/Animals_Wild_Horses_in_the_mountains.mp4">lien de la vidéo</a> à télécharger</p>
              </video>`;
    }
  }
}
