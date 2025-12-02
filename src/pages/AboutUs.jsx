import React from "react";
import {
  Container,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import aboutImage from "../assets/atn.png";

const faqData = [
  {
    question: "What is MarkME?",
    answer:
      "MarkME is a cutting-edge project that provides innovative solutions for authentication and digital security.",
  },
  {
    question: "How does MarkME work?",
    answer:
      "Our system uses advanced technologies including facial recognition and secure protocols to ensure reliable and efficient authentication.",
  },
  {
    question: "Can I update my profile information?",
    answer:
      "Yes! Once you're logged in, you can update your profile information from your dashboard.",
  },
];

function AboutUs() {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ color: "#1976d2" }}
            >
              About MarkME
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#424242" }}>
              MarkME is dedicated to providing state-of-the-art solutions that
              simplify and secure your digital interactions. Our platform is
              built with cutting-edge technology and designed with a focus on
              user experience, security, and efficiency.
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#424242" }}>
              Our mission is to innovate and integrate seamless authentication
              mechanisms that empower businesses and individuals alike. Join us
              on our journey to redefine digital security.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{ overflow: "hidden", borderRadius: "8px" }}
            >
              <img
                src={aboutImage}
                alt="About MarkME"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </Paper>
          </Grid>
        </Grid>

        <Typography
          variant="h4"
          component="h2"
          sx={{ mt: 6, mb: 2, textAlign: "center", color: "#1976d2" }}
        >
          Frequently Asked Questions
        </Typography>
        <Grid container spacing={2}>
          {faqData.map((faq, index) => (
            <Grid item xs={12} key={index}>
              <Accordion sx={{ backgroundColor: "#ffffff", borderRadius: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#1976d2" }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    backgroundColor: "#e3f2fd",
                    borderRadius: 1,
                    p: 1,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ color: "#424242" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{ p: 3, backgroundColor: "#f0f4f8" }}>
                  <Typography variant="body2" sx={{ color: "#616161" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default AboutUs;
