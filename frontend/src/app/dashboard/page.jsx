"use client";

import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Checkbox, Label, Modal, ModalBody, ModalHeader, TextInput, Radio } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { MdLogout, MdAdd, MdEdit, MdDelete } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';

export default function Dashboard() {
    const router = useRouter();
    const [q, setQ] = useState(null);
    const [data, setData] = useState([]);
    const [currentItem, setItem] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    function logout() {
      localStorage.removeItem("logged_in");
    }

    function onCloseModal() {
        setOpenModal(false);
        setItem(null);
    }

    useEffect(() => {
        if(!localStorage.getItem("logged_in")) {
          router.push("/login");
        }
        loadData(q).then(res => {
            setData(res);
        });
    }, [q]); // re-fetch only if q changes

    function addCriminal() {
        onCloseModal();
        let name = document.getElementById("name").value;
        let sex = document.querySelector("[name='gender']:checked").value;
        let national_id = document.getElementById("national_id").value;
        let id = currentItem ? currentItem.c_id : uuidv4();

        fetch(`http://127.0.0.1:5000/addRecord`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: { c_id: id, name, sex, national_id }, create: !currentItem })
        })
        .then(res => {
          if(res.ok) {
            loadData(q).then(res => {
                setData(res);
            });
          }
        })
        .catch(e => {
            console.error(e);
            return [];
        });
    }

    function deleteCriminal(item) {
      if(!confirm("Are you sure you want to delete this record?")) return;
      fetch(`http://127.0.0.1:5000/deleteRecord?c_id=${item.c_id}`, {
            method: 'DELETE'
        })
        .then(res => {
          if(res.ok) {
            loadData(q).then(res => {
                setData(res);
            });
          }
        })
        .catch(e => {
            console.error(e);
            return [];
        });
    }

    function getTable(data) {
        return data.map((item, index) => (
            <TableRow key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {item.c_id || 'N/A'}
                </TableCell>
                <TableCell>{item.name || 'N/A'}</TableCell>
                <TableCell>{item.sex || 'N/A'}</TableCell>
                <TableCell>{item.national_id || 'N/A'}</TableCell>
                <TableCell className="flex justify-center items-center gap-3 text-xl">
                    <a onClick={() => { setItem(item); setOpenModal(true); }} className="font-medium text-slate-100">
                        <MdEdit/>
                    </a>
                    <a onClick={() => { deleteCriminal(item); }} className="font-medium text-red-500">
                        <MdDelete/>
                    </a>
                </TableCell>
            </TableRow>
        ));
    }

    function loadData(query = null) {
        return fetch(`http://127.0.0.1:5000/getRecords?query=${String(query)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(res => res['data'])
        .catch(e => {
            console.error(e);
            return [];
        });
    }
  return (
    <div className="overflow-x-auto p-10">
        
    <div className="flex w-full gap-5">
        <div  className=" mx-auto mb-10 flex-1">   
            <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input onChange={(e) => {setQ(e.target.value)}} type="search" id="search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Criminal by ID" required />
                <button onClick={() => {setQ(document.getElementById("search").value)}}  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            </div>
        </div>
        <Button onClick={() => {setOpenModal(true)}} color="green" className="h-full py-4 px-8">
            <MdAdd/>
            Add Record
        </Button>
        <Button onClick={() => { if(confirm("Are you sure you want to logout?")){logout(); router.push("/login");} }} color="red" className="h-full py-4 px-8">
            <MdLogout/>
            Logout
        </Button>
    </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Criminal Id</TableHeadCell>
            <TableHeadCell>Criminal Name</TableHeadCell>
            <TableHeadCell>Gender</TableHeadCell>
             <TableHeadCell>National Id</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          { getTable(data) }
        </TableBody>
      </Table>
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader />
        <ModalBody>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{currentItem ? "Edit" : "Add"} Criminal Record</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">Criminal Name</Label>
              </div>
              <TextInput
                id="name"
                placeholder="John Doe"
                defaultValue={currentItem ? currentItem.name : ""}
                // onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="gender">Gender</Label>
              </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                        <Radio id="male" name="gender" value="Male" defaultChecked={currentItem ? currentItem.sex === "Male" : true} />
                        <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Radio id="female" name="gender" value="Female" defaultChecked={currentItem ? currentItem.sex === "Female" : false} />
                        <Label htmlFor="female">Female</Label>
                    </div>
                </div>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="national_id">National Id</Label>
              </div>
                <TextInput id="national_id" placeholder="Country code" defaultValue={currentItem ? currentItem.national_id : ""}></TextInput>
            </div>
            <div className="w-full flex justify-center">
              <Button onClick={addCriminal} color="blue" className="h-full py-4 px-8">{currentItem ? "Edit" : "Add"} record</Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
