let filtersArray = [];
fetch("./js/data.json")
  .then((resp) => resp.json())
  .then(function (data) {
    let list = new List();
    for (let item of data.photographers) {
      let photographe = new Photographer(item);
      list.add(photographe);
    }
    list.display("photographe");
    list.displayTags();
    let filteredTag = getUrlParameter("tag");
    filteredTag ? list.addFilter(filteredTag) : "";
    list.ApplyFilter();
    list.showPhotographes();

    document.querySelectorAll(".filters").forEach((btn) =>
      btn.addEventListener("click", function (e) {
        e.preventDefault;
        let filter = e.target.dataset.value;
        list.addFilter(filter);
        list.ApplyFilter();
        list.showPhotographes();
      })
    );
    document.getElementById("return").addEventListener("click", function () {
      filtersArray = [];
      list.ApplyFilter();
      document
        .querySelectorAll(`.filters`)
        .forEach((btn) => btn.classList.remove("filters-active"));
    });
  });

document.addEventListener("keydown", (e) => {
  if (e.code == "Enter") e.target.click();
});
