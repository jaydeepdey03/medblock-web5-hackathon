"use client";

import { useEffect, useState } from "react";
import useGlobalStore from "../../hook/useGlobalStore";
import protocolDefinition from "../../assets/shared-user-protocol.json";
import { Button } from "@/components/ui/button";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, Droplet, Stethoscope, Syringe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Fuse from "fuse.js";

export default function Dashboard() {
  const { web5, myDid } = useGlobalStore();

  const [patients, setPatients] = useState<any[]>([]);
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [searchPattern, setSearchPattern] = useState<string>("");
  const fuse = new Fuse(patients, {
    keys: ["name"],
  });

  useEffect(() => {
    if (web5) {
      console.log("number of callss---------");
      fetchList(web5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web5]);

  const fetchList = async (web5: any) => {
    try {
      console.log("Fetching list-------", web5);

      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.list.schema,
          },
          dateSort: "createdAscending",
        },
      });

      console.log("Saved records", records);

      // add entry to sharedList
      let patientsArray: any[] = [];
      for (let record of records) {
        const data = await record.data.json();
        const list = { record, ...data, id: record.id };

        // console.log("Added record", list);
        // // add to existing state of the patient
        if (!patientsArray.some((item) => item.id === list.id)) {
          patientsArray.push(list);
        }
        // setPatients((prev) => [list, ...prev]);
        console.log("Updated records", patientsArray);
        if (patientsArray.length !== patients.length)
          setPatients(patientsArray);
      }
    } catch (error) {
      console.log("Failed ", error);
    }
  };

  const addNewPatient = async (patientDetails: any) => {
    let recipientDID = patientDetails.did;

    const sharedListData = {
      "@type": "list",
      author: myDid,
      name: patientDetails.name,
      age: patientDetails.age,
      height: patientDetails.height,
      weight: patientDetails.weight,
      bloodGrp: patientDetails.bloodGrp,
      recipient: recipientDID,
      gender: patientDetails.gender,
    };

    console.log(sharedListData);
    try {
      const { record } = await web5.dwn.records.create({
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
      const list = { record, ...data, id: record.id };

      // sharedList.value.push(list);
      setPatients([list, ...patients]);
      // showForm.value = false

      const { status: sendStatus } = await record.send(recipientDID);

      if (sendStatus.code !== 202) {
        console.log("Unable to send to target did:" + sendStatus);
        return;
      } else {
        console.log("Shared list sent to recipient");
      }
    } catch (e) {
      console.error(e);
      return;
    }
  };

  useEffect(() => {
    console.log("patientsssss----  ", patients);
  }, [patients]);

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
                  name: "" as string,
                  age: "" as string,
                  bloodGrp: "" as string,
                  did: "" as string,
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
      <p className="mb-6 py-5 text-center font-inter text-4xl font-bold text-blue-900">
        List of Patient
      </p>
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
          gridTemplateColumns: `repeat(auto-${patients.length <= 1 ? "fit" : "fill"
            }, minmax(400px, 1fr))`,
        }}
      >
        {searchPattern.length === 0 &&
          patients.map((patient, i) => (
            <div
              className="flex h-fit w-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 duration-100 hover:scale-105"
              // style={{ width: "100%" }} // Set width to 100%
              key={i}
              onClick={() => router.push(`/patientDashboard/${patient.id}`)}
            >
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/${patient.gender === "male" ? "boy" : "girl"}.png`}
                  alt="doctor"
                  className="h-9 w-9"
                />
                <div className="flex flex-col">
                  <p className="text-sm capitalize">{patient.name} {searchPattern.length}{patients.length}</p>
                  <p className="text-xs capitalize">{patient.gender}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 py-3">
                <p className="truncate text-sm">
                  <span className="font-medium">Doctor:</span> {patient.author + "..."}
                </p>
                <p className="truncate text-sm">
                  <span className="font-medium">Patient:</span>{" "}
                  {patient.recipient.slice(0, 15) + "..."}
                </p>
                <p className="truncate text-sm">
                  <span className="font-medium">Blood Group:&nbsp;</span>

                  {patient.bloodGrp?.toUpperCase()}
                </p>
                <p className="truncate text-sm">
                  <span className="font-medium">Height:</span> {patient.height}
                </p>
                <p className="truncate text-sm">
                  <span className="font-medium">Weight:</span> {patient.weight}
                </p>
              </div>
            </div>
          ))}
        {/* If not searching  */}
        {searchPattern.length > 0 &&
          fuse.search(searchPattern)?.map(({ item: patient }, i) => (
            <div
              className="flex h-fit cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-5 duration-100 hover:scale-105"
              style={{ width: "100%" }} // Set width to 100%
              key={i}
              onClick={() => router.push(`/patientDashboard/${patient.id}`)}
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
                  <span className="font-medium">Doctor:</span> {patient.author}
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
                  <span className="font-medium">Height:</span> {patient.height}
                </p>
                <p className="truncate text-sm">
                  <span className="font-medium">Weight:</span> {patient.weight}
                </p>
              </div>
            </div>
          ))}
        {
          searchPattern.length > 0 &&
          fuse.search(searchPattern).length == 0 &&
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-2xl font-bold text-blue-900">No results found</p>
          </div>
        }
      </div>
    </div>
  );
}
