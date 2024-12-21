import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

const App = () => {

  const [JDContent, setJDContent] = useState("")
  const [skillContent, setSkillContent] = useState("")
  const [answer, setanswer] = useState("")

  async function generateAnswer() {
    const apiKey = import.meta.env.VITE_API_KEY;
    setanswer("Loading...")
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
    setanswer(response.data.candidates[0].content.parts[0].text)
  }

  return (
    <main>
      <h1> Skill-Sync</h1>
      <p>Enter the Job Description below:</p>
      <textarea
        value={JDContent}
        onChange={(e) => setJDContent(e.target.value)}
      />
      <p>Enter The CV or the skill you have</p>
      <textarea
        value={skillContent}
        onChange={(e) => setSkillContent(e.target.value)}
      />

      <button onClick={generateAnswer}>Check Relavancy</button>
      <ReactMarkdown>{answer}</ReactMarkdown>
    </main>
  )
}

export default App

