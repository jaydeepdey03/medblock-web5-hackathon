"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  CalendarIcon,
  Droplet,
  Minus,
  Plus,
  Ruler,
  Weight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Field, FieldArray, Form, Formik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// import protocolDefinition from "../../../assets/shared-user-protocol.json";
import useGlobalStore from "../../../hook/useGlobalStore";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import createProtocolDefinition from "@/lib/Protocol";

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
  tillDate: Date;
};

export default function PatientDashboard({
  params,
}: {
  params: { patientdid: string };
}) {
  const [openNewAppointment, setOpenNewAppointment] = useState<boolean>(false);
  const [openMyNewAppointment, setOpenMyNewAppointment] = useState<boolean[]>(
    Array(13).fill(false),
  );

  const [openAllAppointment, setOpenAllAppointment] = useState<boolean[]>(
    Array(13).fill(false),
  );

  console.log(openAllAppointment, "openAllAppointment");

  const patientId = decodeURIComponent(params.patientdid);
  // console.log(patientId, "patientId");

  const { web5, myDid, patientRecords: records, setRecords } = useGlobalStore();

  // let todoRecipient;
  // let todoList = ref({});
  // let todoItems = ref([]);

  interface PatientDetails {
    author: string;
    name: string;
    age: string;
    height: string;
    weight: string;
    bloodGrp: string;
    recipient: string;
    gender: string;
    allAppointments: Medication[]; // You can replace 'any[]' with a specific type for appointments if available
    timeStamp: string;
    recordId: string;
  }

  const [patientDid, setPatientDid] = useState("");
  const [patientDetails, setPatientDetails] = useState<PatientDetails>({
    author: "",
    name: "",
    age: "",
    height: "",
    weight: "",
    bloodGrp: "",
    recipient: "",
    gender: "",
    allAppointments: [],
    timeStamp: "",
    recordId: "",
  });
  const [appointmentItems, setAppointmentItems] = useState<any[]>([]);


  useEffect(() => {

    const fetchDetails = () => {

      console.log(patientId, "didi")
      console.log(patientDid, "save", records)


      let patient = records.filter((record: any) => (record.patient === patientId))[0];
      console.log(patient, "patient")
      // console.log(patient, "found")
      if (patient) {
        setPatientDid(patient.recipient);
        setPatientDetails(patient);
        console.log(patient, "data")
        setAppointmentItems(patient.allAppointments);
      }
    }

    console.log(records, "recordsss")
    if (web5 && myDid && records.length > 0 && patientId) {
      fetchDetails();
    }
  }, [records, web5, myDid, patientId])


  async function addAppointment(values: any) {
    const protocolDefinition = await createProtocolDefinition();
    let recipientDID = patientDetails.recipient;

    const sharedListData = {
      "@type": "list",
      author: myDid,
      name: patientDetails.name,
      age: patientDetails.age,
      height: patientDetails.height,
      weight: patientDetails.weight,
      bloodGrp: patientDetails.bloodGrp,
      patient: recipientDID,
      doctor: myDid,
      recipient: recipientDID,
      gender: patientDetails.gender,
      allAppointments: [...patientDetails.allAppointments, values],
      timeStamp: new Date().toISOString(),
    };

    const dataSet: PatientDetails = {
      author: myDid,
      name: patientDetails.name,
      age: patientDetails.age,
      height: patientDetails.height,
      weight: patientDetails.weight,
      bloodGrp: patientDetails.bloodGrp,
      recipient: recipientDID,
      gender: patientDetails.gender,
      allAppointments: [...patientDetails.allAppointments, values],
      timeStamp: new Date().toISOString(),
      recordId: patientDetails.recordId
    };

    console.log(sharedListData, "sharedListData");
    try {
      const { record, status } = await web5.dwn.records.create({
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
      // const list = { record, ...data, id: record.id };

      const { status: sendToMeStatus } = await record.send(myDid);
      const { status: sendStatus } = await record.send(recipientDID);
      console.log("Record sent", sendStatus);

      if (sendStatus.code !== 202) {
        console.log("Unable to send to target did:" + sendStatus);
        return;
      } else {
        setPatientDetails(dataSet);
        setAppointmentItems([...patientDetails.allAppointments, values])
        console.log("Shared list sent to recipient");
        console.log(sendStatus.code, "status code");
      }
    } catch (e) {
      console.error(e, "err 2 in dashboard");
      return;
    }
  }

  return (
    <div className="relative h-full">
      {/* Background circles */}
      <div className="absolute -top-[100px] -z-10 h-72 w-72 rounded-full bg-pink-400 blur-[500px]" />
      <div className="absolute -top-[100px] left-1/2 -z-10 h-72 w-72 -translate-x-1/2 transform rounded-full bg-blue-400 blur-[500px]" />
      <div className="absolute -top-[100px] right-0 -z-10 h-72 w-72 rounded-full bg-purple-400 blur-[500px]" />
      {/* Main content */}
      <div className="flex w-full items-end justify-between py-10 sm:h-fit sm:justify-start sm:p-10">
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/girl.png"
            alt="girl"
            className="grid h-20 w-20 place-items-center rounded-full bg-white"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">Hello Doctor,</h1>
            <p className="text-lg">
              Welcome to {patientDetails.name ? patientDetails.name + "'s" : ""} dashboard
            </p>
          </div>
        </div>
      </div>
      <div className="grid h-screen grid-flow-row grid-cols-1 gap-4 p-8 xl:grid-cols-3 xl:grid-rows-3">
        <Card className="order-last col-start-1 col-end-2 row-span-full flex h-[600px] w-full flex-col xl:h-full">
          <CardHeader>
            <CardTitle className="flex justify-between">
              All Appointment
            </CardTitle>
          </CardHeader>
          <div className="card-scroll h-full w-full overflow-y-scroll">
            <CardContent className="overflow-hidden p-0">
              <div className="space-y-2 px-7">
                {appointmentItems.map((item, index) => (
                  <div
                    className="flex cursor-pointer items-center rounded-xl hover:bg-slate-100"
                    key={item}
                    onClick={() => {
                      setOpenAllAppointment((prevState) => {
                        // set the index to true
                        let temp = [...prevState];
                        temp[index] = true;
                        return temp;
                      });
                    }}
                  >
                    <Dialog
                      key={index}
                      open={openAllAppointment[index]}
                      onOpenChange={(val) => {
                        setOpenAllAppointment((prevState) => {
                          // set the value to the value at the index
                          let temp = [...prevState];
                          temp[index] = val;
                          return temp;
                        });
                      }}
                    >
                      <DialogContent className="h-[90vh] max-w-[80vw]">
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure absolutely sure? {item}
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                    <div className="flex items-center gap-0 truncate sm:w-[70%]">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/avatars/01.png" alt="Avatar" />
                        <AvatarFallback>OM</AvatarFallback>
                      </Avatar>
                      <div className="ml-4 mr-3 w-full space-y-1 truncate px-1 py-4">
                        <p className="truncate text-sm font-medium leading-none">
                          Olivia Martin
                        </p>
                        <p className="truncate text-sm text-muted-foreground">
                          olivia.martin@email.com
                        </p>
                      </div>
                    </div>

                    <div className="ml-auto flex flex-col items-end sm:w-fit">
                      <p className="text-right text-xs font-medium sm:text-sm">
                        {new Date("2021-08-17T09:00:00.000Z").toLocaleString(
                          "en-us",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-right text-xs font-normal sm:text-sm">
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
        <div className="order-first grid h-[600px] w-full grid-cols-1 gap-2 rounded-xl xl:col-span-full xl:col-start-2 xl:col-end-4 xl:row-start-1 xl:row-end-2 xl:h-full xl:grid-cols-3">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-xl border-[1px] border-slate-200 bg-white">
            <Ruler className="h-[50px] w-[50px] text-slate-700" />
            <p className="text-sm font-medium">Height</p>
            <p className="text-3xl font-semibold">{patientDetails?.height}cm</p>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-xl border-[1px] border-slate-200 bg-white">
            <Weight className="h-[50px] w-[50px] text-slate-700" />
            <p className="text-sm font-medium">Weight</p>
            <p className="text-3xl font-semibold">{patientDetails?.weight}</p>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-xl border-[1px] border-slate-200 bg-white">
            <Droplet className="h-[50px] w-[50px] text-slate-700" />
            <p className="text-lg font-medium">Blood Group</p>
            <p className="text-3xl font-semibold uppercase">
              {patientDetails?.bloodGrp}
            </p>
          </div>
        </div>
        <div className="h-[600px] w-full overflow-hidden rounded-xl xl:col-start-2 xl:col-end-4 xl:row-start-2 xl:row-end-4 xl:h-full">
          <Card className="h-full">
            <CardHeader className="flex flex-row justify-between">
              <p className="text-2xl font-[600] leading-none tracking-tight">
                My Appointment
              </p>
              <Button
                className="w-fit"
                onClick={() => setOpenNewAppointment((prev) => !prev)}
              >
                Add New Appointment
              </Button>
            </CardHeader>
            <div className="card-scroll h-full w-full overflow-y-scroll">
              <CardContent className="overflow-hidden">
                <Dialog
                  open={openNewAppointment}
                  onOpenChange={setOpenNewAppointment}
                >
                  <DialogContent className="h-[90vh] max-w-[80vw] overflow-scroll">
                    <DialogHeader>
                      <DialogTitle asChild>
                        <p className="text-3xl font-bold text-blue-800">
                          Patient Diagnosis Detail
                        </p>
                      </DialogTitle>
                      <DialogDescription>
                        <Formik
                          initialValues={{
                            problem: "" as string,
                            diagnosis: "" as string,
                            medications: [] as Medication[],
                          }}
                          onSubmit={(values, _) => {
                            // console.log(values);
                            addAppointment(values);
                          }}
                        >
                          {(formik) => (
                            <Form className="flex w-full flex-col items-center space-y-5 p-10">
                              <div className="w-full">
                                <Label htmlFor="problem" className="ml-1">
                                  Problem
                                </Label>
                                <Field
                                  name="problem"
                                  as={Textarea}
                                  placeholder="Mention their Problem"
                                  type="text"
                                  className="mt-2"
                                />
                              </div>
                              <div className="w-full">
                                <Label htmlFor="diagnosis" className="ml-1">
                                  Diagnosis
                                </Label>
                                <Field
                                  name="diagnosis"
                                  as={Textarea}
                                  placeholder="Diagnosis of the problem"
                                  type="text"
                                  className="mt-2"
                                />
                              </div>

                              <FieldArray name="medications">
                                {({ push, remove }) => (
                                  <>
                                    <Button
                                      type="button"
                                      className="h-10 w-10 rounded-full p-1"
                                      onClick={() =>
                                        push({
                                          name: "",
                                          dosage: "",
                                          frequency: "",
                                        })
                                      }
                                    >
                                      <Plus />
                                    </Button>
                                    {formik.values.medications.map(
                                      (_, index) => (
                                        <div
                                          key={index}
                                          className="flex w-full items-end gap-4"
                                        >
                                          <div className="w-full">
                                            <Label
                                              htmlFor={`medications[${index}].name`}
                                              className="ml-1"
                                            >
                                              Name of Medicine
                                            </Label>
                                            <Field
                                              name={`medications[${index}].name`}
                                              as={Input}
                                              placeholder="Name of Medicine"
                                              type="text"
                                              className="mt-2"
                                            />
                                          </div>
                                          <div className="w-full">
                                            <Label
                                              htmlFor={`medications[${index}].dosage`}
                                              className="ml-1"
                                            >
                                              Dosage
                                            </Label>
                                            <Field
                                              name={`medications[${index}].dosage`}
                                              as={Input}
                                              placeholder="Dosage"
                                              type="text"
                                              className="mt-2"
                                            />
                                          </div>
                                          <div className="w-full">
                                            <Label
                                              htmlFor={`medications[${index}].frequency`}
                                              className="ml-1"
                                            >
                                              Frequency
                                            </Label>
                                            <Field
                                              name={`medications[${index}].frequency`}
                                              as={Input}
                                              placeholder="Frequency of the medicine"
                                              type="text"
                                              className="mt-2"
                                            />
                                          </div>
                                          <div className="flex w-full flex-col">
                                            <Label
                                              htmlFor={`medications[${index}].tillDate`}
                                              className="ml-1"
                                            >
                                              Till Date
                                            </Label>
                                            <div className="mt-[0.5rem]">
                                              <Popover>
                                                <PopoverTrigger asChild>
                                                  <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                      "w-full pl-3 text-left font-normal",
                                                      !formik.values
                                                        .medications[index]
                                                        .tillDate &&
                                                      "text-muted-foreground",
                                                    )}
                                                  >
                                                    {formik.values.medications[
                                                      index
                                                    ].tillDate ? (
                                                      format(
                                                        formik.values
                                                          .medications[index]
                                                          .tillDate,
                                                        "PPP",
                                                      )
                                                    ) : (
                                                      <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                  </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                  className="w-auto p-0"
                                                  align="start"
                                                >
                                                  <Calendar
                                                    className="w-full"
                                                    mode="single"
                                                    selected={
                                                      formik.values.medications[
                                                        index
                                                      ].tillDate
                                                    }
                                                    onSelect={(value) => {
                                                      {
                                                        formik.setFieldValue(
                                                          `medications[${index}].tillDate`,
                                                          value,
                                                        );
                                                      }
                                                    }}
                                                    disabled={(date) =>
                                                      date < new Date()
                                                    }
                                                    initialFocus
                                                  />
                                                </PopoverContent>
                                              </Popover>
                                            </div>
                                          </div>
                                          <Button
                                            className="h-8 w-8 rounded-full p-1"
                                            onClick={() => remove(index)}
                                          >
                                            <Minus />
                                          </Button>
                                        </div>
                                      ),
                                    )}
                                  </>
                                )}
                              </FieldArray>

                              <div className="w-full">
                                <Button
                                  type="submit"
                                  className="group flex w-full items-center justify-center bg-blue-800 hover:bg-blue-900"
                                  onClick={() => setOpenNewAppointment(false)}
                                >
                                  <p className="text-white">Add Details</p>
                                  <ArrowRight className="ml-2 h-4 w-4 duration-100 ease-in-out group-hover:translate-x-1" />
                                </Button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <div className="space-y-2">
                  {appointmentItems.map((item) => (
                    <div
                      className="flex cursor-pointer items-center rounded-xl px-3 hover:bg-slate-100"
                      key={item}
                    // onClick={() => setOpenMyNewAppointment((prev) => !prev)}
                    >
                      <div className="flex items-center gap-0 truncate sm:w-[70%]">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/avatars/01.png" alt="Avatar" />
                          <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 mr-3 w-full space-y-1 truncate px-1 py-4">
                          <p className="truncate text-sm font-medium leading-none">
                            {item?.diagnosis}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {patientDetails.author}
                          </p>
                        </div>
                      </div>

                      <div className="ml-auto flex flex-col items-end sm:w-fit">
                        <p className="text-right text-xs font-medium sm:text-sm">
                          {new Date(patientDetails.timeStamp)?.toLocaleString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </p>
                        <p className="text-right text-xs font-normal sm:text-sm">
                          {new Date(patientDetails.timeStamp)?.toLocaleString(
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
