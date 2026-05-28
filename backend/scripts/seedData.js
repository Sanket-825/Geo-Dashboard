import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import Project from "../models/Project.js";

dotenv.config();

const statuses = ["Active", "Inactive", "Pending", "Completed"];

const indianCities = [
  { city: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { city: "Delhi", lat: 28.7041, lng: 77.1025 },
  { city: "Bangalore", lat: 12.9716, lng: 77.5946 },
  { city: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { city: "Pune", lat: 18.5204, lng: 73.8567 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { city: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { city: "Goa", lat: 15.2993, lng: 74.1240 },
];

const generateProjects = (count) => {
  return Array.from({ length: count }, (_, i) => {

    const city =
      indianCities[
        Math.floor(Math.random() * indianCities.length)
      ];

    return {
      projectName: `Project ${i + 1}`,

      projectNumber: i + 1,

      latitude:
        city.lat + (Math.random() - 0.5) * 0.5,

      longitude:
        city.lng + (Math.random() - 0.5) * 0.5,

      status:
        statuses[
          Math.floor(Math.random() * statuses.length)
        ],

      lastUpdated:
        faker.date.recent({ days: 365 }),
    };
  });
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    await Project.deleteMany();

    console.log("Old data removed");

    const projects = generateProjects(100000);

    console.log("Inserting 100k records...");
    
    await Project.insertMany(projects);

    console.log("100,000 records inserted successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();