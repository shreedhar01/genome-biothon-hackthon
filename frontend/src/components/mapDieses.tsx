export const diseaseGuide = {
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

  leaf_curl_virus: {
    spreadBy: "Whitefly",
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

  bacterial_spot: {
    immediate: [
      "Remove infected leaves with spots.",
      "Avoid working in wet fields.",
      "Repeat spraying every seven days.",
    ],
    longTerm: [
      "Use disease-free seeds and seedlings.",
      "Avoid overhead irrigation.",
      "Practice crop rotation.",
      "Maintain field sanitation.",
    ],
    chemicals: [
      { name: "Copper fungicide", dose: "300–350g per ropani" },
      { name: "Streptocycline", dose: "1g per 10 liters of water" },
    ],
  },

  fruit_borer: {
    commonName: "Tomato fruit worm",
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
      "Repeat every seven to ten days.",
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

  spodoptera_litura: {
    commonName: "Tobacco caterpillar",
    immediate: [
      "Handpick larvae and destroy egg masses.",
      "Spray every five to seven days.",
    ],
    longTerm: [
      "Install pheromone traps and encourage natural enemies.",
      "Avoid continuous cropping and monitor regularly.",
    ],
    chemicals: [
      { name: "Emamectin benzoate", dose: "20g per ropani" },
      { name: "Chlorantraniliprole", dose: "20ml per ropani" },
    ],
  },
};