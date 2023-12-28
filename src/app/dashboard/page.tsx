"use client";

import { useEffect, useState } from "react";
import useGlobalStore from "../../hook/useGlobalStore";
// import protocolDefinition from "../assets/shared-user-protocol.json";

export default function Dashboard() {
  const { web5, myDid } = useGlobalStore();


  return (
    <div>
      Dashboard
      {/* <button onClick={() => addUser('Cook', '12-12-2012', 'male')}> add</button> */}
    </div>
  );
}
