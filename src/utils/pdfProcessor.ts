export const extractTextFromPDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Convert the file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF using pdf.js
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
          fullText += pageText + '\n\n';
        }
        
        if (!fullText.trim()) {
          throw new Error("No text could be extracted from the PDF");
        }
        
        resolve(fullText);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read the PDF file"));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const generateQuestionsFromText = async (pdfText: string): Promise<any> => {
  const API_KEY = "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";
  
  const prompt = `Generate 10 multiple choice questions based on the following text. Each question should have 4 options and one correct answer. Format the response as a JSON array with this structure:
  [
    {
      "id": 1,
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]

  Text content:
  ${pdfText}

  Return only the JSON array, no additional text.`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "PDF Quiz Generator",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-r1-0528:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const questionsText = data.choices[0].message.content;
    
    try {
      const questions = JSON.parse(questionsText);
      return questions;
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", questionsText);
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
