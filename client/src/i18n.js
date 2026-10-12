export const supportedLanguages = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'hi', label: 'हिन्दी' },
];

export const navLabels = {
  en: ['Home', 'World', 'Business', 'Politics', 'Tech', 'Culture', 'Climate', 'Analysis'],
  ta: ['முகப்பு', 'உலகம்', 'வணிகம்', 'அரசியல்', 'தொழில்நுட்பம்', 'கலாச்சாரம்', 'காலநிலை', 'பகுப்பாய்வு'],
  hi: ['होम', 'दुनिया', 'व्यवसाय', 'राजनीति', 'टेक', 'संस्कृति', 'जलवायु', 'विश्लेषण'],
};

const articleTranslations = {
  'AI infrastructure spending is reshaping the next decade of global growth': {
    ml: {
      title: 'എഞ്ചിൻ-സർവ്വകാലം വരെ AI ഇന്റര്ഫേസ് ചെലവുകൾ ആഗോള വളർച്ചയിൽ ചേർന്നുവരുന്നു',
      summary: 'ചിപ്പ്മേക്കർമാർ, ക്ലൗഡ് പ്രൊവിഡർമാർ, പവർ ഗ്രിഡുകൾ എന്നിവ AI-കേന്ദ്രീകൃത സമ്പദ്വ്യത്തിനെക്കുറിച്ചുള്ള അടിസ്ഥാനസൗകര്യത്തിനായി മത്സരിക്കുന്നു.',
      content: [
        'സോഫ്റ്റ്വെയർ പരീക്ഷണത്തിൽ നിന്ന് ഫിസിക്കൽ ഇൻഫ്രാസ്ട്രക്ചർაზე വായ്പയിടുന്ന ഒരു പുതിയ കാപിറ്റൽ തരംഗം ഉയർന്നുവരുന്നു, ഡാറ്റ സെന്ററുകൾ, പവർ സിസ്റ്റങ്ങൾ, സെമികണ്ടക്ടർ സപ്ലൈ ചയിനുകൾ എന്നിവ പ്രധാനതലയിലായി.',
        'AI ഡിമാൻഡ് കാരണം ക്ലൗഡ് പ്രൊവിഡർമാരും utilities-യും ശേഷി ആസൂത്രണം, തണുപ്പിക്കൽ, നീണ്ടകാല നെറ്റ്വർക്ക് വിശ്വാസ്യത എന്നിവ വീണ്ടും ചിന്തിക്കുന്നു.',
        'അനലിസ്റ്റുകൾ പറയുന്നത്, അടുത്ത വളർച്ചചക്രം കംപ്യൂട്ട് ത്രൗപ്പുട്ടിനെ സുസ്ഥിര ഊർജ്ജത്തോടും റിസിലയന്റ് ഡെലിവറി സിസ്റ്റങ്ങളോടും കൂട്ടിച്ചേർത്ത കരുത്തുള്ള ഫയർമാർ reward ചെയ്യും എന്നാണ്.',
      ],
    },
    ta: {
      title: 'AI உள்கட்டமைப்பு செலவுகள் உலகளாவிய வளர்ச்சியில் அடுத்த பத்தாண்டை மாற்றுகின்றன',
      summary: 'சிப் தயாரிப்பாளர்கள், கிளவுட் வழங்குனர்கள், மின் கட்டமைப்புகள் அனைத்தும் AI-மைய பொருளாதாரத்திற்கான உள்கட்டமைப்பை உருவாக்க போட்டியிடுகின்றன.',
      content: [
        'மென்பொருள் பரிசோதனையில் இருந்து உடல் உள்கட்டமைப்புக்கு புதிய மூலதனம் நகர்ந்துகொண்டிருக்கிறது. தரவு மையங்கள், மின் அமைப்புகள், செமிகண்டக்டர் வழங்கல் சங்கிலிகள் முக்கியத்துவம் பெறுகின்றன.',
        'AI தேவையின் அளவு கிளவுட் வழங்குனர்களையும் பயன்பாடுகளையும் திறன் திட்டமிடல், குளிரூட்டல், நீண்டகால வலையமைப்பு நம்பகத்தன்மை ஆகியவற்றை மறுபரிசீலனை செய்ய வலியுறுத்துகிறது.',
        'அடுத்த வளர்ச்சி சுழற்சியில், கணினி செயல்திறனையும் நிலையான சக்தியையும் நம்பகமான விநியோக அமைப்பையும் இணைக்கும் நிறுவனங்கள் வெற்றிபெறுவர் என்று பகுப்பாய்வாளர்கள் கூறுகின்றனர்.',
      ],
    },
    hi: {
      title: 'AI इन्फ्रास्ट्रक्चर खर्च वैश्विक विकास के अगले दशक को बदल रहा है',
      summary: 'चिपमेकर, क्लाउड प्रदाता और पावर ग्रिड AI-संचालित अर्थव्यवस्था के लिए आवश्यक आधारभूत संरचना के लिए प्रतिस्पर्धा कर रहे हैं।',
      content: [
        'सॉफ्टवेयर प्रयोग से भौतिक आधारभूत संरचना की ओर एक नया पूंजी प्रवाह बढ़ रहा है, जहाँ डेटा सेंटर, पावर सिस्टम और सेमीकंडक्टर सप्लाई चेन मुख्य भूमिका निभा रहे हैं।',
        'AI की मांग ने क्लाउड प्रदाताओं और उपयोगिताओं को क्षमता योजना, कूलिंग और लंबी दूरी नेटवर्क विश्वसनीयता को फिर से सोचने के लिए मजबूर किया है।',
        'विश्लेषकों का कहना है कि अगली विकास चक्र उन कंपनियों को पुरस्कृत करेगा जो compute throughput, टिकाऊ ऊर्जा और L1/L2 resilience delivery system को एक साथ जोड़ेंगी।',
      ],
    },
    te: {
      title: 'AI ఆధారిత ఇన్‌ఫ్రాస్ట్రక్చర్ ఖర్చులు ప్రపంచ వృద్ధికి కొత్త దశ ఇస్తున్నాయి',
      summary: 'చిప్ తయారీదారులు, క్లౌడ్ ప్రొవైడర్లు, పవర్ గ్రిడ్లు AI-నాయితీర్థమైన ఆర్థిక వ్యవస్థకు అవసరమైన ఆధారిత నిర్మాణంపై పోటీ పడుతున్నాయి.',
      content: [
        'సాఫ్ట్‌వేర్ ఎక్స్పీరిమెంటేషన్ నుంచి భౌతిక ఇన్‌ఫ్రాస్ట్రక్చర్‌ వైపు కొత్త పెట్టుబడి కదులుతోంది. డేటా సెంటర్లు, పవర్ సిస్టమ్స్, సెమీకండక్టర్ సప్లై చైన్లు కీలకంగా మారుతున్నాయి.',
        'AI డిమాండ్ కారణంగా క్లౌడ్ ప్రొవైడర్లు మరియు యుటిలిటీలు సామర్థ్యం ప్లానింగ్, కూలింగ్, దీర్ఘకాలిక నెట్‌వర్క్ నమ్మకాన్ని తిరిగి పరిశీలిస్తున్నాయి.',
        'విశ్లేషకులు చెప్పినట్లుగా, అடுத்த వృద్ధి చక్రం కంప్యూట్‌ త్రూపుట్, స్థిరమైన శక్తి, బలమైన డెలివరీ సిస్టమ్లను కలిపే సంస్థలను మెరుగుపరుస్తుంది.',
      ],
    },
  },
  'Cities are rebuilding power systems around climate risk, not just demand forecasts': {
    ml: {
      title: 'നഗരങ്ങൾ ആവശ്യത്തിന്റെ പ്രവചനകൾക്ക് ഒപ്പം കാലാവസ്ഥാ അപകടത്തെ കേന്ദ്രീകരിച്ച് പവർ സിസ്റ്റങ്ങൾ പുനർനിർമ്മിക്കുന്നു',
      summary: 'നാഷണൽ റിസിലിയൻസ് ബജറ്റുകളും ബാക്കപ്പ് എനർജി, 스마트 ഗ്രിഡുകൾ, കടൽതീരാത്ത കാലാവസ്ഥയിൽ വിശ്വാസം ഉയർത്തുന്ന സേവനങ്ങളിലേക്ക് മാറുന്നു.',
      content: [
        'പൊതു രക്ഷാ ആസൂത്രണം എന്ന നിലയിൽUtilitys വീണ്ടും ചിന്തിക്കുന്നു.',
        'പുതിയ മുൻഗണനകൾ വേഗത്തിൽ വീണ്ടെടുക്കൽ, വൈവിധ്യമാർന്ന आपूर्ति, ആവർത്തിച്ചുള്ള ഷോക്കുകൾക്കിടയിൽ നിലനിൽക്കാവുന്ന അറ്റകൂടിനുള്ള സങ്കേതങ്ങൾ എന്നിവയാണ്.',
        'ഇത് uninterrupted service, trust and stability on a daily basis ആയ വാസ്തവപൂർവ്വമായ നഗര ആസൂത്രണത്തെ നിറവേറ്റുന്നു.',
      ],
    },
    ta: {
      title: 'மாநிலங்கள் கடன் தேவைக் கணிப்புகளுடன் சேர்த்து காலநிலை ஆபத்தை மையமாகக் கொண்டு மின் அமைப்புகளை மறுகட்டமைக்கின்றன',
      summary: 'நகரங்களின் மீள்தன்மை பட்ஜெட்டுகள் பின்தங்கிய ஆற்றல், ஸ்மார்ட் கிரிடுகள், தீவிர வானிலை காலங்களில் நம்பகமான சேவைகளுக்கு மாறி வருகின்றன.',
      content: [
        'பொது மீள்தன்மை திட்டமிடலில் நகரங்கள் மின்சார வசதிகளை புதிய கோணத்தில் பார்க்கின்றன.',
        'விரைவான மீட்பு, பன்முக வழங்கல், மீண்டும் மீண்டும் வரும் அதிர்ச்சிகளைத் தாங்கும் தகவமைப்பு ஆகியவை புதிய முன்னுரிமைகளாக உள்ளன.',
        'இதன் விளைவாக தினசரி நம்பிக்கை மற்றும் நிலைத்தன்மையை மையமாகக் கொண்ட நகர திட்டமிடல் உருவாகிறது.',
      ],
    },
    hi: {
      title: 'शहर जलवायु जोखिम के चारों ओर बिजली प्रणालियों को फिर से बनाते हैं, केवल मांग पूर्वानुमान नहीं',
      summary: 'नगरों की लचीलापन योजनाएँ बैकअप ऊर्जा, स्मार्ट ग्रिड और चरम मौसम के दौरान भरोसेमंद सेवा की ओर बढ़ रही हैं।',
      content: [
        'स्थानीय सरकारें उपयोगिताओं को सिर्फ़ सेवा नहीं बल्कि सार्वजनिक लचीलापन योजना का हिस्सा मान रही हैं।',
        'नए प्राथमिकताएँ तेज़ पुनर्स्थापन, विविध आपूर्ति, और बार-बार झटकों को झेल सकने वाली अनुकूलित बुनियादी ढाँचे को शामिल करती हैं।',
        'परिणाम एक अधिक व्यावहारिक नगर नियोजन मॉडल है जिसके केंद्र में निरंतरता, विश्वास और दैनिक स्थिरता है।',
      ],
    },
    te: {
      title: 'నగరాలు డిమాండ్ అంచనాల కంటే వాతావరణ ప్రమాదం చుట్టూ పవర్ సిస్టమ్లను తిరిగి నిర్మించుకుంటున్నాయి',
      summary: 'నగరాల రిసిలియెన్స్ బడ్జెట్లు బ్యాకప్ ఎనర్జీ, స్మార్ట్ గ్రిడ్లు, తీవ్రమైన వాతావరణంలో నమ్మకమైన సేవలకు మళ్లుతున్నాయి.',
      content: [
        'స్థానిక ప్రభుత్వాలు యుటిలిటీలను కేవలం బ్యాక్-ఆఫీస్ సేవగా కాకుండా పబ్లిక్ రిసిలియెన్స్ ప్లానింగ్‌లో భాగంగా పరిగణిస్తున్నారు.',
        'కొత్త ప్రాధాన్యతలు త్వరిత పునరుద్ధరణ, వైవిధ్యమయ సరఫరా, పునరావృత షాక్లను తట్టుకునే అనుకూలమైన ఇన్‌ఫ్రాస్ట్రక్చర్‌ మీద ఉంటాయి.',
        'ఫలితంగా రోజువారీ స్థిరత్వం, నమ్మకం మరియు uninterrupted continuityపై కేంద్రీకృతమైన నగర ప్రణాళిక ఏర్పడుతోంది.',
      ],
    },
  },
  'Productivity software buyers are demanding measurable returns before expansion': {
    ml: {
      title: 'പ്രൊഡക്റ്റിവിറ്റി സോഫ്റ്റ്വെയർ വാങ്ങുന്നവർ വിപുലീകരണം ചെയ്യുന്നതിന് മുമ്പ് അളക്കാവുന്ന റിട്ടേൺ‌കൾ ആവശ്യപ്പെടുന്നു',
      summary: 'ബിസിനസുകൾ ഫീച്ചർ-ആദ്യ വാഗ്ദാനങ്ങൾക്ക് പകരം ROI-പ്രപortion, measurable adoption എന്നിവയെ കേന്ദ്രീകരിക്കുന്നു.',
      content: ['വിപണിയിൽ നിന്നുള്ള വാങ്ങുന്നവർ விரைவான payback, വ്യക്തമായ ഓപ്പറേഷണൽ നേട്ടങ്ങൾ, workload automation എന്നിവ തേടുന്നു.', 'ടീമുകൾ കൂടുതൽ pain points-ലേക്ക് കേന്ദ്രീകരിച്ച് സവിശേഷതകൾ ചുരുക്കാൻ ശ്രമിക്കുന്നു.', 'നിക്ഷേപകർ discipline and revenue quality-നെ മുൻനിരയാക്കുന്നു.'],
    },
    ta: {
      title: 'உற்பத்தித்திறன் மென்பொருள் வாங்குவோர் விரிவாக்கத்திற்கு முன் அளவிடக்கூடிய வருவாயை கோருகின்றனர்',
      summary: 'வணிகங்கள் அம்சம் அடிப்படையிலான விளக்கங்களுக்குப் பதிலாக ROI-மையப்பட்ட தத்தெடுப்பை விரும்புகின்றன.',
      content: ['வாங்குவோர் விரைவான வருமானத் திரும்புதல், தெளிவான செயல்பாட்டு நன்மைகள், பணிச்சூழல் ஆட்டோமேஷன் ஆகியவற்றைக் கோருகின்றனர்.', 'குழுக்கள் குறிப்பிட்ட சிக்கல்களுக்கு மையமாக சிறு சிறு அம்சங்களை குறைக்கின்றன.', 'முதலீட்டாளர்கள் துரிதமாக வளர்வதை விட ஒழுங்கான வருவாய் தரத்தை விரும்புகின்றனர்.'],
    },
    hi: {
      title: 'प्रोडक्टिविटी सॉफ्टवेयर के खरीदार विस्तार से पहले मापने योग्य रिटर्न की मांग कर रहे हैं',
      summary: 'व्यवसाय फीचर-फर्स्ट पिच के बजाय ROI-आधारित अपनाने और स्पष्ट परिणामों पर ध्यान दे रहे हैं।',
      content: ['खरीदार तेज़ रिटर्न, स्पष्ट परिचालन लाभ और वर्कफ़्लो ऑटोमेशन चाहते हैं।', 'टीमें फ़ीचर विस्तार कम कर विशिष्ट समस्याओं पर ध्यान केंद्रित कर रही हैं।', 'निवेशक तेज़ लेकिन अनियोजित विस्तार के बजाय अनुशासित आय गुणवत्ता को चुन रहे हैं।'],
    },
    te: {
      title: 'ప్రొడక్టివిటీ సాఫ్ట్‌వేర్ కొనుగోలుదారులు విస్తరణకు ముందు కొలవగల రిటర్న్‌లను అడుగుతున్నారు',
      summary: 'వ్యవసాయాలు ఫీచర్-ఫస్ట్ పిచ్‌లకు బదులుగా ROI-ఆధారిత స్వీకరణను కోరుతున్నాయి.',
      content: ['కొనుగోలుదారులు త్వరిత రిటర్న్, స్పష్టమైన ఆపరేషనల్ లాభాలు మరియు వర్క్‌ఫ్లో ఆటోమేషన్‌ను కోరుతున్నారు.', 'గుంపులు మినిమమ్ ఫీచర్ స్ప్రెడ్‌తో నిర్దిష్ట సమస్యలపై దృష్టి పెడుతున్నాయి.', 'పెట్టుబడిదారులు వడివడిగా పెరగడాన్ని గానీ, క్రమశిక్షణాత్మక ఆదాయ నాణ్యతను ఇష్టపడుతున్నారు.'],
    },
  },
  'Turnout models are tightening as local trust and digital access reshape election strategy': {
    ml: {
      title: 'പ്രാദേശിക വിശ്വാസവും ഡിജിറ്റൽ ആക്സസും തിരഞ്ഞെടുപ്പ് തന്ത്രം മാറ്റുമ്പോൾ turnout modelsക്ക് സാവധാനിയുണ്ട്',
      summary: 'കാമ്പെയിനുകൾ പ്രദേശിക വിശ്വാസം, യുവജന പങ്കാളിത്തം, turnout quality എന്നിവയ്ക്ക് მეტი പ്രാധാന്യം നൽകുന്നു.',
      content: ['കാമ്പെയിൻ ടീമുകൾ വിശ്വാസം ഉറപ്പാക്കാൻ പ്രദേശിക നിലയിൽ കൂടുതൽ പ്രവർത്തനം നടത്തുന്നു.', 'വോട്ടർമാർ ബ്രോഡ് മെസേജുകളേക്കാൾ സേവനം, പ്രദേശിക പ്രാപ്യത, നേതൃత్వത്തിന്റെ വ്യക്തത എന്നിവയ്ക്ക് കൂടുതൽ പ്രതികരിക്കുന്നു.'],
    },
    ta: {
      title: 'உள்ளூர் நம்பிக்கை மற்றும் டிஜிட்டல் அணுகல் தேர்தல் உத்தியைக் மாற்றும் போது turnout மாதிரிகள் இறுக்கமாகின்றன',
      summary: 'பிரச்சாரங்கள் உள்ளூர் நம்பிக்கை, இளைஞர் பங்கேற்பு மற்றும் turnout quality மீது அதிகம் கவனம் செலுத்துகின்றன.',
      content: ['பிரச்சார குழுக்கள் பரந்த செய்திகளுக்கு பதிலாக உள்ளூர் நம்பிக்கையை உறுதி செய்யும் நடவடிக்கைகளில் கவனம் செலுத்துகின்றன.', 'வாக்காளர்கள் பெரிய கதைகளைக் காட்டிலும் சேவைகள், உள்ளூர் அணுகல் மற்றும் தலைமை தெளிவை அதிகம் பார்க்கிறார்கள்.'],
    },
    hi: {
      title: 'स्थानीय भरोसा और डिजिटल एक्सेस चुनाव रणनीति को बदलते समय turnout मॉडल सख्त हो रहे हैं',
      summary: 'अभियान स्थानीय विश्वास, युवा भागीदारी और turnout quality पर अधिक जोर दे रहे हैं।',
      content: ['कैंपेन टीमें बड़े मैसेजिंग के बजाय स्थानीय विश्वसनीयता की पुष्टि के लिए ज़मीनी काम कर रही हैं।', 'वोटर अब बड़े संदेशों की जगह सेवा, स्थानीय पहुँच और नेतृत्व की स्पष्टता पर प्रतिक्रिया दे रहे हैं।'],
    },
    te: {
      title: 'స్థానిక నమ్మకం మరియు డిజిటల్ ప్రాప్తి ఎన్నిక వ్యూహాన్ని మార్చినప్పుడు turnout మోడల్స్ మరింత కట్టుబడుతున్నాయి',
      summary: 'ప్రచారాలు స్థానిక నమ్మకం, యువ పంచాయతీ మరియు turnout qualityపై దృష్టి పెడుతున్నాయి.',
      content: ['క్యాంపెయిన్ టీమ్‌లు విస్తృత సందేశాలకు బదులుగా స్థానిక నమ్మకాన్ని ధృవీకరించే పనికి ఎక్కువ空间 ఇస్తున్నాయి.', 'ఓటర్లు పెద్ద కథనాల కంటే సేవలు, స్థానిక ప్రాప్యత, నాయకత్వ స్పష్టతపై ఎక్కువ స్పందిస్తున్నారు.'],
    },
  },
  'Edge networks are bringing AI closer to the places where latency and trust matter most': {
    ml: {
      title: 'എഡ്ജ് നെറ്റ്വർക്കുകൾ AI-യെ ലാറ്റൻസിയും വിശ്വാസവും ഏറ്റവും പ്രധാനമായ സ്ഥലങ്ങൾക്ക് nearer ആക്കുന്നു',
      summary: 'വിൽപന, സ്വাস্থാവസ്ഥ, പൊതു substructure-കൾക്ക് edge compute നിർബന്ധമായിത്തീർന്നിരിക്കുന്നു.',
      content: ['Edge deployment-കൾ പരീക്ഷണാത്മക pilot-കൾക്ക് മുകളിലേക്ക് production systems-ലേക്ക് നീങ്ങി.', 'ലാറ്റൻസിയേക്കാൾ ഉപഭോക്തൃ గోప్యత, bandwidth control, operational continuity എന്നിവയും முக்கியമാണ്.'],
    },
    ta: {
      title: 'எட்ஜ் நெட்வொர்க்குகள் AI-வை தாமதம் மற்றும் நம்பிக்கை மிக முக்கியமான இடங்களுக்கு நெருக்கமாக கொண்டுவருகின்றன',
      summary: 'சில்லறை, சுகாதாரம், பொது உள்கட்டமைப்பு ஆகியவற்றுக்கு எட்ஜ் கம்ப்யூட் அவசியமாகிறது.',
      content: ['எட்ஜ் செயலாக்கங்கள் பரிசோதனை நிலையிலிருந்து உற்பத்தி அமைப்புகளுக்கு நகர்ந்துள்ளன.', 'நன்மை வெறும் தாமதத்தைக் குறைப்பதல்ல; தனியுரிமை, பேண்ட்வித் மேலாண்மை, செயல்பாட்டு தொடர்ச்சி ஆகியவற்றையும் மேம்படுத்துகிறது.'],
    },
    hi: {
      title: 'एज नेटवर्क AI को उन स्थानों के करीब ला रहे हैं जहाँ latency और trust सबसे महत्वपूर्ण हैं',
      summary: 'रिटेल, हेल्थकेयर और सार्वजनिक बुनियादी ढाँचे के लिए Edge compute अब आवश्यक है।',
      content: ['एज डिप्लॉयमेंट प्रयोगात्मक pilote से उत्पादन सिस्टम तक पहुँच चुका है।', 'फ़ायदा सिर्फ़ latency कम करने में नहीं है; privacy, bandwidth और continuity भी बेहतर होती है।'],
    },
    te: {
      title: 'ఎడ్జ్ నెట్‌వర్క్‌లు AIని లేటెన్సీ మరియు నమ్మకం ముఖ్యమైన చోట్లకు దగ్గర చేస్తున్నాయి',
      summary: 'రిటైల్, హెల్త్‌కేర్, పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్‌లో ఎడ్జ్ కంప్యూట్ అవసరం అయింది.',
      content: ['ఎడ్జ్ డిప్లోయ్‌మెంట్‌లు ప్రయోగాత్మక ప్లోట్స్ నుంచి ప్రొడక్షన్ సిస్టమ్‌లకు వెళ్లాయి.', 'లాభం కేవలం లేటెన్సీ తగ్గించడం మాత్రమే కాదు; గోప్యత, బ్యాండ్‌విడ్త్, క్రియాత్మక కొనసాగింపు కూడా మెరుగవుతాయి.'],
    },
  },
};

