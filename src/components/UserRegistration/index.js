import startFirebase from "../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { Form, Container, Table, Button, Row, Col } from 'react-bootstrap';
import { ref, onValue } from 'firebase/database';
import jsPDF from 'jspdf';
import 'jspdf-autotable';  // For table generation
import './styles.css';  // Import additional styling

const db = startFirebase();

const RealtimeData = (props) => {
  const [sportsList, setSportsList] = useState([]);  // Store list of sports dynamically
  const [fullData, setFullData] = useState({});  // Store full unfiltered data (sports -> students)
  const [filteredData, setFilteredData] = useState([]);  // Store filtered data (students)
  const [selectedSport, setSelectedSport] = useState('');  // Store selected sport

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const dbRef = ref(db, 'InterCollegeRegistration');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      setFullData(data);  // Store the full dataset
      setSportsList(Object.keys(data));  // Get and store the list of sports
    });
  }, []);

  // Handle dropdown selection change
  const handleSportChange = (event) => {
    const sport = event.target.value;
    setSelectedSport(sport);

    if (sport) {
      const sportData = fullData[sport] || {};
      const students = Object.values(sportData);
      setFilteredData(students);
    } else {
      setFilteredData([]);
    }
  };

  // Generate PDF with student data
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Student List for ${selectedSport}`, 20, 20);
    
    const tableData = filteredData.map((student, index) => [
      index + 1,
      student.enrollment,
      student.student_name,
      student.phoneNo,
    ]);

    doc.autoTable({
      head: [['#', 'Enrollment', 'Name', 'Phone']],
      body: tableData,
      startY: 30,
    });

    doc.save(`${selectedSport}_StudentList.pdf`);
  };

  return (
    <Container className="realtime-data-container my-5 p-4" style={{ maxWidth: '1200px' }}>
      <Row className="align-items-center mb-4">
        <Col md={12}>
          {/* Dropdown to select sport */}
          <Form.Group controlId="sportSelect">
            <Form.Label className="h5">Select a Sport:</Form.Label>
            <Form.Control 
              as="select" 
              value={selectedSport} 
              onChange={handleSportChange} 
              className="custom-select sport-select"
            >
              <option value="">-- Select Sport --</option>
              {sportsList.map((sport, index) => (
                <option key={index} value={sport}>{sport}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4} className="text-right">
          {/* Button to download PDF */}
          <Button 
            variant="success" 
            onClick={generatePDF} 
            disabled={!selectedSport}  // Disable if no sport is selected
          >
            Download PDF
          </Button>
        </Col>
      </Row>

      {/* Display student data */}
      {filteredData.length > 0 ? (
        <Table striped bordered hover className="table-responsive animate-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Enrollment</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Document</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student, index) => (
              <tr key={student.enrollment}>
                <td>{index + 1}</td>
                <td>{student.enrollment}</td>
                <td>{student.student_name}</td>
                <td>{student.phoneNo}</td>
                <td>
                  <Button 
                    variant="primary" 
                    onClick={() => window.open(student.document, '_blank')}
                    className="btn-doc"
                  >
                    View Document
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center mt-5">Please select a sport to see the students.</p>
      )}
    </Container>
  );
};

export default RealtimeData;
