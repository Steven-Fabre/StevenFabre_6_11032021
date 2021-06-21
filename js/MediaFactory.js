class MediaFactory {
  init(data) {
    if (data.image) return new Image(data);
    else return new Video(data);
  }
}
