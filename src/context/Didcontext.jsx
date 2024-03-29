"use client";
import {createContext, ReactNode, useState, useEffect} from "react";
// import protocolDefinition from "../assets/shared-user-protocol.json";
import {Web5} from "@web5/api";
import createProtocolDefinition from "@/lib/Protocol";

export const DIDContext = createContext({});
export default function DIDContextProvider({children}) {
  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);
  const PROTOCOL_URL = "https://didcomm.org/shared-user-protocol";

  useEffect(() => {
    const initWeb5 = async () => {
      try {
        const {web5: web5Instance, did} = await Web5.connect({
          sync: "5s",
        });
        console.log(did);

        setWeb5(web5Instance);
        setMyDid(did);
      } catch (err) {
        console.log("error while connecting to web5", err.message);
      }
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

  const queryProtocol = async (web5) => {
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

  const installProtocol = async (web5, protocolDefinition, did) => {
    try {
      const {protocol} = await web5.dwn.protocols.configure({
        message: {
          definition: protocolDefinition,
        },
      });
      await protocol.send(did);
    } catch (err) {
      console.log(err, "err 2");
    }
  };

  const configureProtocol = async (web5, did) => {
    // const protocolDefinition = await createProtocolDefinition();
    // if (!web5) {
    //   console.error("Web5 is not initialized");
    //   return;
    // }
    const protocolDefinition = await createProtocolDefinition();
    try {
      const {protocols: localProtocol, status: localProtocolStatus} =
        await queryProtocol(web5);
      console.log({localProtocol, localProtocolStatus}, "localProtocol");

      // if protocol is not installed, install it
      if (localProtocolStatus.code !== 200 || localProtocol.length === 0) {
        const protocolValueAfterInstallation = await installProtocol(
          web5,
          protocolDefinition,
          myDid
        );
        console.log(
          "Protocol installed successfully",
          protocolValueAfterInstallation
        );

        const {status: configureRemoteStatus} = await localProtocol.send(did);
        console.log(
          "Did the protocol install on the remote DWN?",
          configureRemoteStatus
        );
      } else {
        console.log("Protocol already installed");
      }
    } catch (err) {
      console.log(err, "err 3");
    }
  };

  const [doctorRecords, setDoctorRecords] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);

  const fetchList = async (web5Instance) => {
    const protocolDefinition = await createProtocolDefinition();
    try {
      console.log("Fetching list...");

      const response = await web5Instance.dwn.records.query({
        from: myDid,
        message: {
          filter: {
            protocol: protocolDefinition.protocol,
            schema: protocolDefinition.types.list.schema,
          },
        },
      });
      console.log("Saved Response", response);

      if (response.status.code === 200) {
        const recordss = await Promise.all(
          response.records.map(async (record) => {
            const data = await record.data.json();
            return {
              ...data,
              recordId: record.id,
            };
          })
        );

        let patientMap = new Map();
        let doctorMap = new Map();

        let uniqueDoctorRecords = [];
        let uniquePatientRecords = [];
        console.log(recordss, " ----");

        recordss.reverse().map((record) => {
          console.log();
          if (!patientMap.has(record.patient) && record.doctor === myDid) {
            patientMap.set(record.patient, true);
            console.log(record, "jaysdas");
            uniquePatientRecords.push(record);
          }

          if (!doctorMap.has(record.doctor) && record.patient === myDid) {
            doctorMap.set(record.doctor, true);
            console.log(record, "doc");
            uniqueDoctorRecords.push(record);
          }
        });
        console.log(uniqueDoctorRecords, "unique doctorsss");
        console.log(uniquePatientRecords, "unique patient");
        setDoctorRecords(uniqueDoctorRecords);
        setPatientRecords(uniquePatientRecords);
      }
    } catch (error) {
      console.log("err 1 in dashboard ", error);
    }
  };

  const updateDetailsToDoctor = async (doctorDid) => {
    console.log("updateDetailsToDoctor", doctorDid);
    const protocolDefinition = await createProtocolDefinition();

    let allAppointmentsForPatient = [];

    doctorRecords.map((record) => {
      allAppointmentsForPatient.push(...record.allAppointments);
    });

    const recordd = doctorRecords.filter(
      (record) => record.doctor === doctorDid
    )[0];

    let recipientDID = doctorDid;

    const sharedListData = {
      "@type": "list",
      author: myDid,
      doctor: doctorDid,
      patient: myDid,
      name: recordd.name,
      age: recordd.age,
      height: recordd.height,
      weight: recordd.weight,
      bloodGrp: recordd.bloodGrp,
      recipient: doctorDid,
      gender: recordd.gender,
      allAppointments: allAppointmentsForPatient,
      timeStamp: new Date().toISOString(),
    };

    try {
      const {record, status} = await web5.dwn.records.create({
        data: sharedListData,
        message: {
          protocol: protocolDefinition.protocol,
          protocolPath: "list",
          schema: protocolDefinition.types.list.schema,
          dataFormat: protocolDefinition.types.list.dataFormats[0],
          recipient: recipientDID,
        },
      });

      const data = await record.data.json();
      const list = {record, ...data, id: record.id};

      const {status: sendToMeStatus} = await record.send(myDid);
      const {status: sendStatus} = await record.send(recipientDID);
      console.log("Record sent", sendStatus);

      if (sendStatus.code !== 202) {
        console.log("Unable to send to target did:" + sendStatus);
        return;
      } else {
        console.log("Shared list sent to recipient");
        console.log(sendStatus.code, "status code");
      }
    } catch (e) {
      console.error(e, "err 2 in dashboard");
      return;
    }
  };

  useEffect(() => {
    console.log("hello");
    if (web5) {
      console.log("hi");
      fetchList(web5);
    }
  }, [web5]);

  return (
    <DIDContext.Provider
      value={{
        web5,
        myDid,
        doctorRecords,
        setDoctorRecords,
        patientRecords,
        setPatientRecords,
        updateDetailsToDoctor,
      }}
    >
      {children}
    </DIDContext.Provider>
  );
}
