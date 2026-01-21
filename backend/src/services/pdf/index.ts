import puppeteer from 'puppeteer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface PDFGenerationOptions {
  content: any;
  template: any;
  type: 'CV' | 'COVER_LETTER';
  watermark?: boolean;
}

class PDFService {
  async generatePDF(html: string, options: { watermark?: boolean } = {}): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      
      // Set content
      await page.setContent(html, { waitUntil: 'networkidle0' });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm',
        },
        printBackground: true,
      });

      // Add watermark if needed
      if (options.watermark) {
        return await this.addWatermark(Buffer.from(pdfBuffer));
      }

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  private async addWatermark(pdfBuffer: Buffer): Promise<Buffer> {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Add diagonal watermark
      page.drawText('Created with CV Builder', {
        x: width / 4,
        y: height / 2,
        size: 40,
        font: helveticaFont,
        color: rgb(0.9, 0.9, 0.9),
        rotate: { type: 'degrees' as const, angle: -45 },
        opacity: 0.3,
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    return Buffer.from(modifiedPdfBytes);
  }

  generateCVHTML(content: any, template: any): string {
    const styles = template.styles || {};
    const primaryColor = styles.colorScheme?.[0] || '#2563eb';
    const textColor = styles.colorScheme?.[1] || '#1e293b';
    const fontFamily = styles.fonts?.[0] || 'Inter';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11pt;
            line-height: 1.5;
            color: ${textColor};
          }
          
          .cv-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 2px solid ${primaryColor};
          }
          
          .header h1 {
            font-size: 28pt;
            font-weight: 700;
            color: ${textColor};
            margin-bottom: 8px;
          }
          
          .header .headline {
            font-size: 14pt;
            color: ${primaryColor};
            font-weight: 500;
            margin-bottom: 12px;
          }
          
          .header .contact-info {
            font-size: 10pt;
            color: #64748b;
          }
          
          .header .contact-info span {
            margin: 0 8px;
          }
          
          .section {
            margin-bottom: 20px;
          }
          
          .section-title {
            font-size: 14pt;
            font-weight: 600;
            color: ${primaryColor};
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .summary {
            font-size: 11pt;
            color: #475569;
            line-height: 1.6;
          }
          
          .experience-item, .education-item {
            margin-bottom: 16px;
          }
          
          .experience-header, .education-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 4px;
          }
          
          .company-name, .institution-name {
            font-weight: 600;
            font-size: 12pt;
          }
          
          .job-title, .degree {
            color: ${primaryColor};
            font-weight: 500;
          }
          
          .date-range {
            font-size: 10pt;
            color: #64748b;
          }
          
          .location {
            font-size: 10pt;
            color: #64748b;
            font-style: italic;
          }
          
          .description {
            font-size: 10pt;
            color: #475569;
            margin-top: 4px;
          }
          
          .achievements {
            margin-top: 8px;
            padding-left: 16px;
          }
          
          .achievements li {
            font-size: 10pt;
            margin-bottom: 4px;
            color: #334155;
          }
          
          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }
          
          .skill-category {
            margin-bottom: 12px;
          }
          
          .skill-category-title {
            font-weight: 600;
            font-size: 11pt;
            margin-bottom: 6px;
          }
          
          .skill-tag {
            display: inline-block;
            background: #f1f5f9;
            color: ${textColor};
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 10pt;
            margin: 2px;
          }
          
          .certifications-list, .projects-list {
            padding-left: 0;
            list-style: none;
          }
          
          .certification-item, .project-item {
            margin-bottom: 8px;
            padding-left: 16px;
            position: relative;
          }
          
          .certification-item::before, .project-item::before {
            content: "•";
            color: ${primaryColor};
            font-weight: bold;
            position: absolute;
            left: 0;
          }
        </style>
      </head>
      <body>
        <div class="cv-container">
          ${this.renderCVHeader(content)}
          ${content.summary ? this.renderSummary(content.summary) : ''}
          ${content.experience ? this.renderExperience(content.experience) : ''}
          ${content.education ? this.renderEducation(content.education) : ''}
          ${content.skills ? this.renderSkills(content.skills) : ''}
          ${content.certifications ? this.renderCertifications(content.certifications) : ''}
          ${content.projects ? this.renderProjects(content.projects) : ''}
        </div>
      </body>
      </html>
    `;
  }

  private renderCVHeader(content: any): string {
    const header = content.header || {};
    return `
      <div class="header">
        <h1>${header.name || 'Your Name'}</h1>
        ${header.headline ? `<div class="headline">${header.headline}</div>` : ''}
        <div class="contact-info">
          ${header.email ? `<span>📧 ${header.email}</span>` : ''}
          ${header.phone ? `<span>📱 ${header.phone}</span>` : ''}
          ${header.location ? `<span>📍 ${header.location}</span>` : ''}
          ${header.linkedin ? `<span>💼 LinkedIn</span>` : ''}
          ${header.website ? `<span>🌐 ${header.website}</span>` : ''}
        </div>
      </div>
    `;
  }

  private renderSummary(summary: string): string {
    return `
      <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <p class="summary">${summary}</p>
      </div>
    `;
  }

  private renderExperience(experience: any[]): string {
    if (!experience || experience.length === 0) return '';
    
    return `
      <div class="section">
        <h2 class="section-title">Work Experience</h2>
        ${experience.map(exp => `
          <div class="experience-item">
            <div class="experience-header">
              <div>
                <span class="company-name">${exp.company}</span>
                ${exp.location ? `<span class="location"> - ${exp.location}</span>` : ''}
              </div>
              <span class="date-range">${exp.startDate} - ${exp.endDate || 'Present'}</span>
            </div>
            <div class="job-title">${exp.title}</div>
            ${exp.description ? `<p class="description">${exp.description}</p>` : ''}
            ${exp.achievements && exp.achievements.length > 0 ? `
              <ul class="achievements">
                ${exp.achievements.map((a: string) => `<li>${a}</li>`).join('')}
              </ul>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderEducation(education: any[]): string {
    if (!education || education.length === 0) return '';
    
    return `
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
          <div class="education-item">
            <div class="education-header">
              <div>
                <span class="institution-name">${edu.institution}</span>
              </div>
              <span class="date-range">${edu.startDate} - ${edu.endDate || 'Present'}</span>
            </div>
            <div class="degree">${edu.degree} in ${edu.field}</div>
            ${edu.gpa ? `<div class="description">GPA: ${edu.gpa}</div>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderSkills(skills: any): string {
    if (!skills) return '';
    
    const technical = skills.technical || [];
    const soft = skills.soft || [];
    
    if (technical.length === 0 && soft.length === 0) return '';
    
    return `
      <div class="section">
        <h2 class="section-title">Skills</h2>
        ${technical.length > 0 ? `
          <div class="skill-category">
            <div class="skill-category-title">Technical Skills</div>
            <div class="skills-container">
              ${technical.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}
        ${soft.length > 0 ? `
          <div class="skill-category">
            <div class="skill-category-title">Soft Skills</div>
            <div class="skills-container">
              ${soft.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  private renderCertifications(certifications: any[]): string {
    if (!certifications || certifications.length === 0) return '';
    
    return `
      <div class="section">
        <h2 class="section-title">Certifications</h2>
        <ul class="certifications-list">
          ${certifications.map(cert => `
            <li class="certification-item">
              <strong>${cert.name}</strong> - ${cert.issuer} (${cert.date || ''})
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  private renderProjects(projects: any[]): string {
    if (!projects || projects.length === 0) return '';
    
    return `
      <div class="section">
        <h2 class="section-title">Projects</h2>
        <ul class="projects-list">
          ${projects.map(proj => `
            <li class="project-item">
              <strong>${proj.name}</strong>
              ${proj.description ? ` - ${proj.description}` : ''}
              ${proj.technologies ? `<br><em>Technologies: ${proj.technologies.join(', ')}</em>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  generateCoverLetterHTML(content: any, template: any): string {
    const styles = template.styles || {};
    const primaryColor = styles.colorScheme?.[0] || '#2563eb';
    const textColor = styles.colorScheme?.[1] || '#1e293b';
    const fontFamily = styles.fonts?.[0] || 'Inter';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 11pt;
            line-height: 1.8;
            color: ${textColor};
          }
          
          .letter-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 40px;
          }
          
          .header {
            margin-bottom: 30px;
          }
          
          .header .name {
            font-size: 18pt;
            font-weight: 600;
            color: ${primaryColor};
          }
          
          .header .contact {
            font-size: 10pt;
            color: #64748b;
            margin-top: 4px;
          }
          
          .date {
            margin-bottom: 20px;
            color: #64748b;
          }
          
          .greeting {
            margin-bottom: 20px;
            font-weight: 500;
          }
          
          .body p {
            margin-bottom: 16px;
            text-align: justify;
          }
          
          .closing {
            margin-top: 30px;
          }
          
          .signature {
            margin-top: 40px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="letter-container">
          <div class="header">
            <div class="name">${content.header?.name || 'Your Name'}</div>
            <div class="contact">
              ${content.header?.email || ''} ${content.header?.phone ? '| ' + content.header.phone : ''}
            </div>
          </div>
          
          <div class="date">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          
          <div class="greeting">${content.greeting || 'Dear Hiring Manager,'}</div>
          
          <div class="body">
            <p>${content.opening || ''}</p>
            <p>${content.body || ''}</p>
            <p>${content.closing || ''}</p>
          </div>
          
          <div class="signature">
            ${content.signature || 'Sincerely,<br><br>Your Name'}
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const pdfService = new PDFService();
export default pdfService;
