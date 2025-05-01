import { useState, useEffect } from "react";
import { createWorker } from "../Components/WorkerSetup";

/**
 * Hook for running expensive calculations in a web worker thread
 * to prevent blocking the main thread
 */
export function useWorkerComputation<T, R>(
  processingFunction: (data: T) => R,
  data: T | null,
  dependencies: any[] = []
) {
  const [result, setResult] = useState<R | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Skip if no data is provided
    if (data === null) return;

    setIsProcessing(true);
    setError(null);

    // Create a worker with the provided processing function
    const worker = createWorker(() => {
      // This code runs in a separate thread
      self.addEventListener("message", (e) => {
        try {
          // @ts-ignore (self and postMessage are available in worker context)
          const result = (self as any).processFn(e.data);
          self.postMessage({ result });
        } catch (err: any) {
          self.postMessage({ error: err.message || "Unknown error in worker" });
        }
      });
    });

    // Define the processing function in the worker scope
    const workerCode = `self.processFn = ${processingFunction.toString()};`;
    const codeBlob = new Blob([workerCode], { type: "application/javascript" });
    const codeURL = URL.createObjectURL(codeBlob);

    // Import the processing function into the worker
    worker.postMessage({
      type: "IMPORT_SCRIPTS",
      scripts: [codeURL],
    });

    // Set up message handling
    worker.onmessage = (e) => {
      if (e.data.error) {
        setError(new Error(e.data.error));
      } else {
        setResult(e.data.result);
      }
      setIsProcessing(false);
      worker.terminate();
      URL.revokeObjectURL(codeURL);
    };

    worker.onerror = (err) => {
      setError(err.error || new Error("Unknown worker error"));
      setIsProcessing(false);
      worker.terminate();
      URL.revokeObjectURL(codeURL);
    };

    // Send data to be processed
    worker.postMessage(data);

    // Clean up
    return () => {
      worker.terminate();
      URL.revokeObjectURL(codeURL);
    };
  }, [data, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  return { result, isProcessing, error };
}

/**
 * Simplified version for one-time computations
 */
export function useSimpleWorker<T, R>(processingFunction: (data: T) => R) {
  return (data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      const worker = createWorker(() => {
        // This code runs in a separate thread
        self.addEventListener("message", (e) => {
          try {
            // @ts-ignore
            const result = (self as any).processFn(e.data);
            self.postMessage({ result });
          } catch (err: any) {
            self.postMessage({
              error: err.message || "Unknown error in worker",
            });
          }
        });
      });

      // Define the processing function in the worker scope
      const workerCode = `self.processFn = ${processingFunction.toString()};`;
      const codeBlob = new Blob([workerCode], {
        type: "application/javascript",
      });
      const codeURL = URL.createObjectURL(codeBlob);

      worker.postMessage({
        type: "IMPORT_SCRIPTS",
        scripts: [codeURL],
      });

      worker.onmessage = (e) => {
        if (e.data.error) {
          reject(new Error(e.data.error));
        } else {
          resolve(e.data.result);
        }
        worker.terminate();
        URL.revokeObjectURL(codeURL);
      };

      worker.onerror = (err) => {
        reject(err.error || new Error("Unknown worker error"));
        worker.terminate();
        URL.revokeObjectURL(codeURL);
      };

      worker.postMessage(data);
    });
  };
}
