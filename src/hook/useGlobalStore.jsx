import {useContext} from "react";
import {DIDContext} from "../context/Didcontext";

const useGlobalStore = () => {
  return useContext(DIDContext);
};

export default useGlobalStore;
