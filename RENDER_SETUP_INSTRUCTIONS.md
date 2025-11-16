# 🚀 Render Blueprint Setup Instructions

## ✅ Step 1: Create render.yaml

I've created `render.yaml` in your repository root. This file defines:
- **Gateway Service** (Web Service - port 3000)
- **Authentication Service** (Background Worker - port 3001)

## 📋 Step 2: Commit and Push render.yaml

```bash
cd NestNextAuth-backend
git add render.yaml
git commit -m "Add render.yaml for Blueprint deployment"
git push origin master
```

## 🔧 Step 3: Set Up MongoDB Atlas (Free)

Since Render doesn't provide MongoDB in the free tier, use MongoDB Atlas:

1. **Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)**
2. **Sign up** (free account)
3. **Create a free M0 cluster**
4. **Get connection string:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/users_db`

## 🎯 Step 4: Deploy on Render

1. **Go back to Render Blueprint**
2. **Click "Retry"** (now that render.yaml is pushed)
3. **Render will detect the services**

## ⚙️ Step 5: Configure Environment Variables

After services are created, you need to set these environment variables **manually** in Render dashboard:

### For Gateway Service:

1. Go to **Gateway service** → **Environment** tab
2. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/users_db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### For Authentication Service:

1. Go to **Authentication service** → **Environment** tab
2. Add these variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/users_db
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-change-this
```

**Important:** Use the **same** `JWT_SECRET` and `MONGODB_URI` in both services!

## 🔗 Step 6: Service Discovery

The `render.yaml` uses Render's service discovery:
- `AUTH_SERVICE_HOST` is automatically set from the Authentication service
- Services can communicate via Render's internal network

## ⚠️ Important Notes

### TCP Microservices on Render

Render's free tier might have limitations with TCP connections between services. If you encounter connection issues:

1. **Check service logs** in Render dashboard
2. **Verify service URLs** are correct
3. **Test health endpoints:**
   - Gateway: `https://nestnextauth-gateway.onrender.com/health`
   - Authentication: Check logs for startup message

### If TCP Doesn't Work

If services can't connect via TCP, you might need to:
- Use HTTP instead of TCP (requires code changes)
- Or deploy as a single service (not ideal for microservices)

## ✅ Step 7: Get Your Gateway URL

After deployment:
- Gateway URL: `https://nestnextauth-gateway.onrender.com`
- Use this for `NEXT_PUBLIC_API_URL` in Vercel

## 🐛 Troubleshooting

### Issue: Services can't connect

**Check:**
1. Both services are deployed and running
2. Environment variables are set correctly
3. Service discovery is working (check `AUTH_SERVICE_HOST` in Gateway)

### Issue: MongoDB connection failed

**Fix:**
1. Verify MongoDB Atlas connection string
2. Check IP whitelist in MongoDB Atlas (allow all IPs: `0.0.0.0/0`)
3. Ensure database name matches: `users_db`

### Issue: Build fails

**Fix:**
1. Check build logs
2. Verify `package.json` has correct scripts
3. Check Node.js version compatibility

## 📝 Summary

1. ✅ `render.yaml` created
2. ⏳ Commit and push to GitHub
3. ⏳ Set up MongoDB Atlas
4. ⏳ Deploy on Render (click Retry)
5. ⏳ Add environment variables manually
6. ⏳ Test deployment
7. ⏳ Update frontend with Gateway URL

---

**After pushing render.yaml, click "Retry" in Render! 🚀**

