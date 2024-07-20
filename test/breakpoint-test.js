import http from "k6/http";
import { check, sleep } from "k6";

let baseUrl = "http://10.147.20.2:3000";

export const options = {
  vus: 100, // number of virtual users
  duration: "5s" // test duration
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