export const categoryLabels = {
  en: {
    Home: 'Home',
    World: 'World',
    Business: 'Business',
    Politics: 'Politics',
    Tech: 'Tech',
    Culture: 'Culture',
    Climate: 'Climate',
    Analysis: 'Analysis',
  },
  ml: {
    Home: 'ഹോം',
    World: 'ലോകം',
    Business: 'വാണിജ്യം',
    Politics: 'രാഷ്ട്രീയം',
    Tech: 'ത്വരിതം',
    Culture: 'സാംസ്കാരികം',
    Climate: 'കാലാവസ്ഥ',
    Analysis: 'വിശകലനം',
  },
  ta: {
    Home: 'முகப்பு',
    World: 'உலகம்',
    Business: 'வணிகம்',
    Politics: 'அரசியல்',
    Tech: 'தொழில்நுட்பம்',
    Culture: 'கலாச்சாரம்',
    Climate: 'காலநிலை',
    Analysis: 'பகுப்பாய்வு',
  },
  hi: {
    Home: 'होम',
    World: 'दुनिया',
    Business: 'व्यवसाय',
    Politics: 'राजनीति',
    Tech: 'टेक',
    Culture: 'संस्कृति',
    Climate: 'जलवायु',
    Analysis: 'विश्लेषण',
  },
  te: {
    Home: 'హోమ్',
    World: 'ప్రపంచం',
    Business: 'వ్యవసాయం',
    Politics: 'రాజకీయాలు',
    Tech: 'టెక్',
    Culture: 'సాంస్కృతికం',
    Climate: 'వాతావరణం',
    Analysis: 'విశ్లేషణ',
  },
};

