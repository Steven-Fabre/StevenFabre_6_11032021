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

    document.querySelectorAll(".filters").forEach((btn) =>
      btn.addEventListener("click", function (e) {
        e.preventDefault;

        list.applyFilter(e);
      })
    );
    document.getElementById("return").addEventListener("click", function () {
      filtersArray = [];
      list.isFilterEmpty();
      document
        .querySelectorAll(`.filters`)
        .forEach((btn) => btn.classList.remove("filters-active"));
    });
  });
