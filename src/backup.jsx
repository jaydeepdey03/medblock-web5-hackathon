<div className="h-full w-full rounded-xl flex flex-col space-y-4">
  {/* navbar */}
  <div className="bg-slate-50 h-[10%] rounded-xl flex items-center justify-between pl-6 pr-5">
    <p>MedBlock</p>
    <ul className="list-none flex space-x-10">
      <li>Home</li>
      <li>About</li>
      <li>Login</li>
    </ul>
  </div>
  {/* main banner */}
  <div className="bg-sky-500 h-[90%] rounded-xl w-full flex justify-center relative">
    <div className="absolute top-10 text-white flex flex-col space-y-4 text-center">
      <p className="text-6xl font-bold">MedBlock</p>
      <p className="text-xl font-semibold">
        Your Decentralized Patient ID for Modern Appointments
      </p>
    </div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/doctor2.png"
      alt="doctor"
      className="w-auto h-[500px] absolute bottom-0"
    />
    <div className="absolute bottom-10 right-10 h-56 w-72 border-[1px] border-slate-200 rounded-xl flex justify-center items-center overflow-hidden cursor-pointer hover:scale-105 duration-100 ease-in-out">
      <Image
        height={256}
        width={256}
        src="/hospital.jpg"
        alt="hospital"
        className="absolute top-0 right-0 z-0 h-full w-full"
      />
      <div className="flex justify-center items-center flex-col z-10">
        <p className="text-red-950 text-2xl font-semibold">Create Patient ID</p>
      </div>
    </div>
  </div>
</div>;

<div className="flex justify-center h-screen w-screen font-poppins p-5">
  <div className="bg-sky-400 rounded-xl h-full w-full flex relative">
    <div className="h-full w-full grid place-items-center">
      <div className="text-white flex flex-col space-y-4">
        <p className="text-6xl font-bold">MedBlock</p>
        <p className="text-xl font-semibold">
          Your Decentralized Patient ID for Modern Appointments
        </p>
        <Button className="group rounded-full w-fit bg-sky-600 flex space-x-2 hover:bg-sky-700">
          <span>Create Patient ID</span>
          <ArrowRight className="group-hover:translate-x-2 duration-200 ease-in-out mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="h-full w-full grid place-items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/doctor2.png" alt="doctor2" className="h-[80%] w-auto" />
    </div>
  </div>
</div>;

<div className="flex justify-center h-full w-full font-poppins p-5">
  <div className="bg-blue-500 rounded-xl h-full w-full flex relative p-5">
    <div className="h-full w-full grid place-items-center rounded-xl ">
      <div className="text-white flex flex-col space-y-4">
        <p className="text-6xl font-bold">MedBlock</p>
        <p className="text-xl font-semibold">
          Your Decentralized Patient ID for Modern Appointments
        </p>
        <Button className="group rounded-full w-[200px] bg-blue-800 flex space-x-2 hover:bg-blue-900">
          <span>Create Patient ID</span>
          <ArrowRight className="group-hover:translate-x-1 duration-200 ease-in-out mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="h-full w-full grid place-items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/doctor2.png" alt="doctor2" className="h-[80%] w-auto" />
    </div>
  </div>
</div>;
