# **Deployment Reflection – Azure Version**

## **Azure Deployment Summary**

* Deployed the Lovable-generated application to **Azure App Service** using the **Linux Node.js** runtime.
* Cloned the Lovable Git repository locally, configured `.env` variables, and tested the application using `npm run dev` and `npm run build`.
* Set environment variables in **Azure App Service → Configuration**, including:

  * `VITE_SUPABASE_URL`
  * `VITE_SUPABASE_PROJECT_ID`
  * `VITE_SUPABASE_PUBLISHABLE_KEY`
  * `VITE_OPENAI_API_KEY`
  * Other required runtime variables
* Triggered a new deployment so Azure could rebuild the Vite app with the correct environment variables.
* Connected GitHub repo (or used ZIP deployment depending on your method).
* Verified that the app was reachable via the Azure App Service URL.
* Confirmed successful backend integration with Supabase and Azure-hosted OpenAI endpoint (set up tp replace the lovable api key).

## **Security**

* Used an Azure AD user with **least-privilege IAM roles** (not the subscription root owner).
* Environment variables securely stored in **App Service Configuration** (never stored in GitHub or committed to the repo).
* Azure OpenAI key stored using built-in secrets management—never exposed in client-side code.
* Connection restricted to HTTPS using Azure’s built-in TLS/SSL support.
* No direct access to containers or underlying VMs (PaaS model reduces attack surface).
* Monitoring enabled via App Service logs and Application Insights (optional).

## **Multi-cloud Notes**

* Azure deployment validated the baseline functionality and Supabase/OpenAI integration.
* AWS deployment achieved functional parity using the same build artifacts and environment configuration.
* Multi-cloud approach ensures failover capability and platform independence.
* Both platforms run the same frontend build, but differ in runtime hosting (Azure App Service vs AWS Elastic Beanstalk).


--------------------------------------------

## **Azure CI/CD Setup (GitHub Actions) for Static Web App**

To automate deployments on Azure, I deployed the app as a **Static Web App** and connected it directly to my GitHub repository.

1. **Created the Static Web App**

   * Set up through the Azure Portal and linked to my GitHub repo and `main` branch during creation.

2. **Workflow Auto-Generated**

   * Azure automatically created a GitHub Actions workflow file in `.github/workflows`, configured for my project structure.

3. **Build & Deployment Config**

   * The workflow defined the app location, optional API location, and output folder so GitHub Actions can build and package the app.

4. **Secure Authentication**

   * Azure provided a deployment token which GitHub stored as a secret (`AZURE_STATIC_WEB_APPS_API_TOKEN`).

5. **Automated CI/CD Flow**

   * Every time I **push to the main branch**:

     * GitHub Actions runs
     * Builds the static site
     * Deploys it directly to the Azure Static Web App environment
   * No manual deployment steps are required.

6. **Result**

   * Azure now deploys automatically from GitHub, giving me a clean and consistent CI/CD pipeline aligned with my multi-cloud setup.

--------------------------------------------

### **Reasons for Choosing Static Web App over App Service**

1. **Optimized for Frontend Frameworks**

   * SWA is designed for modern frontend frameworks (React, Vue, Angular) with a static build output.
   * Automatically handles routing, SPA fallback, and frontend hosting with minimal configuration.

2. **Built-in CI/CD Integration**

   * SWA integrates directly with GitHub Actions during creation.
   * Pushes to `main` automatically trigger builds and deployments, reducing manual steps.

3. **Serverless API Support**

   * Supports Azure Functions for backend logic without needing a full server instance.
   * Perfect for our Supabase Edge Function calls or small API endpoints.

4. **Simpler & Cheaper**

   * SWA’s free tier covers hosting, SSL, and global CDN out-of-the-box.
   * No need to manage VMs, scaling, or platform updates like in App Service.

5. **Performance**

   * Global CDN automatically distributes our static content closer to users.
   * Fast load times with minimal backend overhead.

-------------------------

