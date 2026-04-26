export const diseaseGuide = {
  late_blight: {
    immediate: [
      "Remove infected leaves and destroy them away from the field.",
      "Avoid overhead irrigation and keep leaves as dry as possible.",
      "Ensure good airflow by pruning and staking.",
      "Spray every five to seven days during severe infection.",
    ],
    immediateNP: [
      "संक्रमित पातहरू हटाएर खेतबाट टाढा नष्ट गर्नुहोस्।",
      "माथिबाट सिँचाइ नगर्नुहोस् र पातहरू सकेसम्म सुख्खा राख्नुहोस्।",
      "छाँटाई र डोरीले बाँधेर राम्रो हावा आउने बनाउनुहोस्।",
      "गम्भीर संक्रमणमा हरेक पाँच देखि सात दिनमा औषधि छर्नुहोस्।",
    ],
    longTerm: [
      "Use well-drained fields and raised beds.",
      "Maintain proper spacing and avoid dense planting.",
      "Practice crop rotation and avoid planting tomato after potato.",
      "Use resistant varieties if available.",
      "Start preventive spraying during cool and humid weather.",
    ],
    longTermNP: [
      "राम्रो पानी निकास हुने खेत र उठाइएको क्यारी प्रयोग गर्नुहोस्।",
      "उचित दूरी कायम राख्नुहोस् र घना रोपाइँ नगर्नुहोस्।",
      "बाली फेरबदल गर्नुहोस् र आलुपछि टमाटर नलगाउनुहोस्।",
      "उपलब्ध भए प्रतिरोधी जातहरू प्रयोग गर्नुहोस्।",
      "चिसो र ओसिलो मौसममा रोकथामका लागि औषधि छर्न सुरु गर्नुहोस्।",
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
    immediateNP: [
      "गोलाकार धर्के रोग लागेका तल्ला पातहरू हटाउनुहोस्।",
      "हावा सञ्चार सुधार्नुहोस् र पानीको तनाव नहोस् भनी ध्यान दिनुहोस्।",
      "हरेक सात देखि दस दिनमा औषधि छर्नुहोस्।",
    ],
    longTerm: [
      "Maintain proper nutrition, especially potassium.",
      "Avoid stress conditions.",
      "Practice crop rotation and remove plant debris after harvest.",
      "Use healthy seedlings.",
    ],
    longTermNP: [
      "उचित पोषण कायम राख्नुहोस्, विशेषगरी पोटासियम।",
      "तनावको अवस्था हुन नदिनुहोस्।",
      "बाली फेरबदल गर्नुहोस् र फसल काटेपछि बिरुवाका अवशेष हटाउनुहोस्।",
      "स्वस्थ बिउमा प्रयोग गर्नुहोस्।",
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
    immediateNP: [
      "संक्रमित बिरुवाहरू तुरुन्त हटाएर नष्ट गर्नुहोस्।",
      "संक्रमित बिरुवाहरू खेतमा नछोड्नुहोस्।",
      "संक्रमित ठाउँबाट स्वस्थ ठाउँमा माटो नसार्नुहोस्।",
      "एकपटक संक्रमण भएपछि प्रभावकारी रासायनिक उपचार छैन।",
    ],
    longTerm: [
      "Practice long crop rotation of at least two to three years.",
      "Use resistant varieties.",
      "Use raised beds and ensure proper drainage.",
      "Apply lime in acidic soils.",
      "Use clean tools and avoid waterlogging.",
    ],
    longTermNP: [
      "कम्तीमा दुई देखि तीन वर्षको लामो बाली फेरबदल गर्नुहोस्।",
      "प्रतिरोधी जातहरू प्रयोग गर्नुहोस्।",
      "उठाइएका क्यारी प्रयोग गरी राम्रो पानी निकास सुनिश्चित गर्नुहोस्।",
      "अम्लीय माटोमा चुन हाल्नुहोस्।",
      "सफा औजारहरू प्रयोग गर्नुहोस् र पानी जम्न नदिनुहोस्।",
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
    immediateNP: [
      "संक्रमित पातहरू हटाउनुहोस् र पातहरू भिजाउन नदिनुहोस्।",
      "हावा सञ्चार सुधार्नुहोस्।",
      "हरेक पाँच देखि सात दिनमा औषधि छर्नुहोस्।",
    ],
    longTerm: [
      "Use proper spacing, raised beds, and good drainage.",
      "Avoid dense canopy and rotate crops.",
    ],
    longTermNP: [
      "उचित दूरी, उठाइएका क्यारी र राम्रो पानी निकास प्रयोग गर्नुहोस्।",
      "घना छाना हुन नदिनुहोस् र बाली फेरबदल गर्नुहोस्।",
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
    immediateNP: [
      "संक्रमित पातहरू हटाएर हावा सञ्चार सुधार्नुहोस्।",
      "हरेक सात दिनमा दोहोर्याउनुहोस्।",
    ],
    longTerm: [
      "Avoid excess nitrogen fertilizer.",
      "Maintain spacing and prune regularly.",
      "Monitor crop frequently.",
    ],
    longTermNP: [
      "अत्यधिक नाइट्रोजन मल प्रयोग नगर्नुहोस्।",
      "दूरी कायम राख्नुहोस् र नियमित छाँटाई गर्नुहोस्।",
      "बिरुवाको अनुगमन बारम्बार गर्नुहोस्।",
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
    immediateNP: [
      "संक्रमित बिरुवाहरू तुरुन्त हटाउनुहोस्।",
      "किराको दबाब अनुसार हरेक सात देखि दस दिनमा औषधि छर्नुहोस्।",
    ],
    longTerm: [
      "Use resistant varieties.",
      "Install yellow sticky traps.",
      "Use insect-proof nets in nursery.",
      "Control whiteflies early.",
      "Avoid overlapping crops.",
    ],
    longTermNP: [
      "प्रतिरोधी जातहरू प्रयोग गर्नुहोस्।",
      "पहेलो टाँसिने पासोहरू राख्नुहोस्।",
      "नर्सरीमा कीरा-रोधी जाली प्रयोग गर्नुहोस्।",
      "सेतो झिँगाहरूलाई सुरुमै नियन्त्रण गर्नुहोस्।",
      "बालीहरू एकापसमा नजोड्नुहोस्।",
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
    immediateNP: [
      "दाग लागेका पातहरू हटाउनुहोस्।",
      "भिजेको खेतमा काम नगर्नुहोस्।",
      "हरेक सात दिनमा औषधि छर्नुहोस्।",
    ],
    longTerm: [
      "Use disease-free seeds and seedlings.",
      "Avoid overhead irrigation.",
      "Practice crop rotation.",
      "Maintain field sanitation.",
    ],
    longTermNP: [
      "रोगमुक्त बिउ र बिरुवाहरू प्रयोग गर्नुहोस्।",
      "माथिबाट सिँचाइ नगर्नुहोस्।",
      "बाली फेरबदल गर्नुहोस्।",
      "खेतको सफाइ कायम राख्नुहोस्।",
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
    immediateNP: [
      "लार्भाहरू र क्षतिग्रस्त फलहरू हातले टिपेर नष्ट गर्नुहोस्।",
      "हरेक पाँच देखि सात दिनमा दोहोर्याउनुहोस्।",
    ],
    longTerm: [
      "Install pheromone traps (4–5 per ropani).",
      "Encourage natural enemies.",
      "Avoid continuous tomato cropping.",
      "Use light traps if available.",
    ],
    longTermNP: [
      "फेरोमोन पासोहरू राख्नुहोस् (प्रति रोपनी ४–५ वटा)।",
      "प्राकृतिक शत्रुहरूलाई प्रोत्साहित गर्नुहोस्।",
      "लगातार टमाटर खेती नगर्नुहोस्।",
      "उपलब्ध भए प्रकाश पासोहरू प्रयोग गर्नुहोस्।",
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
    immediateNP: [
      "हरेक सात देखि दस दिनमा दोहोर्याउनुहोस्।",
    ],
    longTerm: [
      "Use yellow sticky traps.",
      "Maintain field sanitation.",
      "Avoid excessive nitrogen fertilizer.",
      "Encourage beneficial insects.",
    ],
    longTermNP: [
      "पहेलो टाँसिने पासोहरू प्रयोग गर्नुहोस्।",
      "खेतको सफाइ कायम राख्नुहोस्।",
      "अत्यधिक नाइट्रोजन मल प्रयोग नगर्नुहोस्।",
      "लाभदायक कीराहरूलाई प्रोत्साहित गर्नुहोस्।",
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
    immediateNP: [
      "सुरुङ रोग लागेका पातहरू हटाउनुहोस्।",
      "हरेक पाँच देखि सात दिनमा दोहोर्याउनुहोस्।",
    ],
    longTerm: [
      "Avoid overuse of pesticides that kill beneficial insects.",
      "Use traps and monitor regularly.",
      "Maintain field hygiene.",
    ],
    longTermNP: [
      "लाभदायक कीराहरू मार्ने कीटनाशकहरूको अत्यधिक प्रयोग नगर्नुहोस्।",
      "पासोहरू राख्नुहोस् र नियमित अनुगमन गर्नुहोस्।",
      "खेतको सफाइ कायम राख्नुहोस्।",
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
    immediateNP: [
      "लार्भाहरू हातले टिप्नुहोस् र अण्डाहरू नष्ट गर्नुहोस्।",
      "हरेक पाँच देखि सात दिनमा औषधि छर्नुहोस्।",
    ],
    longTerm: [
      "Install pheromone traps and encourage natural enemies.",
      "Avoid continuous cropping and monitor regularly.",
    ],
    longTermNP: [
      "फेरोमोन पासोहरू राख्नुहोस् र प्राकृतिक शत्रुहरूलाई प्रोत्साहित गर्नुहोस्।",
      "लगातार खेती नगर्नुहोस् र नियमित अनुगमन गर्नुहोस्।",
    ],
    chemicals: [
      { name: "Emamectin benzoate", dose: "20g per ropani" },
      { name: "Chlorantraniliprole", dose: "20ml per ropani" },
    ],
  },
};