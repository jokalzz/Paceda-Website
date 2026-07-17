# 🧪 Quick Test Checklist - User Dashboard

## Pre-Test Setup

### ✅ Step 1: Make Sure All Files Exist
```bash
# Run these commands to verify files are created:

# New files
ls src/pages/user/DashboardPage.jsx          # MUST EXIST
ls src/components/layout/UserLayout.jsx      # MUST EXIST

# Updated files
grep "UserDashboardPage" src/App.jsx         # Should return match
grep "/dashboard" src/App.jsx                # Should return match
grep "navigate('/dashboard')" src/pages/public/LoginPage.jsx  # Should return match
```

### ✅ Step 2: Clear Cache & Dependencies
```bash
# Install dependencies
npm install

# Optional: Clear cache
rm -rf node_modules/.vite
npm run build  # or just start dev server
```

### ✅ Step 3: Start Dev Server
```bash
npm run dev
```

Output should show:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## 🧪 Testing Flow

### Test 1: Register New User (5 minutes)
```
[ ] Open http://localhost:5173
[ ] Click "Daftar" button
[ ] Fill form:
    - Nama Lengkap: Test User
    - Email: testuser@example.com
    - Password: password123
[ ] Click "Daftar"
[ ] Should show success message or redirect
```

### Test 2: Login with New User (2 minutes)
```
[ ] Click "Masuk" button
[ ] Fill form:
    - Email: testuser@example.com
    - Password: password123
[ ] Click "Masuk"
[ ] ⭐ SHOULD REDIRECT TO /dashboard
    (If goes to / or shows error, something is wrong)
[ ] URL should change to http://localhost:5173/dashboard
```

### Test 3: Verify Dashboard Loads
```
[ ] Page header shows "Selamat datang kembali, Test User"
[ ] 6 stats cards visible with icons and 0 values
[ ] Stats cards show:
    - Total
    - Menunggu
    - Diproses
    - Ditolak
    - Disetujui
    - Selesai
[ ] 4 quick action buttons visible:
    - Ajukan Surat Baru
    - Cek Status Surat
    - Profil Saya
    - Peta Digital
[ ] "Recent Pengajuan" section shows "Belum ada pengajuan"
[ ] Profile card shows user name and email
[ ] Pengumuman section shows announcements or empty
[ ] Help card visible at bottom
```

### Test 4: Test Quick Action Buttons
```
[ ] Click "Ajukan Surat Baru" → Should go to /pengajuan-surat
[ ] Go back to dashboard
[ ] Click "Cek Status Surat" → Should go to /status-surat
[ ] Go back to dashboard
[ ] Click "Profil Saya" → Should go to /profil
[ ] Go back to dashboard
[ ] Click "Peta Digital" → Should go to /peta-digital
```

### Test 5: Test Responsiveness
```
Mobile View (< 640px):
[ ] Open DevTools (F12)
[ ] Set device to iPhone 12
[ ] Refresh page
[ ] Header should be compact
[ ] Stats cards should be 2 columns
[ ] All content should be readable
[ ] No horizontal scroll

Tablet View (640px - 1024px):
[ ] Set device to iPad
[ ] Refresh page
[ ] Content should expand
[ ] Still readable and clean

Desktop View (> 1024px):
[ ] Set device to Desktop
[ ] Refresh page
[ ] Full layout visible
[ ] Sidebar should be on right
[ ] All stats cards visible (6 columns)
```

### Test 6: Test Navigation
```
[ ] From dashboard, go to /pengajuan-surat
[ ] Click navbar logo → should go to /
[ ] From home page, click "Daftar" → register page
[ ] Login again → dashboard
[ ] From navbar, click profile dropdown
[ ] Click "Profil Saya" → /profil
[ ] Click "Keluar" → should logout
[ ] Should redirect to /login
[ ] Try access /dashboard without login
[ ] Should redirect to /login
```

### Test 7: Test Error Handling
```
[ ] Open DevTools Console (F12 → Console)
[ ] Should NOT show red errors
[ ] May see some warnings (okay)
[ ] Go back to dashboard
[ ] Should work fine (refresh if needed)
```

### Test 8: Admin Access (Optional)
```
Note: Requires setting up admin user in Supabase

[ ] Go to Supabase dashboard
[ ] Table Editor → profiles
[ ] Find your test user
[ ] Change role from 'user' to 'admin'
[ ] Go back to website dashboard
[ ] Try access /admin → should see admin dashboard
[ ] Navbar should show "Dashboard Admin" option
```

