from __future__ import annotations
import argparse, json, pathlib, sys

REQUIRED = {
    "hypertension": ["patient_name", "archive_no", "visit_date", "visit_method", "symptom_codes", "sbp", "dbp", "med_adherence", "adverse_reaction", "visit_class", "next_visit_date", "doctor_name"],
    "diabetes": ["patient_name", "archive_no", "visit_date", "visit_method", "symptom_codes", "sbp", "dbp", "fasting_glucose", "med_adherence", "adverse_reaction", "hypoglycemia", "visit_class", "next_visit_date", "doctor_name"],
}

def main() -> int:
    p = argparse.ArgumentParser(description="校验随访导出并生成电脑录入计划")
    p.add_argument("input", type=pathlib.Path)
    p.add_argument("--out", type=pathlib.Path, default=pathlib.Path("queue.json"))
    args = p.parse_args()
    payload = json.loads(args.input.read_text(encoding="utf-8-sig"))
    if payload.get("format") != "followup-mobile-v1":
        raise SystemExit("不支持的导出格式")
    mapping = json.loads((pathlib.Path(__file__).with_name("platform-map.json")).read_text(encoding="utf-8"))
    queue, problems = [], []
    for i, record in enumerate(payload.get("records", []), 1):
        kind, values = record.get("type"), record.get("values", {})
        if kind not in REQUIRED:
            problems.append(f"第{i}条：未知病种")
            continue
        missing = [k for k in REQUIRED[kind] if values.get(k) in (None, "", [])]
        if missing:
            problems.append(f"第{i}条：缺少 {', '.join(missing)}")
            continue
        ordered = [{"field": k, "value": values.get(k, "")} for k in mapping[kind]["ordered_fields"]]
        queue.append({"id": record.get("id"), "type": kind, "patient_name": values.get("patient_name"), "archive_no": values.get("archive_no"), "window_title": mapping[kind]["window_title"], "save_action": "manual_only", "steps": ordered})
    result = {"format": "followup-pc-queue-v1", "mapping_verified": mapping["verified"], "save_action": "manual_only", "records": queue, "problems": problems}
    args.out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"valid": len(queue), "problems": len(problems), "out": str(args.out)}, ensure_ascii=False))
    return 0 if not problems else 2

if __name__ == "__main__":
    sys.exit(main())

