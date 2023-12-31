"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Droplet, Ruler, Weight } from "lucide-react";
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
import { Field, Form, Formik } from "formik";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
            <h1 className="text-3xl font-bold">Hello,</h1>
            <p className="text-lg">Welcome to your dashboard</p>
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(
                  (item, index) => (
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
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
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
                  ),
                )}
              </div>
            </CardContent>
          </div>
        </Card>
        <div className="order-first grid h-[600px] w-full grid-cols-1 gap-2 rounded-xl xl:col-span-full xl:col-start-2 xl:col-end-4 xl:row-start-1 xl:row-end-2 xl:h-full xl:grid-cols-3">
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-xl border-[1px] border-slate-200 bg-white">
            <Ruler className="h-[50px] w-[50px] text-slate-700" />
            <p className="text-sm font-medium">Height</p>
            <p className="text-3xl font-semibold">171cm</p>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-xl border-[1px] border-slate-200 bg-white">
            <Weight className="h-[50px] w-[50px] text-slate-700" />
            <p className="text-sm font-medium">Weight</p>
            <p className="text-3xl font-semibold">180kg</p>
          </div>
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 rounded-xl border-[1px] border-slate-200 bg-white">
            <Droplet className="h-[50px] w-[50px] text-slate-700" />
            <p className="text-lg font-medium">Blood Group</p>
            <p className="text-3xl font-semibold">B+</p>
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
                  <DialogContent className="h-[90vh] max-w-[80vw]">
                    <DialogHeader>
                      <DialogTitle>New Appointment Form</DialogTitle>
                      <DialogDescription>
                        <Formik
                          initialValues={{
                            name: "" as string,
                            age: "" as string,
                            bloodGrp: "" as string,
                            did: "" as string,
                            height: "",
                            weight: "",
                          }}
                          onSubmit={(values, _) => {
                            console.log(values);
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
                        </Formik>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14].map((item) => (
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
        </div>
      </div>
    </div>
  );
}
