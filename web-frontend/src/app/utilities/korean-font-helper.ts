
import jsPDF from 'jspdf';

export class KoreanFontHelper {
  private static isRegistered = false;
  private static fontName = 'KoreanFont'; // Use a simple name
  
  static initialize(pdf: jsPDF): boolean {
    try {
      // Get the font data from window
      const fontData = (window as any).FontSourceHanSansNormal;
      
      if (!fontData) {
        console.error('❌ Korean font data not found on window');
        return false;
      }
      
      console.log('✅ Font data found, length:', fontData.length);
      
      // CRITICAL: Register with a SIMPLE name
      // This is the most important part - use a simple name without special characters
      pdf.addFileToVFS('KoreanFont.ttf', fontData);
      pdf.addFont('KoreanFont.ttf', 'KoreanFont', 'normal');
      
      // Verify registration by trying to set the font
      try {
        pdf.setFont('KoreanFont', 'normal');
        this.isRegistered = true;
        this.fontName = 'KoreanFont';
        console.log('✅ Korean font registered successfully as "KoreanFont"');
        return true;
      } catch (setError) {
        console.error('❌ Font registered but cannot set:', setError);
        
        // Try to register with different style
        try {
          pdf.addFont('KoreanFont.ttf', 'KoreanFont', 'bold');
          pdf.setFont('KoreanFont', 'bold');
          this.isRegistered = true;
          this.fontName = 'KoreanFont';
          console.log('✅ Korean font registered as "KoreanFont" with bold style');
          return true;
        } catch (e2) {
          console.error('❌ Cannot set font with bold style either');
          return false;
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to register Korean font:', error);
      return false;
    }
  }
  
  
 static testKoreanFontStandalone(pdf: jsPDF) {
  console.log('=== STANDALONE KOREAN FONT TEST ===');
  
  // Create PDF
  const doc = pdf;
  
  // Get font data
  const fontData = (window as any).FontSourceHanSansNormal;
  console.log('Font data available:', !!fontData);
  
  if (!fontData) {
    console.error('❌ No font data');
    return;
  }
  
  // Register font
  doc.addFileToVFS('SourceHanSans-Normal.ttf', fontData);
  doc.addFont('SourceHanSans-Normal.ttf', 'SourceHanSans-Normal', 'bold');
  doc.addFont('SourceHanSans-Normal.ttf', 'SourceHanSans-Normal', 'normal');
  
  // Try different ways to set the font
  try {
    // Method 1: Set with style
    doc.setFont('SourceHanSans-Normal', 'bold');
    doc.setFontSize(12);
    doc.text('테스트 1 - Korean Test', 10, 10);
    console.log('✅ Method 1 succeeded');
  } catch (e) {
    console.error('❌ Method 1 failed:', e);
  }
  
  try {
    // Method 2: Set without style
    doc.setFont('SourceHanSans-Normal');
    doc.setFontSize(12);
    doc.text('테스트 2 - Korean Test', 10, 20);
    console.log('✅ Method 2 succeeded');
  } catch (e) {
    console.error('❌ Method 2 failed:', e);
  }
  
  try {
    // Method 3: Set using font object
    doc.setFont('SourceHanSans-Normal.ttf');
    doc.setFontSize(12);
    doc.text('테스트 3 - Korean Test', 10, 30);
    console.log('✅ Method 3 succeeded');
  } catch (e) {
    console.error('❌ Method 3 failed:', e);
  }
  
  // Save the test PDF
  doc.save('korean-standalone-test.pdf');
  console.log('✅ Test PDF saved');
}


  static getFontName(): string {
    return this.fontName;
  }
  
  static isAvailable(): boolean {
    return this.isRegistered;
  }

//   static isKoreanFontAvailable(): boolean {
//     return !!(window as any).FontSourceHanSansNormal;
//   }
  
  // Check if text contains Korean characters
  static hasKorean(text: string): boolean {
    return /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/.test(text);
  }
  
  // Get font name for text
  static getFontForText(text: string): string {
    return this.hasKorean(text) ? this.fontName : 'helvetica';
  }
  
  // Clean address - remove corrupted characters
  static cleanAddress(address: string): string {
    // Remove non-printable and weird characters
    return address
      .replace(/[^\x20-\x7E\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F\s,.\-()]/g, '')
      .trim();
  }

   
  
  // Clean address and extract Korean part
  static parseAddress(fullAddress: string): {
    englishPart: string;
    koreanPart: string;
    hasKorean: boolean;
  } {
    // Split by comma to separate parts
    const parts = fullAddress.split(',').map(p => p.trim());
    
    // Separate English and Korean parts
    const englishParts: string[] = [];
    const koreanParts: string[] = [];
    
    for (const part of parts) {
      if (this.hasKorean(part)) {
        koreanParts.push(part);
      } else {
        englishParts.push(part);
      }
    }
    
    // Build English address (without Korean)
    const englishAddress = englishParts.join(', ');
    
    // Build Korean address
    const koreanAddress = koreanParts.join(', ');
    
    return {
      englishPart: englishAddress,
      koreanPart: koreanAddress,
      hasKorean: koreanParts.length > 0
    };
  }
  
  // Clean address - remove corrupted characters
  static cleanCorruptedText(text: string): string {
    // If text contains mixed corrupted characters, try to extract clean parts
    // This is a fallback for addresses that already have corrupted data
    const cleanRegex = /[A-Za-z0-9\s,.\-()°'"]+/g;
    const matches = text.match(cleanRegex);
    return matches ? matches.join('') : text;
  }
}