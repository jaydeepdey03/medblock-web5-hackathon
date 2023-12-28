"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, Form, Formik } from "formik";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { TagsInput } from "react-tag-input-component";

import useGlobalStore from "../../hook/useGlobalStore";
import protocolDefinition from "../../assets/shared-user-protocol.json";
import { useEffect, useState } from "react";

export default function CreatePatient() {
  const router = useRouter();
  const { web5, myDid } = useGlobalStore();

  const [sharedList, setSharedList] = useState<any[]>([]);

  useEffect(() => {
    if (web5 && myDid) {
      fetchList(web5, myDid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web5, myDid]);

  const fetchList = async (web5: any, did: string) => {
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
      for (let record of records) {
        const data = await record.data.json();
        const list = { record, data, id: record.id };
        // sharedList.value.push(list);
        setSharedList([list, ...sharedList]);
      }
    } catch (error) {
      console.log("Failed ", error);
    }
  };

  useEffect(() => {
    sharedList.map((val, index) => {
      console.log(val.id);
    });
  }, [sharedList]);

  const createSharedList = async (patientDetails: any) => {
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
      const list = { record, data, id: record.id };

      // sharedList.value.push(list);
      setSharedList([list, ...sharedList]);
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

  return (
    <div className="grid h-screen w-screen place-items-center p-10">
      <div className="mb-10 flex h-fit w-[600px] flex-col rounded-xl border-[1px] shadow-2xl shadow-pink-100 xl:flex-row">
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
            createSharedList(values);
            router.push(`/patientDashboard/did:ion:id=${values.did.slice(-8)}`);
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
      </div>
    </div>
  );
}
