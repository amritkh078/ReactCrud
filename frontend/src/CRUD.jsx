import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const CRUD = () => {
    const [data, setData] = useState([])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState("")
    const [age, setAge] = useState("")
    const [isActive, setIsActive] = useState(0)

    const [editID, setEditID] = useState("")
    const [editName, setEditName] = useState("")
    const [editAge, setEditAge] = useState("")
    const [editIsActive, setEditIsActive] = useState(0)


    useEffect(() => {
        // setData(empdata)
        getData();
    }, [])

    const getData = () => {
        axios.get('https://localhost:7033/api/Employee')
        .then((result)=>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const handleEdit = (id) => {
        handleShow()
        axios.get(`https://localhost:7033/api/Employee/${id}`)
        .then((result)=>{
            setEditName(result.data.name);
            setEditAge(result.data.age);
            setEditIsActive(result.data.isActive);
            setEditID(id);
        })
        .catch((error)=>{
            console.log(error);
        })

    }
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this record?") == true) {
           axios.delete(`https://localhost:7033/api/Employee/${id}`)
           .then((result)=>{
                if(result.status == 200){
                    toast.success("Data Deleted Successfully");
                    getData();
                }
           })
           .catch((error)=>{
            toast.error(error);
        })
        }

    }
    const handleUpdate = () => {
        const url = `https://localhost:7033/api/Employee/${editID}`;
        const data ={
            "id": editID,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive

        }
        axios.put(url, data)
        .then((result)=>{
            handleClose();
            getData();
            clear();
            toast.success("Data Updated Successfully")
        }).catch((error)=>{
            toast.error(error);
        })

    }
    const handleSave = () => {
        const url = 'https://localhost:7033/api/Employee'
        const data = {
                "name": name,
                "age": age,
                "isActive": isActive
        }
        axios.post(url, data)
        .then((result)=>{
            getData();
            clear();
            toast.success("Data Entered Successfully")
        }).catch((error)=>{
            toast.error(error);
        })

    }

    const clear = () => {
        setName("");
        setAge("");
        setIsActive(0);
        setEditName("");
        setEditAge("");
        setEditIsActive(0);
        setEditID("");
    }
    const handleActive = (e) => {
        if(e.target.checked){
            setIsActive(1)
        }else{
            setIsActive(0)
        }
    }
    const handleEditActive = (e) => {
        if(e.target.checked){
            setEditIsActive(1)
        }else{
            setEditIsActive(0)
        }
    }


    return (
        <>
            <ToastContainer />
            <Container>
                <Row>
                    <Col> <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} /> </Col>
                    <Col> <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)}  /> </Col>
                    <Col> <input type="checkbox" checked={isActive === 1 ? true : false} onChange={(e)=> handleActive(e)} value={isActive} /> <label>IsActive</label> </Col>
                    <Col> <button className="btn btn-primary" onClick={()=>handleSave()}>Submit</button> </Col>
                </Row>
            </Container>
            <br></br>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>IsActive</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button className="btn btn-primary" onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                            <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            'Loading...'
                    }
                </tbody>
            </table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Row>
                    <Col> <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)} /> </Col>
                    <Col> <input type="text" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e) => setEditAge(e.target.value)}  /> </Col>
                    <Col> <input type="checkbox" checked={editIsActive === 1 ? true : false} onChange={(e)=> handleEditActive(e)} value={editIsActive} /> <label>IsActive</label> </Col>
                </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CRUD;