export const uiText = {
  en: {
    admin: 'Admin',
    search: 'Search',
    subscribe: 'Subscribe',
    menu: 'Menu',
    close: 'Close',
    live: 'Live',
    readLead: 'Read live lead',
    browseLatest: 'Browse live updates',
    trending: 'Trending',
    topics: 'Topics',
    coverageMap: 'Coverage map',
    todaysNewsroom: 'Live desk',
    latest: 'Live latest',
    topStories: 'Live stories',
    whatMattersNow: 'What matters now',
    briefing: 'Live briefing',
    editorsPick: 'Editor’s live pick',
    deepReads: 'Live reads',
    marketPulse: 'Live market pulse',
    markets: 'Markets',
    climateBrief: 'Live climate brief',
    resilienceWatch: 'Live resilience watch',
    morningBrief: 'Live brief',
    searchStories: 'Search stories',
    searchPlaceholder: 'Search stories, topics, or people...',
    readStory: 'Read story',
    share: 'Share',
    saveStory: 'Save story',
    saved: 'Saved',
    related: 'Related',
    moreStories: 'More stories',
    noArticles: 'No articles available yet. Try again in a moment.',
    noStories: 'No stories yet for {category}.',
    searchIntro: 'Try a keyword to discover relevant reporting.',
    noMatch: 'No stories matched “{query}”.',
    loadingStories: 'Loading stories…',
    searchingStories: 'Searching stories…',
    articleNotFound: 'Article not found.',
    storyCopied: 'Story link copied to clipboard.',
    openSearch: 'Open search',
    home: 'Home',
    searchIcon: 'Search',
    heatIndex: 'Heat index',
    coastalRisk: 'Coastal risk',
    cleanPower: 'Clean power',
    stormWatch: 'Storm watch',
    aiInfrastructure: 'AI infrastructure',
    globalEconomy: 'Global economy',
    climateAction: 'Climate action',
    startupFunding: 'Startup funding',
    sportsAnalytics: 'Sports analytics',
    culturalShifts: 'Cultural shifts',
  },
  ml: {
    admin: 'അഡ്മിൻ',
    search: 'തിരയുക',
    subscribe: 'സബ്‌സ്‌ക്രൈബ്',
    menu: 'മെനു',
    close: 'അടയ്ക്കുക',
    live: 'തത്സമയം',
    readLead: 'തലക്കെട്ട് വായിച്ചു',
    browseLatest: 'പുതിയത് നോക്കുക',
    trending: 'ട്രെൻഡിംഗ്',
    topics: 'തലക്കെട്ടുകൾ',
    coverageMap: 'കവർേജ് മാപ്പ്',
    todaysNewsroom: 'ഇന്നത്തെ newsroom',
    latest: 'പുതിയത്',
    topStories: 'മികച്ച കഥകൾ',
    whatMattersNow: 'ഇപ്പോൾ പ്രധാനം',
    briefing: 'സമ്മേളനം',
    editorsPick: 'എഡിറ്ററിന്റെ തിരഞ്ഞെടുപ്പ്',
    deepReads: 'ആഴത്തിലുള്ള വായന',
    marketPulse: 'മാർക്കറ്റ് പൾസ്',
    markets: 'മാർക്കറ്റുകൾ',
    climateBrief: 'കാലാവസ്ഥാ സാരാംശം',
    resilienceWatch: 'പുനരുജ്ജീവന ചർച്ച',
    morningBrief: 'പ്രഭാത സാരാംശം',
    searchStories: 'കഥകൾ തിരയുക',
    searchPlaceholder: 'കഥകൾ, വിഷയങ്ങൾ അല്ലെങ്കിൽ ആളുകളെ തിരയുക...',
    readStory: 'കഥ വായിക്കുക',
    share: 'പങ്കിടുക',
    saveStory: 'കഥ സൂക്ഷിക്കുക',
    saved: 'സൂക്ഷിച്ചു',
    related: 'സംബന്ധിച്ച',
    moreStories: 'കൂടുതൽ കഥകൾ',
    noArticles: 'ഇതുവരെ പ്രശസ്തമായ ലേഖനങ്ങൾ ലഭ്യമല്ല.',
    noStories: '{category} എന്നതിനായി ഇതുവരെ കഥകളില്ല.',
    searchIntro: 'തോന്നിയിട്ടുള്ള ചോദ്യത്തിൽ നിന്ന് കണ്ടെത്താൻ ശ്രമിക്കുക.',
    noMatch: '“{query}” എന്നതിന് матч ചെയ്ത കഥകൾ ഇല്ല.',
    loadingStories: 'കഥകൾ ലഭ്യമാക്കുന്നു…',
    searchingStories: 'കഥകൾ തിരയുന്നു…',
    articleNotFound: 'കഥ കണ്ടെത്തിയില്ല.',
    storyCopied: 'കഥ ലിങ്ക് പകർത്തി.',
    openSearch: 'തിരയൽ തുറക്കുക',
    home: 'ഹോം',
    searchIcon: 'തിരയുക',
    heatIndex: 'താപ സൂചകം',
    coastalRisk: 'തീരദേശ അപകടം',
    cleanPower: 'സുചാരമുള്ള الطاقة',
    stormWatch: 'ചുഴലിക്കാറ്റ് നിരീക്ഷണം',
    aiInfrastructure: 'എഐ അടിസ്ഥാന സൗകര്യം',
    globalEconomy: 'ആഗോള സാമ്പത്തികം',
    climateAction: 'കാലാവസ്ഥാ പ്രവർത്തനം',
    startupFunding: 'സ്റ്റാർടപ്പ് ഫണ്ടിംഗ്',
    sportsAnalytics: 'സ്പോർട്സ് വിശകലനം',
    culturalShifts: 'സാംസ്കാരിക മാറ്റങ്ങൾ',
  },
  ta: {
    admin: 'நிர்வாகம்',
    search: 'தேடு',
    subscribe: 'சந்தா',
    menu: 'மெனு',
    close: 'மூடு',
    live: 'நேரலை',
    readLead: 'முக்கிய செய்தி',
    browseLatest: 'சமீபத்தை பாருங்கள்',
    trending: 'டிரெண்டிங்',
    topics: 'தலைப்புகள்',
    coverageMap: 'கவர் மேப்',
    todaysNewsroom: 'இன்றைய செய்தி அறை',
    latest: 'சமீபத்திய',
    topStories: 'சிறந்த செய்திகள்',
    whatMattersNow: 'இப்போது முக்கியம்',
    briefing: 'சுருக்கம்',
    editorsPick: 'தொகுப்பாளர் தேர்வு',
    deepReads: 'ஆழமான கட்டுரைகள்',
    marketPulse: 'சந்தை சுழற்சி',
    markets: 'சந்தைகள்',
    climateBrief: 'காலநிலை சுருக்கம்',
    resilienceWatch: 'எதிர்ப்பு கண்காணிப்பு',
    morningBrief: 'மாலைச் சுருக்கம்',
    searchStories: 'செய்திகளை தேடு',
    searchPlaceholder: 'செய்திகள், தலைப்புகள் அல்லது மக்கள்...',
    readStory: 'கதை வாசியுங்கள்',
    share: 'பகிர்',
    saveStory: 'கதையை சேமி',
    saved: 'சேமிக்கப்பட்டது',
    related: 'தொடர்புடையது',
    moreStories: 'மேலும் கதைகள்',
    noArticles: 'இதுவரை கட்டுரைகள் இல்லை.',
    noStories: '{category}க்கு இன்னும் கதைகள் இல்லை.',
    searchIntro: 'தொடர்புடைய அறிக்கைகளை கண்டுபிடிக்க ஒரு முக்கிய சொல்லை உள்ளிடவும்.',
    noMatch: '“{query}”க்கு பொருந்தும் கதைகள் எதுவும் இல்லை.',
    loadingStories: 'கதைகள் ஏற்றப்படுகின்றன…',
    searchingStories: 'கதைகள் தேடப்படுகின்றன…',
    articleNotFound: 'கதை கிடைக்கவில்லை.',
    storyCopied: 'கதை இணைப்பு நகலெடுக்கப்பட்டது.',
    openSearch: 'தேடலை திற',
    home: 'முகப்பு',
    searchIcon: 'தேடு',
    heatIndex: 'வெப்ப நிலை',
    coastalRisk: 'கடலோர ஆபத்து',
    cleanPower: 'சுத்தமான மின்சாரம்',
    stormWatch: 'புயல் கண்காணிப்பு',
    aiInfrastructure: 'செயற்கை நுண்ணறிவு உள்கட்டமைப்பு',
    globalEconomy: 'உலகப் பொருளாதாரம்',
    climateAction: 'காலநிலை நடவடிக்கை',
    startupFunding: 'ஸ்டார்ட்அப் நிதியுதவி',
    sportsAnalytics: 'விளையாட்டு பகுப்பாய்வு',
    culturalShifts: 'சமூக மாற்றங்கள்',
  },
  hi: {
    admin: 'एडमिन',
    search: 'खोजें',
    subscribe: 'सब्सक्राइब',
    menu: 'मेनू',
    close: 'बंद',
    live: 'लाइव',
    readLead: 'मुख्य खबर पढ़ें',
    browseLatest: 'नवीनतम देखें',
    trending: 'ट्रेंडिंग',
    topics: 'विषय',
    coverageMap: 'कवरेंज मैप',
    todaysNewsroom: 'आज की newsroom',
    latest: 'नवीनतम',
    topStories: 'मुख्य खबरें',
    whatMattersNow: 'अब क्या मायने रखता है',
    briefing: 'ब्रिफिंग',
    editorsPick: 'संपादक की पसंद',
    deepReads: 'गहरी कहानियाँ',
    marketPulse: 'मार्केट पल्स',
    markets: 'बाजार',
    climateBrief: 'जलवायु संक्षिप्त',
    resilienceWatch: 'लचीलापन पर नजर',
    morningBrief: 'सुबह की संक्षिप्त',
    searchStories: 'खबरें खोजें',
    searchPlaceholder: 'खबरें, विषय या लोगों को खोजें...',
    readStory: 'कहानी पढ़ें',
    share: 'साझा करें',
    saveStory: 'कहानी सेव करें',
    saved: 'सेव किया',
    related: 'संबंधित',
    moreStories: 'और कहानियाँ',
    noArticles: 'अभी तक कोई लेख उपलब्ध नहीं है।',
    noStories: '{category} के लिए अभी कोई कहानी नहीं है।',
    searchIntro: 'प्रासंगिक रिपोर्ट खोजने के लिए कोई कीवर्ड लिखें।',
    noMatch: '“{query}” से मेल खाने वाली कहानियाँ नहीं मिलीं।',
    loadingStories: 'कहानियाँ लोड हो रही हैं…',
    searchingStories: 'कहानियाँ खोजी जा रही हैं…',
    articleNotFound: 'लेख नहीं मिला।',
    storyCopied: 'लेख का लिंक कॉपी किया गया।',
    openSearch: 'खोज खोलें',
    home: 'होम',
    searchIcon: 'खोजें',
    heatIndex: 'ताप सूचकांक',
    coastalRisk: 'तटीय जोखिम',
    cleanPower: 'स्वच्छ ऊर्जा',
    stormWatch: 'तूफान Watch',
    aiInfrastructure: 'एआई आधारभूत संरचना',
    globalEconomy: 'वैश्विक अर्थव्यवस्था',
    climateAction: 'जलवायु कार्रवाई',
    startupFunding: 'स्टार्टअप फंडिंग',
    sportsAnalytics: 'स्पोर्ट्स एनालिटिक्स',
    culturalShifts: 'सांस्कृतिक बदलाव',
  },
  te: {
    admin: 'అడ్మిన్',
    search: 'వెతుకు',
    subscribe: 'సబ్‌స్క్రైబ్',
    menu: 'మెనూ',
    close: 'క్లోజ్',
    live: 'లైవ్',
    readLead: 'ముఖ్య కథ చదవండి',
    browseLatest: 'తాజా వార్తలు చూడండి',
    trending: 'ట్రెండ్',
    topics: 'విషయాలు',
    coverageMap: 'కవరేజ్ మ్యాప్',
    todaysNewsroom: 'ఈ రోజు newsroom',
    latest: 'తాజా',
    topStories: 'ముఖ్య కథలు',
    whatMattersNow: 'ఇప్పుడు ముఖ్యమైనది',
    briefing: 'బ్రీఫింగ్',
    editorsPick: 'ఎడిటర్ ఎంపిక',
    deepReads: 'లోతైన కథలు',
    marketPulse: 'మార్కెట్ పల్‌స్',
    markets: 'మార్కెట్స్',
    climateBrief: 'వాతావరణ సారాంశం',
    resilienceWatch: 'రిజిలియన్‌స్ మానిటర్',
    morningBrief: 'ఉదయపు సారాంశం',
    searchStories: 'కథలు వెతకండి',
    searchPlaceholder: 'కథలు, విషయాలు లేదా వ్యక్తులను వెతకండి...',
    readStory: 'కథ చదవండి',
    share: 'షేర్',
    saveStory: 'కథను సేవ్ చేయండి',
    saved: 'సేవ్ చేయబడింది',
    related: 'సంబంధిత',
    moreStories: 'మరిన్ని కథలు',
    noArticles: 'ఇంకా కథలు లేవు.',
    noStories: '{category} కోసం ఇంకా కథలు లేవు.',
    searchIntro: 'సంబంధిత కథలను కనుగొనడానికి కీలక పదాన్ని నమోదు చేయండి.',
    noMatch: '“{query}” కోసం సరిపోలే కథలు లేవు.',
    loadingStories: 'కథలు లోడ్ అవుతున్నాయి…',
    searchingStories: 'కథలు వెతుకుతున్నాం…',
    articleNotFound: 'కథ కనుగొనబడలేదు.',
    storyCopied: 'కథ లింక్ కాపీ చేయబడింది.',
    openSearch: 'సెర్చ్ తెరవండి',
    home: 'హోమ్',
    searchIcon: 'వెతుకు',
    heatIndex: 'వేడిమి సూచిక',
    coastalRisk: 'తీర ప్రమాదం',
    cleanPower: 'సుస్థిర శక్తి',
    stormWatch: 'చెలరేగే తుఫాను గమనణ',
    aiInfrastructure: 'ఎఐ ఆధారిత నిర్మాణం',
    globalEconomy: 'ప్రపంచ ఆర్థిక వ్యవస్థ',
    climateAction: 'వాతావరణ చర్య',
    startupFunding: 'స్టార్టప్ ఫండింగ్',
    sportsAnalytics: 'క్రీడా విశ్లేషణ',
    culturalShifts: 'సాంస్కృతిక మార్పులు',
  },
};

