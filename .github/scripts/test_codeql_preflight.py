import importlib.util
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path
from unittest import mock


spec = importlib.util.spec_from_file_location("codeql_preflight", Path(__file__).with_name("codeql_preflight.py"))
preflight = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)


class StageTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.extracted = self.root / "extract"
        self.extracted.mkdir()
        self.catalog = self.root / "catalog.json"
        self.catalog.write_text('{"source_type":"external","manifest_version":2}')

    def test_preserves_runtime_manifest_and_source(self):
        (self.extracted / "plugin.json").write_text('{"manifest_version":1}')
        (self.extracted / "main.py").write_text("pass\n")
        preflight.stage(self.extracted, self.catalog, self.root / "analysis", "test-plugin")
        plugin = self.root / "analysis/plugins/test-plugin"
        self.assertEqual(json.loads((plugin / "plugin.json").read_text())["manifest_version"], 2)
        self.assertEqual(json.loads((plugin / ".dispatcharr-runtime-manifest.json").read_text())["manifest_version"], 1)
        self.assertTrue((plugin / "main.py").is_file())

    def test_stages_nested_manifest_without_runtime_sidecar(self):
        (self.extracted / "nested").mkdir()
        (self.extracted / "nested/plugin.json").write_text("{}")
        preflight.stage(self.extracted, self.catalog, self.root / "analysis", "test")
        plugin = self.root / "analysis/plugins/test"
        self.assertTrue((plugin / "nested/plugin.json").is_file())
        self.assertFalse((plugin / ".dispatcharr-runtime-manifest.json").exists())

    def test_rejects_unsafe_slug(self):
        with self.assertRaisesRegex(ValueError, "slug"):
            preflight.stage(self.extracted, self.catalog, self.root / "analysis", "../test")

    def test_rejects_symlink(self):
        (self.extracted / "plugin.json").write_text("{}")
        (self.extracted / "link").symlink_to(self.catalog)
        with self.assertRaisesRegex(ValueError, "symbolic"):
            preflight.stage(self.extracted, self.catalog, self.root / "analysis", "test")


class SarifTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        sarif = types.ModuleType("pluginctl.validate.sarif")
        sarif.load_sarif_dir = lambda directory: [json.loads(path.read_text()) for path in Path(directory).glob("*.sarif")]
        sarif._rule_id = lambda result: result["ruleId"]
        sarif._location = lambda result: (result["uri"], "1")
        sarif.is_sandbox_bypass_rule = lambda rule: rule.startswith("plugin/sandbox-bypass/")
        sarif.is_capability_contract_rule = lambda rule: rule.startswith("plugin/capability-contract/")
        validate = types.ModuleType("pluginctl.validate")
        validate.sarif = sarif
        modules = {"pluginctl": types.ModuleType("pluginctl"), "pluginctl.validate": validate,
                   "pluginctl.validate.sarif": sarif}
        self.patcher = mock.patch.dict(sys.modules, modules)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def write_result(self, uri):
        (self.root / "python.sarif").write_text(json.dumps({"runs": [{"results": [
            {"ruleId": "plugin/sandbox-bypass/example", "uri": uri}
        ]}]}))

    def test_valid_custom_uri(self):
        self.write_result("plugins/test/main.py")
        preflight.check_sarif(self.root, "test", "true", "success")

    def test_invalid_custom_uri_fails_closed(self):
        self.write_result("_analysis/plugins/test/main.py")
        with self.assertRaisesRegex(ValueError, "unresolvable"):
            preflight.check_sarif(self.root, "test", "true", "success")

    def test_success_requires_sarif_but_skipped_scan_does_not(self):
        with self.assertRaisesRegex(ValueError, "no SARIF"):
            preflight.check_sarif(self.root, "test", "true", "success")
        preflight.check_sarif(self.root, "test", "false", "skipped")
        preflight.check_sarif(self.root, "test", "true", "failure")


if __name__ == "__main__":
    unittest.main()
