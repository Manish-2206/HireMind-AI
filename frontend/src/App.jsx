import { useState } from "react"
import axios from "axios"

function App() {

  const [files, setFiles] = useState([])
  const [jobDescription, setJobDescription] = useState("")
  const [results, setResults] = useState([])
  const [analytics, setAnalytics] = useState(null)

  // Candidate modal
  const [selectedCandidate, setSelectedCandidate] = useState(null)

  // Upload files
  const handleFileChange = (event) => {

    setFiles(event.target.files)
  }

  // Submit
  const handleSubmit = async () => {

    if (files.length === 0) {

      alert("Please upload resumes")

      return
    }

    if (jobDescription.trim() === "") {

      alert("Please enter job description")

      return
    }

    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {

      formData.append(
        "files",
        files[i]
      )
    }

    formData.append(
      "job_description",
      jobDescription
    )

    try {

      const response = await axios.post(
        "https://hiremind-ai-backend-gn8t.onrender.com/rank-resumes/",
        formData
      )

      setResults(
        response.data.candidate_rankings
      )

      setAnalytics(
        response.data.analytics
      )

    } catch (error) {

      console.error(error)

      alert(
        "Backend connection failed"
      )
    }
  }

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "40px",
        fontFamily: "Arial"
      }}
    >

      {/* Header */}
      <div
        style={{
          marginBottom: "30px"
        }}
      >

        <h1
          style={{
            color: "#0f172a",
            marginBottom: "10px"
          }}
        >
          HireMind AI Dashboard
        </h1>

        <p
          style={{
            color: "#475569"
          }}
        >
          AI-Powered Resume Screening System
        </p>

      </div>

      {/* Upload Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "16px",
          marginBottom: "30px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)"
        }}
      >

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Upload Resumes
        </h2>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
        />

        <br />
        <br />

        {/* Uploaded Files */}
        <div>

          {
            Array.from(files).map(
              (file, index) => (

                <div
                  key={index}
                  style={{
                    backgroundColor: "#e2e8f0",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "10px"
                  }}
                >
                  {file.name}
                </div>
              )
            )
          }

        </div>

        <textarea
          rows="8"
          placeholder="Enter Job Description..."
          value={jobDescription}
          onChange={(e) =>
            setJobDescription(
              e.target.value
            )
          }
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            boxSizing: "border-box",
            fontSize: "15px"
          }}
        />

        <br />
        <br />

        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            padding: "14px 24px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px"
          }}
        >
          Rank Candidates
        </button>

      </div>

      {/* Analytics */}
      {analytics && (

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h3>Total Candidates</h3>

            <h1>
              {
                analytics.total_candidates
              }
            </h1>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h3>Average Match</h3>

            <h1>
              {
                analytics.average_match_score
              }%
            </h1>
          </div>

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "14px",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h3>Top Candidate</h3>

            <h2>
              {
                analytics.top_candidate
              }
            </h2>
          </div>

        </div>

      )}

      {/* Results */}
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "16px",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.08)",
          overflowX: "auto"
        }}
      >

        <h2>
          Candidate Rankings
        </h2>

        <table
          width="100%"
          style={{
            marginTop: "20px",
            borderCollapse: "collapse",
            minWidth: "900px"
          }}
        >

          <thead>

            <tr
              style={{
                backgroundColor: "#e2e8f0"
              }}
            >

              <th style={{ padding: "14px" }}>
                Candidate
              </th>

              <th style={{ padding: "14px" }}>
                Match %
              </th>

              <th style={{ padding: "14px" }}>
                Resume
              </th>

              <th style={{ padding: "14px" }}>
                Details
              </th>

            </tr>

          </thead>

          <tbody>

            {
              results.map(
                (candidate, index) => (

                  <tr
                    key={index}
                    style={{
                      borderBottom:
                        "1px solid #e5e7eb"
                    }}
                  >

                    <td
                      style={{
                        padding: "14px",
                        fontWeight: "bold"
                      }}
                    >
                      {
                        candidate.candidate_name
                      }
                    </td>

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >
                      {
                        candidate.match_percentage
                      }%
                    </td>

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >

                      <a
                        href={
                          candidate.resume_url
                        }
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          backgroundColor:
                            "#2563eb",

                          color: "white",

                          padding:
                            "10px 14px",

                          borderRadius:
                            "8px",

                          textDecoration:
                            "none",

                          fontWeight:
                            "bold"
                        }}
                      >
                        View Resume
                      </a>

                    </td>

                    <td
                      style={{
                        padding: "14px"
                      }}
                    >

                      <button
                        onClick={() =>
                          setSelectedCandidate(
                            candidate
                          )
                        }
                        style={{
                          backgroundColor:
                            "#16a34a",

                          color: "white",

                          border: "none",

                          padding:
                            "10px 14px",

                          borderRadius:
                            "8px",

                          cursor: "pointer",

                          fontWeight:
                            "bold"
                        }}
                      >
                        View Details
                      </button>

                    </td>

                  </tr>
                )
              )
            }

          </tbody>

        </table>

      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor:
              "rgba(0,0,0,0.5)",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            zIndex: 1000
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "500px",
              maxWidth: "90%",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >

            <h2
              style={{
                marginBottom: "20px"
              }}
            >
              {
                selectedCandidate.candidate_name
              }
            </h2>

            <p>
              <strong>
                Match Score:
              </strong>

              {" "}
              {
                selectedCandidate.match_percentage
              }%
            </p>

            <p>
              <strong>
                Matched Skills:
              </strong>

              {" "}
              {
                selectedCandidate
                  .matched_skills
                  .join(", ")
              }
            </p>

            <p>
              <strong>
                Missing Skills:
              </strong>

              {" "}
              {
                selectedCandidate
                  .missing_skills
                  .join(", ")
              }
            </p>

            <p>
              <strong>
                Summary:
              </strong>

              {" "}
              {
                selectedCandidate.summary
              }
            </p>

            <br />

            <a
              href={
                selectedCandidate.resume_url
              }
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "10px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold"
              }}
            >
              Open Resume
            </a>

            <button
              onClick={() =>
                setSelectedCandidate(null)
              }
              style={{
                marginLeft: "10px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default App