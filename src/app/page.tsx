"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen min-h-screen w-full font-poppins">
      <div className="flex h-full w-full justify-center p-5 font-poppins">
        <div className="relative flex h-full w-full flex-col rounded-xl bg-blue-900 xl:flex-row">
          <div className="grid h-full w-full place-items-center rounded-xl ">
            <div className="flex flex-col items-center space-y-8 text-center xl:items-start">
              <p className="text-5xl font-extrabold text-pink-200 sm:text-8xl">
                MedBlock
              </p>
              <p className="text-md px-4 font-semibold text-pink-100 sm:text-xl">
                Your Decentralized Patient ID for Modern Appointments
              </p>
              <Button
                className="group flex w-[200px] space-x-2 rounded-full bg-pink-400 hover:bg-pink-500"
                onClick={() => router.push("/addPatient")}
              >
                <span>Add Patient ID</span>
                <ArrowRight className="mr-2 h-4 w-4 duration-200 ease-in-out group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
          <div className="relative flex h-full w-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              // src="https://img.freepik.com/free-vector/flat-national-doctor-s-day-illustration-with-female-medic_23-2149449714.jpg?w=740&t=st=1703664836~exp=1703665436~hmac=fcd8cc227be3c32f2ab52cc1a3869d5fc57b5f82b812cfef03191889b0f0100a"
              src="/doctor2.png"
              alt="doctor2"
              className="absolute h-full xl:bottom-0 xl:mt-auto xl:h-[80%]"
            />
          </div>
        </div>
      </div>
      <div className="flex h-fit w-full flex-col gap-5 p-5 lg:flex-row">
        <div className="rounded-3xl bg-pink-300 p-6 px-3 duration-150 ease-in-out hover:scale-105 xl:h-[450px] xl:w-1/4">
          <div
            className="flex h-full w-full
           flex-col items-center justify-around space-y-7 text-center xl:space-x-0"
          >
            <p className="text-3xl font-bold text-blue-900 2xl:text-4xl">
              Decentralized Patient IDs
            </p>
            <p className="font-inter text-lg text-blue-950">
              Seize control of your health with decentralized IDs for a private,
              modern experience
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/card.png"
                alt="card"
                className="relative z-20 h-32 w-auto" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-yellow-400 p-6 px-3 duration-150 ease-in-out hover:scale-105 xl:h-[450px] xl:w-1/4">
          <div
            className="flex h-full w-full
           flex-col items-center justify-around space-y-7 text-center xl:space-x-0"
          >
            <p className="text-3xl font-bold text-blue-900 2xl:text-4xl">
              Seamless Appointment Booking
            </p>
            <p className="text-blue-95 font-inter text-lg">
              Seize control of your health with decentralized IDs for a private,
              modern experience
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/booking.png"
                alt="booking"
                className="relative z-20 h-32 w-auto" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-purple-300 p-6 px-3 duration-150 ease-in-out hover:scale-105 xl:h-[450px] xl:w-1/4">
          <div
            className="flex h-full w-full
           flex-col items-center justify-around space-y-7 text-center xl:space-x-0"
          >
            <p className="text-3xl font-bold text-blue-900 2xl:text-4xl">
              Empowering Telehealth
            </p>
            <p className="font-inter text-lg text-blue-950">
              Telehealth anywhere: Use your decentralized ID for secure medical
              expertise at home
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/consult.png"
                alt="consult"
                className="relative z-20 h-32 w-auto" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-red-300 p-6 px-3 duration-150 ease-in-out hover:scale-105 xl:h-[450px] xl:w-1/4">
          <div
            className="flex h-full w-full
           flex-col items-center justify-around space-y-7 text-center xl:space-x-0"
          >
            <p className="text-3xl font-bold text-blue-900 2xl:text-4xl">
              Interconnected Health Records
            </p>
            <p className="font-inter text-lg text-blue-950">
              Connected healthcare: ID links seamlessly with records for
              comprehensive information across providers.
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/record.png"
                alt="record"
                className="relative z-20 h-32 w-auto" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
