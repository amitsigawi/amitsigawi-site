// כתובת ה-Web App של Google Apps Script שמקבל את הלידים.
// אחרי הפריסה בגוגל (ראו README) מדביקים כאן את הכתובת שמסתיימת ב- /exec
window.LEAD_ENDPOINT = "https://script.google.com/macros/s/AKfycbxAyfI7a9bDcyg_sJGotJYjW6FSfV_5XOsZB4tmY2nuFazKVnwSM8WUdDvBOskmermq/exec";

// קישורים לעמודי הפרויקטים המלאים (לפי ה-data-project של כל כרטיס).
// כרטיס בלי קישור לא יהיה לחיץ.
window.PROJECT_LINKS = {
  "zman-yaar": "",
  "rikmat": "",
  "maavar-lakavim": "",
  "maya-shiflaski": "",
  "tenniswing": "",
  "yaldei-hateva": "",
  "terra": "",
  "sapir-elmaliah": "",
  "puah-oria": ""
};

// פיד האינסטגרם: כתובת ה-JSON Feed מ-Behold (נראית כך: https://feeds.behold.so/XXXXXXXX)
// כל עוד ריק – הסקשן של האינסטגרם לא מוצג באתר
window.INSTAGRAM_FEED_URL = "https://feeds.behold.so/iqJ9RFzw4AX5fNUizpN2";

// קישור לעמוד הפייסבוק (ריק = הקישור לא יהיה לחיץ)
window.FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100079308916934";
