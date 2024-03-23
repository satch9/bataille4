import { useContext, useEffect } from 'react'
import { Card, Typography, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

import { SocketContext } from '../context/SocketContext';

const { Title, Paragraph } = Typography;

let content = "Le jeu de cartes la Bataille est un jeu simple où deux joueurs s affrontent. Chaque joueur reçoit la moitié du paquet de cartes. Les cartes sont retournées une par une, et le joueur qui a la carte la plus forte gagne la manche. Si les cartes sont de valeurs égales, cela signifie qu il y a bataille, et les joueurs doivent alorsposer trois cartes face cachée et en retourner une quatrième. Celui qui a la carte la plus forte gagne la manche. Le gagnant est celui qui remporte toutes les cartes de son adversaire."


export default function IndexPage() {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const socket = useContext(SocketContext)

  console.log("isSignedIn ", isSignedIn)

  useEffect(() => {
    if (socket !== undefined) {
      console.log("socket", socket.id)
    }
  }, [socket])

  return (
    <div className="home-container">
      <Card className="home-card">
        <Typography>
          <Title>Bienvenue sur le jeu de cartes la Bataille !</Title>
          <Paragraph style={{ "textAlign": "justify" }}>
            {content}
          </Paragraph>
        </Typography>
        {
          isSignedIn && <Button type="primary" onClick={() => navigate("/params")}>Entrer</Button>
        }
      </Card>
    </div>
  )
}