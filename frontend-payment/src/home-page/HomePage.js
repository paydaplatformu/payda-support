import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div>
    <Link to="/support">Support</Link>
    <Link to="/admin">Admin</Link>
  </div>
);

export default HomePage;
