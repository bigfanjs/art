import { useContext } from "react";

import { Context } from "./art";

export default function useArt() {
  const context = useContext(Context);

  return context;
}
