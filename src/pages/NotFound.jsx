import React, { Fragment } from "react";
import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <div className="not-found">
      <div className="text-center">
        <h1>404</h1>
        <h2>Page NotFound</h2>
        <p>
          Sorry, we couldn't find this page. You can go back to home page!
        </p>
        <Link style={{ background: "#2d3748", textDecoration: "none", color: "white" }} to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
};
