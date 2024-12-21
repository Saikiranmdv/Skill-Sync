import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import FileUpload from './components/FileUpload';

const App = () => {
  const [JDContent, setJDContent] = useState("");
  const [skillContent, setSkillContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state to control button

  const handleFileContentExtracted = (content) => {
    setSkillContent(content);
  };

  async function generateAnswer() {
    if (!JDContent || !skillContent) {
      alert("Please provide both job description and skills.");
      return;
    }

    const apiKey = import.meta.env.VITE_API_KEY;
    setAnswer("Loading...");
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
                  text: `Analyze the following job description and provided skills to evaluate their compatibility. Consider key requirements, qualifications, and responsibilities from the job description and match them with the skills listed. Provide a relevancy score (0-100) and a concise justification for the score, highlighting specific alignments or gaps.

                    Job Description:
                    ${JDContent}

                    Skills:
                    ${skillContent}`,
                },
              ],
            },
          ],
        },
      });
      const generatedResponse = response.data.candidates[0].content.parts[0].text
      setAnswer(generatedResponse);

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
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
    </main>
  );
};

export default App;
