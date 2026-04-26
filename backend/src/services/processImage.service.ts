import fs from "fs"
import FormData from "form-data"
import { ProcessAudio, ProcessImage, SendEmail } from "../validators/processImage.validation";
import { http } from "../config/axiosApi"
import nodemailer from "nodemailer"
import { config } from "../config";

export const processImageService = async (image: ProcessImage) => {
    const path = image?.image.path

    const form = new FormData()
    form.append("file", fs.createReadStream(path), {
        filename: image.image.originalname,
        contentType: image.image.mimetype,
    })

    const response = await http.post("/plant/predict", form, {
        headers: form.getHeaders(),
    })
    // console.log(response)

    fs.unlink(path, () => { })

    return response.data
}

export const processAudioService = async (data: ProcessAudio) => {
    const response = await http.post("/tts/synthesize", data, {
        responseType: "arraybuffer",
    });

    return response.data;
};

const PLANT_CLASSES = [
    { plant: "Pepper (Bell)", disease: "Bacterial Spot",         healthy: false }, // 0
    { plant: "Pepper (Bell)", disease: "Healthy",                healthy: true  }, // 1
    { plant: "Potato",        disease: "Early Blight",           healthy: false }, // 2
    { plant: "Potato",        disease: "Late Blight",            healthy: false }, // 3
    { plant: "Potato",        disease: "Healthy",                healthy: true  }, // 4
    { plant: "Tomato",        disease: "Bacterial Spot",         healthy: false }, // 5
    { plant: "Tomato",        disease: "Early Blight",           healthy: false }, // 6
    { plant: "Tomato",        disease: "Late Blight",            healthy: false }, // 7
    { plant: "Tomato",        disease: "Leaf Mold",              healthy: false }, // 8
    { plant: "Tomato",        disease: "Septoria Leaf Spot",     healthy: false }, // 9
    { plant: "Tomato",        disease: "Spider Mites",           healthy: false }, // 10
    { plant: "Tomato",        disease: "Target Spot",            healthy: false }, // 11
    { plant: "Tomato",        disease: "Yellow Leaf Curl Virus", healthy: false }, // 12
    { plant: "Tomato",        disease: "Mosaic Virus",           healthy: false }, // 13
    { plant: "Tomato",        disease: "Healthy",                healthy: true  }, // 14
    { plant: "Unknown",       disease: "Not Recognized",         healthy: false }, // 15
];

const diseaseKeyMap: Record<string, string> = {
    "Bacterial Spot":         "bacterial_spot",
    "Early Blight":           "early_blight",
    "Late Blight":            "late_blight",
    "Yellow Leaf Curl Virus": "leaf_curl_virus",
    "Bacterial Wilt":         "bacterial_wilt",
    "Downy Mildew":           "downy_mildew",
    "Powdery Mildew":         "powdery_mildew",
    "Fruit Borer":            "fruit_borer",
    "Whitefly":               "whitefly",
    "Leaf Miner":             "leaf_miner",
};

