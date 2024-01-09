import {useEffect, useState} from "react";
import useGlobalStore from "../hook/useGlobalStore";
// import protocolDefinition from "../../assets/shared-user-protocol.json";
import {Button} from "@/components/ui/button";
import {Field, Form, Formik} from "formik";
import {useRouter} from "next/router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {ArrowRight} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Fuse from "fuse.js";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import createProtocolDefinition from "@/lib/Protocol";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {differenceInDays, parseISO} from "date-fns";

export default function Dashboard() {
  const {web5, myDid, patientRecords, doctorRecords, updateDetailsToDoctor} =
    useGlobalStore();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searchPattern, setSearchPattern] = useState("");
  const [receipientDidValue, setReceipientDidValue] = useState("");
  const fuse = new Fuse(patients, {
    keys: ["name"],
  });

  // let patientRecords: any = [];
  // let doctorRecords: any = [];

  useEffect(() => {
    if (patientRecords && patientRecords.length > 0) {
      setPatients(patientRecords);
    }
    if (doctorRecords && doctorRecords.length > 0) setDoctors(doctorRecords);
  }, [patientRecords, doctorRecords, myDid]);

  const addNewPatient = async (patientDetails) => {
    const protocolDefinition = await createProtocolDefinition();
    let recipientDID = patientDetails.did;
    setReceipientDidValue(recipientDID);

    const sharedListData = {
      "@type": "list",
      author: myDid,
      name: patientDetails.name,
      doctor: myDid,
      patient: recipientDID,
      age: patientDetails.age,
      height: patientDetails.height,
      weight: patientDetails.weight,
      bloodGrp: patientDetails.bloodGrp,
      recipient: recipientDID,
      gender: patientDetails.gender,
      allAppointments: [],
      timeStamp: new Date().toISOString(),
    };
    console.log(sharedListData, "sharedListData");
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
        setPatients([...patients, list]);
        console.log("Shared list sent to recipient");
        console.log(sendStatus.code, "status code");
      }
    } catch (e) {
      console.error(e, "err 2 in dashboard");
      return;
    }
  };

  useEffect(() => {
    console.log(web5, "web5 in dashboard");
  }, [web5]);

  const deletePatient = async (recordId) => {
    console.log("deletePatient", recordId);
    try {
      const deleteResult = await web5.dwn.records.delete({
        message: {
          recordId: recordId,
        },
      });
      console.log(deleteResult);
    } catch (error) {
      console.error(error);
    }
  };

  const [myHistory, setMyHistory] = useState([]);

  useEffect(() => {
    // set the myHistory to the records of the patient which has myAppointment in maximum length using reduce
    let len = 0;
    let idx = 0;
    if (doctorRecords.length > 0) {
      doctorRecords.forEach((curr, index) => {
        if (curr.allAppointments.length > len) {
          console.log(curr, "curr");
          len = curr.allAppointments.length;
          idx = index;
        }
      });

      setMyHistory(doctorRecords[idx].allAppointments);
      console.log(doctorRecords[idx].allAppointments, "temp");
    }
  }, [doctorRecords]);

  // console.log(, "myhis");

  const handleCopyDid = () => {
    navigator.clipboard.writeText(myDid);
    console.log(myDid);
    alert("DID copied to clipboard");
  };

  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    if (myHistory && myHistory.length > 0) {
      // map all the patient records and get the medicines array from each record
      // and then flatten it to a single array
      let temp = [];

      myHistory.map((item) => {
        item.medications.map((medi) => {
          temp.push(medi);
        });
      });

      setMedicines([...temp]);
    }
  }, [patientRecords]);

  console.log(medicines, "medicines in dash");

  return (
    <div className="relative flex h-full w-full flex-col gap-2 p-5">
      <div className="absolute -top-[100px] -z-10 h-72 w-72 rounded-full bg-pink-400 blur-[500px]" />
      <div className="absolute -top-[100px] left-1/2 -z-10 h-72 w-72 -translate-x-1/2 transform rounded-full bg-blue-400 blur-[500px]" />
      <div className="absolute -top-[100px] right-0 -z-10 h-72 w-72 rounded-full bg-purple-400 blur-[500px]" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {/* <DialogTitle>Add New Patient</DialogTitle> */}
            <DialogDescription>
              <Formik
                initialValues={{
                  name: "",
                  age: "",
                  bloodGrp: "",
                  did: "",
                  gender: "",
                  height: "",
                  weight: "",
                }}
                onSubmit={(values, _) => {
                  addNewPatient(values);
                  // console.log(values);
                }}
              >
                {(formik) => (
                  <Form className="flex w-full flex-col items-center space-y-5 p-10">
                    <p className="text-3xl font-bold text-blue-800">
                      MedBlock Patient Details
                    </p>
                    <div className="w-full">
                      <Label htmlFor="did" className="ml-1">
                        DID
                      </Label>
                      <Field
                        name="did"
                        as={Input}
                        placeholder="DID"
                        type="text"
                        className="mt-2"
                      />
                    </div>

                    <div className="w-full">
                      <Label htmlFor="name" className="ml-1">
                        Name
                      </Label>
                      <Field
                        name="name"
                        as={Input}
                        placeholder="Name"
                        className="mt-2"
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="age" className="ml-1">
                        Age
                      </Label>
                      <Field
                        name="age"
                        as={Input}
                        placeholder="Age"
                        type="number"
                        className="mt-2"
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor="gender" className="ml-1">
                        Gender
                      </Label>
                      <div className="mb-2" />
                      <Select
                        onValueChange={(value) => {
                          formik.setFieldValue("gender", value);
                          // console.log(value);
                        }}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex w-full gap-2">
                      <div className="w-full">
                        <Label htmlFor="height" className="ml-1">
                          Height
                        </Label>
                        <Field
                          name="height"
                          as={Input}
                          placeholder="Height"
                          type="number"
                          className="mt-2"
                        />
                      </div>
                      <div className="w-full">
                        <Label htmlFor="weight" className="ml-1">
                          Weight
                        </Label>
                        <Field
                          name="weight"
                          as={Input}
                          placeholder="Weight"
                          type="number"
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <Label htmlFor="bloodGrp" className="ml-1">
                        Blood Group
                      </Label>
                      <div className="mb-2" />
                      <Select
                        onValueChange={(value) => {
                          formik.setFieldValue("bloodGrp", value);
                          // console.log(value);
                        }}
                      >
                        <SelectTrigger className="">
                          <SelectValue placeholder="Select Blood Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a-">A-</SelectItem>
                          <SelectItem value="a+">A+</SelectItem>
                          <SelectItem value="b+">B+</SelectItem>
                          <SelectItem value="b-">B-</SelectItem>
                          <SelectItem value="o+">O+</SelectItem>
                          <SelectItem value="o-">O-</SelectItem>
                          <SelectItem value="ab+">AB+</SelectItem>
                          <SelectItem value="ab-">AB-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full">
                      <Button
                        type="submit"
                        className="group flex w-full items-center justify-center bg-blue-800 hover:bg-blue-900"
                        onClick={() => setOpen(false)}
                      >
                        <p className="text-white">Add Patient</p>
                        <ArrowRight className="ml-2 h-4 w-4 duration-100 ease-in-out group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>{" "}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <p className="py-5 text-center font-inter text-4xl font-bold text-blue-900">
        Dashboard
      </p>
      <p className="mb-6 text-md text-center">
        <span>Your DID:</span> {myDid?.slice(0, 16) + "..." + myDid?.slice(-8)}
      </p>

      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="ml-10 flex justify-between">
          <div>
            <TabsTrigger value="patient">Patient</TabsTrigger>
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
            <TabsTrigger value="myappointment">My Appointments</TabsTrigger>
          </div>
          <div className="mr-10">
            <Button onClick={handleCopyDid} className="w-fit">
              Copy Did
            </Button>
          </div>
        </TabsList>
        <TabsContent value="patient" className="w-full">
          <div className="flex justify-between space-x-2 px-10 py-4">
            <Input
              type="text"
              placeholder="Name"
              value={searchPattern}
              onChange={(e) => setSearchPattern(e.target.value)}
              className="focus-visible:ring-2 focus-visible:ring-blue-800 focus-visible:ring-opacity-50"
            />

            <Button
              className="w-fit bg-blue-800 hover:bg-blue-900"
              onClick={() => setOpen((prev) => !prev)}
            >
              Add New Patient
            </Button>
          </div>

          <div
            className="grid h-full w-full place-items-center gap-4 px-10"
            style={{
              gridTemplateColumns: `repeat(auto-${
                patients.length <= 1 ? "fit" : "fill"
              }, minmax(400px, 1fr))`,
            }}
          >
            {patientRecords.length === 0 && <p>No Patient Records</p>}
            {searchPattern.length === 0 &&
              patients &&
              patients.map((patient, index) => (
                <div
                  className="flex h-fit w-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5"
                  // style={{ width: "100%" }} // Set width to 100%
                  key={index}
                  onClick={() =>
                    // deletePatient(patient.patient)
                    router.push(`/patientDashboard/${patient.patient}`)
                  }
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/${patient.gender === "male" ? "boy" : "girl"}.png`}
                      alt="doctor"
                      className="h-9 w-9"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm capitalize">{patient.name}</p>
                      <p className="text-xs capitalize">{patient.gender}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 py-3">
                    <p className="truncate text-sm">
                      <span className="font-medium">Doctor:</span>{" "}
                      {patient.author + "..."}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Patient:</span>{" "}
                      {patient.recipient}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Blood Group:&nbsp;</span>

                      {patient.bloodGrp?.toUpperCase()}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Height:</span>{" "}
                      {patient.height}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Weight:</span>{" "}
                      {patient.weight}
                    </p>
                  </div>
                </div>
              ))}
            {/* If not searching  */}
            {searchPattern.length > 0 &&
              fuse.search(searchPattern)?.map(({item: patient}, index) => (
                <div
                  className="flex h-fit cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 duration-100 hover:scale-105"
                  style={{width: "100%"}} // Set width to 100%
                  key={index}
                  onClick={() =>
                    router.push(`/patientDashboard/${patient.patient}`)
                  }
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/${patient.gender === "male" ? "boy" : "girl"}.png`}
                      alt="doctor"
                      className="h-9 w-9"
                    />
                    <div className="flex flex-col">
                      <p className="text-sm capitalize">{patient.name}</p>
                      <p className="text-xs capitalize">{patient.gender}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 py-3">
                    <p className="truncate text-sm">
                      <span className="font-medium">Doctor:</span>{" "}
                      {patient.author.slice(0, 5) +
                        "..." +
                        patient.author.slice(-8)}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Patient:</span>{" "}
                      {patient.recipient.slice(0, 5) +
                        "..." +
                        patient.recipient.slice(-8)}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Blood Group:&nbsp;</span>

                      {patient.bloodGrp?.toUpperCase()}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Height:</span>{" "}
                      {patient.height}
                    </p>
                    <p className="truncate text-sm">
                      <span className="font-medium">Weight:</span>{" "}
                      {patient.weight}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          {searchPattern.length > 0 &&
            fuse.search(searchPattern).length == 0 && (
              <div className="flex h-full w-full items-center justify-center p-10">
                <p className="text-center text-2xl font-bold text-blue-900">
                  No results found
                </p>
              </div>
            )}
        </TabsContent>
        <TabsContent
          value="doctor"
          className="mx-10 flex flex-col space-y-3 pt-4"
        >
          {doctors.length === 0 && <p className="text-center">No Doctors</p>}
          {doctors.map((doctor, index) => (
            <Card className="h-[100px] shadow-none" key={index}>
              <CardHeader className="flex w-full flex-row justify-between">
                <div className="flex flex-col space-y-1">
                  <p className="text-xl font-medium">Doctor</p>
                  <CardDescription>
                    {doctor.author.slice(0, 15) +
                      "..." +
                      doctor.author.slice(-8)}
                  </CardDescription>
                </div>
                <Button onClick={() => updateDetailsToDoctor(doctor.doctor)}>
                  Send Details
                </Button>
              </CardHeader>
              {/* <CardContent>
              <p>Card Content</p>
            </CardContent> */}
            </Card>
          ))}
        </TabsContent>
        <TabsContent
          value="myappointment"
          className="flex flex-col space-y-3 pt-4 items-center"
        >
          <Card className="card-scroll h-full overflow-y-scroll p-0 w-1/2">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="sticky top-0">
                  <TableRow>
                    <TableHead className="w-[200px]">Medicine Name</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead className="text-right">Days Left</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="w-full">
                  {/* <div className="w-full overflow-y-scroll"> */}

                  {medicines &&
                    medicines.map((medi, index) => {
                      // Skip records with empty attributes
                      if (!medi.name || !medi.dosage || !medi.frequency) {
                        return null;
                      }
                      const tillDate = parseISO(medi.tillDate);
                      const today = new Date();

                      const duration = differenceInDays(tillDate, today);
                      console.log(duration, "duration");
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {medi.name}
                          </TableCell>
                          <TableCell>{medi.dosage}</TableCell>
                          <TableCell>{medi.frequency}</TableCell>
                          <TableCell className="text-right">
                            {duration}
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {/* </div> */}
                  {/* Add more rows if needed */}
                </TableBody>
              </Table>
              {medicines && medicines.length === 0 && (
                <div className="h-full p-7">
                  <p className="text-center">No Medicines</p>
                </div>
              )}
            </CardContent>
          </Card>
          {myHistory.length === 0 && <p>No Appointment</p>}
          <div className="flex flex-col h-full w-[80%] place-items-center gap-4 px-10">
            {myHistory &&
              myHistory.map((item, index) => (
                <>
                  <div
                    className="flex h-fit w-full flex-col rounded-xl border border-slate-200 bg-white p-5"
                    style={{width: "100%"}} // Set width to 100%
                    key={index}
                    // onClick={() =>
                    //   // deletePatient(patient.patient)
                    //   router.push(`/patientDashboard/${patient.patient}`)
                    // }
                  >
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {/* <img
                      src={`/${patient.gender === "male" ? "boy" : "girl"}.png`}
                      alt="doctor"
                      className="h-9 w-9"
                    /> */}
                      <div className="flex flex-col">
                        <p className="text-sm capitalize">
                          From:{" "}
                          <span className="font-bold">
                            {item.doctor.slice(0, 15) +
                              "..." +
                              item.doctor.slice(-8)}
                          </span>
                          {/* {patients.length} */}
                        </p>
                        {/* <p className="text-xs capitalize">{patient.gender}</p> */}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 py-3">
                      <p className="truncate text-sm">
                        <span className="font-medium">Problem:</span>{" "}
                        {item.problem}
                      </p>
                      <p className="truncate text-sm">
                        <span className="font-medium">Diagnosis:</span>{" "}
                        {item.diagnosis}
                      </p>
                      {/* <p className="truncate text-sm">
                        <span className="font-medium">Blood Group:&nbsp;</span>

                        {patient.bloodGrp?.toUpperCase()}
                      </p>
                      <p className="truncate text-sm">
                        <span className="font-medium">Height:</span>{" "}
                        {patient.height}
                      </p>
                      <p className="truncate text-sm">
                        <span className="font-medium">Weight:</span>{" "}
                        {patient.weight}
                      </p> */}
                    </div>
                  </div>
                </>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
