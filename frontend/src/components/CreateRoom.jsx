import { Form, Input, Select, Button, message } from "antd"
import { useCallback, useEffect, useContext } from 'react'
import { useUser } from '@clerk/clerk-react'

import { SocketContext } from '../context/SocketContext';

const CreateRoom = () => {
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const { user } = useUser()
    const socket = useContext(SocketContext)

    const info = useCallback((text) => {
        messageApi.info(text);
    }, [messageApi])

    useEffect(() => {
        if (socket) {
            console.log("socket", socket)

            const handleCreatedRoom = (data) => {
                console.log("data created room", data)
                info(`Salle "${data.room_name}" créée par ${data.room_creator_name} avec un jeu de ${data.room_number_of_cards} cartes`);
            };

            socket.on("created room", handleCreatedRoom)

            return () => {
                socket.off("created room", handleCreatedRoom)
            }
        }
    }, [socket, info])

    const onCreateRoom = (values) => {
        console.log("values [createRoom]", values);

        socket.emit("create room", { roomName: values.roomName, roomCreator: user.username, roomNumCards: parseInt(values.roomNumCards) })
    }

    const onFinish = () => {
        form.validateFields().then(values => {
            form.resetFields();
            onCreateRoom(values);
        }).catch(info => {
            console.log('Validate Failed:', info);
        })
    }

    return (
        <Form
            layout="vertical"
            name="create_room"
            onFinish={onFinish}
            form={form}
        >
            {contextHolder}
            <Form.Item
                name="roomName"
                rules={[{ required: true, message: 'Veuillez saisir le nom de la salle!' }]}
            >
                <Input placeholder="Nom de la salle" />
            </Form.Item>
            <Form.Item
                name="roomNumCards"
                rules={[
                    { required: true, message: "Veuillez saisir le nombre de carte dans votre paquet!" },
                ]}
            >
                <Select placeholder="Choisir combien de cartes dans le paquet">
                    <Select.Option value="32">32</Select.Option>
                    <Select.Option value="52">52</Select.Option>
                </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">Créer</Button>
        </Form>
    )
}

export default CreateRoom
