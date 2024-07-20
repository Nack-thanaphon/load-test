import http from "k6/http";
import { check, sleep } from "k6";

let baseUrl = "http://10.147.20.2:3000";

export const options = {
  stages: [
    { duration: "2m", target: 10 }, // below normal load
    { duration: "30s", target: 100 }, // spike to 100 users
    { duration: "3m", target: 100 }, // stay at 100 users for 3 minutes
    { duration: "30s", target: 10 }, // ramp down to 10 users
    { duration: "2m", target: 10 } // recover to normal load
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
