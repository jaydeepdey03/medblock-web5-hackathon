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
export default function CreatePatient() {
  const router = useRouter();
  return (
    <div className="grid h-screen w-screen place-items-center p-10">
      <div className="mb-10 flex h-fit w-[600px] flex-col rounded-xl border-[1px] shadow-lg xl:flex-row">
        <Formik
          initialValues={{
            name: "" as String,
            age: "" as String,
            allergyHis: [] as string[],
            bloodGrp: "" as String,
            pastCondition: "",
            height: "",
            weight: "",
          }}
          onSubmit={(values, _) => console.log(values)}
        >
          {(formik) => (
            <Form className="flex w-full flex-col items-center space-y-5 p-10">
              <p className="text-3xl font-bold text-blue-800">Add Patient</p>
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
                    <SelectItem value="a-">A Negative</SelectItem>
                    <SelectItem value="a+">A Positive</SelectItem>
                    <SelectItem value="b+">B Positive</SelectItem>
                    <SelectItem value="b-">B Negative</SelectItem>
                    <SelectItem value="o+">O Positive</SelectItem>
                    <SelectItem value="o-">O Negative</SelectItem>
                    <SelectItem value="ab+">AB Positive</SelectItem>
                    <SelectItem value="ab-">AB Negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full">
                <Label htmlFor="allergyHis" className="ml-1">
                  Allgery History
                </Label>
                <div className="mb-2" />
                <TagsInput
                  classNames={{
                    input: "",
                    tag: "bg-blue-200 text-blue-700",
                  }}
                  value={formik.values.allergyHis}
                  onChange={(newAllergies) => {
                    formik.setFieldValue("allergyHis", newAllergies);
                  }}
                  name="allergyHis"
                  placeHolder="Type disease and Press Enter"
                />
              </div>
              <div className="w-full">
                <Label htmlFor="pastCondition" className="ml-1">
                  Past Condition
                </Label>
                <Field
                  name="pastCondition"
                  as={Input}
                  placeholder="Please specify any past condition"
                  type="text"
                  className="mt-2"
                />
              </div>

              <div className="w-full">
                <Button
                  type="submit"
                  className="group flex w-full items-center justify-center bg-blue-800 hover:bg-blue-900"
                >
                  <p className="text-white">Generate DID and Add Patient</p>
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
