import { useState } from "react"
import axios from "axios"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

function App() {

  const [files, setFiles] = useState([])
  const [jobDescription, setJobDescription] = useState("")
  const [results, setResults] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)

  // Search + Filter
  const [searchTerm, setSearchTerm] = useState("")
  const [minScore, setMinScore] = useState(0)

  // Shortlist
  const [shortlisted, setShortlisted] = useState([])

  // Handle file upload
  const handleFileChange = (event) => {

    setFiles(event.target.files)
  }

  // Submit form
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

      formData.append("files", files[i])
    }

    formData.append(
      "job_description",
      jobDescription
    )

    try {

      setLoading(true)

      const response = await axios.post(
        "http://127.0.0.1:8000/rank-resumes/",
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

      alert("Backend connection failed")

    } finally {

      setLoading(false)
    }
  }

  // Score badge colors
  const getScoreColor = (score) => {

    if (score >= 75) {
      return "#16a34a"
    }

    if (score >= 50) {
      return "#ca8a04"
    }

    return "#dc2626"
  }

  // Toggle shortlist
  const toggleShortlist = (candidateName) => {

    setShortlisted((prev) => {

      if (prev.includes(candidateName)) {

        return prev.filter(
          (name) => name !== candidateName
        )
      }

      return [...prev, candidateName]
    })
  }

  // Filter candidates
  const filteredResults = results.filter(
    (candidate) => {

      return (
        candidate.candidate_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&

        candidate.match_percentage >= minScore
      )
    }
  )

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "40px 20px",
        fontFamily: "Arial",
        display: "flex",
        justifyContent: "center"
      }}
    >

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "1300px"
        }}
      >

        {/* Header */}
        <h1
          style={{
            textAlign: "center",
            color: "#0f172a",
            marginBottom: "40px",
            fontSize: "42px"
          }}
        >
          HireMind AI Dashboard
        </h1>

        {/* Upload Section */}
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >

          <h2>
            Upload Resumes
          </h2>

          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
          />

          <br />
          <br />

          <strong>
            Selected Files:
          </strong>

          <ul>

            {Array.from(files).map(
              (file, index) => (

                <li key={index}>
                  {file.name}
                </li>
              )
            )}

          </ul>

          <textarea
            rows="6"
            placeholder="Enter Job Description..."
            value={jobDescription}
            onChange={(e) =>
              setJobDescription(e.target.value)
            }
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              marginTop: "20px",
              boxSizing: "border-box"
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
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >

            {loading
              ? "Processing..."
              : "Rank Candidates"}

          </button>

        </div>

        {/* Analytics Cards */}
        {analytics && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
              marginBottom: "30px"
            }}
          >

            {/* Total Candidates */}
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)"
              }}
            >

              <h3>Total Candidates</h3>

              <h1>
                {analytics.total_candidates}
              </h1>

            </div>

            {/* Average Match */}
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)"
              }}
            >

              <h3>Average Match</h3>

              <h1>
                {analytics.average_match_score}%
              </h1>

            </div>

            {/* Top Candidate */}
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)"
              }}
            >

              <h3>Top Candidate</h3>

              <h2>
                {analytics.top_candidate}
              </h2>

            </div>

            {/* Shortlisted */}
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.08)"
              }}
            >

              <h3>Shortlisted</h3>

              <h1>
                {shortlisted.length}
              </h1>

            </div>

          </div>

        )}

        {/* Filters */}
        <div
          style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >

          <h2
            style={{
              marginBottom: "20px"
            }}
          >
            Search & Filters
          </h2>

          {/* Search */}
          <input
            type="text"
            placeholder="Search Candidate..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              marginBottom: "20px",
              boxSizing: "border-box"
            }}
          />

          {/* Slider */}
          <label>
            Minimum Match Score:
            <strong>
              {" "} {minScore}%
            </strong>
          </label>

          <input
            type="range"
            min="0"
            max="100"
            value={minScore}
            onChange={(e) =>
              setMinScore(Number(e.target.value))
            }
            style={{
              width: "100%"
            }}
          />

        </div>

        {/* Chart */}
        {filteredResults.length > 0 && (

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

            <h2>
              Candidate Match Analysis
            </h2>

            <div
              style={{
                width: "100%",
                height: "400px"
              }}
            >

              <ResponsiveContainer>

                <BarChart
                  data={filteredResults}
                >

                  <XAxis
                    dataKey="candidate_name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="match_percentage"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

        {/* Shortlisted Candidates */}
        {shortlisted.length > 0 && (

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
              Shortlisted Candidates
            </h2>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "15px"
              }}
            >

              {results
                .filter((candidate) =>
                  shortlisted.includes(
                    candidate.candidate_name
                  )
                )
                .map((candidate, index) => (

                  <div
                    key={index}
                    style={{
                      backgroundColor: "#dcfce7",
                      padding: "16px",
                      borderRadius: "12px",
                      minWidth: "220px"
                    }}
                  >

                    <h3>
                      {candidate.candidate_name}
                    </h3>

                    <p>
                      Match:
                      {" "}
                      {candidate.match_percentage}%
                    </p>

                  </div>
                ))}

            </div>

          </div>

        )}

        {/* Results Table */}
        <div
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflowX: "auto"
          }}
        >

          <h2>
            Candidate Rankings
          </h2>

          {filteredResults.length === 0 ? (

            <p
              style={{
                color: "gray",
                marginTop: "20px"
              }}
            >
              No matching candidates found.
            </p>

          ) : (

            <table
              width="100%"
              style={{
                borderCollapse: "collapse",
                marginTop: "20px",
                minWidth: "1200px"
              }}
            >

              <thead>

                <tr
                  style={{
                    backgroundColor: "#e2e8f0"
                  }}
                >

                  <th style={{ padding: "16px" }}>
                    Candidate
                  </th>

                  <th style={{ padding: "16px" }}>
                    Match Score
                  </th>

                  <th style={{ padding: "16px" }}>
                    Matched Skills
                  </th>

                  <th style={{ padding: "16px" }}>
                    Missing Skills
                  </th>

                  <th style={{ padding: "16px" }}>
                    Summary
                  </th>

                  <th style={{ padding: "16px" }}>
                    Action
                  </th>

                  <th style={{ padding: "16px" }}>
                    Resume
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredResults.map(
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
                          padding: "16px",
                          fontWeight: "bold"
                        }}
                      >
                        {
                          candidate.candidate_name
                        }
                      </td>

                      <td style={{ padding: "16px" }}>

                        <span
                          style={{
                            backgroundColor:
                              getScoreColor(
                                candidate.match_percentage
                              ),
                            color: "white",
                            padding: "8px 14px",
                            borderRadius: "999px",
                            fontWeight: "bold"
                          }}
                        >

                          {
                            candidate.match_percentage
                          }%

                        </span>

                      </td>

                      <td style={{ padding: "16px" }}>
                        {
                          candidate.matched_skills
                            .join(", ")
                        }
                      </td>

                      <td style={{ padding: "16px" }}>
                        {
                          candidate.missing_skills
                            .join(", ")
                        }
                      </td>

                      <td style={{ padding: "16px" }}>
                        {candidate.summary}
                      </td>

                      <td style={{ padding: "16px" }}>

                        <button
                          onClick={() =>
                            toggleShortlist(
                              candidate.candidate_name
                            )
                          }
                          style={{
                            backgroundColor:
                              shortlisted.includes(
                                candidate.candidate_name
                              )
                                ? "#dc2626"
                                : "#16a34a",

                            color: "white",
                            border: "none",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold"
                          }}
                        >

                          {
                            shortlisted.includes(
                              candidate.candidate_name
                            )
                              ? "Remove"
                              : "Shortlist"
                          }

                        </button>

                      </td>

                      <td style={{ padding: "16px" }}>

                        <a
                          href={candidate.resume_url}
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
                          View Resume
                        </a>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>
  )
}

export default App