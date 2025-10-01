This demo application connects a React-based frontend with a Supabase database and two n8n workflows. It allows users to load and edit data in a table using GET and POST webhooks.
To get started, you can either download the GitHub repository or launch the app directly in your browser:

GitHub repository: https://github.com/ducatlinde/n8n-data-joy.git
Online preview : Paste the link https://n8n-data-joy.lovable.app/ in your browser to view the frontend

Once the frontend is running, you’ll need to set up your own n8n environment. This involves importing two workflow files:

n8n_Demo_Get_v2.json for loading data
n8n_Demo_Post_v2.json for saving data

Create two separate workflows in n8n and import each file into its respective project.
Next, configure the required credentials:

Supabase credentials:

Supabase Host: https://ximaqrszmdkjkracetes.supabase.co
Supabase service role key : [can be found in ppt presentation]


OpenAI API key (optional): n8n currently offers free credits for AI agents

After setting up the credentials, open each workflow and double-click the webhook node. Copy the generated webhook URLs—one for GET and one for POST—and paste them into the corresponding fields in the frontend.
To use the app:

Before clicking “Load Data” in the frontend, execute the GET workflow in n8n
After editing data, execute the POST workflow before clicking “Save”

Please note: This is a demo version. If you want to connect the app to a different Supabase database, you’ll need to manually adjust the field mappings in the n8n nodes to match your schema.
This setup is designed to be simple and accessible, even for users with little technical experience.
