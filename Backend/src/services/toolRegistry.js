import { searchInternetTool } from "../tools/knowlegde/search.tool.js";
import { extractWebTool } from "../tools/knowlegde/extract.tool.js";
import { githubSearchTool } from "../tools/developer/github.tool.js";
import { npmTool } from "../tools/developer/npm.tool.js";
import { stacktool } from "../tools/developer/stackoverflow.tool.js";

export const tools = [
    searchInternetTool,
    extractWebTool,
    githubSearchTool,
    npmTool,
    stacktool
];
