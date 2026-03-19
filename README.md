Project Overview:
ARIA is an AI-powered business intelligence platform. A user enters a business idea or topic, and
the system generates a structured intelligence report within about 30 seconds. Each report contains four sections:
> Market Analysis
> Competitor Landscape
> Target Audience
> Content Strategy

Users can save reports, view previous reports, and export them as a PDF. The platform will be
available as both a web application and a mobile application, connected to the same backend API. 

2. System Architecture:
The ARIA system follows a client–server architecture model.
System Flow:
1. User
2. Web App (React) / Mobile App (React Native)
3. Backend API (Node.js + Express)
4. AI Engine (Google Gemini API)
5. Database (MongoDB Atlas)
How the system works:
6. User enters a business idea or topic.
7. Frontend sends a request to the backend API.
8. Backend calls the Gemini AI API for analysis.
9. Gemini returns structured report data.
10. Backend saves the report in MongoDB.
11. Report is returned to frontend and displayed to the user.
