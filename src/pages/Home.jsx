import React, { useState } from "react";
import "./home.css";
import { useDispatch } from "react-redux";
import { setAnalyzedResult } from "../config/slice";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import { Navigate, useNavigate } from "react-router-dom";
const workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userProjects, setUserProjects] = useState("");

  // console.log(userProjects);
  // const [analyzedResult, setAnalyzedLocalResult] = useState('')
  const dispatch = useDispatch();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("select a valid file");
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      setLoading(true);
      try {
        const text = await readpdf(file);
        analyzeResume(text);
        navigate("/result"); // after that redirect result page
      } catch (error) {
        console.error("Error reading pdf:" + error);
      } finally {
        setLoading(false);
      }
      // console.log("Uploaded file:", file);
    } else {
      alert("Please select a PDF file to upload.");
    }
  };
  const readpdf = async (file) => {
    return new Promise(async (resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = async () => {
        const typedArray = new Uint8Array(fileReader.result);
        // console.log(typedArray.length);
        try {
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map((item) => item.str).join(" ");
            // console.log(text)
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  };
  const analyzeResume = (text) => {
    const keywords = {
      jobTitle: [
        "Web Developer",
        "Software Developer",
        "Python Developer",
        "React Developer",
        "Full Stack Developer",
        "Frontend Developer",
        "Backend Developer",
      ],
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "CSS",
        "HTML",
        "Java",
        "C++",
        "Bootstrap",
        "tailwind",
      ],
      experience: ["2 Years", "3 Years", "4 Years", "5 Years"],
      education: [
        "Bachelor's Degree",
        "Master's Degree",
        "PhD",
        "B.Tech",
        "M.Tech",
      ],
      languages: ["Hindi", "English"],
      softSkills: [
        "communication",
        "leadership",
        "Problem-solving",
        "Team collaboration",
      ],
      // project: ["Newsapp"]
    };
    const sectionWeights = {
      jobTitle: 0.15,
      skills: 0.3,
      experience: 0.25,
      education: 0.05,
      softSkills: 0.1,
      userProjects: 0.15,
    };
    // Normalize the text for better matching
    const normalizedText = text.toLowerCase().replace(/\s+/g, " ");
    // Helper function to calculate section score
    const calculateSectionScore = (matchedItems, totalItems) => {
      return totalItems > 0 ? (matchedItems.length / totalItems) * 100 : 0;
    };
    // Calculate matches for each section
    const matchedJobTitles = keywords.jobTitle.filter((job) =>
      normalizedText.includes(job.toLowerCase())
    );
    const matchedSkills = keywords.skills.filter((skill) =>
      normalizedText.includes(skill.toLowerCase())
    );
    const matchedExperience = keywords.experience.filter((exp) =>
      normalizedText.includes(exp.toLowerCase())
    );
    const matchedEducation = keywords.education.filter((edu) =>
      normalizedText.includes(edu.toLowerCase())
    );
    const matchedSoftSkills = keywords.softSkills.filter((soft) =>
      normalizedText.includes(soft.toLowerCase())
    );
    const userProjectList = userProjects
      .split(",")
      .map((proj) => proj.trim())
      .filter((proj) => proj !== "");

    // Calculate scores for each section
    // const jobTitleScore = calculateSectionScore(matchedJobTitles, keywords.jobTitle.length);
    const jobTitleScore = matchedJobTitles.length > 0 ? 100 : 0;
    console.log(jobTitleScore);
    const skillsScore = calculateSectionScore(
      matchedSkills,
      keywords.skills.length
    );
    console.log(skillsScore);
    const experienceScore = calculateSectionScore(
      matchedExperience,
      keywords.experience.length
    );
    console.log(experienceScore);
    const educationScore = calculateSectionScore(
      matchedEducation,
      keywords.education.length
    );
    console.log(educationScore);
    const softSkillsScore = calculateSectionScore(
      matchedSoftSkills,
      keywords.softSkills.length
    );
    // console.log(softSkillsScore);
    const userProjectsScore = userProjectList.length >= 3 ? 100 : 50; // If user provided projects, give full points for that section.

    // Calculate the weighted ATS score
    const atsScore =
      jobTitleScore * sectionWeights.jobTitle +
      skillsScore * sectionWeights.skills +
      experienceScore * sectionWeights.experience +
      educationScore * sectionWeights.education +
      softSkillsScore * sectionWeights.softSkills +
      userProjectsScore * sectionWeights.userProjects;
    // Round and ensure ATS score is capped at 100
    const finalAtsScore = Math.min(Math.round(atsScore), 100);

    let result = "";
    result += `Job Titles found: ${matchedJobTitles.join(", ") || "None"}\n`;
    result += `Skills found: ${matchedSkills.join(", ") || "None"}\n`;
    result += `Experience found: ${matchedExperience.join(", ") || "None"}\n`;
    result += `Education found: ${matchedEducation.join(", ") || "None"}\n`;
    result += `Soft Skills found: ${matchedSoftSkills.join(", ") || "None"}\n`;
    result += `User Projects: ${userProjectList.join(", ") || "None"}\n`;
    // result += `\nATS Score: ${finalAtsScore}/100`;
    // Check if skills are present
    // const hasjobTitle = keywords.jobTitle.some(jobtitle => normalizedText.includes(jobtitle.toLowerCase()));

    // const hasSkills = keywords.skills.some(skill => normalizedText.includes(skill.toLowerCase()));

    // const hasExperience = keywords.experience.some(exp => normalizedText.includes(exp.toLowerCase()));

    // const hasLanguage = keywords.languages.some(lang => normalizedText.includes(lang.toLowerCase()));

    // const hasSoftskill = keywords.softSkills.some(soft => normalizedText.includes(soft.toLowerCase()));
    // const hasProject = keywords.project.some(proj => normalizedText.includes(proj.toLowerCase()));
    // const userProjectList = userProjects.split(',').map(proj => proj.trim()).filter(proj => proj !== "");

    // if (hasjobTitle) {
    //     result += "JobTitle found: " + keywords.jobTitle.filter(job => text.includes(job)).join(", ") + "\n"
    // }
    // else {
    //     result += "No profession found.\n";
    // }
    // if (hasSkills) {
    //     result += "Technical skills found: " + keywords.skills.filter(skill => text.includes(skill)).join(", ") + "\n"
    // } else {
    //     result += "No relevant skills found.\n"
    // }
    // if (hasExperience) {
    //     result += "Experience section found." + keywords.experience.filter(experience => text.includes(experience)).join(", ") + "\n";
    // } else {
    //     result += "No experience section found.\n";
    // }
    // if (hasLanguage) {
    //     result += "Langauge found: " + keywords.languages.filter(lang => text.includes(lang)).join(", ") + "\n";
    // }
    // else {
    //     result += "No language found.\n";
    // }
    // if (hasSoftskill) {
    //     result += "Soft skills: " + keywords.softSkills.filter(soft => text.includes(soft)).join(", ") + "\n";
    // }
    // else {
    //     result += "No soft skills found.\n";
    // }
    // if (userProjectList.length > 0) {
    //     result += "Project provided by the user: " + userProjectList.join(", ") + "\n";
    // }
    // setAnalyzedLocalResult(result);
    dispatch(setAnalyzedResult({ result, atsScore: finalAtsScore }));
  };
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="loader"></div>
        </div>
      )}
      {/* <div className="w-full bg-white text-black">

            </div> */}
      <div className="w-full bg-purple-300   mt-6 p-4 lg:p-16 rounded-t-3xl">
        <h1 className="sm:text-xl lg:text-3xl text-sky-800 font-bold">
          Get Your Resume Review Free
        </h1>
        <div className="max-w-md my-2 mx-auto bg-white shadow-lg rounded-t-3xl overflow-hidden">
          <div className="p-6">
            <h2 className="sm:text-xs md:text-lg font-semibold mb-4 text-center">
              Upload Your Resume (PDF)
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col lg:flex lg:flex-col lg:items-center"
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-300 rounded-md lg:focus:outline-none lg:focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Enter project names, separated by commas"
                value={userProjects}
                onChange={(e) => setUserProjects(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded-md lg:focus:outline-none lg:focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="transition duration-700  bg-fuchsia-400 text-white py-2 px-4 rounded-md hover:text-black"
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </form>
            {file && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Selected file: {file.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
