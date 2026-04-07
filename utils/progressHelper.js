export const getProgressMessage = (progress) => {
    if (progress === 0) return "Course started";
    if (progress < 25) return "Getting started, keep going";
    if (progress === 25) return "Completed first milestone (25%)";
    if (progress < 50) return "Making steady progress";
    if (progress === 50) return "You are halfway through";
    if (progress < 75) return "Progressing well, stay consistent";
    if (progress === 75) return "Almost there, keep pushing";
    if (progress < 100) return "Final stretch, course almost complete";
    if (progress === 100) return "Course completed successfully";
};