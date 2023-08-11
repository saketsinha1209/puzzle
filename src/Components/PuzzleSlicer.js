import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@mui/material";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import Items from "@/Components/items";
import Grid from "@/Components/grid";
import SortableItem from "@/Components/SortableItem";
import {useDispatch} from 'react-redux';
import { updateCurrency } from "@/redux/create";
const PuzzleSlicer = ({ imageUrl, rows, columns,setActive,setReset,reset }) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isCompleted,setIsCompleted] = useState(false);
  const [username, setUsername] =useState("Guest"); 
  const [time, setTime] = useState("00:00:00");
  const [Scores, setScores]= useState(null);
  const [dialog,setDialog] = useState(true);
  const [playSound, setPlaySound] = useState(false);
  const [highestScore, setHighestScore] = useState(null);
  useEffect(() => {
    if (isCompleted ) {
      const audio = new Audio("puzzlesound.mp3");
      audio.play();
      setPlaySound(true);
    }
  }, [isCompleted, playSound]);
  
 useEffect(() => {
  const name=localStorage.getItem("username");
  const ti=localStorage.getItem("time");
  setUsername(name);
  setTime(ti);
 })
 useEffect(() => {
  if (reset) {
    const shuffledPieces = shuffleArray(items);
    setItems(shuffledPieces);
    setReset(false);
    setDialog(false);
  }
}, [reset]);
 useEffect(() => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  if(rows==3)
  setScores(1000-totalSeconds);
  else if(rows==4)
  setScores(2000-totalSeconds);
  else if(rows==6)
  setScores(3000-totalSeconds);
  },[time,rows])
 const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
 const SaveScore = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/scores`, {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ username, Scores }),
    });

    const data = await response.json();
    console.log(data);
    alert("Score Saved Successfully");
  } catch (error) {
    console.error(error);
    console.log("Couldnt save the score");
  }
};
const dispatch = useDispatch();
const handleCurrencyUpdate = (amount) => {
  dispatch(updateCurrency(amount));
};
useEffect(() => {
  if (isCompleted === true) {
    let currencyAmount = 0;

    if (rows === 3) {
      currencyAmount = 100;
    } else if (rows === 4) {
      currencyAmount = 200;
    } else {
      currencyAmount = 500;
    }

    if (currencyAmount > 0) {
      handleCurrencyUpdate(currencyAmount);
      localStorage.setItem('coins', currencyAmount);
    }
  }  const storedCoins = localStorage.getItem('coins');
  if (storedCoins !== null) {
    handleCurrencyUpdate(parseInt(storedCoins));
  }
}, [isCompleted]);
const getHighestScore = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/scores/highest?username=${username}`);
    if (response.ok) {
      const data = await response.json();
      setHighestScore(data.highestScore);
      console.log(data.highestScore);
    } else {
     console.log("Failed to getHighestScore");
    }
  } catch (error) {
    console.log("failed to set request");
  }
};

useEffect(() => {
  getHighestScore(username);
},[]);



  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);
  const handleDragEnd = useCallback((event) => {
  const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        const isCompleted = newOrder.every((item, index) => item.id === correctOrder[index].id);
       setIsCompleted(isCompleted);
       if(isCompleted )
       {
        setReset(false);
        setActive(false);
        setDialog(true);
       }
        return newOrder;
      });
    }
  
    setActiveId(null);
  }, []);

const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);
  useEffect(() => {
    const image = new Image();
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = imageUrl;
    image.onload = () => {
      const pieceSize = Math.min(
        Math.floor(image.width / columns),
        Math.floor(image.height / rows)
      );
      const pieces = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
          const canvas = document.createElement("canvas");
          canvas.width = pieceSize;
          canvas.height = pieceSize;
          const context = canvas.getContext("2d");

          context.drawImage(
            image,
            col * pieceSize,
            row * pieceSize,
            pieceSize,
            pieceSize,
            0,
            0,
            pieceSize,
            pieceSize
          );

          const puzzlePieceDataUrl = canvas.toDataURL();
          pieces.push({ id: `${row}-${col}`, imageUrl: puzzlePieceDataUrl });
        }
      }

      const shuffledPieces = shuffleArray(pieces);
      setItems(shuffledPieces);
    };
  }, [imageUrl, rows, columns]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  const correctOrder = Array.from({ length: rows * columns }, (_, index) => ({
    id: `${Math.floor(index / columns)}-${index % columns}`,
  }))

   return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <Grid columns={columns}>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              imageUrl={item.imageUrl}
              rows={rows}
              columns={columns}
            />
          ))}
        </Grid>
      </SortableContext>
      <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
        {activeId ? (
          <Items
            id={activeId}
            isDragging={true}
            imageUrl={items.find((item) => item.id === activeId)?.imageUrl}
          />
        ) : null}
      </DragOverlay>
      {isCompleted && dialog &&(
      <div className="dialogBox">
      <h1>PUZZLE COMPLETED</h1>
      <h2>Congratulations, {username}!</h2> 
      <h2>Elapsed Time: {time}</h2>
      <h2>Your Score: <span className="score">{Scores}</span></h2>
      <h2>Highest Score: <span className="score">{highestScore}</span></h2>
      <Button
        type="contained"
        onClick={SaveScore}
        className="saveScoreButton"
      >
        Save the Score
      </Button>
      <h4 className="resetInstructions">
        Click the "Reset" button to play again.
      </h4>
    </div>
    
      )}
    </DndContext>
  );
};

export default PuzzleSlicer;
