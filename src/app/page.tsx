import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="f min-h-screen h-screen w-screen font-poppins p-5">
      <div className="flex justify-center h-full w-full font-poppins p-5">
        <div className="bg-blue-900 rounded-xl h-full w-full flex flex-col xl:flex-row relative">
          <div className="h-full w-full grid place-items-center rounded-xl ">
            <div className="flex flex-col space-y-8 xl:items-start items-center">
              <p className="text-8xl font-extrabold text-pink-200">MedBlock</p>
              <p className="text-xl font-semibold text-pink-100">
                Your Decentralized Patient ID for Modern Appointments
              </p>
              <Button className="group rounded-full w-[200px] bg-pink-400 flex space-x-2 hover:bg-pink-500">
                <span>Create Patient ID</span>
                <ArrowRight className="group-hover:translate-x-1 duration-200 ease-in-out mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="h-full w-full relative flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/doctor2.png"
              alt="doctor2"
              className="h-full xl:mt-auto absolute xl:h-[80%] xl:bottom-0"
            />
          </div>
        </div>
      </div>
      <div className="p-5 flex gap-2 h-fit w-full flex-col xl:flex-row">
        <div className="xl:h-[450px] xl:w-1/4 px-3 bg-pink-300 rounded-3xl p-6">
          <div
            className="flex flex-col justify-around
           items-center text-center h-full w-full space-y-7 xl:space-x-0"
          >
            <p className="text-3xl 2xl:text-5xl font-bold text-blue-900">
              Decentralized Patient IDs
            </p>
            <p className="text-lg text-blue-950">
              Seize control of your health with decentralized IDs for a private,
              modern experience
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/card.png"
                alt="card"
                className="h-32 w-auto z-20 relative" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
        <div className="xl:h-[450px] xl:w-1/4 px-3 bg-yellow-400 rounded-3xl p-6">
          <div
            className="flex flex-col justify-around
           items-center text-center h-full w-full"
          >
            <p className="text-3xl 2xl:text-5xl font-bold text-blue-900">
              Seamless Appointment Booking
            </p>
            <p className="text-lg text-blue-950">
              Seize control of your health with decentralized IDs for a private,
              modern experience
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/booking.png"
                alt="booking"
                className="h-32 w-auto z-20 relative" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
        <div className="xl:h-[450px] xl:w-1/4 px-3 bg-purple-300 rounded-3xl p-6">
          <div
            className="flex flex-col justify-around
           items-center text-center h-full w-full"
          >
            <p className="text-3xl 2xl:text-5xl font-bold text-blue-900">
              Empowering Telehealth
            </p>
            <p className="text-lg text-blue-950">
              Telehealth anywhere: Use your decentralized ID for secure medical
              expertise at home
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/consult.png"
                alt="consult"
                className="h-32 w-auto z-20 relative" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
        <div className="xl:h-[450px] xl:w-1/4 px-3 bg-red-300 rounded-3xl p-6">
          <div
            className="flex flex-col justify-around
           items-center text-center h-full w-full"
          >
            <p className="text-3xl 2xl:text-5xl font-bold text-blue-900">
              Interconnected Health Records
            </p>
            <p className="text-lg text-blue-950">
              Connected healthcare: ID links seamlessly with records for
              comprehensive information across providers.
            </p>
            <div className="relative">
              {/* <div className="bg-stone-400 rounded-full h-24 w-24 z-10 -top-5 -left-5 blur-2xl absolute" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/record.png"
                alt="record"
                className="h-32 w-auto z-20 relative" // Set a higher z-index value
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
