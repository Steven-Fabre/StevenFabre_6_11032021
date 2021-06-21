function getUrlParameter(param) {
  let result = {};
  window.location.href
    .replace(location.hash, "")
    .replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function (_, key, value) {
      result[key] = value !== undefined ? value : "";
    });

  if (param) {
    return result[param] ? result[param] : null;
  }
  return result;
}
