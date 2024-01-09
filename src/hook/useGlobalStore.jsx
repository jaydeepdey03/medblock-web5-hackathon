import {useContext} from "react";
import {DIDContext} from "../context/didcontext";

const useGlobalStore = () => {
  return useContext(DIDContext);
};

export default useGlobalStore;
