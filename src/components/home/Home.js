import React from "react";
import "./styles.css"; // Add your CSS for styling

const Home = (props) => {
  return (
    <div className="home-container">
      <header className="header-section">
        <h1>Welcome to TIT Sports</h1>
        <p>Stay updated with all sports activities at Technocrats Institute of Technology!</p>
      </header>
      <section className="officer-section">
        <h2>Meet Our Sports Officer</h2>
        <div className="officer-details">
          <img src="/sharmasir.jpg" alt="Sports Officer" className="officer-photo" />
          <div className="officer-info">
            <h3>Mr. Ram Kumar Sharma</h3>
            <p>Position: Sports Officer</p>
            <p>Email: titsports@gmail.com</p>
            <p>Experience: 25+ years in managing sports activities and events.</p>
          </div>
        </div>
      </section>

      <section className="photos-section">
        <h2>Sports Gallery</h2>
        <div className="photos-grid">
          <img src="/bb.jpeg" alt="Sport 1" />
          <img src="/bc.jpeg" alt="Sport 2" />
          <img src="/bh.jpeg" alt="Sport 3" />
          <img src="/cf.jpeg" alt="Sport 4" />
          <img src="/cg.jpeg" alt="Sport 5" />
          <img src="/ch.jpeg" alt="Sport 6" />
          <img src="/cj.jpeg" alt="Sport 7" />
          <img src="/ck.jpeg" alt="Sport 8" />
        </div>
      </section>
    </div>
  );
};

export default Home;
