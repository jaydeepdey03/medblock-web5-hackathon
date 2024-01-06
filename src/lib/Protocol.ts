// protocolDefinition.js

const PROTOCOL_URL = "https://didcomm.org/shared-user-protocol";

export const createProtocolDefinition = async () => {
    const protocolDefinition = {
        protocol: "https://didcomm.org/shared-user-protocol",
        published: true,
        types: {
            list: {
                schema: "https://didcomm.org/shared-user-protocol/schemas/list.json",
                dataFormats: ["application/json"],
            },
            appointment: {
                schema: "https://didcomm.org/shared-user-protocol/schemas/list.json",
                dataFormats: ["application/json"],
            },
        },
        structure: {
            list: {
                $actions: [
                    { who: "anyone", can: "read" },
                    { who: "anyone", can: "write" },
                    // { who: "anyone", can: "query" },
                ],
                appointment: {
                    $actions: [
                        { who: "author", of: "list", can: "write" },
                        { who: "author", of: "list", can: "read" },
                        { who: "recipient", of: "list", can: "read" },
                        { who: "recipient", of: "list", can: "write" },
                        // { who: "anyone", can: "query" },
                    ],
                },
            },
        },
    }
    return protocolDefinition;
};

export default createProtocolDefinition;

export const queryProtocol = async (web5: any) => {
    return await web5.dwn.protocols.query({
        message: {
            protocol: PROTOCOL_URL,
        }
    });
};

export const installProtocol = async (web5: any, protocolDefinition: any, did: any) => {
    const { protocol } = await web5.dwn.protocols.configure({
        message: {
            definition: protocolDefinition,
        },
    });
    await protocol.send(did);
};