---

## 🎯 Expected Results

### ✅ Success Indicators
- [x] User can register
- [x] User can login
- [x] Login redirects to /dashboard (NOT to /)
- [x] Dashboard loads without 404 errors
- [x] Stats cards display
- [x] Quick action buttons work
- [x] Responsive on mobile/tablet/desktop
- [x] No red console errors
- [x] Can navigate between pages
- [x] Can logout successfully

### ❌ Failure Indicators (Need to Fix)
- [ ] Login doesn't redirect to /dashboard
- [ ] Page shows 404 error
- [ ] Stats cards don't display
- [ ] Buttons don't navigate
- [ ] Console shows red errors
- [ ] Page not responsive
- [ ] Can't logout

---

## 🐛 If Something is Wrong

### Issue: "404 Not Found at /dashboard"
**Check:**
1. File `src/pages/user/DashboardPage.jsx` exists?
2. File `src/components/layout/UserLayout.jsx` exists?
3. App.jsx has this route?
   ```javascript
   <Route path="/dashboard" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
     <Route index element={<UserDashboardPage />} />
   </Route>
   ```
4. Restart dev server (Ctrl+C, then `npm run dev`)

### Issue: "Login goes to / instead of /dashboard"
**Check:**
1. LoginPage.jsx has `navigate('/dashboard')`?
   ```javascript
   navigate('/dashboard');  // NOT navigate('/');
   ```
2. Try clearing browser cache
3. Restart dev server

### Issue: "Stats cards show 0 but have data"
**Check:**
1. Console for errors (F12 → Console)
2. Supabase connection working?
3. `.env` has correct credentials?
4. Database has data?
   ```bash
   # Go to Supabase dashboard
   # Table Editor → pengajuan_surat
   # Should see data if you've tested pengajuan
   ```

### Issue: "Can't see user name in dashboard"
**Check:**
1. Profile loaded from AuthContext?
2. User profile created in profiles table?
   ```bash
   # Supabase → Table Editor → profiles
   # Should see your user with full_name
   ```
3. Refresh page (Ctrl+R)

---

## 📊 Data Verification

### Expected Supabase State After Testing:

**Table: auth.users**
- Should have at least 1 user (test user)

**Table: profiles**
- Should have matching profile for test user
- full_name: "Test User"
- role: "user" (unless made admin)

**Table: pengajuan_surat**
- May be empty (or have test data if tested pengajuan)

**Storage Buckets**
- 5 buckets should exist (created during Supabase setup)

---

## 📝 Notes

1. **First Load Might Be Slow**
   - First time Supabase loads can be slow
   - Subsequent loads are faster
   - If takes > 10 seconds, check connection

2. **Browser Cache Issues**
   - If page looks broken, clear cache (Ctrl+Shift+Delete)
   - or Open DevTools → Application → Clear storage

3. **Multiple Logins**
   - Can login with different users to test
   - Each user sees their own data
   - Safe to create test accounts

4. **Admin Testing**
   - Only test admin if needed
   - Regular user dashboard is enough for now
   - Admin dashboard is in `/admin` route

---

## 📞 If Still Having Issues

### Check These Files:
1. `src/App.jsx` - Verify routing
2. `src/pages/user/DashboardPage.jsx` - Check component export
3. `src/components/layout/UserLayout.jsx` - Check component render
4. `.env` - Verify Supabase credentials

### Check These Places:
1. Browser Console (F12 → Console) - for errors
2. Supabase Dashboard - verify data exists
3. Network tab (F12 → Network) - check API calls
4. Terminal where dev server runs - for build errors

### Still Stuck?
1. Read `USER_DASHBOARD_GUIDE.md`
2. Read `SUPABASE_SETUP_GUIDE.md`
3. Check `DATABASE_STRUCTURE.md`

---

## ✅ Final Checklist

Before declaring success:

- [ ] All 3 new/updated files are in place
- [ ] Dev server starts without errors
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Login redirects to /dashboard (not /)
- [ ] Dashboard page loads
- [ ] All UI elements visible
- [ ] Stats cards display
- [ ] Quick action buttons work
- [ ] Responsive on mobile
- [ ] No red console errors
- [ ] Can navigate between pages
- [ ] Can logout
- [ ] Dashboard shows user name

---

**🎊 If all checkboxes are ticked, Dashboard is WORKING! 🎉**

Dibuat dengan ❤️ untuk Smart Kelurahan Paceda
