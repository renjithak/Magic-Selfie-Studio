import { GoogleGenAI } from "@google/genai";
import { AspectRatio, PhotoFilter } from "../types";

export class GeminiService {
  async generateMagicSelfie(
    image1Base64: string,
    image2Base64: string | null,
    location: string,
    mobilePhone: string,
    aspectRatio: AspectRatio = "1:1",
    blurIntensity: number = 50,
    filter: PhotoFilter = 'none'
  ): Promise<string> {
    // Directly use process.env.API_KEY as per instructions
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    try {
      const cleanImg1 = image1Base64.split(',')[1] || image1Base64;
      const cleanImg2 = image2Base64 ? (image2Base64.split(',')[1] || image2Base64) : null;

      const isSolo = !cleanImg2;

      // Translate 0-100 intensity to descriptive prompt language
      let bokehPrompt = "moderate natural bokeh";
      if (blurIntensity < 20) bokehPrompt = "minimal background blur, sharp background details and scenery";
      else if (blurIntensity < 40) bokehPrompt = "soft background blur";
      else if (blurIntensity > 80) bokehPrompt = "extreme cinematic bokeh, heavily blurred background, creamy shallow depth of field";
      else if (blurIntensity > 60) bokehPrompt = "strong artistic bokeh";

      // Translate filters to descriptive prompt language
      let filterPrompt = "";
      switch (filter) {
        case 'sepia': filterPrompt = "Apply a warm sepia tone filter, with brownish tints."; break;
        case 'bw': filterPrompt = "Render the photo in high-contrast black and white."; break;
        case 'vintage': filterPrompt = "Apply a vintage film look with subtle grain."; break;
        case 'warm': filterPrompt = "Apply a warm, golden hour filter."; break;
        case 'cool': filterPrompt = "Apply a cool blue-toned filter."; break;
        default: filterPrompt = "Use natural colors and professional photographic lighting."; break;
      }

      const referencePrompts = isSolo
        ? `REFERENCE (Person 1): Replicate the exact facial features, skin tone, bone structure, hairstyle, and expression of the person in the attached image with 100% accuracy.`
        : `REFERENCE 1 (Person 1): Replicate the exact facial features, skin tone, bone structure, hairstyle, and expression of the person in the first attached image.
REFERENCE 2 (Person 2): Replicate the exact facial features, skin tone, bone structure, hairstyle, and expression of the person in the second attached image.`;

      const prompt = `
        TASK: Create an ultra-realistic, professional high-detail handheld selfie of ${isSolo ? 'one person' : 'two people'} at ${location}.
        
        ${referencePrompts}
        
        SELFIE AUTHENTICITY & GAZE:
        - EYE CONTACT: The subjects are looking DIRECTLY into the front-facing selfie camera lens of the ${mobilePhone} they are holding. 
        - ALIGNMENT: Their eyes must be perfectly aligned with the camera lens for a sharp, engaging gaze, exactly as if they are taking a real selfie. They are NOT looking at the screen, to the side, or at the viewer; they are looking into the lens.
        - POSTURE: One arm is extended forward/slightly upward to hold the phone, creating a natural selfie shoulder/arm angle. 
        - PERSPECTIVE: The camera angle is slightly high-angle or eye-level, characteristic of a handheld smartphone shot.
        
        SCENE COMPOSITION:
        - DEVICE: The edge of the ${mobilePhone} or the hand holding it is naturally partially visible in the corner or bottom of the frame, emphasizing the handheld nature.
        - BACKGROUND: A stunning, realistic, and iconic view of ${location}.
        - BLUR EFFECT: Apply ${bokehPrompt}.
        - STYLE: ${filterPrompt}
        - IDENTITY: Identity preservation is the top priority. The generated subjects must be indistinguishable from the reference images provided.
      `;

      const parts: any[] = [
        {
          inlineData: {
            data: cleanImg1,
            mimeType: 'image/png',
          },
        }
      ];

      if (cleanImg2) {
        parts.push({
          inlineData: {
            data: cleanImg2,
            mimeType: 'image/png',
          },
        });
      }

      parts.push({ text: prompt });

      // Using gemini-2.5-flash-image to ensure it works with default environment key without 403 errors
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData?.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }

      if (response.text) {
        throw new Error(`The model returned text: ${response.text}`);
      }

      throw new Error("The model did not return any image data.");
    } catch (error: any) {
      console.error("Gemini Generation Error:", error);
      throw new Error(error.message || "Failed to generate selfie.");
    }
  }
}

export const geminiService = new GeminiService();