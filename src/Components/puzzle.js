import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Button from '@mui/material/Button';

export default function Puzzle() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      title: "Animals",
      categoryId: 1,
    },
    {
      id: 2,
      title: "Nature",
      categoryId: 2,
    },
    {
      id: 3,
      title: "Cartoons",
      categoryId: 3,
    },
    {
      id: 4,
      title: "My Puzzle",
      categoryId: 4,
    },
  ]);

  // Default puzzles
  const [defaultPuzzles, setDefaultPuzzles] = useState([
    { id: 1, title: "Lion", imageUrl: "/Lion.jpg", categoryId: categories[0].id },
    { id: 2, title: "Elephant", imageUrl: "/elephant.jpg", categoryId: categories[0].id },
    { id: 3, title: "Tiger", imageUrl: "/tiger.jpg", categoryId: categories[0].id },
    { id: 4, title: "Cheetah", imageUrl: "/cheetah.jpeg", categoryId: categories[0].id },
    { id: 5, title: "Snake", imageUrl: "/snake.jpeg", categoryId: categories[0].id },
    { id: 6, title: "Dawn", imageUrl: "/nature1.jpeg", categoryId: categories[1].id },
    { id: 7, title: "Forest", imageUrl: "/nature2.jpeg", categoryId: categories[1].id },
    { id: 8, title: "Gardens", imageUrl: "/nature3.jpeg", categoryId: categories[1].id },
    { id: 9, title: "Desert", imageUrl: "/desert.jpg", categoryId: categories[1].id },
    { id: 10, title: "Waterfall", imageUrl: "/watterfall.jpeg", categoryId: categories[1].id },
    { id: 11, title: "Tom and Jerry", imageUrl: "/tom.jpeg", categoryId: categories[2].id },
    { id: 12, title: "BEN 10", imageUrl: "/ben10.jpeg", categoryId: categories[2].id },
    { id: 13, title: "Chotta Bheem", imageUrl: "/cb.jpeg", categoryId: categories[2].id },
    { id: 14, title: "Micky Mouse", imageUrl: "/mm.jpeg", categoryId: categories[2].id },
    { id: 15, title: "Oggy", imageUrl: "/oggy.jpeg", categoryId: categories[2].id },
  ]);

  // User-added puzzles
  const [userPuzzles, setUserPuzzles] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPuzzleTitle, setNewPuzzleTitle] = useState("");
  const [newPuzzleImage, setNewPuzzleImage] = useState(null);
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    const storedUserPuzzles = JSON.parse(localStorage.getItem("userPuzzles")) || [];
  setUserPuzzles(storedUserPuzzles);
  }, []);
  const handleToggleForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handleAddPuzzle = async (e) => {
    e.preventDefault();

    if (!newPuzzleTitle || !newPuzzleImage) {
      alert("Please enter a title and upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", newPuzzleImage);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/upload`,
        formData
      );
      
      if (response && response.data) {
        const { public_id, secure_url } = response.data;
        const newPuzzle = {
          id: public_id,
          title: newPuzzleTitle,
          imageUrl: secure_url,
          categoryId: 4,
        };

         // Update the userPuzzles in localStorage
        const updatedUserPuzzles = [...userPuzzles, newPuzzle];
       localStorage.setItem("userPuzzles", JSON.stringify(updatedUserPuzzles));
       setUserPuzzles(updatedUserPuzzles);
        setShowAddForm(false);
        setNewPuzzleTitle('');
        setNewPuzzleImage(null);
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (error) {
      console.log("Error uploading image:", error);
      alert("Image upload failed. Please try again.");
    }
  };
  const handleCancel = () => {
    setShowAddForm(false);
    setNewPuzzleTitle("");
    setNewPuzzleImage(null);
  };

  const handlePuzzleClick = (imageUrl) => {
    router.push(`/board?imageUrl=${encodeURIComponent(imageUrl)}`);
  };

  return (
    <div className="puzzle">
      {categories.map((category) => (
        <div className="category" key={category.id}>
          <h2>{category.title}</h2>
          <div className="puzzle-cards">
            {defaultPuzzles
              .filter((puzzle) => puzzle.categoryId === category.id)
              .map((puzzle) => (
                <div
                  className="puzzle-card"
                  key={puzzle.id}
                  onClick={() => handlePuzzleClick(puzzle.imageUrl)}
                >
                  <h3>{puzzle.title}</h3>
                  <img src={puzzle.imageUrl} alt={puzzle.title} crossOrigin="anonymous" />
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="category">
        <div className="puzzle-cards">
          {userPuzzles.map((puzzle) => (
            <div
              className="puzzle-card"
              key={puzzle.id}
              onClick={() => handlePuzzleClick(puzzle.imageUrl)}
            >
              <h3>{puzzle.title}</h3>
              <img src={puzzle.imageUrl} alt={puzzle.title} crossOrigin="anonymous" />
            </div>
          ))}
        </div>
      </div>

      {/* Add puzzle form */}
      {showAddForm ? (
        <div className="add-puzzle-form">
          <h3 id="form-title">Add Puzzle</h3>
          <form onSubmit={handleAddPuzzle}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={newPuzzleTitle}
                onChange={(e) => setNewPuzzleTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageFile">Upload Image:</label>
              <input
                id="imageFile"
                type="file"
                accept=".jpg, .jpeg, .png"
                name="image"
                onChange={(e) => setNewPuzzleImage(e.target.files[0])}
              />
            </div>
            <div>
              <button type="submit" className="addbtn">
                Add
              </button>
              <button type="button" className="addbtn2" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
       <button type="submit" className="add-puzzle-button" onClick={handleToggleForm}>Add Puzzle</button>
      )}
    </div>
  );
}
