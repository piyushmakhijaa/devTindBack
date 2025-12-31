import { useState } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [logs,setLogs] = useState([]);
const handleLogs = async()=>{
   
 const data =  await axios.get("http://localhost:3000/feed");
console.log(data.data);
 setLogs(data.data);

}


  return (
   <>
   {logs.map((l,idx)=>{
    return(<div key={idx}>  <img src={l.photoUrl}></img>  {l.firstName} </div>)
   })}
     <button onClick={handleLogs} >CLICK</button>
   </>
  )
}

export default App
