const generateTfId = () => {
    const year = new Date().getFullYear();

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomPart = "";

    for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `TF-${year}-${randomPart}`;
};

export default generateTfId;