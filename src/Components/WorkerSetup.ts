export function createWorker(workerFunction: () => void) {
  const workerCode = workerFunction.toString();
  const blob = new Blob([`(${workerCode})()`], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}