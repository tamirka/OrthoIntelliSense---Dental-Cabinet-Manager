
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { Patient, TreatmentStep } from '../types';

// IMPORTANT: This check is a safeguard. In a real-world scenario,
// the build process or environment setup would ensure API_KEY is present.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

export const generatePatientSummary = async (patient: Patient): Promise<string> => {
  try {
    const prompt = `As a dental professional, provide a concise clinical summary for the following patient. Highlight key issues and potential risks.
    
    Patient Name: ${patient.name}
    Medical History: ${patient.medicalHistory}
    Dental History: ${patient.dentalHistory}
    Recent Notes: ${patient.notes}
    
    Generate a summary in 2-3 bullet points.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating patient summary:", error);
    return "Error: Could not generate summary. The AI model may be temporarily unavailable.";
  }
};

export const generateTreatmentOptions = async (patient: Patient): Promise<string> => {
  try {
    const prompt = `Based on the following patient's information, suggest 2-3 potential treatment options with brief pros and cons for each. Format the response clearly for a dentist's review.
    
    Patient Name: ${patient.name}
    Medical History: ${patient.medicalHistory}
    Dental History: ${patient.dentalHistory}
    Recent Notes: ${patient.notes}
    
    Structure your response with headings for each option.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating treatment options:", error);
    return "Error: Could not generate treatment options. The AI model may be temporarily unavailable.";
  }
};


export const generateAppointmentReminder = async (patientName: string, appointmentDate: string, appointmentTime: string): Promise<string> => {
    try {
        const prompt = `Generate a friendly and professional SMS appointment reminder for a dental patient.
        
        Patient Name: ${patientName}
        Appointment Date: ${appointmentDate}
        Appointment Time: ${appointmentTime}
        Clinic Name: OrthoIntelliSense Clinic
        
        The message should be concise, under 160 characters, and include an option to confirm or reschedule by calling our office.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error generating appointment reminder:", error);
        return "Error: Could not generate reminder.";
    }
}

export const generateTreatmentPlan = async (patient: Patient, goal: string): Promise<Omit<TreatmentStep, 'id' | 'status'>[]> => {
    try {
        const prompt = `As a senior dentist, create a structured, step-by-step treatment plan for the following clinical goal.
        
        Patient Context:
        - Name: ${patient.name}
        - Medical History: ${patient.medicalHistory}
        - Dental History: ${patient.dentalHistory}
        - Recent Notes: ${patient.notes}
        
        Clinical Goal: "${goal}"
        
        Generate a list of treatment steps with a brief description and an estimated cost for each step. The cost should be a number.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: {
                                type: Type.STRING,
                                description: "A clear, concise description of the clinical step.",
                            },
                            cost: {
                                type: Type.NUMBER,
                                description: "The estimated cost for this specific step.",
                            },
                        },
                        required: ["description", "cost"],
                    },
                },
            },
        });

        const jsonResponse = JSON.parse(response.text);
        return Array.isArray(jsonResponse) ? jsonResponse : [];

    } catch (error) {
        console.error("Error generating treatment plan:", error);
        // Return an empty array or throw a custom error to be handled by the UI
        return [];
    }
};
