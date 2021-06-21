class Photographer {
  constructor(data) {
    this.city = data.city;
    this.id = data.id;
    this.country = data.country;
    this.name = data.name;
    this.portrait = data.portrait;
    this.price = data.price;
    this.tagline = data.tagline;
    this.tags = data.tags;
  }

  render() {
    return `
    <article class="photographerCard ${this.tags.join(" ")}" id="${this.name}">
      <a href="profil.html?id=${this.id}&?name=${this.getFirstWord(this.name)}">
          <img class="profilpic" alt="${this.name}" src="./img/IDPhotos/${
      this.portrait
    }">
          <h2>${this.name}</h2>
      </a>
      <p>${this.city}, ${this.country}</p>
      <p>${this.tagline}</p>
      <p>${this.price}€/jour</p>
     <div id="tag${this.id}"></div>
    </article>`;
  }

  getFirstWord(str) {
    let spaceIndex = str.indexOf(" ");
    return spaceIndex === -1 ? str : str.substr(0, spaceIndex);
  }

  renderProfil() {
    document.getElementById(
      "photographerPrice"
    ).innerHTML = `${this.price}€/jour`;
    document.getElementById("modalname").innerHTML = `${this.name}`;
    document.getElementById("profil").innerHTML = `
    <div id="description">
      <div id="contact">
        <h1>${this.name}</h1>
        <button id="btn-modal" title="Contactez-moi" class="btn-modal toggle-modal">Contactez-moi</button>
      </div>
      <h3>${this.city}, ${this.country}</h3>
      <h4>${this.tagline}</h4>
      <div id="tags${this.id}">${this.renderProfilTags()}</div>
    </div>
      <img class="profilpic" alt="photo de profil de ${
        this.name
      }" src="./img/IDPhotos/${this.portrait}">
    `;
  }

  renderProfilTags() {
    let result = ``;
    for (let tag of this.tags) {
      let balise = `<a data-value="${tag}" class="filters" href="index.html?tag=${tag}" aria-label="Accéder aux photos ${tag}"  title="${tag}">#${tag}</a>`;
      result += balise;
    }
    return result;
  }
}
