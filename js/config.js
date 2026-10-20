// כתובת ה-Web App של Google Apps Script שמקבל את הלידים.
// אחרי הפריסה בגוגל (ראו README) מדביקים כאן את הכתובת שמסתיימת ב- /exec
window.LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbxAyfI7a9bDcyg_sJGotJYjW6FSfV_5XOsZB4tmY2nuFazKVnwSM8WUdDvBOskmermq/exec";

// קישורים לעמודי הפרויקטים המלאים (לפי ה-data-project של כל כרטיס).
// כרטיס בלי קישור לא יהיה לחיץ.
window.PROJECT_LINKS = {
  "naomi-gutman": "projects/naomi-gutman.html",
  "zman-yaar": "projects/zman-yaar.html",
  "rikmat": "projects/rokemet.html",
  "maavar-lakavim": "projects/meever-lakavim.html",
  "maya-shiflaski": "projects/maya-shipelski.html",
  "tenniswing": "projects/tenniswing.html",
  "yaldei-hateva": "",
  "terra": "",
  "sapir-elmaliah": "",
  "puah-oria": ""
};

// הפרויקטים להצגה ב"פרויקטים נוספים" בסוף כל עמוד פרויקט (נבחרים 3 באקראי).
// page = שם קובץ העמוד בתיקייה projects, img = תמונת הכרטיס מדף הבית
window.PROJECTS = [
  { page: "naomi-gutman.html",   img: "naomi-gutman.jpg",   name: "נעמי גוטמן",   type: "מיתוג, אתר ומערכת ניהול", result: "מרעיון – לעסק מוכן לצאת לדרך" },
  { page: "zman-yaar.html",      img: "zman-yaar.jpg",      name: "זמן יער",      type: "מיתוג ואתר תדמית",        result: "20 פניות כבר ביום הראשון" },
  { page: "rokemet.html",        img: "rikmat.jpg",         name: "רֹקמת",        type: "מיתוג",                    result: "מ-1-2 ל-8-10 מטופלות בחודש" },
  { page: "maya-shipelski.html", img: "maya-shiflaski.jpg", name: "מיה שיפלסקי",  type: "מיתוג",                    result: "מעסק מפוזר – למותג שמדבר על משמעות" },
  { page: "tenniswing.html",     img: "tenniswing.jpg",     name: "TENNISWING",   type: "מיתוג",                    result: "מותג שבעל המועדון גאה לעמוד מאחוריו" },
  { page: "meever-lakavim.html", img: "maavar-lakavim.jpg", name: "מעבר לקווים",  type: "מיתוג",                    result: "זהות ראשונה לעסק שצמח מפה לאוזן" }
];

// פיד האינסטגרם: כתובת ה-JSON Feed מ-Behold (נראית כך: https://feeds.behold.so/XXXXXXXX)
// כל עוד ריק – הסקשן של האינסטגרם לא מוצג באתר
window.INSTAGRAM_FEED_URL = "https://feeds.behold.so/iqJ9RFzw4AX5fNUizpN2";

// קישור לעמוד הפייסבוק (ריק = הקישור לא יהיה לחיץ)
window.FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100079308916934";
