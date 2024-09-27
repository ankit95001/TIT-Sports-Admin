import startFirebase from "../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import { ref, onValue } from 'firebase/database';
import '../certificates/styles.css';  // Import the updated styling

const db = startFirebase();

const Highlights = (props) => {
  const [sportsList, setSportsList] = useState([]);  // List of sports
  const [fullData, setFullData] = useState({});  // Store full data (sports -> highlights)
  const [filteredData, setFilteredData] = useState([]);  // Store filtered data (highlight entries for selected sport)
  const [selectedSport, setSelectedSport] = useState('');  // Store selected sport

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    const dbRef = ref(db, 'Highlights');
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
      // Access all highlights for the selected sport
      const highlightsData = Object.values(fullData[sport]);  // Convert the highlight entries into an array
      setFilteredData(highlightsData);  // Update filtered data
    } else {
      setFilteredData([]);
    }
  };

  return (
    <Container className="realtime-data-container my-5 p-4">
      <Row className="align-items-center mb-4">
        <Col md={8}>
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

      {/* Display highlight data */}
      {filteredData.length > 0 ? (
        <Row className="g-4">
          {filteredData.map((highlight, index) => (
            <Col key={index} xs={12} sm={6} md={4}>
              <Card className="h-100 shadow-sm">
                {/* Highlight Document Image */}
                {highlight.document ? (
                  <Card.Img 
                    variant="top" 
                    src={highlight.document} 
                    alt="Highlight Document" 
                    className="card-img-top"
                  />
                ) : (
                  <Card.Img 
                    variant="top" 
                    src="https://via.placeholder.com/200x200.png?text=No+Image" 
                    alt="No Highlight Available" 
                    className="card-img-top"
                  />
                )}
                <Card.Body className="card-body">
                  <Card.Title className="card-title">{highlight.description || 'N/A'}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center mt-5">Please select a sport to see the highlights.</p>
      )}
    </Container>
  );
};

export default Highlights;
