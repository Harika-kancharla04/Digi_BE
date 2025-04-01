const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  theme: { type: String, default: 'light' },
  language: { type: String, default: 'english' },
  location: String,
  title: String,
  website: String,
  profileImage: String,
  summary: String,
  skills: [String],
  education: [
    {
      institution: String,
      degree: String,
      year: String,
    },
  ],
  experiences: [
    {
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  projects: [
    {
      title: String,
      description: String,
      link: String,
    },
  ],
  socialLinks: {
    linkedin: String,
    twitter: String,
    github: String,
    website: String,
  },
  role: { type: String, default: "user" }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;



