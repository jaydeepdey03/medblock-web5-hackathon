"use client"

import { Web5 } from "@web5/api";
import { useEffect, useState } from "react";


export default function Dashboard() {


  const [web5, setWeb5] = useState(null);
  const [myDid, setMyDid] = useState(null);

  useEffect(() => {
    const initWeb5 = async () => {
      const { web5, did } = await Web5.connect();
      console.log(did);

      setWeb5(web5);
      setMyDid(did);

      // if (web5 && did) {
      //   await configureProtocol(web5, did);
      //   await fetchDings(web5, did);
      // }
    };
    initWeb5();
  }, []);


  async function addUser(name: string, dateofbirth: string, gender: string) {
    const userData = {
      name: name,
      dateofbirth: dateofbirth,
      gender: gender,
      isDoctor: false,
    };


    // Create the record in DWN
    const { record } = await web5.dwn.records.create({
      data: userData,
      message: {
        schema: 'https://blackgirlbytes.dev/user',
        dataFormat: 'application/json'
      }
    });

    console.log(record);
  }


  useEffect(() => {
    const fetchUser = async () => {

      try {
        if (web5 && myDid) {
          const { records } = await web5.dwn.records.query({
            message: {
              filter: {
                schema: 'https://blackgirlbytes.dev/user'
              },
              dateSort: 'createdAscending'
            }
          });

          console.log("records ", records)

          for (let record of records) {
            const data = await record.data.json();
            console.log('--------- ', data)
          }
        }

      } catch (error) {
        console.log(error)
      }
    }
    fetchUser();
  }, [web5, myDid]);

  return <div>Dashboard

    <button onClick={() => addUser('Cook', '12-12-2012', 'male')}> add</button>
  </div>;
}
