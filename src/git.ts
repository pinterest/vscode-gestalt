import execa from "execa";
import log from "./log";

const unknown = "_unknown@pinterest.com";

/**
 * Get the git email of the current user
 */
const userEmail = async (): Promise<string> => {
  try {
    const result = await execa.command("git config user.email");

    return result?.stdout ?? unknown;
  } catch (e) {
    console.error(e);
    log.append(`Git userEmail Error: ${e.message}`);
    return unknown;
  }
};

export default {
  userEmail,
};
