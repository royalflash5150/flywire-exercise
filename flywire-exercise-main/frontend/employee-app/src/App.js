import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Description, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { HTTP_REQUEST_BASIC_URL } from './const';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', directReports: '', dateHired: '', isActive: true });
  const [deactivateId, setDeactivateId] = useState('');
  const [ret, setRet] = useState({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchActiveEmployees();
    reset();
  }, []);

  const reset = () => {
    setEmployees([]);
    setEmployeeId('');
    setStartDate('');
    setEndDate('');
    setNewEmployee({ name: '', position: '', dateHired: '', isActive: true });
    setDeactivateId('');
  }
  const fetchActiveEmployees = async () => {
    const response = await axios.get(HTTP_REQUEST_BASIC_URL + 'employee/list/active');
    setEmployees(response.data);
  };

  const fetchEmployeeById = async () => {
    if (!employeeId) {
      alert("Input employee id.");
      return;
    }
    const response = await axios.get(HTTP_REQUEST_BASIC_URL + `employee/list/${employeeId}`);
    setMsg("Operation Success");
    setRet(response.data);
    setIsOpen(true);
  };

  const fetchEmployeesHiredWithinRange = async () => {
    if (!startDate || !endDate) {
      alert("Please Input start date and end date correctly.");
      return;
    }
    if (startDate > endDate) {
      alert("Start Date should be before than end date.");
      return;
    }
    const response = await axios.get(HTTP_REQUEST_BASIC_URL + `employee/list/hired?startDate=${startDate}&endDate=${endDate}`);
    setEmployees(response.data);
  };

  const addNewEmployee = async () => {
    if (!validate()) {
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const employeeToAdd = {
      ...newEmployee,
      active: true,
      hireDate: today
    };
    try {
      const response = await axios.post(HTTP_REQUEST_BASIC_URL + 'employee/create', employeeToAdd);
      setMsg("Operation Success");
      setRet(response.data);
      setIsOpen(true);
      fetchActiveEmployees();
    } catch (error) {
      console.error('Failed to add new employee:', error);
      setMsg("Operation Failed");
      setIsOpen(true);
    }
  };
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  const validate = () => {
    let flag = true;
    if (!newEmployee?.name) {
      alert("Input name.");
      return false;
    }
    if (newEmployee.name.split(" ").length < 2) {
      alert("Input First Name and Last Name correctly.");
      return false;
    }
    if (!newEmployee?.position) {
      alert("Input position.");
      return false;
    }
    newEmployee?.directReports?.map((item) => {
      if (!isNumber(item)) {
        flag = false;
      }
    })
    if (!flag) {
      alert("Input Direct Reports Numbers correctly.(Ex: 1, 3, 2)");
      return false;
    }
    if (!newEmployee?.id) {
      alert("Input id.");
      return false;
    }
    if (!isNumber(newEmployee?.id)) {
      alert("Input correct number for Id.");
      return false;
    }
    return true;
  }

  const deactivateEmployee = async () => {
    if (!deactivateId) {
      alert("Input employee id to deactivate.");
      return;
    }
    try{
      const response = await axios.put(HTTP_REQUEST_BASIC_URL + `employee/deactivate/${deactivateId}`);
      setMsg("Employee Deactivated.");
      setRet(response.data);
    } catch(err) {
      setMsg("Operation Fail, No employee id.");
      setRet(null);
    }
    setIsOpen(true);
    fetchActiveEmployees();
  
  };

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }
  return (
    <div className="App">
      <div className="bg-gradient-to-b from-fuchsia-600 to-fuchsia-900 text-gray-300 p-5 h-full min-h-lvh">
        <div className="grid grid-cols-1 xl:grid-cols-2 mx-4 mt-2 p-4">
          <div className="rounded-xl bg-gray-800 bg-opacity-30 py-8">
            <div className="text-gray-100 text-4xl pb-4"><b>Active Employees</b></div>
            <div className="mx-8">
              <div className="my-4 border-b-2  border-gray-400 border-opacity-50 ..." />
              {
                (employees && employees.length) ? employees.map((employee, idx) => (
                  <div key={idx}>
                    <p key={employee.id}>{employee.name}</p>
                    <div className="my-4 border-b-2  border-gray-400 border-opacity-50 ..." />
                  </div>
                )) :
                  <div className='mt-16'><span className='text-gray-100 text-xl'>No Employees to display</span></div>
              }
            </div>
          </div>
          <div className='grid grid-cols-1 text-white mx-4 my-8'>
            <div className='grid grid-cols-2 md:grid-cols-3 py-4'>
              <div className='py-2'>
                <label className='mr-4'>From: </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined"
                  className="rounded-md bg-gray-800 bg-opacity-30 w-auto p-3"
                />
              </div>
              <div className='py-2'>
                <label className='mr-4'>To: </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined"
                  className="rounded-md bg-gray-800 bg-opacity-30 w-auto p-3"
                />
              </div>
              <button variant="contained" className="rounded-md h-12 hover:bg-rose-700 focus:bg-rose-600 bg-rose-500 w-auto p-3 my-2 xs:ml-8" onClick={fetchEmployeesHiredWithinRange}>
                Search
              </button>
            </div>
            <div className="grid grid-cols-3 py-4">
              <div className="text-white col-span-2 mx-4">
                <input label="Employee Id"
                  value={employeeId} placeholder="Employee Id"
                  onChange={(e) => setEmployeeId(e.target.value)}
                  variant="outlined" className="rounded-md w-full bg-white bg-opacity-30 w-auto p-3" />
              </div>
              <button variant="contained" className="rounded-md h-12 hover:bg-rose-700 focus:bg-rose-600 bg-rose-500 w-auto p-3" onClick={fetchEmployeeById}>
                Get
              </button>
            </div>
            <div className='grid grid-cols-3 py-4'>
              <div className="mx-4 col-span-2">
                <input label="Employee Id to deactivate"
                  value={deactivateId} placeholder='Employee Id to deactivate'
                  onChange={(e) => setDeactivateId(e.target.value)}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <button variant="contained" className="rounded-md h-12 hover:bg-rose-700 focus:bg-rose-600 bg-rose-500 w-auto p-3" onClick={deactivateEmployee}>
                Deactivate
              </button>
            </div>
            <div className="grid grid-cols-2 border-t-2 py-4 border-gray-400">
              <div className="mx-4 py-4">
                <input label="Name"
                  value={newEmployee.name} placeholder='Name (FirstName LastName)'
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <div className="mx-4 py-4">
                <input label="Position"
                  value={newEmployee.position} placeholder='Position'
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <div className="mx-4 py-4">
                <input label="Direct Reports"
                  value={newEmployee.directReports} placeholder='Direct Reports (Ex: 1,2,3)'
                  onChange={(e) => setNewEmployee({ ...newEmployee, directReports: e.target.value.split(',') })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <div className="mx-4 py-4">
                <input label="Id"
                  value={newEmployee.id} placeholder='Id'
                  onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
            </div>
            <div className='grid grid-cols-3'>
              <button variant="contained" className="rounded-md h-12 col-start-2 col-span-1 hover:bg-rose-700 focus:bg-rose-600 bg-rose-500 w-auto p-3" onClick={addNewEmployee}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <>
        <Transition appear show={isOpen}>
          <Dialog as="div" className="relative z-10 focus:outline-none" onClose={close}>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <TransitionChild
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 transform-[scale(95%)]"
                  enterTo="opacity-100 transform-[scale(100%)]"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 transform-[scale(100%)]"
                  leaveTo="opacity-0 transform-[scale(95%)]"
                >
                  <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-4 backdrop-blur-2xl">
                    <DialogTitle as="h3" className="text-2xl font-medium text-white border-b-2 pb-4 border-gray-200">
                      {msg}
                    </DialogTitle>
                    <p className="mt-2 text-sm/6 text-white/50">
                      <div className='px-4 border-b-2 pb-4 border-gray-2 px-4'>
                        {
                          ret ? <>
                            <Description className="text-xl">Employee data</Description>
                            <p>Id: {ret.id}</p>
                            <p>Name: {ret.name}</p>
                            <p>Position: {ret.position}</p>
                            <p>Status: {ret.active ? "Active" : "InActive"}</p>
                            <p>directReports: {ret.directReports?.map((item, index) => (
                              <span>{item} {index === ret.directReports.length - 1 ? "" : ", "}</span>
                            ))}</p>

                          </>
                            : " No display data"}
                      </div>
                    </p>
                    <div className="mt-4">
                      <Button
                        className="inline-flex float-right items-center gap-2 rounded-md bg-blue-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                        onClick={close}
                      >
                        Got it, thanks!
                      </Button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </div >
  );
}

export default App;
