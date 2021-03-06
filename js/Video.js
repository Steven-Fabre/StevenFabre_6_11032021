class Video {
  constructor(data) {
    this.date = data.date;
    this.id = data.id;
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
    <video tabindex="0" class="media" title="${this.title}" id="media${
      this.id
    }" src="./img/${getUrlParameter("name")}/${this.video}"> 
            <p>Votre navigateur ne supporte pas la lecture du média, voici à la place un <a href="./img/${getUrlParameter(
              "name"
            )}/Animals_Wild_Horses_in_the_mountains.mp4">lien de la vidéo</a> à télécharger</p>
            </video>
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
    return `<video src="./img/${getUrlParameter("name")}/${media.video}" id="${
      media.id
    }"  controls="controls">
    <p>Votre navigateur ne supporte pas la lecture du média, voici à la place un <a href="./img/${getUrlParameter(
      "name"
    )}/${media.video}">lien de la vidéo</a> à télécharger</p>
      <source id='mp4Source' src="movie.mp4" type="video/mp4" />
      <source id='oggSource' src="movie.ogg" type="video/ogg" />
      </video>
      <p>${media.title}</p>`;
  }
}
