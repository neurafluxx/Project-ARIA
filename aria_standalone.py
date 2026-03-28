import os
import requests
import time
from fpdf import FPDF
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ==========================================
# CONFIGURATION
# ==========================================
# API Key from .env file (or fallback to hardcoded)
API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyCSkf-iT5P2W7pANHczc_NpNrMir1-xLfE')

# Targeted URL for Gemini 2.5 Flash
MODEL_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

class GeminiService:
    def __init__(self, api_key):
        self.api_key = api_key

    def fetch_report(self, prompt):
        """High-capacity request handler with doubled token limit"""
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.8,      # More creative for business ideas
                "maxOutputTokens": 2048,  # DOUBLED: Allows for long-form reports
                "topP": 0.95,            # Better diversity in word choice
                "topK": 40
            }
        }
        try:
            response = requests.post(
                f"{MODEL_URL}?key={self.api_key}",
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=60 # Increased timeout for longer responses
            )
            
            if response.status_code == 200:
                data = response.json()
                return data['candidates'][0]['content']['parts'][0]['text']
            elif response.status_code == 403:
                return "Error 403: Security Block. Please use a fresh API key."
            else:
                return f"Error {response.status_code}: {response.text}"
        except Exception as e:
            return f"Connection Error: {str(e)}"

class ARIA_Engine:
    def __init__(self, service):
        self.service = service
        self.reports = {}
        # Enhanced Prompts to encourage longer, more detailed output
        self.templates = {
            "Market Analysis": "Provide an extremely detailed Market Analysis for: {query}. Include global market size (USD), current 2026 trends, key growth drivers, and a SWOT analysis for this sector.",
            "Competitor Research": "Perform deep competitor research for: {query}. Identify 5 major players, their market share, their unique selling points (USPs), and gaps in their service that a newcomer could exploit.",
            "Audience Profiling": "Create comprehensive buyer personas for: {query}. Include 3 distinct segments with detailed demographics, psychological profiles, spending habits, and specific pain points.",
            "Content Strategy": "Design a massive 30-day marketing blueprint for: {query}. Include daily content themes for LinkedIn, Instagram, and TikTok, plus 3 specific 'viral' campaign ideas."
        }

    def generate_all(self, idea):
        """Generates and stores all 4 deep-dive reports"""
        for title, template in self.templates.items():
            print(f">> Analyzing {title} (Deep Dive)...")
            prompt = template.format(query=idea)
            result = self.service.fetch_report(prompt)
            self.reports[title] = result
            
            print(f"\n--- {title.upper()} ---")
            print(result[:500] + "...") # Preview in terminal
            print("-" * 30)
            time.sleep(2) # Safety delay for long generations

    def export_pdf(self, idea):
        """Creates a clean, multi-page professional PDF"""
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        
        pdf.set_font("Arial", 'B', 20)
        pdf.cell(200, 10, txt="ARIA Intelligence: Deep Dive Report", ln=True, align='C')
        pdf.set_font("Arial", 'I', 12)
        pdf.cell(200, 10, txt=f"Strategy for: {idea}", ln=True, align='C')
        pdf.ln(10)

        for title, content in self.reports.items():
            pdf.set_font("Arial", 'B', 14)
            pdf.set_fill_color(230, 230, 230) # Light grey header background
            pdf.cell(0, 10, txt=title.upper(), ln=True, align='L', fill=True)
            pdf.ln(2)
            pdf.set_font("Arial", '', 11)
            
            # Clean text for PDF compatibility
            clean_text = content.encode('latin-1', 'replace').decode('latin-1')
            pdf.multi_cell(0, 7, txt=clean_text)
            pdf.ln(10)

        filename = f"ARIA_{idea.replace(' ', '_')}_Full_Report.pdf"
        pdf.output(filename)
        return filename

def main():
    print("="*45)
    print("      ARIA INTELLIGENCE ENGINE v2.0 (2026)     ")
    print("="*45)

    business_idea = input("\nEnter your Business Idea: ")
    if not business_idea.strip(): return

    service = GeminiService(API_KEY)
    aria = ARIA_Engine(service)

    print("\nCrunching data and generating deep-dive reports. This may take a minute...\n")
    aria.generate_all(business_idea)

    choice = input("\nWould you like to save this FULL report as a PDF? (yes/no): ").lower()
    if choice in ['yes', 'y']:
        fname = aria.export_pdf(business_idea)
        print(f"[+] Success: Detailed report saved as '{fname}'")

if __name__ == "__main__":
    main()
