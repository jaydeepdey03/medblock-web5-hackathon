import { useRouter } from 'next/router';
import protocolDefinition from "../assets/shared-user-protocol.json";
import React, { useEffect, useState } from 'react'

function Appointment() {

    const router = useRouter();
    const patientId = router.query.id;


    let todoRecipient;
    // let todoList = ref({});
    // let todoItems = ref([]);
    const [appointmentList, setAppointmentList] = useState({});
    const [appointmentItems, setAppointmentItems] = useState([]);

    useEffect(() => {

        const fetchAppointments = async () => {
            console.log("this is your DID", myDID);

            // fetch shared list details.
            const { record } = await web5.dwn.records.read({
                message: {
                    filter: {
                        recordId: patientId
                    }
                }
            })

            // fetch todos under list.
            const { records: todoRecords } = await web5.dwn.records.query({
                message: {
                    filter: {
                        parentId: patientId
                    },
                }
            })

            // todoList = await record.data.json();
            // todoRecipient = await getTodoRecipient();

            // // Add entry to ToDos array
            // for (let record of todoRecords) {
            //     const data = await record.data.json();
            //     const todo = { record, data, id: record.id };
            //     todoItems.value.push(todo);
            // }

        }
    }, [])

    async function addAppointment() {

        let newTodoDescription = 'Newointment'

        const todoData = {
            completed: false,
            description: newTodoDescription,
            author: myDID,
            parentId: patientId,
        };

        newTodoDescription = '';



        const { record: todoRecord, status: createStatus } = await web5.dwn.records.create({
            data: todoData,
            message: {
                protocol: protocolDefinition.protocol,
                protocolPath: 'list/todo',
                schema: protocolDefinition.types.appointment.schema,
                dataFormat: protocolDefinition.types.appointment.dataFormats[0],
                parentId: patientId,
                contextId: patientId,
            }
        });

        const data = await todoRecord.data.json();
        const todo = { todoRecord, data, id: todoRecord.id };
        // todoItems.value.push(todo);
        setAppointmentItems([todo, ...appointmentItems]);
        const { status: sendStatus } = await todoRecord.send(todoRecipient);

        if (sendStatus.code !== 202) {
            console.log("Unable to send to target did:" + sendStatus);
            return;
        }
        else {
            console.log("Sent todo to recipient");
        }

    }



    return (
        <div></div>
    )
}

export default Appointment;