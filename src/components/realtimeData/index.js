import startFirebase from "../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { Table, Form, Container } from 'react-bootstrap';
// import './styles.css';

const db = startFirebase();

const RealtimeData = (props) => {
  const [fullData, setFullData] = useState([]);  // Store full unfiltered data
  const [tableData, setTableData] = useState([]);  // Store filtered data
  const [search, setSearch] = useState('');  // Store the search query

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const dbRef = ref(db, 'User Details');
    onValue(dbRef, (snapshot) => {
      let records = [];
      snapshot.forEach((childSnapshot) => {
        let keyName = childSnapshot.key;
        let data = childSnapshot.val();
        records.push({ "key": keyName, "data": data });
      });
      setFullData(records);  // Set full data
      setTableData(records);  // Initially set table data to full data
    });
  }, []);

  // Filter the data based on search input
  const filteredData = tableData.filter((item) => {
    const query = search.toLowerCase();
    const { enrollment = '', name = '', phone = '', email = '',sport='' } = item.data;
    
    return (
      enrollment.toLowerCase().includes(query) ||
      name.toLowerCase().includes(query) ||
      phone.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      sport.toLowerCase().includes(query) 
    );
  });

  return (
    <Container className="realtime-data-container">
      <Form className="mb-3 sticky-search">
        <Form.Control
          type="text"
          placeholder="Search by name, enrollment, phone, sports or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}  // Triggers filtering on every key press
        />
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Enrollment</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Sport</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={row.key}>
                <td>{index + 1}</td>
                <td>{row.data.enrollment || 'N/A'}</td>
                <td>{row.data.name || 'N/A'}</td>
                <td>{row.data.phone || 'N/A'}</td>
                <td>{row.data.email || 'N/A'}</td>
                <td>{row.data.sport || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No matching data found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default RealtimeData;
