import json, pathlib, subprocess, sys, tempfile, unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class BridgeTests(unittest.TestCase):
    def test_prepare_valid_record(self):
        values={k:"测试" for k in ["patient_name","archive_no","visit_date","visit_method","symptom_codes","sbp","dbp","med_adherence","adverse_reaction","visit_class","next_visit_date","doctor_name"]}
        payload={"format":"followup-mobile-v1","records":[{"id":"1","type":"hypertension","values":values}]}
        with tempfile.TemporaryDirectory() as d:
            src=pathlib.Path(d)/"in.json";out=pathlib.Path(d)/"out.json";src.write_text(json.dumps(payload,ensure_ascii=False),encoding="utf-8")
            result=subprocess.run([sys.executable,str(ROOT/"bridge/prepare_import.py"),str(src),"--out",str(out)],capture_output=True,text=True)
            self.assertEqual(result.returncode,0,result.stderr)
            q=json.loads(out.read_text(encoding="utf-8"));self.assertEqual(len(q["records"]),1);self.assertEqual(q["save_action"],"manual_only")
    def test_execute_is_blocked(self):
        with tempfile.TemporaryDirectory() as d:
            src=pathlib.Path(d)/"queue.json";src.write_text(json.dumps({"records":[]}),encoding="utf-8")
            result=subprocess.run([sys.executable,str(ROOT/"bridge/runner.py"),str(src),"--execute"],capture_output=True,text=True)
            self.assertNotEqual(result.returncode,0)

if __name__=="__main__":unittest.main()

