import React, { createContext, ReactNode, useState, useEffect } from "react";
import protocolDefinition from "../app/assets/shared-user-protocol.json";
import { Web5 } from "@web5/api";

export const DIDContext = createContext({} as any);
export default function DIDContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [web5, setWeb5] = useState(null);
    const [myDid, setMyDid] = useState(null);

    useEffect(() => {
        const initWeb5 = async () => {
            const { web5, did } = await Web5.connect();
            console.log(did);

            setWeb5(web5);
            setMyDid(did);

            if (web5 && did) {
                await configureProtocol(web5, did);
                console.log(did, web5, "-------");

            }
        };
        initWeb5();
    }, []);

    const queryForProtocol = async (web5: any) => {
        try {
            return await web5.dwn.protocols.query({
                message: {
                    filter: {
                        protocol: "https://blackgirlbytes.dev/dinger-chat-protocol",
                    },
                },
            });
        } catch (error) {
            console.log("Failed ", error);
        }
    };

    const installProtocolLocally = async (web5: any, protocolDefinition: any) => {
        try {
            return await web5.dwn.protocols.configure({
                message: {
                    definition: protocolDefinition,
                },
            });
        } catch (error) {
            console.log("Failed ", error);
        }
    };

    const configureProtocol = async (web5: any, did: string) => {
        // const protocolDefinition = await createProtocolDefinition();

        const { protocols: localProtocol, status: localProtocolStatus } =
            await queryForProtocol(web5);
        console.log({ localProtocol, localProtocolStatus });
        if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
            const { protocol, status } = await installProtocolLocally(
                web5,
                protocolDefinition,
            );
            console.log("Protocol installed locally", protocol, status);

            const { status: configureRemoteStatus } = await protocol.send(did);
            console.log(
                "Did the protocol install on the remote DWN?",
                configureRemoteStatus,
            );
        } else {
            console.log("Protocol already installed");
        }
    };

    return <DIDContext.Provider value={{ web5, myDid }}>{children}</DIDContext.Provider>;
}
