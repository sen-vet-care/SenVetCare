# Dr. Tamal B. Sen Memorial Clinic – AI Powered WebApp

This project incorporates the requested "living digital clinic" features, immersive UI mapped to physical sections, an integrated AI assistant (Dr. Lily®), and is designed around the requested Supabase schema.

## Features Built
1. **Interactive Zones**: Component architecture mapping to physical clinic spaces (Reception, Pharmacy, Diagnostics Lab, Emergency etc.)
2. **Immersive Design System**: Elements load with grayscale styling and transition to full color on interaction/hover, giving a premium and discovery-focused feel.
3. **Dr. Lily® AI Assistant**: Built directly into the frontend, it connects via Gemini 3 Flash to simulate the clinic's digital assistant, responding to specific clinical contexts.
4. **Supabase Architecture**: A ready-to-deploy schema (`supabase_schema.sql`) and configured client (`src/services/supabase.ts`) awaits your keys for deep integrations (like the automated blog pipeline). 
5. **SEO Optimized**: The structure allows dynamic loading of editorial blog content, with space to inject automated HTML schema when hooked to the database.

## Automated Blog Pipeline Architecture (Next Steps mapping)

1. Set up a Supabase Edge Function or a serverless CRON job.
2. The CRON job hits the Gemini API using trending SEO keywords.
3. Content is pushed directly into the `blogs` Supabase table.
4. (Optional) Hook up a library or third-party API that turns the Title/Excerpt into a generated PNG if needed, and stores the image URL in `media_assets`.
5. Frontend fetches from `blogs` table where `is_published = true`.

---

## Deployment Steps (GitHub -> Netlify)

This project has been initialized using standard tooling fully compatible with Netlify.

### 1. Version Control (GitHub)
- Initialize your Git repository locally:
  \`\`\`bash
  git init
  git add .
  git commit -m "Initial commit of Dr. CBS Memorial App"
  \`\`\`
- Push to your new GitHub repository:
  \`\`\`bash
  git branch -M main
  git remote add origin https://github.com/your-username/dr-tbsen-memorial.git
  git push -u origin main
  \`\`\`

### 2. Connect to Netlify
- Go to [Netlify.com](https://www.netlify.com/) and log in.
- Click **"Add new site"** -> **"Import an existing project"**.
- Select **GitHub** and authorize Netlify.
- Choose the repository \`dr-tbsen-memorial\`.

### 3. Configure Netlify Build Settings
- **Base directory**: (Leave empty unless nested)
- **Build command**: \`npm run build\`
- **Publish directory**: \`dist\`

### 4. Provide Environment Variables
Before deploying, click **Show advanced** and add your environment variables to Netlify:
- \`GEMINI_API_KEY\` = \`Your Gemini Key\`
- \`VITE_SUPABASE_URL\` = \`Your Supabase URL\`
- \`VITE_SUPABASE_ANON_KEY\` = \`Your Supabase Anon Key\`

### 5. Deploy!
- Click **"Deploy site"**. Netlify will automatically build the React (Vite) application and serve the resulting static \`dist/\` files. Every future push to the \`main\` branch will trigger a new deployment.
