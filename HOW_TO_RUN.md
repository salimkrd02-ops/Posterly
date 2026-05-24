# 🎯 HOW TO OPEN/RUN POSTERGEN APP

## ✅ The Easiest Way - 2 Methods

---

## Method 1: Run the Batch Script (EASIEST) ⭐

### Step 1: Open File Explorer
- Press `Win + E` on your keyboard
- Navigate to: `C:\Users\Admin\OneDrive\文档\web\PosterGen`

### Step 2: Double-Click RUN.bat
- Look for the file named: **RUN.bat** (newly created)
- Double-click it
- A command prompt window will open
- The script will automatically:
  - ✅ Install dependencies
  - ✅ Generate Prisma client
  - ✅ Start the dev server
  - ✅ Open http://localhost:3000 in your browser

### That's it!
Just wait 2-5 minutes and your app opens automatically.

---

## Method 2: Manual Commands (If you prefer terminal)

### Step 1: Open Command Prompt
- Press `Win + R`
- Type: `cmd`
- Press Enter

### Step 2: Run These 4 Commands
```bash
cd C:\Users\Admin\OneDrive\文档\web\PosterGen
npm install
npm run prisma:generate
npm run dev
```

### Step 3: Wait & See Your App
- Terminal will show: `✓ Ready in X.Xs`
- Browser opens to http://localhost:3000
- You see the PosterGen landing page

---

## What to Expect

### First Run (with npm install)
- **Takes:** 2-5 minutes
- **Why:** Downloading 25+ npm packages
- **Don't close** the terminal!

### After npm install
- **Takes:** 1 minute
- **Why:** Starting Next.js dev server
- **You'll see:** "✓ Ready in X.Xs"

### Browser Opens
- **Automatic:** http://localhost:3000
- **Shows:** PosterGen landing page
- **Design:** Blue gradient, professional UI
- **Success:** App is running! 🎉

---

## Troubleshooting

### "npm is not found"
- Solution: Install Node.js from https://nodejs.org/
- Choose version 18 or newer

### "Port 3000 already in use"
- Solution: Run this instead:
```bash
npm run dev -- -p 3001
```
- Then visit http://localhost:3001

### "npm install is taking forever"
- This is normal! First install takes 2-5 minutes
- Your internet speed affects this
- Don't close the terminal

### Command Prompt closes immediately
- Solution: Use RUN.bat instead (doesn't close)
- Or add `pause` at end of commands

---

## Success Checklist ✅

After running, you should see:

Terminal:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000

✓ Ready in 2.5s
```

Browser:
- [ ] Page loads without errors
- [ ] Can see PosterGen logo
- [ ] Blue gradient background visible
- [ ] Feature cards are displayed
- [ ] No red error messages (F12 to check)

**All checked? Your app is running!** 🚀

---

## To Stop the Server

- Press `Ctrl + C` in the terminal
- Type `Y` if prompted
- Server stops

---

## To Start Again

- Either:
  1. Double-click RUN.bat again, OR
  2. Run `npm run dev` command again

---

## File Created for Easy Launch

**RUN.bat** - Automatically does everything:
- Checks for package.json
- Installs dependencies (if needed)
- Generates Prisma client
- Starts dev server
- No manual commands needed!

Just double-click it! 💪

---

## Next Steps (After App Runs)

1. ✅ See the landing page
2. 📖 Read COMPLETE_CODE.md for code examples
3. 🔨 Copy authentication code
4. 🎨 Build login/signup pages
5. ⚡ Add event management features
6. 🖼️ Create template editor
7. 📸 Implement poster generation

---

## Quick Reference

| Need | File/Command |
|------|--------------|
| Easiest launch | Double-click **RUN.bat** |
| Manual launch | Run the 4 commands above |
| Stop server | Press Ctrl+C |
| View app | http://localhost:3000 |
| View code | COMPLETE_CODE.md |
| Get help | INDEX.md |

---

## Summary

✅ **Easiest:** Double-click RUN.bat
✅ **Alternative:** Run 4 commands manually
✅ **Result:** App opens on http://localhost:3000
✅ **Time:** 10-15 minutes first run
✅ **Next:** Start building features!

---

**Ready? Go double-click RUN.bat! 🚀**
