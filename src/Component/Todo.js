import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Todo() {
  const url = "http://localhost:4200/todo";



  const [todoData, setTodoData] = useState([]);

  const [searchText, setSearch] = useState('')
  const [initialTodo, setInitialTodo] = useState({
    name: '',
    status: "Pending",
    createdAt: new Date().toDateString(),
    editCount: 0
  });

  const [editToggle, setEditToggle] = useState(false)

  const [editTodoData, setEditTodoData] = useState('')

  const [rowIndex, setRowIndex] = useState(null)

  const inputRef = useRef(null);

  const handleSubmit = () => {
    axios.post(url, initialTodo)
      .then(() => {
        toast.success(`${initialTodo.name}, is added Successfully`)
        inputRef.current.value = '';
        getTodoData();// post ke andar get ka function run kar diya ussi time ---> 
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTodoData = () => {
    axios.get(url)
      .then((res) => {
        console.log(res, '<-----')
        setTodoData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };




  const handleDelete = (itemId) => {
    axios.delete(`${url}/${itemId}`)
      .then(() => {
        toast.success(`${initialTodo.name}, is Delete successfully`)
        setTodoData(prevTodoData => { return prevTodoData.filter(item => item.id !== itemId) });
        // console.log('shivam <----')
      })
      .catch((err) => {
        console.log(err);
      });
  };



  const handleMarkAsDone = (e, item) => {
    const { checked } = e.target;
    const { id } = item
    axios.patch(`${url}/${id}`, { status: checked ? "Complete" : "Pending" }).then((res) => {
      getTodoData()
    }).catch((err) => {
      console.log(err);
    })
  }


  const handleEditTodoSubmit = (item) => {
    const { id, editCount } = item;
    axios.patch(`${url}/${id}`, {
      name: editTodoData,
      createdAt: new Date().toDateString(),
      editCount: editCount + 1
    }).then((res) => {
      setEditToggle(false);
      getTodoData()
      console.log(res)
    }).catch((err) => console.log(err))
  }


  useEffect(() => {
    getTodoData();
  }, []);


  const [inputchange, setInputchange] = useState('All')


  return (
    <>
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-5">
            <div className="input-group mb-3">
              <input
                className="form-control"
                type="text"
                placeholder="Enter todo..."
                onChange={(e) => setInitialTodo({ ...initialTodo, name: e.target.value })}
                ref={inputRef}
              />
              <button className="btn btn-dark" onClick={handleSubmit}>Add</button>
            </div>
          </div>
          <div className="col-md-7">
            <div className="input-group mb-3">
              <select
                onInput={(e) => setInputchange(e.target.value)}
                className="form-select me-2"
                aria-label="Default select example"
              >
                <option selected>All</option>
                <option>Pending</option>
                <option>Complete</option>
                <option>Edited</option>
              </select>
              <input
                type="search"
                className="form-control"
                placeholder="Search Todo..."
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table caption-top">
            <caption>List of todos</caption>
            <thead className="table-dark">
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Mark As Done</th>
                <th scope="col">Name</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {
                todoData && todoData.filter((item) =>
                  inputchange === 'All'
                  ||
                  item.status === inputchange ||
                  inputchange === 'Edited' && item.editCount > 0
                ).filter((item) => item?.name?.toLowerCase().includes(searchText)).map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row">{item.id}</th>
                    <td>

                      <input
                        type="checkbox"
                        defaultChecked={item.status === "Complete"} onChange={(e) => handleMarkAsDone(e, item)}
                      />
                    </td>
                    <td>{editToggle && rowIndex === index ? <input defaultValue={item.name} onChange={(e) => setEditTodoData(e.target.value)} /> : item.name}</td>
                    <td className={item.status === "Pending" ? 'text-warning' : "text-success"}>{item.status}</td>
                    <td>{item.createdAt}</td>
                    <td>{
                      editToggle && rowIndex === index ? <><button className="btn btn-sm btn-danger" onClick={() => setEditToggle(false)}>Cancel</button>
                        <button className="btn btn-sm btn-success ms-2" onClick={() => handleEditTodoSubmit(item)}>Save</button></>
                        :

                        <>
                          <button className="btn btn-sm btn-success" disabled={item.editCount === 2} onClick={() => { setEditToggle(true); setRowIndex(index) }}>Edit</button>
                          <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(item.id)}>Delete</button>
                        </>
                    }

                    </td>
                  </tr>
                ))}

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Todo;




