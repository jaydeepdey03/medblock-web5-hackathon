"use client";
import { useRouter } from "next/navigation";
import protocolDefinition from "../../../assets/shared-user-protocol.json";
import React, { useEffect, useState } from "react";

import useGlobalStore from "../../../hook/useGlobalStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
function Appointment({ params }: { params: { id: string } }) {
  const router = useRouter();

  const patientId = decodeURIComponent(params.id);
  const { web5, myDid } = useGlobalStore();

  // let todoRecipient;
  // let todoList = ref({});
  // let todoItems = ref([]);
  const [patientDid, setPatientDid] = useState("");
  const [appointmentList, setAppointmentList] = useState({});
  const [appointmentItems, setAppointmentItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (web5 && myDid) {
        console.log("this is your DID", myDid);

        // fetch shared list details.
        const { record } = await web5.dwn.records.read({
          message: {
            filter: {
              recordId: patientId,
            },
          },
        });

        // fetch todos under list.
        const { records: appointmentRecords } = await web5.dwn.records.query({
          message: {
            filter: {
              parentId: patientId,
            },
          },
        });

        let appList = await record.data.json();
        setAppointmentList(appList);
        // appList - contains information about all the things of the patient
        setPatientDid(appList.recipientId);
        // todoRecipient = await getTodoRecipient();

        // // Add entry to ToDos array
        for (let record of appointmentRecords) {
          const data = await record.data.json();
          const appointment = { record, data, id: record.id };
          // todoItems.value.push(todo);
          console.log("fetching------->>>> ", appointment);
          setAppointmentItems([appointment, ...appointmentItems]);
        }
      }
    };
    fetchAppointments();
  }, []);

  async function addAppointment() {
    const obj = {
      problem: "problem",
      diagnosis: "diagnosis",
      treatment: {
        medications: [
          {
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily",
          },
          {
            name: "Hydrochlorothiazide",
            dosage: "25mg",
            frequency: "Once daily",
          },
        ],
        recommendations: [
          "Maintain a low-sodium diet",
          "Regular exercise",
          "Follow-up appointment in 3 months",
        ],
      },
      appointmentDate: "12-11-2003",
    };

    const appointmentData = {
      author: myDid,
      parentId: patientId,
      problem: obj.problem,
      diagnosis: obj.diagnosis,
      treatment: obj.treatment,
      appointmentDate: obj.appointmentDate,
    };

    const { record: appointmentRecord, status: createStatus } =
      await web5.dwn.records.create({
        data: appointmentData,
        message: {
          protocol: protocolDefinition.protocol,
          protocolPath: "list/appointment",
          schema: protocolDefinition.types.appointment.schema,
          dataFormat: protocolDefinition.types.appointment.dataFormats[0],
          parentId: patientId,
          contextId: patientId,
        },
      });

    const data = await appointmentRecord.data.json();
    const appointment = { appointmentRecord, data, id: appointmentRecord.id };
    // todoItems.value.push(todo);
    setAppointmentItems([appointment, ...appointmentItems]);
    const { status: sendStatus } = await appointmentRecord.send(patientDid);

    if (sendStatus.code !== 202) {
      console.log("Unable to send to target did:" + sendStatus);
      return;
    } else {
      console.log("Sent todo to recipient");
    }
  }

  return (
    <div className="h-screen w-full p-2">
      {/* <button type="button" onClick={() => addAppointment()}>
        Add Appointment
      </button> */}
      <div className="flex h-full w-full flex-col gap-3">
        <div className="h-[50%] w-full rounded-2xl bg-gray-200"></div>
        <div className="flex h-[40%] w-full flex-col gap-5 rounded-2xl md:flex-row">
          <Card className="card-scroll col-span-3 h-fit w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Appointment</CardTitle>
              {/* <CardDescription>You made 265 sales this month.</CardDescription> */}
            </CardHeader>
            <div className="card-scroll h-full w-full overflow-y-scroll">
              <CardContent className="">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      className="flex items-center rounded-xl p-5 hover:bg-slate-100"
                      key={item}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Olivia Martin
                        </p>
                        <p className="text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
                      <div className="ml-auto flex flex-col items-end">
                        <p className="text-sm font-medium">
                          {new Date("2021-08-17T09:00:00.000Z").toLocaleString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-sm font-normal">
                          {new Date("2021-08-17T09:00:00.000Z").toLocaleString(
                            "en-us",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
          <Card className="col-span-3 w-full overflow-hidden md:w-1/2">
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              {/* <CardDescription>You made 265 sales this month.</CardDescription> */}
            </CardHeader>
            <div className="card-scroll h-full w-full overflow-y-scroll">
              <CardContent className="">
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <div
                      className="flex items-center rounded-xl p-5 hover:bg-slate-100"
                      key={item}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Olivia Martin
                        </p>
                        <p className="text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
                      <div className="ml-auto flex flex-col items-end">
                        <p className="text-sm font-semibold">
                          {new Date("2021-08-17T09:00:00.000Z").toLocaleString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-sm font-normal">
                          {new Date("2021-08-17T09:00:00.000Z").toLocaleString(
                            "en-us",
                            {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            },
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Appointment;
