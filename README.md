# Salah's little classroom: setup guide

A tiny static site (plain HTML, one CSS file, one JS helper) for GitHub Pages.
Sign up and login run on Firebase (free plan is enough to start). Lessons live in Firestore, so the video links are never in your public code.

## 1. Create the Firebase project
1. Go to https://console.firebase.google.com and click **Add project**.
2. Open **Build > Authentication > Get started**. Enable **Email/Password** and **Google**.
3. Open **Build > Firestore Database > Create database**. Choose production mode and a region in Europe.

## 2. Connect the site
1. In **Project settings > Your apps**, add a **Web app** (the `</>` icon).
2. Copy the four values (`apiKey`, `authDomain`, `projectId`, `appId`) into `firebaseConfig` in `firebase.js`.
   These values are public by design. The security comes from the rules in step 3.

## 3. Lock the database (important)
In **Firestore > Rules**, paste the whole content of `firestore.rules` and click **Publish**.
This makes: lessons readable only by students with a confirmed email, each profile visible only to its owner, and questions write-only for students.

## 4. Publish on GitHub Pages
1. Create a repository and upload all files from this folder.
2. **Settings > Pages**: deploy from branch `main`, folder `/ (root)`.
3. Copy your site address (like `yourname.github.io/repo`).
4. Back in Firebase: **Authentication > Settings > Authorized domains > Add domain**, and add `yourname.github.io` (the domain only, no path). Without this, Google sign-in will fail.

## 5. Add your first lesson
In Firestore, create a collection `videos` and add a document (auto ID) with these fields:

| Field | Type | Example |
|---|---|---|
| title | string | Install Python and VS Code |
| track | string | Setup guides |
| description | string | Everything you need before session 1. |
| note | string | (optional) My handwritten-style note under the video |
| youtubeId | string | the 11 characters after `v=` in the YouTube link |
| order | number | 1 (lessons are shown from lowest to highest) |

A document without a numeric `order` will not show up.

## 6. See your students
- **Authentication > Users**: the list of every account, and how many there are.
- **Firestore > students**: what each student wrote (level and what they want to learn).
- **Firestore > questions**: the questions they send. Add a `createdAt` sort in the console to see the newest.

## Rename the site
Replace "Salah's little classroom" in the four HTML files. The "Made by hand" lines and the text on `index.html` are yours to rewrite.

## Honest limits (read once)
- Upload videos to YouTube as **Unlisted**. A student could still share a link, because a static site can't truly hide a video. When you need real protection, move to a host with signed or domain-restricted video links.
- Anyone can create an account, and a confirmed email is the only check. That's enough to count students, not to prove who they are.
- Nothing stops a signed-in student from sending many questions. Add Firebase App Check later if it becomes a problem.
- Don't put anything secret in this repository. There's nothing secret in it now, and keep it that way.
