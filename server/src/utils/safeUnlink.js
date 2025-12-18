import fs from "fs/promises";


export const safeUnlink = async (filePath, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await fs.unlink(filePath);
      return;
    } catch (err) {
      if (err.code === "EBUSY" || err.code === "EPERM") {
        await new Promise((res) => setTimeout(res, 200));
      } else {
        throw err;
      }
    }
  }
};
