import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

let errorRate = new Rate("errors");

let baseUrl = "http://192.168.100.52:30030";
// let baseUrl = "http://localhost:50409";

export const options = {
  vus: 5000,
    stages: [
      { duration: "1s", target: 50 },
      { duration: "4s", target: 1000 },
      { duration: "1m", target: 700 },
      { duration: "50s", target: 3000 },
      { duration: "10s", target: 100 }
    ],
    thresholds: {
      errors: ["rate<0.05"], // Error rate should be less than 5%
      http_req_duration: ["p(95)<150"] // 95% of requests should be below 150ms
    }
};

export default function () {
  const url = baseUrl + "/sender/services/post-passport";
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
    "status is 201": (r) => r.status === 201
  });

  sleep(1);
}
