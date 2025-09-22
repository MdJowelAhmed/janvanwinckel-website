export const convertBackendToExistingFormat = (backendResponse) => {
  if (!backendResponse?.data) {
    return { 
      nodes: [], 
      edges: [] 
    };
  }

  const subject = backendResponse.data;
  const nodes = [];
  const edges = [];

  // Helper function to format results
  const formatResults = (results) => {
    if (!Array.isArray(results) || results.length === 0) {
      return "No achievements recorded";
    }
    // Take the first result and format it
    const firstResult = results[0];
    return `${firstResult.name || ''}: ${firstResult.place || ''} (${firstResult.date ? new Date(firstResult.date).getFullYear() : ''})`;
  };

  nodes.push({
    id: "subject",
    type: "pigeonNode",
    position: { x: 100, y: 500 }, 
    data: {
      name: subject.name || "Unknown",
      ringNumber: subject.ringNumber || "Unknown",
      owner: typeof subject.breeder === 'object' ? (subject.breeder?.breederName || "Unknown Owner") : (subject.breeder || "Unknown Owner"),
      country: subject.country || "Unknown",
      gender: typeof subject.gender === 'string' ? subject.gender.toLowerCase() : "male",
      generation: 0,
      position: "Subject",
      birthYear: subject.birthYear?.toString() || "Unknown",
      color: "#FFFFE0",
      colorName: subject.color || "Unknown",
      description: subject.notes || subject.shortInfo || "No description available",
      achievements: formatResults(subject.results),
    },
  });

  if (subject.fatherRingId) {
    nodes.push({
      id: "father_1",
      type: "pigeonNode", 
      position: { x: 450, y: 0 },
      data: {
        name: subject.fatherRingId.name || "Unknown Father",
        ringNumber: subject.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.breeder === 'object' ? 
          (subject.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 1,
        position: "Father",
        birthYear: subject.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#ADD8E6", 
        colorName: subject.fatherRingId.color || "Unknown",
        description: subject.fatherRingId.notes || subject.fatherRingId.shortInfo || "No description available",
        achievements: formatResults(subject.fatherRingId.results),
      },
    });

    // Subject to Father edge
    edges.push({
      id: "subject-father_1",
      source: "subject",
      target: "father_1", 
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 3 },
      animated: true,
    });
  }

  if (subject.motherRingId) {
    nodes.push({
      id: "mother_1",
      type: "pigeonNode",
      position: { x: 450, y: window.screen?.height - 30 || 1000 },
      data: {
        name: subject.motherRingId.name || "Unknown Mother", 
        ringNumber: subject.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.breeder === 'object' ? 
          (subject.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.country || "Unknown",
        gender: "female",
        generation: 1,
        position: "Mother",
        birthYear: subject.motherRingId.birthYear?.toString() || "Unknown",
        color: "#fff", 
        colorName: subject.motherRingId.color || "Unknown", 
        description: subject.motherRingId.notes || subject.motherRingId.shortInfo || "No description available",
        achievements: formatResults(subject.motherRingId.results),
      },
    });

    edges.push({
      id: "subject-mother_1", 
      source: "subject",
      target: "mother_1",
      type: "smoothstep", 
      style: { stroke: "#ec4899", strokeWidth: 3 },
      animated: true,
    });
  }

  // Generation 2 - Grandparents
  if (subject.fatherRingId?.fatherRingId) {
    nodes.push({
      id: "father_2_1",
      type: "pigeonNode",
      position: { x: 800, y: 0 }, 
      data: {
        name: subject.fatherRingId.fatherRingId.name || "Unknown GF (FP)",
        ringNumber: subject.fatherRingId.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.fatherRingId.breeder === 'object' ? 
          (subject.fatherRingId.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.fatherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 2,
        position: "Grandfather (FP)",
        birthYear: subject.fatherRingId.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.fatherRingId.fatherRingId.color || "Blue",
        description: subject.fatherRingId.fatherRingId.notes || subject.fatherRingId.fatherRingId.shortInfo || "Top racing cock.",
        achievements: formatResults(subject.fatherRingId.fatherRingId.results) || "Multiple race winner",
      },
    });

    // Father to Grandfather edge
    edges.push({
      id: "father_1-father_2_1",
      source: "father_1", 
      target: "father_2_1",
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 2.5 },
    });
  }

  if (subject.fatherRingId?.motherRingId) {
    nodes.push({
      id: "mother_2_1", 
      type: "pigeonNode",
      position: { x: 800, y: 420 },
      data: {
        name: subject.fatherRingId.motherRingId.name || "Unknown GM (FP)",
        ringNumber: subject.fatherRingId.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.motherRingId.breeder === 'object' ? 
          (subject.fatherRingId.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.motherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.motherRingId.country || "Unknown",
        gender: "female",
        generation: 2,
        position: "Grandmother (FP)",
        birthYear: subject.fatherRingId.motherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.fatherRingId.motherRingId.color || "Sky Blue",
        description: subject.fatherRingId.motherRingId.notes || subject.fatherRingId.motherRingId.shortInfo || "Excellent breeding hen.",
        achievements: formatResults(subject.fatherRingId.motherRingId.results) || "Top producer",
      },
    });

    // Father to Grandmother edge
    edges.push({
      id: "father_1-mother_2_1",
      source: "father_1",
      target: "mother_2_1", 
      type: "smoothstep",
      style: { stroke: "#ec4899", strokeWidth: 2.5 },
    });
  }

  if (subject.motherRingId?.fatherRingId) {
    nodes.push({
      id: "father_2_2",
      type: "pigeonNode", 
      position: { x: 800, y: 920 },
      data: {
        name: subject.motherRingId.fatherRingId.name || "Unknown GF (MP)",
        ringNumber: subject.motherRingId.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.fatherRingId.breeder === 'object' ? 
          (subject.motherRingId.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.fatherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 2,
        position: "Grandfather (MP)",
        birthYear: subject.motherRingId.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.motherRingId.fatherRingId.color || "Royal Blue",
        description: subject.motherRingId.fatherRingId.notes || subject.motherRingId.fatherRingId.shortInfo || "Champion racer.",
        achievements: formatResults(subject.motherRingId.fatherRingId.results) || "National ace",
      },
    });

    // Mother to Grandfather edge
    edges.push({
      id: "mother_1-father_2_2",
      source: "mother_1",
      target: "father_2_2",
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 2.5 },
    });
  }

  if (subject.motherRingId?.motherRingId) {
    nodes.push({
      id: "mother_2_2",
      type: "pigeonNode",
      position: { x: 800, y: 1350 },
      data: {
        name: subject.motherRingId.motherRingId.name || "Unknown GM (MP)",
        ringNumber: subject.motherRingId.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.motherRingId.breeder === 'object' ? 
          (subject.motherRingId.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.motherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.motherRingId.country || "Unknown",
        gender: "female",
        generation: 2,
        position: "Grandmother (MP)",
        birthYear: subject.motherRingId.motherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.motherRingId.motherRingId.color || "Powder Blue",
        description: subject.motherRingId.motherRingId.notes || subject.motherRingId.motherRingId.shortInfo || "Foundation hen.",
        achievements: formatResults(subject.motherRingId.motherRingId.results) || "Mother of champions",
      },
    });

    // Mother to Grandmother edge
    edges.push({
      id: "mother_1-mother_2_2",
      source: "mother_1", 
      target: "mother_2_2",
      type: "smoothstep",
      style: { stroke: "#ec4899", strokeWidth: 2.5 },
    });
  }

  // Generation 3 - Great-grandparents 
  // Father side of father_2_1
  if (subject.fatherRingId?.fatherRingId?.fatherRingId) {
    nodes.push({
      id: "father_3_1",
      type: "pigeonNode",
      position: { x: 1150, y: 0 },
      data: {
        name: subject.fatherRingId.fatherRingId.fatherRingId.name || "Blue Prince",
        ringNumber: subject.fatherRingId.fatherRingId.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.fatherRingId.fatherRingId.breeder === 'object' ? 
          (subject.fatherRingId.fatherRingId.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.fatherRingId.fatherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.fatherRingId.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 3,
        position: "Great-GF (FP)",
        birthYear: subject.fatherRingId.fatherRingId.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#90EE90",
        colorName: subject.fatherRingId.fatherRingId.fatherRingId.color || "Dark Blue",
        description: subject.fatherRingId.fatherRingId.fatherRingId.notes || subject.fatherRingId.fatherRingId.fatherRingId.shortInfo || "Legendary racer.",
        achievements: formatResults(subject.fatherRingId.fatherRingId.fatherRingId.results) || "Olympic champion",
      },
    });

    edges.push({
      id: "father_2_1-father_3_1",
      source: "father_2_1",
      target: "father_3_1",
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    });
  }

  if (subject.fatherRingId?.fatherRingId?.motherRingId) {
    nodes.push({
      id: "mother_3_1",
      type: "pigeonNode",
      position: { x: 1150, y: 210 },
      data: {
        name: subject.fatherRingId.fatherRingId.motherRingId.name || "Sapphire Queen",
        ringNumber: subject.fatherRingId.fatherRingId.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.fatherRingId.motherRingId.breeder === 'object' ? 
          (subject.fatherRingId.fatherRingId.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.fatherRingId.motherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.fatherRingId.motherRingId.country || "Unknown",
        gender: "female",
        generation: 3,
        position: "Great-GM (FP)",
        birthYear: subject.fatherRingId.fatherRingId.motherRingId.birthYear?.toString() || "Unknown",
        color: "#FFFFE0",
        colorName: subject.fatherRingId.fatherRingId.motherRingId.color || "Dodger Blue",
        description: subject.fatherRingId.fatherRingId.motherRingId.notes || subject.fatherRingId.fatherRingId.motherRingId.shortInfo || "Exceptional breeding hen.",
        achievements: formatResults(subject.fatherRingId.fatherRingId.motherRingId.results) || "Mother of winners",
      },
    });

    edges.push({
      id: "father_2_1-mother_3_1",
      source: "father_2_1",
      target: "mother_3_1",
      type: "smoothstep",
      style: { stroke: "#ec4899", strokeWidth: 2 },
    });
  }

  // Mother side of father_2_1
  if (subject.fatherRingId?.motherRingId?.fatherRingId) {
    nodes.push({
      id: "father_3_2",
      type: "pigeonNode",
      position: { x: 1150, y: 420 },
      data: {
        name: subject.fatherRingId.motherRingId.fatherRingId.name || "Silver Storm",
        ringNumber: subject.fatherRingId.motherRingId.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.motherRingId.fatherRingId.breeder === 'object' ? 
          (subject.fatherRingId.motherRingId.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.motherRingId.fatherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.motherRingId.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 3,
        position: "Great-GF (PM)",
        birthYear: subject.fatherRingId.motherRingId.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.fatherRingId.motherRingId.fatherRingId.color || "Silver",
        description: subject.fatherRingId.motherRingId.fatherRingId.notes || subject.fatherRingId.motherRingId.fatherRingId.shortInfo || "Strong breeding cock.",
        achievements: formatResults(subject.fatherRingId.motherRingId.fatherRingId.results) || "Proven breeder",
      },
    });

    edges.push({
      id: "mother_2_1-father_3_2",
      source: "mother_2_1",
      target: "father_3_2",
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    });
  }

  if (subject.fatherRingId?.motherRingId?.motherRingId) {
    nodes.push({
      id: "mother_3_2",
      type: "pigeonNode",
      position: { x: 1150, y: 630 },
      data: {
        name: subject.fatherRingId.motherRingId.motherRingId.name || "Pearl Beauty",
        ringNumber: subject.fatherRingId.motherRingId.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.fatherRingId.motherRingId.motherRingId.breeder === 'object' ? 
          (subject.fatherRingId.motherRingId.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.fatherRingId.motherRingId.motherRingId.breeder || "Unknown Owner"),
        country: subject.fatherRingId.motherRingId.motherRingId.country || "Unknown",
        gender: "female",
        generation: 3,
        position: "Great-GM (PM)",
        birthYear: subject.fatherRingId.motherRingId.motherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.fatherRingId.motherRingId.motherRingId.color || "White",
        description: subject.fatherRingId.motherRingId.motherRingId.notes || subject.fatherRingId.motherRingId.motherRingId.shortInfo || "Beautiful white hen with excellent qualities.",
        achievements: formatResults(subject.fatherRingId.motherRingId.motherRingId.results) || "Show winner",
      },
    });

    edges.push({
      id: "mother_2_1-mother_3_2",
      source: "mother_2_1",
      target: "mother_3_2",
      type: "smoothstep",
      style: { stroke: "#ec4899", strokeWidth: 2 },
    });
  }

  // Father side of father_2_2
  if (subject.motherRingId?.fatherRingId?.fatherRingId) {
    nodes.push({
      id: "father_3_3",
      type: "pigeonNode",
      position: { x: 1150, y: 840 },
      data: {
        name: subject.motherRingId.fatherRingId.fatherRingId.name || "Golden Eagle",
        ringNumber: subject.motherRingId.fatherRingId.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.fatherRingId.fatherRingId.breeder === 'object' ? 
          (subject.motherRingId.fatherRingId.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.fatherRingId.fatherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.fatherRingId.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 3,
        position: "Great-GF (MP)",
        birthYear: subject.motherRingId.fatherRingId.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.motherRingId.fatherRingId.fatherRingId.color || "Golden",
        description: subject.motherRingId.fatherRingId.fatherRingId.notes || subject.motherRingId.fatherRingId.fatherRingId.shortInfo || "Outstanding racing cock.",
        achievements: formatResults(subject.motherRingId.fatherRingId.fatherRingId.results) || "Multi-race winner",
      },
    });

    edges.push({
      id: "father_2_2-father_3_3",
      source: "father_2_2",
      target: "father_3_3",
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    });
  }

  if (subject.motherRingId?.fatherRingId?.motherRingId) {
    nodes.push({
      id: "mother_3_3",
      type: "pigeonNode",
      position: { x: 1150, y: 1050 },
      data: {
        name: subject.motherRingId.fatherRingId.motherRingId.name || "Amber Star",
        ringNumber: subject.motherRingId.fatherRingId.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.fatherRingId.motherRingId.breeder === 'object' ? 
          (subject.motherRingId.fatherRingId.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.fatherRingId.motherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.fatherRingId.motherRingId.country || "Unknown",
        gender: "female",
        generation: 3,
        position: "Great-GM (MP)",
        birthYear: subject.motherRingId.fatherRingId.motherRingId.birthYear?.toString() || "Unknown",
        color: "#fff",
        colorName: subject.motherRingId.fatherRingId.motherRingId.color || "Amber",
        description: subject.motherRingId.fatherRingId.motherRingId.notes || subject.motherRingId.fatherRingId.motherRingId.shortInfo || "Exceptional breeding hen.",
        achievements: formatResults(subject.motherRingId.fatherRingId.motherRingId.results) || "Mother of winners",
      },
    });

    edges.push({
      id: "father_2_2-mother_3_3",
      source: "father_2_2",
      target: "mother_3_3",
      type: "smoothstep",
      style: { stroke: "#ec4899", strokeWidth: 2 },
    });
  }

  // Father side of mother_2_2
  if (subject.motherRingId?.motherRingId?.fatherRingId) {
    nodes.push({
      id: "father_3_4",
      type: "pigeonNode",
      position: { x: 1150, y: 1260 },
      data: {
        name: subject.motherRingId.motherRingId.fatherRingId.name || "Ruby King",
        ringNumber: subject.motherRingId.motherRingId.fatherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.motherRingId.fatherRingId.breeder === 'object' ? 
          (subject.motherRingId.motherRingId.fatherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.motherRingId.fatherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.motherRingId.fatherRingId.country || "Unknown",
        gender: "male",
        generation: 3,
        position: "Great-GF (MM)",
        birthYear: subject.motherRingId.motherRingId.fatherRingId.birthYear?.toString() || "Unknown",
        color: "#90EE90",
        colorName: subject.motherRingId.motherRingId.fatherRingId.color || "Dark Red",
        description: subject.motherRingId.motherRingId.fatherRingId.notes || subject.motherRingId.motherRingId.fatherRingId.shortInfo || "Strong red cock with racing ability.",
        achievements: formatResults(subject.motherRingId.motherRingId.fatherRingId.results) || "Regional winner",
      },
    });

    edges.push({
      id: "mother_2_2-father_3_4",
      source: "mother_2_2",
      target: "father_3_4",
      type: "smoothstep",
      style: { stroke: "#3b82f6", strokeWidth: 2 },
    });
  }

  if (subject.motherRingId?.motherRingId?.motherRingId) {
    nodes.push({
      id: "mother_3_4",
      type: "pigeonNode",
      position: { x: 1150, y: 1550 },
      data: {
        name: subject.motherRingId.motherRingId.motherRingId.name || "Crimson Rose",
        ringNumber: subject.motherRingId.motherRingId.motherRingId.ringNumber || "Unknown",
        owner: typeof subject.motherRingId.motherRingId.motherRingId.breeder === 'object' ? 
          (subject.motherRingId.motherRingId.motherRingId.breeder.breederName || "Unknown Owner") : 
          (subject.motherRingId.motherRingId.motherRingId.breeder || "Unknown Owner"),
        country: subject.motherRingId.motherRingId.motherRingId.country || "Unknown",
        gender: "female",
        generation: 3,
        position: "Great-GM (MM)",
        birthYear: subject.motherRingId.motherRingId.motherRingId.birthYear?.toString() || "Unknown",
        color: "#FFFFE0",
        colorName: subject.motherRingId.motherRingId.motherRingId.color || "Rose",
        description: subject.motherRingId.motherRingId.motherRingId.notes || subject.motherRingId.motherRingId.motherRingId.shortInfo || "Beautiful rose colored hen.",
        achievements: formatResults(subject.motherRingId.motherRingId.motherRingId.results) || "Quality breeder",
      },
    });

    edges.push({
      id: "mother_2_2-mother_3_4",
      source: "mother_2_2",
      target: "mother_3_4",
      type: "smoothstep",
      style: { stroke: "#ec4899", strokeWidth: 2 },
    });
  }

  // Generation 4 - Great-great-grandparents (16 possible positions)
  // Helper function to add generation 4 nodes
  const addGen4Node = (parentPath, nodeId, position, defaultName, defaultColor = "#90EE90") => {
    if (parentPath && parentPath.fatherRingId) {
      nodes.push({
        id: `${nodeId}_father`,
        type: "pigeonNode",
        position: position.father,
        data: {
          name: parentPath.fatherRingId.name || `${defaultName} Father`,
          ringNumber: parentPath.fatherRingId.ringNumber || "Unknown",
          owner: typeof parentPath.fatherRingId.breeder === 'object' ? 
            (parentPath.fatherRingId.breeder.breederName || "Unknown Owner") : 
            (parentPath.fatherRingId.breeder || "Unknown Owner"),
          country: parentPath.fatherRingId.country || "Unknown",
          gender: "male",
          generation: 4,
          position: `GG-GF (${nodeId})`,
          birthYear: parentPath.fatherRingId.birthYear?.toString() || "Unknown",
          color: defaultColor,
          colorName: parentPath.fatherRingId.color || "Unknown",
          description: parentPath.fatherRingId.notes || parentPath.fatherRingId.shortInfo || "Foundation bloodline patriarch.",
          achievements: formatResults(parentPath.fatherRingId.results) || "Ancestral sire",
        },
      });

      edges.push({
        id: `${nodeId}-${nodeId}_father`,
        source: nodeId,
        target: `${nodeId}_father`,
        type: "smoothstep",
        style: { stroke: "#3b82f6", strokeWidth: 1.5 },
      });
    }

    if (parentPath && parentPath.motherRingId) {
      nodes.push({
        id: `${nodeId}_mother`,
        type: "pigeonNode",
        position: position.mother,
        data: {
          name: parentPath.motherRingId.name || `${defaultName} Mother`,
          ringNumber: parentPath.motherRingId.ringNumber || "Unknown",
          owner: typeof parentPath.motherRingId.breeder === 'object' ? 
            (parentPath.motherRingId.breeder.breederName || "Unknown Owner") : 
            (parentPath.motherRingId.breeder || "Unknown Owner"),
          country: parentPath.motherRingId.country || "Unknown",
          gender: "female",
          generation: 4,
          position: `GG-GM (${nodeId})`,
          birthYear: parentPath.motherRingId.birthYear?.toString() || "Unknown",
          color: defaultColor === "#90EE90" ? "#FFFFE0" : defaultColor,
          colorName: parentPath.motherRingId.color || "Unknown",
          description: parentPath.motherRingId.notes || parentPath.motherRingId.shortInfo || "Foundation bloodline matriarch.",
          achievements: formatResults(parentPath.motherRingId.results) || "Ancestral dam",
        },
      });

      edges.push({
        id: `${nodeId}-${nodeId}_mother`,
        source: nodeId,
        target: `${nodeId}_mother`,
        type: "smoothstep",
        style: { stroke: "#ec4899", strokeWidth: 1.5 },
      });
    }
  }

   // Add Generation 4 nodes for all existing Generation 3 nodes
  addGen4Node(subject.fatherRingId?.fatherRingId?.fatherRingId, "father_3_1", 
    { father: { x: 1500, y: 0 }, mother: { x: 1500, y: 110 } }, "Ancient", "#90EE90");
  
  addGen4Node(subject.fatherRingId?.fatherRingId?.motherRingId, "mother_3_1", 
    { father: { x: 1500, y: 220 }, mother: { x: 1500, y: 330 } }, "Storm", "#FFFFE0");
  
  addGen4Node(subject.fatherRingId?.motherRingId?.fatherRingId, "father_3_2", 
    { father: { x: 1500, y: 440 }, mother: { x: 1500, y: 550 } }, "Silver", "bg-gray-700");
  
  addGen4Node(subject.fatherRingId?.motherRingId?.motherRingId, "mother_3_2", 
    { father: { x: 1500, y: 660 }, mother: { x: 1500, y: 770 } }, "Purple", "bg-purple-700");
  
  addGen4Node(subject.motherRingId?.fatherRingId?.fatherRingId, "father_3_3", 
    { father: { x: 1500, y: 880 }, mother: { x: 1500, y: 990 } }, "Golden", "bg-yellow-800");
  
  addGen4Node(subject.motherRingId?.fatherRingId?.motherRingId, "mother_3_3", 
    { father: { x: 1500, y: 1100 }, mother: { x: 1500, y: 1210 } }, "Ruby", "bg-red-800");
  
  addGen4Node(subject.motherRingId?.motherRingId?.fatherRingId, "father_3_4", 
    { father: { x: 1500, y: 1320 }, mother: { x: 1500, y: 1430 } }, "Crimson", "#90EE90");
  
  addGen4Node(subject.motherRingId?.motherRingId?.motherRingId, "mother_3_4", 
    { father: { x: 1500, y: 1540 }, mother: { x: 1500, y: 1650 } }, "Scarlet", "#FFFFE0");

  return { nodes, edges };
};