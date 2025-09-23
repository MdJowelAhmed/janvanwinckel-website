// utils/getNodePosition.js
const GEN_X_OFFSET = 400; 
const GEN_Y_GAP = 250;    

export function getNodePosition(generation, role) {
  const baseX = 100;  
  const baseY = 500;  

  if (generation === 0) {
    return { x: baseX, y: baseY };
  }

  if (generation === 1) {
    if (role === "Father") {
      return { x: baseX, y: baseY - GEN_Y_GAP };
    }
    if (role === "Mother") {
      return { x: baseX, y: baseY + GEN_Y_GAP };
    }
  }

  const x = baseX + generation * GEN_X_OFFSET;

  if (role.includes("Father")) {
    return { x, y: baseY - GEN_Y_GAP * generation };
  }
  if (role.includes("Mother")) {
    return { x, y: baseY + GEN_Y_GAP * generation };
  }

  return { x, y: baseY };
}
