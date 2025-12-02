import React from "react";
import {
  FaUserCheck,
  FaCamera,
  FaClock,
  FaShieldAlt,
  FaUsers,
  FaChartBar,
} from "react-icons/fa";
import { Card, CardContent, Typography, Grid } from "@mui/material";

function Home() {
  return (
    <div className="bg-white py-10 md:pt-20 md:pb-14">
      <div className="mx-auto max-w-7xl">
        {/* Intro Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome To
          </h1>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-900 sm:text-5xl md:text-6xl">
            MarkME
          </h1>
          <p className="mt-6 text-md text-gray-600 max-w-3xl mx-auto font-bold">
            A cutting-edge facial recognition authentication system built using
            React and face-api.js. Enhance security, streamline check-ins, and
            ensure seamless authentication through advanced AI-driven facial
            analysis.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-16 lg:px-32 mb-16">
          <CardComponent
            icon={<FaUserCheck />}
            title="Secure Authentication"
            desc="Authenticate users with AI-driven facial recognition."
          />
          <CardComponent
            icon={<FaCamera />}
            title="Live Camera Capture"
            desc="Capture and analyze faces in real-time."
          />
          <CardComponent
            icon={<FaClock />}
            title="Attendance Tracking"
            desc="Record and manage attendance seamlessly."
          />
          <CardComponent
            icon={<FaShieldAlt />}
            title="Data Protection"
            desc="Ensuring encrypted and secure user data storage."
          />
          <CardComponent
            icon={<FaUsers />}
            title="Multi-User Support"
            desc="Allow multiple users with role-based access."
          />
          <CardComponent
            icon={<FaChartBar />}
            title="Analytics & Reports"
            desc="Get detailed insights and attendance records."
          />
        </div>

        {/* Feature Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 p-4">
            Why Choose MarkME?
          </h2>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            className="mt-6 px-6 md:px-32"
          >
            <Grid item xs={12} md={8}>
              <Card
                elevation={3}
                sx={{ backgroundColor: "#f3f4f6", padding: 3 }}
              >
                <CardContent>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    align="left"
                  >
                    ✅ <strong>Instant Check-ins:</strong> No more waiting –
                    simply scan and go.
                    <br />✅ <strong>Cloud-Based Storage:</strong> Securely
                    store attendance records with easy access.
                    <br />✅ <strong>Fraud Prevention:</strong> Eliminate buddy
                    punching and unauthorized access.
                    <br />✅ <strong>Seamless Integration:</strong> Easily
                    integrate with your existing systems.
                    <br />✅ <strong>AI-Powered Accuracy:</strong>{" "}
                    High-precision facial recognition for reliable results.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

function CardComponent({ icon, title, desc }) {
  return (
    <div className="bg-indigo-100 p-6 rounded-lg shadow-lg text-center">
      <div className="text-indigo-700 text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  );
}

export default Home;