const diseaseGuide: Record<string, {
    immediate: string[];
    longTerm: string[];
    chemicals: { name: string; dose: string }[];
}> = {
    bacterial_spot: {
        immediate: [
            "Remove infected leaves with spots and destroy them away from the field.",
            "Avoid working in wet fields.",
            "Do not use overhead irrigation — keep leaves dry.",
            "Spray chemicals every seven days.",
        ],
        longTerm: [
            "Use disease-free seeds and resistant varieties.",
            "Maintain proper spacing and avoid dense planting.",
            "Practice crop rotation.",
            "Maintain field sanitation.",
        ],
        chemicals: [
            { name: "Copper fungicide", dose: "300–350g per ropani" },
            { name: "Streptocycline", dose: "1g per 10L water" },
        ],
    },
    early_blight: {
        immediate: [
            "Remove infected lower leaves showing concentric rings.",
            "Improve airflow and avoid water stress.",
            "Repeat spraying every seven to ten days.",
        ],
        longTerm: [
            "Maintain proper nutrition, especially potassium.",
            "Avoid stress conditions.",
            "Practice crop rotation and remove plant debris after harvest.",
            "Use healthy seedlings.",
        ],
        chemicals: [
            { name: "Mancozeb", dose: "250–300g per ropani" },
            { name: "Chlorothalonil", dose: "250–300g per ropani" },
        ],
    },
    late_blight: {
        immediate: [
            "Remove infected leaves and destroy them away from the field.",
            "Avoid overhead irrigation and keep leaves as dry as possible.",
            "Ensure good airflow by pruning and staking.",
            "Spray every five to seven days during severe infection.",
        ],
        longTerm: [
            "Use well-drained fields and raised beds.",
            "Maintain proper spacing and avoid dense planting.",
            "Practice crop rotation and avoid planting tomato after potato.",
            "Use resistant varieties if available.",
            "Start preventive spraying during cool and humid weather.",
        ],
        chemicals: [
            { name: "Metalaxyl + Mancozeb", dose: "250–300g per ropani" },
            { name: "Cymoxanil + Mancozeb", dose: "250g per ropani" },
        ],
    },
    leaf_curl_virus: {
        immediate: [
            "Remove infected plants immediately.",
            "Spray every seven to ten days depending on pest pressure.",
        ],
        longTerm: [
            "Use resistant varieties.",
            "Install yellow sticky traps.",
            "Use insect-proof nets in nursery.",
            "Control whiteflies early.",
            "Avoid overlapping crops.",
        ],
        chemicals: [
            { name: "Imidacloprid", dose: "30–40ml per ropani" },
        ],
    },
    bacterial_wilt: {
        immediate: [
            "Remove and destroy infected plants immediately.",
            "Do not leave infected plants in the field.",
            "Avoid moving soil from infected to healthy areas.",
            "No effective chemical cure once infection occurs.",
        ],
        longTerm: [
            "Practice long crop rotation of at least two to three years.",
            "Use resistant varieties.",
            "Use raised beds and ensure proper drainage.",
            "Apply lime in acidic soils.",
            "Use clean tools and avoid waterlogging.",
        ],
        chemicals: [
            { name: "Copper oxychloride (soil drench)", dose: "300g per ropani" },
        ],
    },
    downy_mildew: {
        immediate: [
            "Remove infected leaves and avoid wetting foliage.",
            "Improve airflow.",
            "Spray every five to seven days.",
        ],
        longTerm: [
            "Use proper spacing, raised beds, and good drainage.",
            "Avoid dense canopy and rotate crops.",
        ],
        chemicals: [
            { name: "Metalaxyl + Mancozeb", dose: "250–300g per ropani" },
            { name: "Copper fungicide", dose: "300–350g per ropani" },
        ],
    },
    powdery_mildew: {
        immediate: [
            "Remove infected leaves and improve airflow.",
            "Repeat every seven days.",
        ],
        longTerm: [
            "Avoid excess nitrogen fertilizer.",
            "Maintain spacing and prune regularly.",
            "Monitor crop frequently.",
        ],
        chemicals: [
            { name: "Sulfur", dose: "250–300g per ropani" },
            { name: "Hexaconazole", dose: "100–120ml per ropani" },
        ],
    },
    fruit_borer: {
        immediate: [
            "Handpick and destroy larvae and damaged fruits.",
            "Repeat every five to seven days.",
        ],
        longTerm: [
            "Install pheromone traps (4–5 per ropani).",
            "Encourage natural enemies.",
            "Avoid continuous tomato cropping.",
            "Use light traps if available.",
        ],
        chemicals: [
            { name: "Emamectin benzoate", dose: "20g per ropani" },
            { name: "Spinosad", dose: "30ml per ropani" },
        ],
    },
    whitefly: {
        immediate: [
            "Spray insecticide every seven to ten days.",
        ],
        longTerm: [
            "Use yellow sticky traps.",
            "Maintain field sanitation.",
            "Avoid excessive nitrogen fertilizer.",
            "Encourage beneficial insects.",
        ],
        chemicals: [
            { name: "Imidacloprid", dose: "30–40ml per ropani" },
            { name: "Thiamethoxam", dose: "40g per ropani" },
        ],
    },
    leaf_miner: {
        immediate: [
            "Remove affected leaves with mines.",
            "Repeat every five to seven days.",
        ],
        longTerm: [
            "Avoid overuse of pesticides that kill beneficial insects.",
            "Use traps and monitor regularly.",
            "Maintain field hygiene.",
        ],
        chemicals: [
            { name: "Abamectin", dose: "20ml per ropani" },
            { name: "Spinosad", dose: "30ml per ropani" },
        ],
    },
};

