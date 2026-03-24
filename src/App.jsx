import React, { useEffect, useMemo, useState } from "react";

export default function App() {
  const teams = [
    { id: "AEK", name: "ΑΕΚ", points: 60, short: "ΑΕΚ", color: "#f4c430", accent: "#1f1f1f", glow: "rgba(244,196,48,0.35)", badge: "🟡" },
    { id: "OLY", name: "Ολυμπιακός", points: 58, short: "ΟΛΥ", color: "#d7263d", accent: "#ffffff", glow: "rgba(215,38,61,0.30)", badge: "🔴" },
    { id: "PAOK", name: "ΠΑΟΚ", points: 57, short: "ΠΑΟΚ", color: "#1f1f1f", accent: "#ffffff", glow: "rgba(31,31,31,0.35)", badge: "⚫" },
    { id: "PAN", name: "Παναθηναϊκός", points: 49, short: "ΠΑΟ", color: "#159947", accent: "#ffffff", glow: "rgba(21,153,71,0.30)", badge: "🟢" }
  ];

  const fixtures = [
    { round: "1η αγωνιστική", date: "4–5 Απριλίου", home: "OLY", away: "AEK" },
    { round: "1η αγωνιστική", date: "4–5 Απριλίου", home: "PAOK", away: "PAN" },
    { round: "2η αγωνιστική", date: "18–19 Απριλίου", home: "AEK", away: "PAOK" },
    { round: "2η αγωνιστική", date: "18–19 Απριλίου", home: "PAN", away: "OLY" },
    { round: "3η αγωνιστική", date: "2–3 Μαΐου", home: "PAN", away: "AEK" },
    { round: "3η αγωνιστική", date: "2–3 Μαΐου", home: "PAOK", away: "OLY" },
    { round: "4η αγωνιστική", date: "9–10 Μαΐου", home: "AEK", away: "PAN" },
    { round: "4η αγωνιστική", date: "9–10 Μαΐου", home: "OLY", away: "PAOK" },
    { round: "5η αγωνιστική", date: "12–13 Μαΐου", home: "OLY", away: "PAN" },
    { round: "5η αγωνιστική", date: "12–13 Μαΐου", home: "PAOK", away: "AEK" },
    { round: "6η αγωνιστική", date: "16–17 Μαΐου", home: "AEK", away: "OLY" },
    { round: "6η αγωνιστική", date: "16–17 Μαΐου", home: "PAN", away: "PAOK" }
  ];

  const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));
  const initialResults = Object.fromEntries(fixtures.map((_, i) => [i, ""]));
  const [results, setResults] = useState(initialResults);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 900 : false);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 900);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const standings = useMemo(() => {
    const table = Object.fromEntries(
      teams.map((t) => [
        t.id,
        {
          ...t,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          playoffPoints: 0
        }
      ])
    );

    fixtures.forEach((match, idx) => {
      const result = results[idx];
      if (!result) return;

      const home = table[match.home];
      const away = table[match.away];

      home.played += 1;
      away.played += 1;

      if (result === "H") {
        home.wins += 1;
        away.losses += 1;
        home.playoffPoints += 3;
      } else if (result === "D") {
        home.draws += 1;
        away.draws += 1;
        home.playoffPoints += 1;
        away.playoffPoints += 1;
      } else if (result === "A") {
        away.wins += 1;
        home.losses += 1;
        away.playoffPoints += 3;
      }
    });

    return Object.values(table)
      .map((t) => ({ ...t, totalPoints: t.points + t.playoffPoints }))
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.playoffPoints !== a.playoffPoints) return b.playoffPoints - a.playoffPoints;
        return a.name.localeCompare(b.name, "el");
      });
  }, [results]);

  const grouped = fixtures.reduce((acc, match, idx) => {
    if (!acc[match.round]) acc[match.round] = { date: match.date, matches: [] };
    acc[match.round].matches.push({ ...match, idx });
    return acc;
  }, {});

  const completedMatches = Object.values(results).filter(Boolean).length;
  const leader = standings[0];

  function resetAll() {
    setResults(initialResults);
  }

  function setQuickResult(index, value) {
    setResults((prev) => ({ ...prev, [index]: value }));
  }

  const mobileStyles = {
    hero: {
      ...styles.hero,
      padding: isMobile ? 18 : 28,
      borderRadius: isMobile ? 20 : 28,
      alignItems: isMobile ? "flex-start" : "center"
    },
    title: {
      ...styles.title,
      fontSize: isMobile ? 28 : 42
    },
    subtitle: {
      ...styles.subtitle,
      fontSize: isMobile ? 14 : 16
    },
    topCards: {
      ...styles.topCards,
      gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr"
    },
    grid: {
      ...styles.grid,
      gridTemplateColumns: isMobile ? "1fr" : "1.45fr 0.9fr"
    },
    sidebar: {
      ...styles.sidebar,
      position: isMobile ? "static" : "sticky"
    },
    matchCard: {
      ...styles.matchCard,
      gridTemplateColumns: isMobile ? "1fr" : "1fr 70px 1fr 170px",
      padding: isMobile ? 12 : 14
    },
    vs: {
      ...styles.vs,
      fontSize: isMobile ? 18 : 22,
      padding: isMobile ? "2px 0" : 0
    },
    buttonGroup: {
      ...styles.buttonGroup,
      width: isMobile ? "100%" : "auto"
    },
    roundTitle: {
      ...styles.roundTitle,
      fontSize: isMobile ? 18 : 22
    },
    teamName: {
      ...styles.teamName,
      fontSize: isMobile ? 16 : 18
    },
    page: {
      ...styles.page,
      padding: isMobile ? 12 : 24
    }
  };

  return (
    <div style={mobileStyles.page}>
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.container}>
        <div style={mobileStyles.hero}>
          <div>
            <div style={styles.kicker}>SUPER LEAGUE PLAYOFFS</div>
            <h1 style={mobileStyles.title}>Predictor App</h1>
            <p style={mobileStyles.subtitle}>
              Διάλεξε για κάθε παιχνίδι μόνο αποτέλεσμα: νίκη γηπεδούχου, ισοπαλία ή νίκη φιλοξενούμενου.
              Η βαθμολογία ενημερώνεται αυτόματα και ζωντανά.
            </p>
          </div>

          <div style={styles.heroSide}>
            <div style={styles.statPill}>Συμπληρωμένα: <strong>{completedMatches}/12</strong></div>
            <button onClick={resetAll} style={styles.resetButton}>Καθαρισμός όλων</button>
          </div>
        </div>

        <div style={mobileStyles.topCards}>
          <div style={{ ...styles.leaderCard, boxShadow: `0 20px 45px ${leader.glow}` }}>
            <div style={styles.leaderLabel}>ΠΡΩΤΟΠΟΡΟΣ</div>
            <div style={styles.leaderRow}>
              <div style={{ ...styles.badgeCircle, background: leader.color, color: leader.accent }}>{leader.badge}</div>
              <div>
                <div style={styles.leaderName}>{leader.name}</div>
                <div style={styles.leaderPoints}>{leader.totalPoints} βαθμοί</div>
              </div>
            </div>
          </div>

          <div style={styles.infoCard}>
            <div style={styles.infoTitle}>Κανόνες</div>
            <div style={styles.infoText}>Νίκη = 3β • Ισοπαλία = 1β + 1β • Ήττα = 0β</div>
          </div>
        </div>

        <div style={mobileStyles.grid}>
          <div>
            {Object.entries(grouped).map(([round, data]) => (
              <div key={round} style={styles.roundCard}>
                <div style={styles.roundHeader}>
                  <div>
                    <div style={mobileStyles.roundTitle}>{round}</div>
                    <div style={styles.roundDate}>{data.date}</div>
                  </div>
                  <div style={styles.roundBadge}>{data.matches.length} ματς</div>
                </div>

                <div style={styles.matchesWrap}>
                  {data.matches.map((match) => {
                    const home = teamMap[match.home];
                    const away = teamMap[match.away];
                    const value = results[match.idx];

                    return (
                      <div key={match.idx} style={mobileStyles.matchCard}>
                        <div style={{ ...styles.teamBox, background: `linear-gradient(135deg, ${home.color}, ${shade(home.color, -18)})`, color: home.accent, boxShadow: `0 12px 24px ${home.glow}` }}>
                          <div style={styles.teamBadge}>{home.badge}</div>
                          <div>
                            <div style={mobileStyles.teamName}>{home.name}</div>
                            <div style={styles.teamTag}>Γηπεδούχος</div>
                          </div>
                        </div>

                        <div style={mobileStyles.vs}>VS</div>

                        <div style={{ ...styles.teamBox, background: `linear-gradient(135deg, ${away.color}, ${shade(away.color, -18)})`, color: away.accent, boxShadow: `0 12px 24px ${away.glow}` }}>
                          <div style={styles.teamBadge}>{away.badge}</div>
                          <div>
                            <div style={mobileStyles.teamName}>{away.name}</div>
                            <div style={styles.teamTag}>Φιλοξενούμενος</div>
                          </div>
                        </div>

                        <div style={mobileStyles.buttonGroup}>
                          <button
                            onClick={() => setQuickResult(match.idx, value === "H" ? "" : "H")}
                            style={{
                              ...styles.choiceButton,
                              ...(value === "H" ? { background: "#0f766e", color: "white", borderColor: "#0f766e" } : {})
                            }}
                          >
                            1
                          </button>
                          <button
                            onClick={() => setQuickResult(match.idx, value === "D" ? "" : "D")}
                            style={{
                              ...styles.choiceButton,
                              ...(value === "D" ? { background: "#2563eb", color: "white", borderColor: "#2563eb" } : {})
                            }}
                          >
                            Χ
                          </button>
                          <button
                            onClick={() => setQuickResult(match.idx, value === "A" ? "" : "A")}
                            style={{
                              ...styles.choiceButton,
                              ...(value === "A" ? { background: "#7c3aed", color: "white", borderColor: "#7c3aed" } : {})
                            }}
                          >
                            2
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={mobileStyles.sidebar}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <div style={styles.tableTitle}>Ζωντανή βαθμολογία</div>
                <div style={styles.liveDot}>LIVE</div>
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.thLeft}>#</th>
                      <th style={styles.thLeft}>Ομάδα</th>
                      <th style={styles.th}>Β</th>
                      <th style={styles.th}>Αγ</th>
                      <th style={styles.th}>Ν</th>
                      <th style={styles.th}>Ι</th>
                      <th style={styles.th}>Η</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr key={team.id} style={index === 0 ? styles.firstRow : styles.row}>
                        <td style={styles.tdRank}>{index + 1}</td>
                        <td style={styles.tdTeam}>
                          <span style={{ ...styles.miniBadge, background: team.color, color: team.accent }}>{team.badge}</span>
                          {team.name}
                        </td>
                        <td style={styles.tdBold}>{team.totalPoints}</td>
                        <td style={styles.td}>{team.played}</td>
                        <td style={styles.td}>{team.wins}</td>
                        <td style={styles.td}>{team.draws}</td>
                        <td style={styles.td}>{team.losses}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={styles.baseCard}>
              <div style={styles.baseTitle}>Αρχική βαθμολογία</div>
              {teams.map((team) => (
                <div key={team.id} style={styles.baseRow}>
                  <div style={styles.baseTeam}>
                    <span style={{ ...styles.miniBadge, background: team.color, color: team.accent }}>{team.badge}</span>
                    {team.name}
                  </div>
                  <strong>{team.points}</strong>
                </div>
              ))}
            </div>

            <div style={styles.legendCard}>
              <div style={styles.baseTitle}>Επιλογές</div>
              <div style={styles.legendRow}><span style={styles.legendKey}>1</span> Νίκη γηπεδούχου</div>
              <div style={styles.legendRow}><span style={styles.legendKey}>Χ</span> Ισοπαλία</div>
              <div style={styles.legendRow}><span style={styles.legendKey}>2</span> Νίκη φιλοξενούμενου</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function shade(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #07111f 0%, #0d1b2a 40%, #eef4ff 100%)",
    fontFamily: "Inter, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: 24,
    color: "#0f172a"
  },
  bgOrb1: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.28), transparent 70%)"
  },
  bgOrb2: {
    position: "absolute",
    bottom: 50,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(22,163,74,0.22), transparent 70%)"
  },
  container: {
    maxWidth: 1320,
    margin: "0 auto",
    position: "relative",
    zIndex: 2
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(14px)",
    borderRadius: 28,
    padding: 28,
    color: "white",
    marginBottom: 20,
    flexWrap: "wrap"
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 2,
    opacity: 0.8,
    marginBottom: 8
  },
  title: {
    fontSize: 42,
    margin: "0 0 8px 0",
    lineHeight: 1
  },
  subtitle: {
    maxWidth: 740,
    margin: 0,
    color: "rgba(255,255,255,0.86)",
    fontSize: 16,
    lineHeight: 1.5
  },
  heroSide: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap"
  },
  statPill: {
    background: "rgba(255,255,255,0.12)",
    color: "white",
    borderRadius: 18,
    padding: "12px 16px",
    border: "1px solid rgba(255,255,255,0.12)"
  },
  resetButton: {
    background: "linear-gradient(135deg, #f97316, #ea580c)",
    color: "white",
    border: "none",
    borderRadius: 18,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 14px 26px rgba(234,88,12,0.28)"
  },
  topCards: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 18,
    marginBottom: 20
  },
  leaderCard: {
    background: "linear-gradient(135deg, #ffffff, #ecf5ff)",
    borderRadius: 24,
    padding: 22,
    border: "1px solid rgba(148,163,184,0.18)"
  },
  leaderLabel: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: "#475569",
    marginBottom: 12,
    fontWeight: 800
  },
  leaderRow: {
    display: "flex",
    gap: 16,
    alignItems: "center"
  },
  badgeCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 700
  },
  leaderName: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 4
  },
  leaderPoints: {
    fontSize: 16,
    color: "#334155"
  },
  infoCard: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    borderRadius: 24,
    padding: 22,
    color: "white",
    boxShadow: "0 18px 35px rgba(15,23,42,0.35)"
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 10
  },
  infoText: {
    color: "rgba(255,255,255,0.82)",
    lineHeight: 1.6
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.45fr 0.9fr",
    gap: 20,
    alignItems: "start"
  },
  roundCard: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: 26,
    padding: 20,
    boxShadow: "0 20px 40px rgba(15,23,42,0.08)",
    marginBottom: 18,
    border: "1px solid rgba(226,232,240,0.85)"
  },
  roundHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    gap: 12
  },
  roundTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#0f172a"
  },
  roundDate: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4
  },
  roundBadge: {
    background: "#e0f2fe",
    color: "#075985",
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 700,
    fontSize: 13
  },
  matchesWrap: {
    display: "grid",
    gap: 14
  },
  matchCard: {
    display: "grid",
    gridTemplateColumns: "1fr 70px 1fr 170px",
    gap: 12,
    alignItems: "center",
    background: "#f8fbff",
    border: "1px solid #e2e8f0",
    borderRadius: 22,
    padding: 14
  },
  teamBox: {
    borderRadius: 18,
    padding: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
    minHeight: 78
  },
  teamBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0
  },
  teamName: {
    fontWeight: 800,
    fontSize: 18
  },
  teamTag: {
    fontSize: 12,
    opacity: 0.82,
    marginTop: 4
  },
  vs: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 22,
    color: "#64748b"
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8
  },
  choiceButton: {
    borderRadius: 14,
    border: "1px solid #cbd5e1",
    background: "white",
    padding: "14px 0",
    fontWeight: 900,
    fontSize: 20,
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  sidebar: {
    position: "sticky",
    top: 18,
    display: "grid",
    gap: 16
  },
  tableCard: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: 26,
    padding: 18,
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid rgba(226,232,240,0.9)"
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#0f172a"
  },
  liveDot: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12
  },
  tableWrap: {
    overflow: "hidden",
    borderRadius: 18,
    border: "1px solid #e2e8f0"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
    background: "white"
  },
  thLeft: {
    textAlign: "left",
    padding: 12,
    background: "#eff6ff",
    color: "#334155"
  },
  th: {
    textAlign: "center",
    padding: 12,
    background: "#eff6ff",
    color: "#334155"
  },
  row: {
    borderTop: "1px solid #e2e8f0"
  },
  firstRow: {
    borderTop: "1px solid #e2e8f0",
    background: "#fffbeb"
  },
  tdRank: {
    padding: 12,
    fontWeight: 800,
    textAlign: "left"
  },
  tdTeam: {
    padding: 12,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  tdBold: {
    padding: 12,
    textAlign: "center",
    fontWeight: 900,
    color: "#0f172a"
  },
  td: {
    padding: 12,
    textAlign: "center"
  },
  miniBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700
  },
  baseCard: {
    background: "rgba(255,255,255,0.95)",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
    border: "1px solid rgba(226,232,240,0.9)"
  },
  legendCard: {
    background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
    borderRadius: 22,
    padding: 18,
    boxShadow: "0 18px 40px rgba(15,23,42,0.06)",
    border: "1px solid rgba(226,232,240,0.9)"
  },
  baseTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 12,
    color: "#0f172a"
  },
  baseRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderTop: "1px solid #e2e8f0"
  },
  baseTeam: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700
  },
  legendRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 0",
    color: "#334155",
    fontWeight: 600
  },
  legendKey: {
    width: 28,
    height: 28,
    borderRadius: 10,
    background: "#0f172a",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900
  }
};
