
export function getWAECGrade(score: number): { grade: number; remarks: string } {
    if (score >= 80 && score <= 100) {
      return { grade: 1, remarks: "Excellent" };
    } else if (score >= 70 && score <= 79) {
      return { grade: 2, remarks: "Very good" };
    } else if (score >= 65 && score <= 69) {
      return { grade: 3, remarks: "Good" };
    } else if (score >= 60 && score <= 64) {
      return { grade: 4, remarks: "Credit" };
    } else if (score >= 55 && score <= 59) {
      return { grade: 5, remarks: "Credit" };
    } else if (score >= 50 && score <= 54) {
      return { grade: 6, remarks: "Credit" };
    } else if (score >= 45 && score <= 49) {
      return { grade: 7, remarks: "Pass" };
    } else if (score >= 40 && score <= 44) {
      return { grade: 8, remarks: "Pass" };
    } else if (score <= 39) {
      return { grade: 9, remarks: "Fail" };
    } else {
      throw new Error("Invalid score. Please enter a score between 0 and 100.");
    }
  }