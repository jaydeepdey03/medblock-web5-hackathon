"use client"
import { useRouter } from 'next/navigation';
import protocolDefinition from "../../../assets/shared-user-protocol.json";
import React, { useEffect, useState } from 'react'

import useGlobalStore from "../../../hook/useGlobalStore";
function Appointment() {

    const router = useRouter();
    const patientId = router.query.id;
    const { web5, myDid } = useGlobalStore();

    // let todoRecipient;
    // let todoList = ref({});
    // let todoItems = ref([]);
    const [patientDid, setPatientDid] = useState('');
    const [appointmentList, setAppointmentList] = useState({});
    const [appointmentItems, setAppointmentItems] = useState([]);

    useEffect(() => {

        const fetchAppointments = async () => {
            console.log("this is your DID", myDid);

            // fetch shared list details.
            const { record } = await web5.dwn.records.read({
                message: {
                    filter: {
                        recordId: patientId
                    }
                }
            })

            // fetch todos under list.
            const { records: appointmentRecords } = await web5.dwn.records.query({
                message: {
                    filter: {
                        parentId: patientId
                    },
                }
            })

            let appList = await record.data.json();
            setAppointmentList(appList)
            // appList - contains information about all the things of the patient
            setPatientDid(appList.recipientId)
            // todoRecipient = await getTodoRecipient();

            // // Add entry to ToDos array
            for (let record of appointmentRecords) {
                const data = await record.data.json();
                const appointment = { record, data, id: record.id };
                // todoItems.value.push(todo);
                console.log("fetching------->>>> ", appointment);
                setAppointmentItems([appointment, ...appointmentItems]);
            }

        }
        fetchAppointments();
    }, [])

    async function addAppointment() {

        const obj = {
            problem: 'problem', diagnosis: 'diagnosis',
            treatment: {
                medications: [
                    {
                        name: "Lisinopril",
                        dosage: "10mg",
                        frequency: "Once daily"
                    },
                    {
                        name: "Hydrochlorothiazide",
                        dosage: "25mg",
                        frequency: "Once daily"
                    }
                ],
                recommendations: [
                    "Maintain a low-sodium diet",
                    "Regular exercise",
                    "Follow-up appointment in 3 months"
                ]
            },
            appointmentDate: '12-11-2003'
        }

        const appointmentData = {
            author: myDid,
            parentId: patientId,
            problem: obj.problem,
            diagnosis: obj.diagnosis,
            treatment: obj.treatment,
            appointmentDate: obj.appointmentDate,
        };


        const { record: appointmentRecord, status: createStatus } = await web5.dwn.records.create({
            data: appointmentData,
            message: {
                protocol: protocolDefinition.protocol,
                protocolPath: 'list/appointment',
                schema: protocolDefinition.types.appointment.schema,
                dataFormat: protocolDefinition.types.appointment.dataFormats[0],
                parentId: patientId,
                contextId: patientId,
            }
        });

        const data = await appointmentRecord.data.json();
        const appointment = { appointmentRecord, data, id: appointmentRecord.id };
        // todoItems.value.push(todo);
        setAppointmentItems([appointment, ...appointmentItems]);
        const { status: sendStatus } = await appointmentRecord.send(patientDid);

        if (sendStatus.code !== 202) {
            console.log("Unable to send to target did:" + sendStatus);
            return;
        }
        else {
            console.log("Sent todo to recipient");
        }

    }



    return (
        <div>
            <button type="button" onClick={() => addAppointment()}>
                Add Appointment
            </button>
        </div>
    )
}

export default Appointment;