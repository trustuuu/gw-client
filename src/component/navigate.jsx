let navigateFunction = null;

export function setNavigate(fn) {
  navigateFunction = fn;
}

export function navigate(path) {
  if (navigateFunction) {
    navigateFunction(path);
  } else {
    console.warn("navigate function is not set yet.");
  }
}
