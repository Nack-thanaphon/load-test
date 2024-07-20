import http from "k6/http";
import { check, sleep } from "k6";

let baseUrl = "http://10.147.20.2:3000";

export const options = {
  stages: [
    { duration: "2m", target: 50 }, // ramp up to 50 users
    { duration: "3m", target: 50 }, // stay at 50 users for 3 minutes
    { duration: "2m", target: 0 } // ramp down to 0 users
  ]
};

export default function () {
  const url = baseUrl + "/sender/send";
  const payload = JSON.stringify({
    sender_code: "ccdc-center",
    message: {
      data: "file2",
      text: "file-transfer-success"
    }
  });

  const params = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const res = http.post(url, payload, params);

  check(res, {
    "status is 200": (r) => r.status === 200
  });

  sleep(1);
}
