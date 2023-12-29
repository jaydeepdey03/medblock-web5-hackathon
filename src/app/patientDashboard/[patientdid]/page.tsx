import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PatientDashboard({
  params,
}: {
  params: { patientdid: string };
}) {
  return (
    <div className="relative h-screen w-screen">
      {/* Background circles */}
      <div className="absolute -top-[100px] -z-10 h-72 w-72 rounded-full bg-pink-400 blur-[500px]" />
      <div className="absolute -top-[100px] left-1/2 -z-10 h-72 w-72 -translate-x-1/2 transform rounded-full bg-blue-400 blur-[500px]" />
      <div className="absolute -top-[100px] right-0 -z-10 h-72 w-72 rounded-full bg-purple-400 blur-[500px]" />
      {/* Main content */}
      <div className="flex h-fit w-full items-end justify-between py-10 sm:justify-start sm:p-10">
        <div className="flex flex-1 flex-col items-center gap-4 sm:flex-row">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/girl.png"
            alt="girl"
            className="grid h-20 w-20 place-items-center rounded-full bg-white"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">Hello, Jane</h1>
            <p className="text-lg">Welcome to your dashboard</p>
          </div>
        </div>
      </div>
      <div className="p-8">
        <Card className="card-scroll col-span-3 h-fit w-full sm:px-5 lg:w-1/2">
          <CardHeader>
            <CardTitle>Appointment</CardTitle>
          </CardHeader>
          <div className="card-scroll h-full w-full overflow-y-scroll">
            <CardContent className="">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    className="flex items-center rounded-xl hover:bg-slate-100"
                    key={item}
                  >
                    <div className="flex items-center gap-0 truncate sm:w-[80%]">
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
  );
}
