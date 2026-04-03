const generateRoleId = (type) => {
    const year = new Date().getFullYear();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let random = "";

    for (let i = 0; i < 5; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${type}-${year}-${random}`;
};

export default generateRoleId;