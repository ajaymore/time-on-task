## Google Auth
- Visit [Google Cloud Console](https://cloud.google.com/console/project)
- Select your project from the dropdown next to title "Google Cloud Platform"
- Open Side Panel click hamburger Icon on the top
- Then click on *APIs & Services* in the sidebar
- Click on **ENABLE APIS AND SERVICES** under *Dashboard*
- Enable **Google+ API** and **Gmail API**
- Next, click on *Credentials* tab
- Click on **Create Credentials** button > Click **Oauth Client ID**
- Select *Web Application*
- In the *Create Client ID* dialog:
 - **Application Type**: Web Application
 - **Authorized Javascript origins**: http://localhost:8000
 - **Authorized redirect URI**: http://localhost:8000/auth/google/callback and https://developers.google.com/oauthplayground
- Click on **Create Client ID** button
- Copy and paste *Client ID* and *Client secret* keys into `.env`
- Visit https://developers.google.com/oauthplayground/
- Click the Gear Button on the right-top. Check **Use your own OAuth credentials** Set your Client ID and Client Secret obtained from above steps, and select Access token location as Authorization header w/ Bearer prefix. Close this configuration overlay.
- Select ` https://mail.google.com/` under Select the scope and click Authorize APIs
- In Step two click **Exchange authorization code for tokens**
- Copy the refreshtoken and add to the .env file next to **MAIL_CLIENT_REFRESH_TOKEN**

**Note:** When you ready to deploy to production don't forget to
add your new url to *Authorized Javascript origins* and *Authorized redirect URI*,
e.g. `http://my-awesome-app.herokuapp.com` and
`http://my-awesome-app.herokuapp.com/auth/google/callback` respectively.
The same goes for other providers.

## Components
- Express
- Passport | local and google login
- mongoose
- nodemailer
- graphql | queries, mutations, subscriptions, access control
- file uploads