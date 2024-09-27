import startFirebase from "../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import { ref, onValue } from 'firebase/database';
import './styles.css';

const db = startFirebase();

const Certificates = (props) => {
  const [sportsList, setSportsList] = useState([]);  // List of sports
  const [fullData, setFullData] = useState({});  // Store full data (sports -> details)
  const [filteredData, setFilteredData] = useState(null);  // Store filtered data (details for selected sport)
  const [selectedSport, setSelectedSport] = useState('');  // Store selected sport

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const dbRef = ref(db, 'Certificates');
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFullData(data);  // Store the full dataset
        setSportsList(Object.keys(data));  // Extract and store the list of sports
      }
    });
  }, []);

  // Handle dropdown selection change
  const handleSportChange = (event) => {
    const sport = event.target.value;
    setSelectedSport(sport);
    if (sport && fullData[sport]) {
      // Access the data for the selected sport
      const sportData = fullData[sport];  // This is the data for the selected sport
      setFilteredData(sportData);  // Update filtered data
    } else {
      setFilteredData(null);
    }
  };

  return (
    <Container className="realtime-data-container my-5 p-4">
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
      </Row>

      {/* Display certificate data */}
      {filteredData ? (
        <Row className="g-4">
          <Col xs={12} sm={6} md={4}>
            <Card className="h-100 shadow-sm">
              {/* Certificate Document Image */}
              {filteredData.document ? (
                <Card.Img 
                  variant="top" 
                  src={filteredData.document} 
                  alt={`${filteredData.student_name}'s Certificate`} 
                  className="card-img-top"
                />
              ) : (
                <Card.Img 
                  variant="top" 
                  src="https://via.placeholder.com/200x200.png?text=No+Image" 
                  alt="No Certificate Available" 
                  className="card-img-top"
                />
              )}
              <Card.Body className="card-body">
                <Card.Title className="card-title">{filteredData.student_name}</Card.Title>
                <Card.Text className="card-text">
                  <strong>Enrollment:</strong> {filteredData.enrollment}<br />
                  <strong>Phone:</strong> {filteredData.phoneNo}<br />
                  <strong>Description:</strong> {filteredData.description || 'N/A'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <p className="text-center mt-5">Please select a sport to see the certificate.</p>
      )}
    </Container>
  );
};

export default Certificates;
