import React, { useEffect } from "react";

import Constraint from "./Constraint";

/*

* we have to measure distance between p1 and p2 at each update.
* we have to

*/

export default function Constraint({ p1, p2 }) {
  const controls = useUpdate();

  useEffect(() => {}, []);

  return <Constraint update={controls} />;
}
