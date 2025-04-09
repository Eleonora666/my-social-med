import React from "react";
import "./footer.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const creationDate = "2025"; // You can change this to the year when the website was created

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Developed by Eleonora Jevdokimova</p>
        <p>Site created in {creationDate}</p>
        <p>&copy; {currentYear} All Rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