const normalizeTranslationKey = (title = '') => String(title)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .replace(/\s+/g, ' ');

const stripSlugSuffix = (value = '') => {
  const text = String(value || '').trim();
  if (!text) return '';
  return text.replace(/-(?:\d{13}|\d+)-[a-z0-9]+$/, '');
};

const slugifyText = (value = '') => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .replace(/-+/g, '-');

const getStableArticleKey = (article = {}) => {
  const slug = String(article.slug || '').trim();
  if (slug) {
    const normalizedSlug = stripSlugSuffix(slug);
    return normalizedSlug || slug;
  }

  if (article.id !== undefined && article.id !== null && String(article.id).trim()) {
    return `id:${article.id}`;
  }

  return normalizeTranslationKey(article.title || '');
};

const buildArticleTranslationIndex = () => {
  const entries = {};

  Object.entries(articleTranslations).forEach(([key, value]) => {
    if (!value) return;
    const normalizedKey = normalizeTranslationKey(key);
    entries[normalizedKey] = value;

    const slugKey = slugifyText(key);
    if (slugKey) entries[slugKey] = value;
  });

  return entries;
};

const articleTranslationIndex = buildArticleTranslationIndex();

export const getLanguageText = (language, key, fallback = '') => {
  const text = uiText[language]?.[key];
  return text || uiText.en[key] || fallback;
};

export const translateCategoryName = (category, language = 'en') => {
  const label = String(category || '').trim();
  if (!label) return '';
  const localeMap = categoryLabels[language] || categoryLabels.en;
  return localeMap[label] || categoryLabels.en[label] || label;
};

export function localizeArticle(article, language = 'en') {
  if (!article) return article;
  if (language === 'en') {
    return {
      ...article,
      translationStatus: 'none',
    };
  }

  const lookupKey = getStableArticleKey(article);
  const localeMap = articleTranslationIndex[lookupKey] || articleTranslationIndex[normalizeTranslationKey(article.title || '')] || articleTranslationIndex[String(article.title || '')];
  const translation = localeMap?.[language] || null;

  if (!translation) {
    return {
      ...article,
      translationStatus: 'missing',
    };
  }

  return {
    ...article,
    title: translation.title || article.title,
    summary: translation.summary || article.summary,
    content: Array.isArray(translation.content) && translation.content.length ? translation.content : article.content,
    author: translation.author || article.author,
    readTime: translation.readTime || article.readTime,
    translationStatus: 'translated',
  };
}

export function localizeArticles(articles = [], language = 'en') {
  return articles.map((article) => localizeArticle(article, language));
}
