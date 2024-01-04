"use client";
import { createContext, ReactNode, useState, useEffect } from "react";
// import protocolDefinition from "../assets/shared-user-protocol.json";
import { Web5 } from "@web5/api";
import createProtocolDefinition from "@/lib/Protocol";

export const DIDContext = createContext({} as any);
export default function DIDContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [web5, setWeb5] = useState<any>(null);
  const [myDid, setMyDid] = useState<string | null>(null);
  const PROTOCOL_URL = "https://didcomm.org/shared-user-protocol";

  useEffect(() => {
    const initWeb5 = async () => {
      const { web5: web5Instance, did } = await Web5.connect({
        sync: "5s",
      });
      console.log(did);

      setWeb5(web5Instance);
      setMyDid(did);
    };
    initWeb5();
  }, []);

  useEffect(() => {
    (async () => {
      if (web5 && myDid) {
        await configureProtocol(web5, myDid);
      }
    })();
  }, [web5, myDid]);

  // const queryForProtocol = async (web5: any) => {
  //   try {
  //     return await web5.dwn.protocols.query({
  //       message: {
  //         filter: {
  //           protocol: "https://didcomm.org/shared-user-protocol",
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log("Failed ", error);
  //   }
  // };

  const queryProtocol = async (web5: any) => {
    try {
      return await web5.dwn.protocols.query({
        message: {
          protocol: PROTOCOL_URL,
        },
      });
    } catch (err) {
      console.log(err, "err 1");
    }
  };

  // const installProtocolLocally = async (web5: any, protocolDefinition: any) => {
  //   try {
  //     return await web5.dwn.protocols.configure({
  //       message: {
  //         definition: protocolDefinition,
  //       },
  //     });
  //   } catch (error) {
  //     console.log("Failed ", error);
  //   }
  // };

  const installProtocol = async (
    web5: any,
    protocolDefinition: any,
    did: string | null,
  ) => {
    try {
      const { protocol } = await web5.dwn.protocols.configure({
        message: {
          definition: protocolDefinition,
        },
      });
      await protocol.send(did);
    } catch (err) {
      console.log(err, "err 2");
    }
  };

  const configureProtocol = async (web5: any, did: string) => {
    // const protocolDefinition = await createProtocolDefinition();
    // if (!web5) {
    //   console.error("Web5 is not initialized");
    //   return;
    // }
    const protocolDefinition = await createProtocolDefinition();
    try {
      const { protocols: localProtocol, status: localProtocolStatus } =
        await queryProtocol(web5);
      console.log({ localProtocol, localProtocolStatus }, "localProtocol");

      // if protocol is not installed, install it
      if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
        const protocolValueAfterInstallation = await installProtocol(
          web5,
          protocolDefinition,
          myDid,
        );
        console.log(
          "Protocol installed successfully",
          protocolValueAfterInstallation,
        );

        const { status: configureRemoteStatus } = await localProtocol.send(did);
        console.log(
          "Did the protocol install on the remote DWN?",
          configureRemoteStatus,
        );
      } else {
        console.log("Protocol already installed");
      }
    } catch (err) {
      console.log(err, "err 3");
    }
  };

  return (
    <DIDContext.Provider value={{ web5, myDid }}>
      {children}
    </DIDContext.Provider>
  );
}
