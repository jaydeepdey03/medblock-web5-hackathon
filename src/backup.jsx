<div className="flex h-full w-full flex-col space-y-4 rounded-xl">
  {/* navbar */}
  <div className="flex h-[10%] items-center justify-between rounded-xl bg-slate-50 pl-6 pr-5">
    <p>MedBlock</p>
    <ul className="flex list-none space-x-10">
      <li>Home</li>
      <li>About</li>
      <li>Login</li>
    </ul>
  </div>
  {/* main banner */}
  <div className="relative flex h-[90%] w-full justify-center rounded-xl bg-sky-500">
    <div className="absolute top-10 flex flex-col space-y-4 text-center text-white">
      <p className="text-6xl font-bold">MedBlock</p>
      <p className="text-xl font-semibold">
        Your Decentralized Patient ID for Modern Appointments
      </p>
    </div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/doctor2.png"
      alt="doctor"
      className="absolute bottom-0 h-[500px] w-auto"
    />
    <div className="absolute bottom-10 right-10 flex h-56 w-72 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-[1px] border-slate-200 duration-100 ease-in-out hover:scale-105">
      <Image
        height={256}
        width={256}
        src="/hospital.jpg"
        alt="hospital"
        className="absolute right-0 top-0 z-0 h-full w-full"
      />
      <div className="z-10 flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold text-red-950">Create Patient ID</p>
      </div>
    </div>
  </div>
</div>;

<div className="flex h-screen w-screen justify-center p-5 font-poppins">
  <div className="relative flex h-full w-full rounded-xl bg-sky-400">
    <div className="grid h-full w-full place-items-center">
      <div className="flex flex-col space-y-4 text-white">
        <p className="text-6xl font-bold">MedBlock</p>
        <p className="text-xl font-semibold">
          Your Decentralized Patient ID for Modern Appointments
        </p>
        <Button className="group flex w-fit space-x-2 rounded-full bg-sky-600 hover:bg-sky-700">
          <span>Create Patient ID</span>
          <ArrowRight className="mr-2 h-4 w-4 duration-200 ease-in-out group-hover:translate-x-2" />
        </Button>
      </div>
    </div>
    <div className="grid h-full w-full place-items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/doctor2.png" alt="doctor2" className="h-[80%] w-auto" />
    </div>
  </div>
</div>;

<div className="flex h-full w-full justify-center p-5 font-poppins">
  <div className="relative flex h-full w-full rounded-xl bg-blue-500 p-5">
    <div className="grid h-full w-full place-items-center rounded-xl ">
      <div className="flex flex-col space-y-4 text-white">
        <p className="text-6xl font-bold">MedBlock</p>
        <p className="text-xl font-semibold">
          Your Decentralized Patient ID for Modern Appointments
        </p>
        <Button className="group flex w-[200px] space-x-2 rounded-full bg-blue-800 hover:bg-blue-900">
          <span>Create Patient ID</span>
          <ArrowRight className="mr-2 h-4 w-4 duration-200 ease-in-out group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
    <div className="grid h-full w-full place-items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/doctor2.png" alt="doctor2" className="h-[80%] w-auto" />
    </div>
  </div>
</div>;
