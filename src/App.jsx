import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import FileUpload from './components/FileUpload';
import RelevancyScoreComponent from './components/RelevancyScoreComponent';
// import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [JDContent, setJDContent] = useState("");
  const [skillContent, setSkillContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state to control button
  const [relavancyScore, setrelavancyScore] = useState()

  const handleFileContentExtracted = (content) => {
    setSkillContent(content);
  };

  async function generateAnswer() {
    if (!JDContent || !skillContent) {
      alert("Please provide both job description and skills.");
      return;
    }

    const apiKey = import.meta.env.VITE_API_KEY;
    setIsLoading(true); // Start loading

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Analyze the following job description and the provided skills to evaluate their compatibility. Focus on the following aspects:

                        Key Requirements & Qualifications: Match specific qualifications and experiences (e.g., education level, years of experience, technical expertise) mentioned in the job description to those listed in the skills.
                        Responsibilities: Identify overlaps between the responsibilities outlined in the job description and the experiences provided in the skills.
                        Tools & Technologies: Compare the tools, technologies, and methodologies mentioned in the job description with those highlighted in the skills.
                        Soft Skills: Assess the alignment of any soft skills or non-technical requirements.
                        Provide a Relevancy Score (0-100) in the format "Relevancy Score: 85/100". Additionally, offer:

                        A justification for the score, including specific alignments and gaps.
                        Actionable suggestions to improve the score, such as skills to acquire, tools to learn, or experiences to emphasize.
                        Job Description: ${JDContent}

                        Skills: ${skillContent}

                        `,
                },
              ],
            },
          ],
        },
      });
      const generatedResponse = response.data.candidates[0].content.parts[0].text
      setAnswer(generatedResponse);

      const match = generatedResponse.match(/Relevancy Score: (\d+)\/100/);
      if (match) {
        const generatedRelavancyScore = match[1];
        setrelavancyScore(generatedRelavancyScore);
      } else {
        console.error("Relevancy Score pattern not found in the response");
      }

    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Error generating answer. Please try again.");
    } finally {
      setIsLoading(false); // End loading
    }
  }

  return (
    <main>
      <h1>Skill-Sync</h1>
      <p>Enter the Job Description below:</p>
      <textarea
        value={JDContent}
        onChange={(e) => setJDContent(e.target.value)}
        placeholder="Enter Job Description"
        rows="6"
        cols="50"
      />
      <p>Upload Your CV or Skills:</p>
      <FileUpload onFileContentExtracted={handleFileContentExtracted} />
      <button onClick={generateAnswer} disabled={isLoading || !JDContent || !skillContent}>
        {isLoading ? "Loading..." : "Check Relevancy"}
      </button>
      <div>
        <RelevancyScoreComponent score={relavancyScore} />
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </main>
  );
};

export default App;