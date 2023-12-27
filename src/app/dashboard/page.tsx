"use client"
import protocolDefinition from "../assets/shared-user-protocol.json";
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

      if (web5 && did) {
        await configureProtocol(web5, did);
        //   await fetchDings(web5, did);
      }
    };
    initWeb5();
  }, []);


  const createSharedList = async () => {
    let recipientDID = newTodo.value.recipientDID;
    const sharedListData = {
      "@type": "list",
      "title": newTodo.value.title,
      "description": newTodo.value.description,
      "author": myDID,
      "recipient": newTodo.value.recipientDID,
    }

    newTodo.value = { title: '', description: '', recipientDID: '' }

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

      sharedList.value.push(list);
      showForm.value = false

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

  const configureProtocol = async () => {
    // query the list of existing protocols on the DWN
    const { protocols, status } = await web5.dwn.protocols.query({
      message: {
        filter: {
          protocol: protocolDefinition.protocol,
        }
      }
    });

    if (status.code !== 200) {
      alert('Error querying protocols');
      console.error('Error querying protocols', status);
      return;
    }

    // if the protocol already exists, we return
    if (protocols.length > 0) {
      console.log('Protocol already exists');
      return;
    }

    // configure protocol on local DWN
    const { status: configureStatus, protocol } = await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      }
    });

    console.log('Protocol configured', configureStatus, protocol);
  }

  return <div>Dashboard

    {/* <button onClick={() => addUser('Cook', '12-12-2012', 'male')}> add</button> */}
  </div>;
}