function buildEmailHtml(data: SendEmail): string {
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const diseaseItems = data.items.flatMap((item, i) => {
        const top = item.result[0];
        const cls = PLANT_CLASSES[top.class_index];
        if (!cls || cls.healthy) return [];
        const guideKey = diseaseKeyMap[top.condition] ?? diseaseKeyMap[cls.disease];
        const guide = guideKey ? diseaseGuide[guideKey] : null;
        return [{ index: i + 1, fileName: item.fileName, plant: cls.plant, disease: cls.disease, pct: Math.round(top.confidence * 100), guide }];
    });

    const summaryRows = data.items.map((item, i) => {
        const top = item.result[0];
        const cls = PLANT_CLASSES[top.class_index];
        if (!cls) return "";
        const pct = Math.round(top.confidence * 100);
        return `<tr>
  <td style="padding:5px 8px;border:1px solid #000;">${i + 1}</td>
  <td style="padding:5px 8px;border:1px solid #000;">${item.fileName}</td>
  <td style="padding:5px 8px;border:1px solid #000;">${cls.plant}</td>
  <td style="padding:5px 8px;border:1px solid #000;">${cls.disease}</td>
  <td style="padding:5px 8px;border:1px solid #000;">${pct}%</td>
  <td style="padding:5px 8px;border:1px solid #000;">${cls.healthy ? "Healthy" : "Disease"}</td>
</tr>`;
    }).join("");

    const treatmentSection = diseaseItems.map(d => `
<p><strong>${d.plant} — ${d.disease}</strong> (${d.fileName}, ${d.pct}% confidence)</p>
${d.guide ? `
<p><strong>Immediate Actions</strong></p>
<ol>${d.guide.immediate.map(a => `<li>${a}</li>`).join("")}</ol>
<p><strong>Long-term Prevention</strong></p>
<ol>${d.guide.longTerm.map(a => `<li>${a}</li>`).join("")}</ol>
<p><strong>Recommended Chemicals</strong></p>
<ul>${d.guide.chemicals.map(c => `<li><strong>${c.name}</strong> — ${c.dose}</li>`).join("")}</ul>
` : ""}`).join("<hr/>");

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
</head>
<body style="font-family:serif;font-size:14px;color:#000;background:#fff;padding:24px;max-width:600px;">

  <h2 style="margin:0 0 4px;">Khet Ko Sathi — Crop Diagnosis Report</h2>
  <p style="margin:0 0 16px;">${date} &bull; ${data.items.length} ${data.items.length === 1 ? "image" : "images"} analysed</p>

  <hr/>

  <p>${diseaseItems.length > 0
      ? `<strong>${diseaseItems.length}</strong> of ${data.items.length} images show signs of disease.`
      : `All ${data.items.length} images are healthy.`}
  </p>

  ${treatmentSection ? `<h3>Treatment Guide</h3>${treatmentSection}<hr/>` : ""}

  <h3>Summary</h3>
  <table width="100%" style="border-collapse:collapse;font-size:13px;">
    <thead>
      <tr>
        <th style="padding:5px 8px;border:1px solid #000;text-align:left;">#</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:left;">File</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:left;">Plant</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:left;">Condition</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:left;">Conf.</th>
        <th style="padding:5px 8px;border:1px solid #000;text-align:left;">Status</th>
      </tr>
    </thead>
    <tbody>${summaryRows}</tbody>
  </table>

  <p style="margin-top:24px;font-size:12px;">Khet Ko Sathi — AI Crop Diagnosis</p>

</body>
</html>`;
}

export const sendEmailService = async (data: SendEmail) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.GMAIL_USER,
            pass: config.GMAIL_PASS
        }
    });

    const diseaseCount = data.items.filter(item => {
        const cls = PLANT_CLASSES[item.result[0].class_index];
        return cls && !cls.healthy;
    }).length;

    const subject = diseaseCount > 0
        ? `⚠️ Disease Alert — ${diseaseCount} of ${data.items.length} crops affected | Khet Ko Sathi`
        : `✅ All Clear — ${data.items.length} crops analysed | Khet Ko Sathi`;

    await transporter.sendMail({
        from: `"Khet Ko Sathi" <${config.GMAIL_USER}>`,
        to: config.MAIL_TO,
        subject,
        html: buildEmailHtml(data),
    });

    return "Mail sent successfully";
}