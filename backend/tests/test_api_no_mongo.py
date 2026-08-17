import json
import sys
import threading
import time
import unittest
import urllib.error
import urllib.request
from pathlib import Path

import uvicorn

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

BASE_URL = "http://127.0.0.1:8060"


def request_json(path, data=None, headers=None, method=None):
    body = data.encode("utf-8") if isinstance(data, str) else data

    request = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=body,
        headers=headers or {},
        method=method,
    )

    with urllib.request.urlopen(request, timeout=10) as response:
        return response.status, json.loads(
            response.read().decode("utf-8")
        )


def request_json_error(path, data=None, headers=None, method=None):
    try:
        request_json(path, data, headers, method)
    except urllib.error.HTTPError as exc:
        return exc.code, json.loads(
            exc.read().decode("utf-8")
        )

    raise AssertionError("Expected HTTPError")


def multipart_body(filename, content_type, content):
    boundary = "codex-test-boundary"

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; '
        f'filename="{filename}"\r\n'
        f"Content-Type: {content_type}\r\n\r\n"
    ).encode("utf-8")

    body += content
    body += f"\r\n--{boundary}--\r\n".encode("utf-8")

    return body, {
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    }


class ApiNoMongoTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        config = uvicorn.Config(
            "app.main:app",
            host="127.0.0.1",
            port=8060,
            log_level="warning",
        )

        cls.server = uvicorn.Server(config)

        cls.thread = threading.Thread(
            target=cls.server.run,
            daemon=True,
        )

        cls.thread.start()

        for _ in range(30):
            try:
                request_json("/")
                break
            except Exception:
                time.sleep(0.25)
        else:
            raise RuntimeError("Server did not become ready.")

    @classmethod
    def tearDownClass(cls):
        cls.server.should_exit = True
        cls.thread.join(timeout=5)

    def test_root(self):
        status, payload = request_json("/")

        self.assertEqual(status, 200)
        self.assertEqual(
            payload["message"],
            "Hair Health AI Backend is running",
        )

    @unittest.skip(
        "No-MongoDB test is not applicable while MongoDB Atlas is configured."
    )
    def test_health_reports_database_not_configured(self):
        pass

    @unittest.skip(
        "No-MongoDB test is not applicable while MongoDB Atlas is configured."
    )
    def test_post_assessment_without_mongodb(self):
        pass

    def test_invalid_assessment_request(self):
        status, _ = request_json_error(
            "/api/assessment/",
            json.dumps({"age": 0}),
            {"Content-Type": "application/json"},
        )

        self.assertEqual(status, 422)

    @unittest.skip(
        "No-MongoDB test is not applicable while MongoDB Atlas is configured."
    )
    def test_history_without_mongodb(self):
        pass

    def test_get_invalid_assessment_id(self):
        status, _ = request_json_error(
            "/api/assessment/not-a-valid-id"
        )

        self.assertEqual(status, 400)

    def test_delete_invalid_assessment_id(self):
        status, _ = request_json_error(
            "/api/assessment/not-a-valid-id",
            method="DELETE",
        )

        self.assertEqual(status, 400)

    @unittest.skip(
        "No-MongoDB test is not applicable while MongoDB Atlas is configured."
    )
    def test_delete_without_mongodb(self):
        pass

    def test_upload_image_standalone(self):
        body, headers = multipart_body(
            "sample.png",
            "image/png",
            b"\x89PNG\r\n\x1a\n",
        )

        status, payload = request_json(
            "/api/assessment/upload-image",
            body,
            headers,
        )

        self.assertEqual(status, 200)
        self.assertEqual(
            payload["content_type"],
            "image/png",
        )
        self.assertTrue(
            payload["path"].startswith("uploads/")
        )

        stored_path = (
            Path(__file__).resolve().parents[1]
            / payload["path"]
        )

        self.assertTrue(stored_path.exists())
        stored_path.unlink(missing_ok=True)

    def test_upload_rejects_unsupported_image_type(self):
        body, headers = multipart_body(
            "sample.txt",
            "text/plain",
            b"not an image",
        )

        status, _ = request_json_error(
            "/api/assessment/upload-image",
            body,
            headers,
        )

        self.assertEqual(status, 400)

    def test_upload_rejects_oversized_image(self):
        body, headers = multipart_body(
            "large.jpg",
            "image/jpeg",
            b"x" * (5 * 1024 * 1024 + 1),
        )

        status, _ = request_json_error(
            "/api/assessment/upload-image",
            body,
            headers,
        )

        self.assertEqual(status, 400)

    def test_upload_association_invalid_id(self):
        body, headers = multipart_body(
            "sample.jpg",
            "image/jpeg",
            b"\xff\xd8\xff\xd9",
        )

        status, _ = request_json_error(
            "/api/assessment/upload-image"
            "?assessment_id=not-a-valid-id",
            body,
            headers,
        )

        self.assertEqual(status, 400)

    def test_openapi_contains_required_endpoints(self):
        status, payload = request_json("/openapi.json")

        self.assertEqual(status, 200)

        paths = payload["paths"]

        self.assertIn("/", paths)
        self.assertIn("/health", paths)
        self.assertIn("/api/assessment/", paths)
        self.assertIn("/api/assessment/upload-image", paths)
        self.assertIn("/api/assessment/history", paths)
        self.assertIn("/api/assessment/{record_id}", paths)
        self.assertIn(
            "delete",
            paths["/api/assessment/{record_id}"],
        )


if __name__ == "__main__":
    unittest.main()