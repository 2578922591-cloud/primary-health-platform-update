export const COMMON_STEPS = [
  {title:"对象与随访",help:"先确认患者身份和本次随访方式。",fields:[
    f("patient_name","姓名","text",{required:true}),f("archive_no","档案编号","text",{required:true,hint:"保留编号中的前导零"}),
    f("visit_date","随访日期","date",{required:true}),f("visit_method","随访方式","choice",{required:true,options:["门诊","家庭","电话"]}),
    f("height_cm","身高（cm）","number",{min:80,max:230,step:"0.1",hint:"用于自动计算 BMI；复访可沿用"})
  ]}
];

const commonLifestyle = [
  f("smoking_per_day","日吸烟量（支）","number",{min:0,max:200}),f("smoking_target","目标日吸烟量（支）","number",{min:0,max:200}),
  f("alcohol_per_day","日饮酒量（两）","number",{min:0,max:50,step:"0.1"}),f("alcohol_target","目标日饮酒量（两）","number",{min:0,max:50,step:"0.1"}),
  f("exercise_week","运动（次/周）","number",{min:0,max:30}),f("exercise_minutes","运动（分钟/次）","number",{min:0,max:600}),
  f("exercise_target_week","目标运动（次/周）","number",{min:0,max:30}),f("exercise_target_minutes","目标运动（分钟/次）","number",{min:0,max:600}),
];

const commonEnd = [
  f("med_adherence","服药依从性","choice",{options:["规律","间断","不服药"],required:true}),
  f("adverse_reaction","药物不良反应","choice",{options:["无","有"],required:true}),f("adverse_detail","不良反应说明","textarea"),
  f("visit_class","此次随访分类","choice",{options:["控制满意","控制不满意","不良反应","并发症"],required:true}),
  ...[1,2,3].flatMap(i=>[f(`drug${i}_name`,`药物 ${i} 名称`,`text`),f(`drug${i}_times_day`,`每日次数`,`number`,{min:0,max:20}),f(`drug${i}_dose`,`每次剂量`,`number`,{min:0,step:"0.01"}),f(`drug${i}_unit`,`剂量单位`,`select`,{options:["","mg","g","ml","片","粒","丸","单位","其他"]})]),
  f("referral_reason","转诊原因","textarea"),f("referral_org_dept","转诊机构及科别","text"),
  f("next_visit_date","下次随访日期","date",{required:true}),f("doctor_name","随访医生","text",{required:true}),f("notes","备注","textarea")
];

export const SCHEMAS = {
  hypertension:{label:"原发性高血压",short:"高血压",color:"coral",steps:[...COMMON_STEPS,
    {title:"症状与体征",help:"按电脑平台顺序采集症状、血压、体重和心率。",fields:[
      f("symptom_codes","症状","multi",{options:opts([[1,"无症状"],[2,"头痛头晕"],[3,"恶心呕吐"],[4,"眼花耳鸣"],[5,"呼吸困难"],[6,"心悸胸闷"],[7,"鼻衄出血不止"],[8,"四肢发麻"],[9,"下肢水肿"]]),required:true}),
      f("symptom_other","其他症状","textarea"),f("sbp","收缩压（mmHg）","number",{min:40,max:300,required:true}),f("dbp","舒张压（mmHg）","number",{min:20,max:200,required:true}),
      f("weight_kg","体重（kg）","number",{min:20,max:300,step:"0.1"}),f("weight_target_kg","目标体重（kg）","number",{min:20,max:300,step:"0.1"}),
      f("bmi","BMI（kg/m²）","computed"),f("heart_rate","心率（次/分）","number",{min:20,max:250}),f("signs_other","其他体征","textarea")
    ]},
    {title:"生活方式与检查",help:"当前情况和下次目标分开填写。",fields:[...commonLifestyle,
      f("salt_level","摄盐情况","choice",{options:["轻","中","重"]}),f("salt_target","目标摄盐情况","choice",{options:["轻","中","重"]}),
      f("mental_adjustment","心理调整","choice",{options:["良好","一般","差"]}),f("medical_compliance","遵医行为","choice",{options:["良好","一般","差"]}),f("aux_exam","辅助检查","textarea")
    ]},
    {title:"用药、转诊与计划",help:"录入当前用药和本次随访结论。",fields:[...commonEnd,f("other_drug_name","其他药物","text"),f("other_drug_usage","其他药物用法用量","text")]}
  ]},
  diabetes:{label:"2 型糖尿病",short:"糖尿病",color:"teal",steps:[...COMMON_STEPS,
    {title:"症状与体征",help:"按电脑平台顺序采集症状、血压、体重和足背动脉。",fields:[
      f("symptom_codes","症状","multi",{options:opts([[1,"无症状"],[2,"多饮"],[3,"多食"],[4,"多尿"],[5,"视力模糊"],[6,"感染"],[7,"手脚麻木"],[8,"下肢浮肿"],[9,"体重明显下降"]]),required:true}),
      f("symptom_other","其他症状","textarea"),f("sbp","收缩压（mmHg）","number",{min:40,max:300,required:true}),f("dbp","舒张压（mmHg）","number",{min:20,max:200,required:true}),
      f("weight_kg","体重（kg）","number",{min:20,max:300,step:"0.1"}),f("weight_target_kg","目标体重（kg）","number",{min:20,max:300,step:"0.1"}),f("bmi","BMI（kg/m²）","computed"),
      f("dorsalis_pedis","足背动脉搏动","select",{options:["","触及正常","减弱-双侧","减弱-左侧","减弱-右侧","消失-双侧","消失-左侧","消失-右侧"]}),f("signs_other","其他体征","textarea")
    ]},
    {title:"生活方式与检查",help:"记录当前行为、目标和本次检查结果。",fields:[...commonLifestyle,
      f("staple_food_g","主食量（克/天）","number",{min:0,max:3000}),f("staple_food_target_g","目标主食量（克/天）","number",{min:0,max:3000}),
      f("mental_adjustment","心理调整","choice",{options:["良好","一般","差"]}),f("medical_compliance","遵医行为","choice",{options:["良好","一般","差"]}),
      f("fasting_glucose","空腹血糖（mmol/L）","number",{min:0,max:60,step:"0.1",required:true}),f("hba1c","糖化血红蛋白（%）","number",{min:0,max:30,step:"0.1"}),f("hba1c_date","糖化血红蛋白检查日期","date"),f("other_exam","其他检查","textarea")
    ]},
    {title:"用药、转诊与计划",help:"录入当前用药和本次随访结论。",fields:[...commonEnd,
      f("hypoglycemia","低血糖反应","choice",{options:["无","偶尔","频繁"],required:true}),f("insulin_type","胰岛素种类","text"),f("insulin_usage","胰岛素用法用量","text")
    ]}
  ]}
};

export function allFields(type){return SCHEMAS[type].steps.flatMap(s=>s.fields)}
function f(key,label,type,extra={}){return {key,label,type,...extra}}
function opts(rows){return rows.map(([value,label])=>({value:String(value),label:`${value} ${label}`}))}

