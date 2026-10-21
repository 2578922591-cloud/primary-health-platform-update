# 电脑端录入桥接器

桥接器读取手机端导出的 JSON，校验必填字段，并生成逐字段录入计划。

```powershell
python .\bridge\prepare_import.py .\随访数据_YYYYMMDD.json --out .\queue.json
```

当前 `platform-map.json` 中 `verified` 为 `false`，因此执行器只允许 `--dry-run`。必须在公卫平台测试环境或专用测试患者上逐字段校准 Tab 顺序与下拉选项后，才能将其改为 `true`。

即使完成校准，执行器也不点击“保存/提交”。每条记录填充完毕后由工作人员核对并手动保存，以避免错误医疗记录。

