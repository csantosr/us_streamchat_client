import React, { useEffect, useState } from 'react';
import socketClient from 'socket.io-client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from "react-router-dom";
const SERVER = "http://127.0.0.1:8080";

const Home = ({socket, userId, setUserId}) => {
  const [allRooms, setAllRooms] = useState([])
  useEffect(() => {
    socket?.emit('allRooms');
    console.log('all rooms');
    socket?.on('allRooms', (rooms) => {
      setAllRooms(rooms);
    })
  }, [])
  return (
    <>
      <h1>Home</h1>
      <input onChange={(e) => setUserId(e.target.value)}/>
      <ul>
        {allRooms.map((room) => <li><Link to={`/room/${room.streamId}`}>{room.streamId}</Link></li>)}
      </ul>
    </>
  )
}

const Room = ({socket, userId}) => {
  const {id} = useParams();
  const [room, setRoom] = useState(null)

  useEffect(() => {
    socket?.emit('join', {
      streamId: id,
      userId,
    })
    socket?.on('roomInfo', (room) => {
      setRoom(room)
    })
  }, [])
  

  return (
    <>
      <h1>Room {id}</h1>
      {room}
    </>
  )
}

function App() {
  const [socket, setSocket] = useState(null);
  const [userId, setUserId] = useState('')
  useEffect(() => {
    let sck = socketClient(SERVER);
    sck.on('connection', () => {
      console.log(`I'm connected with the back-end :)`);
    });
    setSocket(sck);
  }, [])
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home socket={socket} userId={userId} setUserId={setUserId}/>} />
          <Route path="/room/:id" element={<Room socket={socket} userId={userId}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
