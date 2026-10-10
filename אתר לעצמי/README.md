# האתר של עמית סיגאוי – מדריך העלאה לאוויר

מה יש בתיקייה:
- `site/` – האתר עצמו (זה מה שעולה לאוויר)
- `google-apps-script/Code.gs` – הקוד שמקבל את הלידים מהטופס
- `serve.ps1` – שרת מקומי לתצוגה מקדימה (לא עולה לאוויר)

---

## שלב 1 – חיבור הטופס לגוגל שיטס (10 דקות)

1. נכנסים ל-https://sheets.new (עם amit.roxas@gmail.com) ונותנים לגיליון שם, למשל "לידים מהאתר".
2. בתפריט: **הרחבות → Apps Script**.
3. מוחקים את מה שכתוב שם, ומדביקים את כל התוכן של `google-apps-script/Code.gs`. שומרים (Ctrl+S).
4. בוחרים למעלה את הפונקציה `testLead` ולוחצים **הפעלה**. גוגל יבקש הרשאות: מאשרים (אם מופיע "Google hasn't verified this app": Advanced → Go to… → Allow).
   ← אמורה להופיע שורת ניסיון בגיליון ומייל בתיבה.
5. **פריסה → פריסה חדשה** → סוג: **אפליקציית אינטרנט**
   - Execute as: **Me**
   - Who has access: **Anyone**
   → פריסה, ומעתיקים את הכתובת שמסתיימת ב-`/exec`.
6. פותחים את `site/js/config.js` ומדביקים אותה בין המרכאות של `LEAD_ENDPOINT`.

## שלב 2 – העלאה ל-GitHub Pages (חינם, כולל https)

1. ב-GitHub: **New repository** → שם: `amitsigawi-site` → Public → Create.
2. בעמוד הריפו: **uploading an existing file** → גוררים פנימה את **כל התוכן של תיקיית `site`** (את הקבצים והתיקיות שבתוכה, לא את התיקייה עצמה) → Commit changes.
3. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
   אחרי דקה-שתיים האתר זמין בכתובת `https://<שם-המשתמש>.github.io/amitsigawi-site/`.

## שלב 3 – חיבור הדומיין (ג'טסרבר)

1. ב-GitHub: **Settings → Pages → Custom domain** → כותבים `www.הדומיין-שלך` → Save.
2. בפאנל הניהול של ג'טסרבר, בניהול רשומות DNS של הדומיין:
   - **מוחקים** את הרשומות שמפנות ל-Adobe Portfolio (רשומת A ו/או CNAME שמצביעות על adobe / myportfolio).
   - מוסיפים 4 רשומות **A** לדומיין הראשי (`@`):
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - מוסיפים רשומת **CNAME** עבור `www` שמצביעה ל-`<שם-המשתמש>.github.io`
3. מחכים (בין כמה דקות לכמה שעות), ואז ב-GitHub Pages מסמנים **Enforce HTTPS**.
4. ב-Adobe Portfolio: מסירים את הדומיין מההגדרות (Settings → Domain Name).

## עדכונים בעתיד
משנים את הקובץ ומעלים אותו שוב לריפו (Add file → Upload files) – האתר מתעדכן לבד תוך דקה.

## עוד לפני העלייה
- `site/js/config.js` – קישורים לעמודי הפרויקטים המלאים ולפייסבוק (כרטיס בלי קישור פשוט לא לחיץ).
- `site/privacy.html`, `site/accessibility.html` – טיוטות בסיסיות, כדאי לעבור עליהן.
