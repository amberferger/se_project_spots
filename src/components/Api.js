import { apiKey } from "../utils/constants";

class Api {
  constructor() {}

  getInitialCards() {
    return fetch("https://around-api.en.tripleten-services.com/v1", {
      headers: {
        authorization: apiKey,
      },
    }).then((res) => {
      if (res.ok) {
        // if suggessful, return response
        return res.json();
      }
      // if error, return error status
      return Promise.reject(`Error: ${res.status}`);
    });
  }
}

export { Api };
