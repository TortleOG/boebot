/* eslint-disable class-methods-use-this */

const snekfetch = require("snekfetch");

const validSections = [
  "home", "opinion", "world", "national", "politics", "upshot", "nyregion", "business", "technology", "science",
  "health", "sports", "arts", "books", "movies", "theater", "sundayreview", "fashion", "tmagazine", "food",
  "travel", "magazine", "realestate", "automobiles", "obituaries", "insider", "all",
];


class NYTimes {
  /**
   * A wrapper for the NYTimes API
   * @param {string} API_KEY The NYTimes API key.
   */
  constructor(API_KEY) {
    this.API_KEY = API_KEY;
    this.baseURL = "https://api.nytimes.com/svc";
    this.validSections = validSections;
  }

  /**
   * Uses snekfetch to make the request.
   * @param {string} url The partial URL for the request.
   * @param {string[]} params The parameters for the request.
   * @return {Promise<APIData>} The requested JSON object.
   */
  async request(url, params = []) {
    params = this.validateParam(params);
    const res = await snekfetch.get(`${url}.json?api-key=${this.API_KEY}&${params.join("&")}`);
    return res.body;
  }

  /**
   * Gets Top Stories from NYTimes.
   * @param {string} section The section of NYTimes.
   * @return {Promise<APIData>} The requested JSON object.
   */
  async getTopStories(section = "home") {
    if (!validSections.includes(section)) throw "Invalid section found.";
    const newURL = `${this.baseURL}/topstories/v2/${section}`;
    const res = await this.request(newURL).catch((err) => { throw err.body ? err.body.message : err; });
    return res;
  }

  /**
   * Gets articles from NYTimes Newswire
   * @param {string} source The source, either NYT International, NYT, or all.
   * @param {string} section The section of NYTimes.
   * @param {number} limit The limit of the results, from 1 - 20.
   * @return {Promise<APIData>} The requested JSON object.
   */
  async getNewswire(source = "all", section = "all", limit = 10) {
    if (!validSections.includes(section)) throw "Invalid section found.";
    const newURL = `${this.baseURL}/news/v3/content/${source}/${section}`;
    const res = await this.request(newURL, [`limit=${limit}`]).catch((err) => { throw err.body ? err.body.message : err; });
    return res;
  }

  /**
   * Gets movie reviews from NYTimes
   * @param {string} query The search query
   * @return {Promise<APIData>}
   */
  async getMovieReview(query) {
    const newURL = `${this.baseURL}/movies/v2/reviews/search`;
    const res = await this.request(newURL, [`query=${query}`]).catch((err) => { throw err.body ? err.body.message : err; });
    return res;
  }

  /**
   * Validates request parameters
   * @param {string[]} params The parameters for the request.
   * @return {string} The validated parameters
   */
  validateParam(params) {
    const param = {
      validated: [],
      current: "",
      equals: 0,
      end: 0,
    };

    params = params.join("&").split("");
    params.forEach((e, i) => {
      if (!param.equals && i === params.length - 1) throw "There must be a '=' sign in parameters.";
      if (!param.equals && e === " ") throw "There cannot be spaces in parmeters.";
      if (e === " ") {
        param.current += "%20";
        return;
      }
      if (e === "=") param.equals++;
      if (e === "&") param.end++;
      if (param.end) {
        param.validated.push(param.current);
        param.current = "";
        param.end--;
        param.equals--;
      }
      param.current += e;
    });
    if (param.current && !param.end) param.validated.push(param.current);
    return param.validated;
  }
}

module.exports = NYTimes;
