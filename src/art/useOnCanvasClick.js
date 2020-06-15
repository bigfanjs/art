import { clickHandlerQueue } from "./art";

export function useOnCanvasClick(handler, dependencies) {
  clickHandlerQueue.add(handler);
}
