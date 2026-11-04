import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col" style={{ maxWidth: '350px' }}>
            <div className="logo" style={{ color: '#fff', marginBottom: '12px' }}>
              <Compass size={24} />
              <span>WILDTRAIL</span>
            </div>
            <p>
              An academic Full-Stack MERN platform for booking adventure travel expeditions, curated alpine stays, and outdoor gear across India.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/adventures">Adventures</Link></li>
              <li><Link to="/stays">Stays & Camps</Link></li>
              <li><Link to="/shop">Outdoor Gear</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Destinations</h4>
            <ul>
              <li>Manali, Himachal Pradesh</li>
              <li>Rishikesh, Uttarakhand</li>
              <li>Leh-Ladakh, J&K</li>
              <li>Spiti Valley, Kaza</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Project Info</h4>
            <ul>
              <li>Course: Full Stack Development (FSD)</li>
              <li>Stack: MongoDB, Express, React, Node.js</li>
              <li>Architecture: REST API + React Context</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} WILDTRAIL FSD Project. Designed for Academic Evaluation & Viva Demonstration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

