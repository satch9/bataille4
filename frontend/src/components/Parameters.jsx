import { useEffect, useState } from 'react'
import { Card } from 'antd'
import RoomList from './RoomList';
import CreateRoom from './CreateRoom';
import ScoreBoard from './ScoreBoard';

const tabListNoTitle = [
    {
        key: 'jeuxDispo',
        label: 'Jeux disponibles',
    },
    {
        key: 'creerJeux',
        label: 'Créer',
    },
    {
        key: 'tableauScore',
        label: 'Tableau des scores',
    },
];

export default function Parameters() {
    const [activeTabKey, setActiveTabKey] = useState('jeuxDispo')
    const [roomList, setRoomList] = useState([])
    const players = [
        {
            name: "Joueur 1",
            score: 10
        }, {
            name: "Joueur 2",
            score: 5
        }
    ]

    useEffect(() => {
        setRoomList([])
    }, [])

    const onTab2Change = (key) => {
        setActiveTabKey(key)
    }

    const contentListNoTitle = {
        jeuxDispo: <RoomList rooms={roomList} />,
        creerJeux: <CreateRoom />,
        tableauScore: <ScoreBoard players={players} />,
    }

    return (
        <>
            <Card
                style={{ width: '100%', marginTop: '20px' }}
                tabList={tabListNoTitle}
                activeTabKey={activeTabKey}
                onTabChange={onTab2Change}
                tabProps={{
                    size: 'middle',
                }}
            >
                {contentListNoTitle[activeTabKey]}
            </Card>

        </>
    )
}