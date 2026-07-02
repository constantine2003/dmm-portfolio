let ready = $state(false);

const status = {
  get ready() { return ready; },
  set ready(v: boolean) { ready = v; }
};

export function initNavStatus() {
  return status;
}

export function setNavReady() {
  ready = true;
}