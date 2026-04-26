type Chemical = { name: string; dose: string };
type Guide = { immediate: string[]; longTerm: string[]; chemicals: Chemical[] };
export type DiseaseEntry = { spreadBy?: string; commonName?: string; en: Guide; ne: Guide };

const diseaseGuide: Record<string, Record<string, DiseaseEntry>> = {
  tomato: {
    late_blight: {
      en: {
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
      ne: {
        immediate: [
          "संक्रमित पात तुरुन्तै टिपेर खेत बाहिर गाड्ने वा जलाउने गर्नुहोस्।",
          "माथिबाट पानी हाल्ने काम नगर्नुहोस् र पात सुक्खा राख्ने प्रयास गर्नुहोस्।",
          "बोटमा हावा सजिलै चल्न सक्ने गरी टेका दिने र अनावश्यक हाँगा काट्ने गर्नुहोस्।",
          "रोग बढी भएमा ५ देखि ७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "पानी नजम्ने जमिन छान्नुहोस् र उचालिएका बेड (ड्याङ) मा रोप्नुहोस्।",
          "बोटबिरुवा बीच उचित दूरी राख्नुहोस् र धेरै बाक्लो नबनाउनुहोस्।",
          "आलु पछि टमाटर नलगाउने गरी बाली चक्र अपनाउनुहोस्।",
          "रोग सहन सक्ने जात प्रयोग गर्नु राम्रो हुन्छ।",
          "चिसो र ओसिलो मौसम सुरु हुनुअघि नै रोकथामका लागि औषधि छर्कनुहोस्।",
        ],
        chemicals: [
          { name: "मेटालाक्सिल + म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
          { name: "साइमोक्सानिल + म्यान्कोजेब", dose: "करिब २५० ग्राम प्रति रोपनी" },
        ],
      },
    },
    early_blight: {
      en: {
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
      ne: {
        immediate: [
          "तलतिरका दाग देखिएका पात टिपेर नष्ट गर्नुहोस्।",
          "बोटमा हावा चल्ने बनाउनुहोस् र बोटलाई पानीको कमी हुन नदिनुहोस्।",
          "७ देखि १० दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "बोटलाई सन्तुलित मलखाद दिनुहोस्, विशेष गरी पोटास।",
          "बोटलाई कमजोर हुन नदिनुहोस्।",
          "बाली चक्र अपनाउनुहोस् र बाली सकिएपछि खेत सफा गर्नुहोस्।",
          "स्वस्थ बिरुवा प्रयोग गर्नुहोस्।",
        ],
        chemicals: [
          { name: "म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
          { name: "क्लोरोथालोनिल", dose: "२५०–३०० ग्राम प्रति रोपनी" },
        ],
      },
    },
    leaf_mold: {
      en: {
        immediate: [
          "Remove infected leaves and improve ventilation, especially in tunnels or greenhouses.",
          "Repeat every seven days.",
        ],
        longTerm: [
          "Reduce humidity by proper spacing and ventilation.",
          "Avoid overhead irrigation and use resistant varieties.",
        ],
        chemicals: [
          { name: "Copper fungicide", dose: "250–300g per ropani" },
          { name: "Mancozeb", dose: "250–300g per ropani" },
        ],
      },
      ne: {
        immediate: [
          "संक्रमित पात हटाउनुहोस् र विशेष गरी टनेल/प्लास्टिक घरमा हावा चल्ने बनाउनुहोस्।",
          "७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "ओसिलोपन घटाउन दूरी कायम गर्नुहोस् र हावा चल्ने बनाउनुहोस्।",
          "माथिबाट पानी हाल्न नदिनुहोस् र सहनशील जात प्रयोग गर्नुहोस्।",
        ],
        chemicals: [
          { name: "कपरजन्य विषादी", dose: "२५०–३०० ग्राम प्रति रोपनी" },
          { name: "म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
        ],
      },
    },
    septoria_leaf_spot: {
      en: {
        immediate: [
          "Remove infected lower leaves and avoid water splashing.",
          "Spray Mancozeb every seven days.",
        ],
        longTerm: [
          "Practice crop rotation and avoid overhead irrigation.",
          "Maintain field sanitation.",
        ],
        chemicals: [
          { name: "Mancozeb", dose: "250–300g per ropani" },
        ],
      },
      ne: {
        immediate: [
          "तलतिरका संक्रमित पात हटाउनुहोस् र पानी छ्यापिन नदिनुहोस्।",
          "७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "बाली चक्र अपनाउनुहोस् र माथिबाट पानी हाल्न नदिनुहोस्।",
          "खेत सफा राख्नुहोस्।",
        ],
        chemicals: [
          { name: "म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
        ],
      },
    },
    spider_mites: {
      en: {
        immediate: [
          "Spray every five to seven days.",
        ],
        longTerm: [
          "Avoid dusty conditions and maintain field humidity.",
          "Encourage natural enemies and avoid excessive pesticide use.",
        ],
        chemicals: [
          { name: "Abamectin", dose: "20ml per ropani" },
          { name: "Spiromesifen", dose: "as available" },
        ],
      },
      ne: {
        immediate: [
          "५–७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "धुलो कम हुने वातावरण बनाउनुहोस् र खेतमा आर्द्रता सन्तुलित राख्नुहोस्।",
          "उपयोगी कीरा संरक्षण गर्नुहोस् र धेरै विषादी प्रयोग नगर्नुहोस्।",
        ],
        chemicals: [
          { name: "अबामेक्टिन", dose: "करिब २० मिलिलिटर प्रति रोपनी" },
        ],
      },
    },
    target_spot: {
      en: {
        immediate: [
          "Remove infected leaves and improve airflow.",
          "Repeat every seven days.",
        ],
        longTerm: [
          "Maintain spacing and avoid high humidity.",
          "Practice crop rotation.",
        ],
        chemicals: [
          { name: "Chlorothalonil", dose: "250–300g per ropani" },
          { name: "Mancozeb", dose: "250–300g per ropani" },
        ],
      },
      ne: {
        immediate: [
          "दाग लागेको पात हटाउनुहोस् र बोट खुल्ला बनाउनुहोस्।",
          "७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "उचित दूरी कायम गर्नुहोस् र बढी ओसिलोपन हुन नदिनुहोस्।",
          "बाली चक्र अपनाउनुहोस्।",
        ],
        chemicals: [
          { name: "क्लोरोथालोनिल", dose: "२५०–३०० ग्राम प्रति रोपनी" },
          { name: "म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
        ],
      },
    },
    leaf_curl_virus: {
      spreadBy: "Whitefly",
      en: {
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
      ne: {
        immediate: [
          "संक्रमित बोट तुरुन्त उखेलेर नष्ट गर्नुहोस्।",
          "सेतो किरालाई नियन्त्रण गर्न ७–१० दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "रोग सहनशील जात प्रयोग गर्नुहोस्।",
          "पहेँलो टाँसिने पासो प्रयोग गर्नुहोस्।",
          "नर्सरीमा जाली प्रयोग गर्नुहोस्।",
          "सुरुमा नै सेतो किरा नियन्त्रण गर्नुहोस्।",
        ],
        chemicals: [
          { name: "इमिडाक्लोप्रिड", dose: "३०–४० मिलिलिटर प्रति रोपनी" },
        ],
      },
    },
    mosaic_virus: {
      en: {
        immediate: [
          "Remove infected plants immediately and destroy them.",
          "No chemical cure available.",
          "Disinfect tools and avoid handling plants after touching infected ones.",
        ],
        longTerm: [
          "Use resistant varieties and disease-free seeds.",
          "Avoid tobacco use in the field.",
          "Maintain hygiene and control insect vectors.",
        ],
        chemicals: [],
      },
      ne: {
        immediate: [
          "संक्रमित बोट तुरुन्त उखेलेर नष्ट गर्नुहोस्।",
          "यस रोगको औषधि हुँदैन।",
          "उपकरण सफा राख्नुहोस् र संक्रमित बोट छोएपछि अन्य बोट नछुनुहोस्।",
        ],
        longTerm: [
          "रोग सहनशील जात र स्वस्थ बीउ प्रयोग गर्नुहोस्।",
          "खेतमा सुर्तीजन्य वस्तु प्रयोग नगर्नुहोस्।",
          "सरसफाइ कायम गर्नुहोस् र किरा नियन्त्रण गर्नुहोस्।",
        ],
        chemicals: [],
      },
    },
    bacterial_spot: {
      en: {
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
      ne: {
        immediate: [
          "दाग लागेको पात हटाउनुहोस् र भिजेको अवस्थामा खेतमा काम नगर्नुहोस्।",
          "७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "रोगरहित बीउ र बिरुवा प्रयोग गर्नुहोस्।",
          "माथिबाट पानी हाल्न नदिनुहोस्।",
          "बाली चक्र अपनाउनुहोस् र खेत सफा राख्नुहोस्।",
        ],
        chemicals: [
          { name: "कपरजन्य विषादी", dose: "३००–३५० ग्राम प्रति रोपनी" },
          { name: "स्ट्रेप्टोसाइक्लिन", dose: "१ ग्राम प्रति १० लिटर पानी" },
        ],
      },
    },
  },

  pepper: {
    bacterial_spot: {
      en: {
        immediate: [
          "Remove infected leaves and avoid working in wet fields.",
          "Avoid overhead irrigation and keep foliage as dry as possible.",
          "Spray every seven days.",
        ],
        longTerm: [
          "Use disease-free seeds and resistant varieties.",
          "Practice crop rotation and maintain field sanitation.",
          "Avoid dense planting.",
        ],
        chemicals: [
          { name: "Copper fungicide", dose: "300–350g per ropani" },
          { name: "Streptocycline", dose: "1g per 10 liters of water" },
        ],
      },
      ne: {
        immediate: [
          "दाग लागेको पात हटाउनुहोस् र भिजेको अवस्थामा खेतमा काम नगर्नुहोस्।",
          "माथिबाट पानी हाल्ने काम नगर्नुहोस् र पात सुक्खा राख्नुहोस्।",
          "७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "रोगरहित बीउ र सहनशील जात प्रयोग गर्नुहोस्।",
          "बाली चक्र अपनाउनुहोस् र खेत सफा राख्नुहोस्।",
          "बोट धेरै बाक्लो नराख्नुहोस्।",
        ],
        chemicals: [
          { name: "कपरजन्य विषादी", dose: "३००–३५० ग्राम प्रति रोपनी" },
          { name: "स्ट्रेप्टोसाइक्लिन", dose: "१ ग्राम प्रति १० लिटर पानी" },
        ],
      },
    },
  },

  potato: {
    early_blight: {
      en: {
        immediate: [
          "Remove infected leaves and improve airflow.",
          "Repeat every seven to ten days.",
        ],
        longTerm: [
          "Maintain proper nutrition and avoid plant stress.",
          "Practice crop rotation and remove crop residues.",
        ],
        chemicals: [
          { name: "Mancozeb", dose: "250–300g per ropani" },
          { name: "Chlorothalonil", dose: "250–300g per ropani" },
        ],
      },
      ne: {
        immediate: [
          "दाग लागेको पात हटाउनुहोस् र बोट खुल्ला बनाउनुहोस्।",
          "७–१० दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "सन्तुलित मल प्रयोग गर्नुहोस् र बोटलाई कमजोर हुन नदिनुहोस्।",
          "बाली चक्र अपनाउनुहोस् र बालीपछि खेत सफा गर्नुहोस्।",
        ],
        chemicals: [
          { name: "म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
          { name: "क्लोरोथालोनिल", dose: "२५०–३०० ग्राम प्रति रोपनी" },
        ],
      },
    },
    late_blight: {
      en: {
        immediate: [
          "Remove infected leaves and avoid leaf wetting.",
          "Repeat every five to seven days.",
        ],
        longTerm: [
          "Use resistant varieties and well-drained fields.",
          "Start preventive spraying during cool, humid weather.",
        ],
        chemicals: [
          { name: "Metalaxyl + Mancozeb", dose: "250–300g per ropani" },
        ],
      },
      ne: {
        immediate: [
          "संक्रमित पात हटाउनुहोस् र पात भिज्न नदिनुहोस्।",
          "५–७ दिनको फरकमा छर्कनुहोस्।",
        ],
        longTerm: [
          "रोग सहनशील जात प्रयोग गर्नुहोस् र पानी नजम्ने खेतमा खेती गर्नुहोस्।",
          "चिसो र ओसिलो मौसममा अग्रीम स्प्रे सुरु गर्नुहोस्।",
        ],
        chemicals: [
          { name: "मेटालाक्सिल + म्यान्कोजेब", dose: "२५०–३०० ग्राम प्रति रोपनी" },
        ],
      },
    },
  },
};

// Indexed by PLANT_CLASSES class_index
export const DISEASE_GUIDE_BY_CLASS: (DiseaseEntry | null)[] = [
  diseaseGuide.pepper.bacterial_spot,       // 0
  null,                                      // 1 – pepper healthy
  diseaseGuide.potato.early_blight,         // 2
  diseaseGuide.potato.late_blight,          // 3
  null,                                      // 4 – potato healthy
  diseaseGuide.tomato.bacterial_spot,       // 5
  diseaseGuide.tomato.early_blight,         // 6
  diseaseGuide.tomato.late_blight,          // 7
  diseaseGuide.tomato.leaf_mold,            // 8
  diseaseGuide.tomato.septoria_leaf_spot,   // 9
  diseaseGuide.tomato.spider_mites,         // 10
  diseaseGuide.tomato.target_spot,          // 11
  diseaseGuide.tomato.leaf_curl_virus,      // 12
  diseaseGuide.tomato.mosaic_virus,         // 13
  null,                                      // 14 – tomato healthy
  null,                                      // 15 – not recognized
];
