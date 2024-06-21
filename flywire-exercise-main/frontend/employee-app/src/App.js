import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

function App() {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newEmployee, setNewEmployee] = useState({ name: '', position: '', dateHired: '', isActive: true });
  const [deactivateId, setDeactivateId] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchActiveEmployees();
  }, []);

  const fetchActiveEmployees = async () => {
    const response = await axios.get('http://localhost:8080/employee/list/active');
    setEmployees(response.data);
  };
  const fetchEmployeeById = async () => {
    const response = await axios.get(`http://localhost:8080/employee/list/${employeeId}`);
    alert(JSON.stringify(response.data));
  };

  const fetchEmployeesHiredWithinRange = async () => {
    const response = await axios.get(`http://localhost:8080/employee/list/hired?startDate=${startDate}&endDate=${endDate}`);
    setEmployees(response.data);
  };

  const addNewEmployee = async () => {
    const today = new Date().toISOString().split('T')[0];
    const employeeToAdd = {
      ...newEmployee,
      active: true,
      hireDate: today
    };
    try {
      const response = await axios.post('http://localhost:8080/employee/create', employeeToAdd);
      alert(`Added: ${JSON.stringify(response.data)}`);
      fetchActiveEmployees();
    } catch (error) {
      console.error('Failed to add new employee:', error);
      alert('Failed to add new employee');
    }
  };

  const deactivateEmployee = async () => {
    const response = await axios.put(`http://localhost:8080/employee/deactivate/${deactivateId}`);
    alert(`Deactivated: ${JSON.stringify(response.data)}`);
    fetchActiveEmployees();
  };
  return (
    <div className="App">
      <div className="bg-gradient-to-b from-fuchsia-600 to-fuchsia-900 text-gray-300 p-5 h-screen">
        <div className="grid grid-cols-2 mx-4 mt-2 p-4">
          <div className="rounded-xl bg-gray-800 bg-opacity-30 py-8">
            <div className="text-gray-100 text-4xl pb-4"><b>Active Employees</b></div>
            <div className="mx-8">
              <div className="my-4 border-b-2  border-gray-400 border-opacity-50 ..." />
              {employees.map((employee) => (
                <>
                  <p key={employee.id}>{employee.name}</p>
                  <div className="my-4 border-b-2  border-gray-400 border-opacity-50 ..." />
                </>
              ))}
            </div>
          </div>
          <div className='grid grid-cols-1 text-white ml-4 my-4'>
            <div className='grid grid-cols-3'>
              <div>
                <label className='mr-4'>From: </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  variant="outlined"
                  className="rounded-md bg-gray-800 bg-opacity-30 w-auto p-3"
                />
              </div>
              <div>
                <label className='mr-4'>To: </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  variant="outlined"
                  className="rounded-md bg-gray-800 bg-opacity-30 w-auto p-3"
                />
              </div>
              <button variant="contained" className="rounded-md h-12 hover:bg-rose-700 focus:bg-rose-600 bg-rose-500 w-auto p-3" onClick={fetchEmployeesHiredWithinRange}>
                Search
              </button>
            </div>
            <div className="grid grid-cols-3">
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
            <div className='grid grid-cols-3'>
              <div className="mx-4 col-span-2">
                <input label="Employee ID"
                  value={deactivateId} placeholder='Employee Id to deactivate'
                  onChange={(e) => setDeactivateId(e.target.value)}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <button variant="contained" className="rounded-md h-12 hover:bg-rose-700 focus:bg-rose-600 bg-rose-500 w-auto p-3" onClick={deactivateEmployee}>
                Deactivate
              </button>
            </div>
            <div className="grid grid-cols-2 border-t-2 pt-4 border-gray-400">
              <div className="mx-4">
                <input label="Name"
                  value={newEmployee.name} placeholder='Name'
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <div className="mx-4">
                <input label="Position"
                  value={newEmployee.position} placeholder='Position'
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <div className="mx-4">
                <input label="Direct Reports"
                  value={newEmployee.directReports} placeholder='Direct Reports (Ex: 1,2,3)'
                  onChange={(e) => setNewEmployee({ ...newEmployee, directReports: e.target.value.split(',') })}
                  variant="outlined" className="rounded-md bg-white w-full bg-opacity-30 w-auto p-3" />
              </div>
              <div className="mx-4">
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
    </div >
  );
}

export default App;
