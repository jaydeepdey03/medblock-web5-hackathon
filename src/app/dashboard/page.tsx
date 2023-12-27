"use client"

import { useEffect, useState } from "react";
import useGlobalStore from '../../hook/useGlobalStore'
import protocolDefinition from "../assets/shared-user-protocol.json";


export default function Dashboard() {

  const { web5, myDid } = useGlobalStore()

  const [sharedList, setSharedList] = useState([]);


  useEffect(() => {


    if (web5 && myDid) {
      fetchList(web5, myDid);
    }
  }, [web5, myDid])


  const [patient, setPatient] = useState({
    name: 'Jaydeep',
    dateOfBirth: '12-12-2012',
    gender: 'male',
    did: '---'
  });

  const fetchList = async (web5: any, did: string) => {

    try {
      console.log("Fetching list-------", web5)

      const { records } = await web5.dwn.records.query({
        message: {
          filter: {
            schema: protocolDefinition.types.list.schema,
          },
          dateSort: 'createdAscending'
        }
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
  }



  const createSharedList = async () => {

    let recipientDID = 'xxx';

    const sharedListData = {
      "@type": "list",
      "name": patient.name,
      "dateOfBirth": patient.dateOfBirth,
      "gender": patient.gender,
      "doctor": myDid,
      "patient": recipientDID,
    }

    // newTodo.value = { title: '', description: '', recipientDID: '' }
    setPatient({
      name: '', dateOfBirth: '', gender: '', did: ''
    })

    try {
      const { record } = await web5.dwn.records.create({
        data: sharedListData,
        message: {
          protocol: protocolDefinition.protocol,
          protocolPath: 'list',
          schema: protocolDefinition.types.list.schema,
          dataFormat: protocolDefinition.types.list.dataFormats[0],
          recipient: recipientDID
        }
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
      }
      else {
        console.log("Shared list sent to recipient");
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }



  return <div>Dashboard

    {/* <button onClick={() => addUser('Cook', '12-12-2012', 'male')}> add</button> */}
  </div>;
}
