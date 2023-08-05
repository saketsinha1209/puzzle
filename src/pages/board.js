import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/Components/header";
import { Button, FormControl,FormControlLabel,FormLabel,RadioGroup,Radio } from "@mui/material";
import PuzzleSlicer from "@/Components/PuzzleSlicer";
const Board = () => {
  const router = useRouter();
  const { query } = router;
  const imageUrl = query.imageUrl || null;
  const [selectedImage, setSelectedImage] = useState(null);
  const [startClicked, setStartClicked] = useState(false);
  const [difficulty, setDifficulty] = useState(imageUrl ? 'Very easy' : null);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [reset, setReset] = useState(false);
  const [highestScore, setHighestScore]=useState(null);
  const [username, setusername]=useState(null);
  useEffect(() => {
    if (imageUrl) {

      setSelectedImage(imageUrl);
      localStorage.setItem("selectedImage", imageUrl);
    }
  }, [imageUrl]);
useEffect(() => {
  setusername(localStorage.getItem("username"));
},[username]);
  const [boardColor, setBoardColor] = useState("gray");

  const handleColorChange = (event) => {
    setBoardColor(event.target.value);
  };

  const [timer, setTimer] = useState(0);
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    let formattedTime= `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
    useEffect(()=>{
      localStorage.setItem('time',formattedTime);
    }) 
    return formattedTime;
  };

  const padNumber = (number) => {
    return String(number).padStart(2, "0");
  };
  const getHighestScore = async (username) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/scores/highest?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        setHighestScore(data.highestScore);
      } else {
        console.log("Failed to getHighestScore");
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    getHighestScore(username);
  }, [username]);

  const fetchPreviousScores = async (username) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/scores/previous?username=${username}`);
      if (response.ok) {
        const data = await response.json();
        return data.scores;
      } else {
        console.log("Failed to fetch previous score");
        alert("Failed to fetch previous score");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  
  const [previousScores, setPreviousScores] = useState([]);
  
  useEffect(() => {
    fetchPreviousScores(username)
      .then((scores) => setPreviousScores(scores))
      .catch((error) => console.error(error));
  }, [username]);
  
  const handleStartTimer = () => {
    setActive(true);
    setStartClicked(true);
  };
  
  const handleStopTimer = () => {
    setActive(false);
  };

  const handleResetTimer = () => {
    setActive(true);
    setReset(true);
    setTimer(0);
  };
  const handleDifficulty = (e)=>{
   const diffi =e.target.value;
    switch(diffi)
    {
      case 'Very easy':
        setRows(3);
        setColumns(3);
        break;
      case 'Easy':
        setRows(4);
        setColumns(4);
        break;
      case 'Medium':
        setRows(6);
        setColumns(6);
        break;
        default:
          setRows(3);
          setColumns(3);
    }
    setDifficulty(diffi)
  };
  return (
    <>
      <Header />
      <div className="board">
        <div className="puzzle-board" style={{ backgroundColor: boardColor, minHeight: "600px" }}>
      
        {startClicked && <PuzzleSlicer imageUrl={imageUrl} rows={rows} 
        columns={columns}
         setActive={setActive}
         setReset={setReset}
         reset={reset}
         />}
        </div>
        <div className="features">
          <div className="features1">
          <div className="colorpicker">
            <label id="boardpicker" style={{ color: "white" }}>
              Board Color:
            </label>
            <input
              type="color"
              onChange={handleColorChange}
            />
          </div>
          <div style={{ color: "white" }} className="time">
            Elapsed Time: {formatTime(timer)}
          </div></div>
          <div className="features1">
      <div className="
      difficulty-form">
      <FormControl>
  <FormLabel id="demo-radio-buttons-group-label">Difficulty</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="Very easy"
    name="radio-buttons-group"
  >
    <FormControlLabel value="Very easy" control={<Radio />} onChange={handleDifficulty} label=" Easy" />
    <FormControlLabel value="Easy" control={<Radio />}onChange={handleDifficulty} label="Medium" />
    <FormControlLabel value="Medium" control={<Radio />} onChange={handleDifficulty} label="Hard" />
  
  </RadioGroup>
</FormControl>
        </div>
        <div className="scoreboard">
  <h2>Highest Score: {highestScore}</h2>
  <h2>Previous Scores:</h2>
  <ul>
    {previousScores.map((score) => (
      <li key={score._id}>
        Username: {score.username}, Score: {score.scores}
      </li>
    ))}
  </ul>
</div>

<div className="startStop">
  <Button
    variant="outlined"
    sx={{
      bgcolor: '#006400',
      color: '#fff',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.3) inset',
    
    }}
    onClick={handleStartTimer}
  >
    Start
  </Button>
  <Button
    variant="outlined"
    sx={{
      bgcolor: '#FF6F61',
      color: '#fff',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.3) inset',
    
    
    }}
    onClick={handleStopTimer}
  >
    Stop
  </Button>
  <Button
    variant="outlined"
    sx={{
      bgcolor: ' #66CCFF',
      color: '#000',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.3) inset',
  
    }}
    onClick={handleResetTimer}
  >
    Reset
  </Button>
</div>

               
        </div>
      </div>
      </div>
    </>
  );
};
export default Board;
