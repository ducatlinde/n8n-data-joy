This demo application connects a React-based frontend with a Supabase database and two n8n workflows. It allows users to view and edit data in a table, with all interactions handled via GET and POST webhooks.
To use the app, you can either download the GitHub repository directly or launch it online. The repository is available at:
https://github.com/ducatlinde/n8n-data-joy.git
You can run the frontend locally by cloning the repository and installing dependencies, or you can open https://n8n-data-joy.lovable.app/ to access the app directly in your browser.
Before using the app, you need to set up your own n8n environment. This includes importing two workflow files: one for loading data (n8n_Demo_Get_v2.json) and one for saving data (n8n_Demo_Post_v2.json). These should be imported into two separate projects within n8n. (They can be found in the linked GitHub repository)
Once imported, you’ll need to configure the required credentials. This includes access to your Supabase database (you’ll need to insert your Supabase URL and anon key) and optionally an OpenAI API key, which n8n currently supports with free credits for AI agents.
After setting up the credentials, open each workflow and double-click on the webhook node. Copy the generated webhook URLs—one for GET and one for POST—and paste them into the corresponding fields in the frontend.
To load data, make sure the GET workflow is active and click “Execute Workflow” in n8n before pressing the “Load Data” button in the frontend. Similarly, when editing and saving data, you must execute the POST workflow before clicking “Save” in the app.
Please note that this is a demo version. If you want to connect the app to a different Supabase database, you’ll need to manually adjust the field mappings in the n8n nodes to match your database schema.
This setup allows users with minimal technical background to explore how n8n workflows can be integrated with a modern frontend and a cloud database.
