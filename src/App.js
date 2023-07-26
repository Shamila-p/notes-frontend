import './App.css';
import React,{useEffect, useState} from 'react'
import Modal from '@mui/material/Modal';
import { Paper } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import axios from './constants/axios'
import { addNote, getNotes,editNote,deleteNote } from './constants/urls';
import Swal from "sweetalert2";


function App() {
  const [cards,setCards]=useState([])
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setEditOpenModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(null);


  function extractDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

 const handleEditOpenModal = (noteId) => {
  setSelectedNoteId(noteId)
  setEditOpenModal(true);
  };

  const handleEditCloseModal = () => {
    setEditOpenModal(false);
  };

  const handleAdd = () =>{
    const body={
      title,
      content
    }
    axios.post(addNote,body,{
      headers: { 'Content-Type': 'application/json' },
    }).then((response)=>{
      setOpenModal(false)
    })

  }

  const handleEdit = () =>{
    const body={
      title,
      content
    }
    console.log("id",selectedNoteId)

    const url = `${editNote}/${selectedNoteId}`
    console.log(url)
    axios.post(url,body,{
      headers: { 'Content-Type': 'application/json' },
    }).then((response)=>{
      console.log(response)
      setEditOpenModal(false);

    })

  }

  const handleDelete = (noteId) =>{
    console.log("id",noteId)
    let confirmationText = 
      "Are you sure you want to Delete this note?"
  
    Swal.fire({
      title: 'Confirmation',
      text: confirmationText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `${deleteNote}/${noteId}`;
        axios
          .post(url, {
            headers:  {'Content-Type': 'application/json' },
          })
          .then((response) => {
            console.log("completed") // Update the isBlocked state
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    });


  }


    useEffect(()=>{
      axios.get(getNotes,{
      headers: { 'Content-Type': 'application/json' },
      }).then((response)=>{
        console.log(response.data)
        setCards(response.data)
      })
    },[cards])
 
  return (
    <div className="App">
      <div className='navbar'>
        <h1 className='app-header'>Notes</h1>
      </div>
      <div className='note-button-container'>
        <button className='note-button' onClick={handleOpenModal}><b>Add Note</b></button>
      </div>
      <Modal open={openModal} onClose={handleCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '400px', height: '400px' }}>
          <Box sx={{ padding: '1rem', width: '100%' }}>
            <FormControl fullWidth style={{marginBottom:'35px'}}>
              <InputLabel id="trainer-label">Title</InputLabel>
              <Input type="text" id="title" label="title" value={title}  onChange={(e) => {setTitle(e.target.value)}} />
            </FormControl>
            <FormControl fullWidth>
              <TextareaAutosize
              minRows={3}
              placeholder='Write your notes here'
              id="notes"
              aria-label="notes"
              style={{ width: '100%' }}
              value={content} onChange={(e) => {setContent(e.target.value)}}
            />
            </FormControl>

            <Button  variant="contained" sx={{ margin: '12px 40%' }} onClick={()=>{handleAdd()}}>
              Add
            </Button>
          </Box>
        </Paper>
      </Modal>
      <div className='card-container'>
        {cards.map((card) => (
          <div key={card.id} className='card'>
            <h2 className='card-title'>{card.title}</h2>
            <p className='card-content'>{card.content}</p>
            <p className='card-date'>Created: {extractDate(card.created_at)}</p> 
            <div className='card-actions'>
              <span className='edit-icon' onClick={()=>{handleEditOpenModal(card.id)}}>✎</span>
              <Modal open={openEditModal} onClose={handleEditCloseModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '400px', height: '400px' }}>
                  <Box sx={{ padding: '1rem', width: '100%' }}>
                    <FormControl fullWidth style={{marginBottom:'35px'}}>
                      <InputLabel id="trainer-label">Title</InputLabel>
                      <Input type="text" id="title" label="title" value={title}  onChange={(e) => {setTitle(e.target.value)}} />
                    </FormControl>
                    <FormControl fullWidth>
                      <TextareaAutosize
                      minRows={3}
                      placeholder='Write your notes here'
                      id="notes"
                      aria-label="notes"
                      style={{ width: '100%' }}
                      value={content} onChange={(e) => {setContent(e.target.value)}}
                    />
                    </FormControl>

                    <Button  variant="contained" sx={{ margin: '12px 40%' }} onClick={()=>{handleEdit()}}>
                      Edit
                    </Button>
                  </Box>
                </Paper>
              </Modal>
              <span className='delete-icon' onClick={()=>{handleDelete(card.id)}}>❌</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
