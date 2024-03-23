import { Form, Input, Select, Button, message } from "antd"
import { useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'

const CreateRoom = () => {
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const { user } = useUser()

    const info = useCallback((text) => {
        messageApi.info(text);
    }, [messageApi])

    const onCreateRoom = (values) => {
        console.log("values [createRoom]", values);
        info(`Salle "${values.roomName}" créé par ${user.username}`)
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
                name="numCards"
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
