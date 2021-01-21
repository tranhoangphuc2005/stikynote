import Add from "./Components/Add/Add";
import { useState, useEffect } from "react";
import axios from "axios";
import Note from "./Components/Note/Note";
import { v4 as uuidv4 } from "uuid";

let api = `http://localhost:5000/notes`;

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    callApi();
  }, []);

  const callApi = async () => {
    let res = await axios.get(api);
    const newData = res.data.map((v) => {
      return {
        ...v,
        open: false,
      };
    });
    setNotes(newData);
  };

  const deleteNote = async (id) => {
    let res = await axios.delete(`${api}/${id}`);
    if (res.status == 200) {
      const newNotes = notes.filter((note) => note.id !== id);
      setNotes(newNotes);
    }
  };

  const editNote = (note) => {
    const newNotes = notes.map((n) => {
      if (n.id === note.id) {
        n.open = !n.open;
        return n;
      }
      n.open = false;
      return n;
    });
    setNotes(newNotes);
  };

  const submitNote = async (note) => {
    delete note.open;
    let res = await axios.put(`${api}/${note.id}`, note);
    if (res.status === 200) {
      let newNotes = notes.map((n) => {
        if (n.id === note.id) {
          n.content = note.content;
          n.open = false;

          return n;
        }
        return n;
      });
      setNotes(newNotes);
    }
  };

  const addNote = async () => {
    const newNote = {
      id: uuidv4(),
      content: "",
      title: "",
    };
    let res = await axios.post(`${api}`, newNote);
    if (res.status === 201) {
      let newNotes = [...notes, newNote];
      setNotes(newNotes);
    }
  };

  return (
    <>
      <Add addNote={addNote} />
      <Note
        notes={notes}
        deleteNote={deleteNote}
        editNote={editNote}
        submitNote={submitNote}
      />
    </>
  );
}

export default App;
