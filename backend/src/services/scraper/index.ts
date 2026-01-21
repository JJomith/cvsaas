import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

export interface ScrapedJob {
  title: string;
  company: string;
  location: string | null;
  description: string;
  requirements: string[];
  salary: string | null;
  url: string;
}

class JobScraperService {
  private async fetchWithPuppeteer(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for content to load
      await page.waitForSelector('body', { timeout: 10000 });
      
      const content = await page.content();
      return content;
    } finally {
      await browser.close();
    }
  }

  async scrapeJobUrl(url: string): Promise<ScrapedJob> {
    try {
      const html = await this.fetchWithPuppeteer(url);
      const $ = cheerio.load(html);

      // Remove script and style elements
      $('script, style, nav, footer, header').remove();

      // Generic extraction - works for most job sites
      const result: ScrapedJob = {
        title: this.extractTitle($),
        company: this.extractCompany($),
        location: this.extractLocation($),
        description: this.extractDescription($),
        requirements: this.extractRequirements($),
        salary: this.extractSalary($),
        url: url,
      };

      // Try site-specific extraction if generic fails
      if (!result.description || result.description.length < 100) {
        const siteSpecific = this.extractSiteSpecific($, url);
        return { ...result, ...siteSpecific };
      }

      return result;
    } catch (error) {
      console.error('Job scraping error:', error);
      throw new Error('Failed to scrape job posting. Please paste the job description manually.');
    }
  }

  private extractTitle($: cheerio.CheerioAPI): string {
    // Common title selectors
    const selectors = [
      'h1.job-title',
      'h1[data-testid="job-title"]',
      '.job-title h1',
      '.posting-headline h2',
      'h1.topcard__title',
      'h1.job-details-jobs-unified-top-card__job-title',
      '[data-job-title]',
      'h1',
    ];

    for (const selector of selectors) {
      const title = $(selector).first().text().trim();
      if (title && title.length > 2 && title.length < 200) {
        return title;
      }
    }

    return 'Job Position';
  }

  private extractCompany($: cheerio.CheerioAPI): string {
    const selectors = [
      '.company-name',
      '[data-testid="company-name"]',
      '.topcard__org-name-link',
      '.job-details-jobs-unified-top-card__company-name',
      '.posting-categories .company',
      'a[data-company-name]',
      '.employer-name',
    ];

    for (const selector of selectors) {
      const company = $(selector).first().text().trim();
      if (company && company.length > 1 && company.length < 100) {
        return company;
      }
    }

    return '';
  }

  private extractLocation($: cheerio.CheerioAPI): string | null {
    const selectors = [
      '.job-location',
      '[data-testid="job-location"]',
      '.topcard__flavor--bullet',
      '.job-details-jobs-unified-top-card__bullet',
      '.posting-categories .location',
      '.location',
    ];

    for (const selector of selectors) {
      const location = $(selector).first().text().trim();
      if (location && location.length > 2 && location.length < 100) {
        return location;
      }
    }

    return null;
  }

  private extractDescription($: cheerio.CheerioAPI): string {
    const selectors = [
      '.job-description',
      '[data-testid="job-description"]',
      '.description__text',
      '.jobs-description-content__text',
      '.posting-description',
      '#job-description',
      '.job-details',
      'article',
      '.content-wrapper',
    ];

    for (const selector of selectors) {
      const element = $(selector).first();
      if (element.length) {
        const text = element.text().trim();
        if (text.length > 100) {
          return this.cleanDescription(text);
        }
      }
    }

    // Fallback: get main content
    const mainContent = $('main, .main-content, #main').text().trim();
    if (mainContent.length > 100) {
      return this.cleanDescription(mainContent);
    }

    // Last resort: get body text
    return this.cleanDescription($('body').text());
  }

  private extractRequirements($: cheerio.CheerioAPI): string[] {
    const requirements: string[] = [];
    
    // Look for lists in requirement sections
    const selectors = [
      '.requirements ul li',
      '.qualifications ul li',
      '[data-testid="requirements"] li',
      '.job-requirements li',
      'ul.requirements li',
    ];

    for (const selector of selectors) {
      $(selector).each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 10 && text.length < 500) {
          requirements.push(text);
        }
      });
      
      if (requirements.length > 0) {
        return requirements.slice(0, 15);
      }
    }

    return requirements;
  }

  private extractSalary($: cheerio.CheerioAPI): string | null {
    const selectors = [
      '.salary',
      '[data-testid="salary"]',
      '.compensation',
      '.salary-range',
    ];

    for (const selector of selectors) {
      const salary = $(selector).first().text().trim();
      if (salary && salary.length > 2 && salary.length < 100) {
        return salary;
      }
    }

    // Look for salary patterns in text
    const bodyText = $('body').text();
    const salaryPattern = /\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\s*(?:per|\/)\s*(?:year|month|hour|annum))?/gi;
    const matches = bodyText.match(salaryPattern);
    
    if (matches && matches.length > 0) {
      return matches[0];
    }

    return null;
  }

  private extractSiteSpecific($: cheerio.CheerioAPI, url: string): Partial<ScrapedJob> {
    const hostname = new URL(url).hostname.toLowerCase();

    if (hostname.includes('linkedin.com')) {
      return this.extractLinkedIn($);
    } else if (hostname.includes('indeed.com')) {
      return this.extractIndeed($);
    } else if (hostname.includes('glassdoor.com')) {
      return this.extractGlassdoor($);
    }

    return {};
  }

  private extractLinkedIn($: cheerio.CheerioAPI): Partial<ScrapedJob> {
    return {
      title: $('.top-card-layout__title').text().trim() || 
             $('h1').first().text().trim(),
      company: $('.topcard__org-name-link').text().trim() ||
               $('.top-card-layout__card').find('a').first().text().trim(),
      description: $('.description__text').text().trim() ||
                   $('.show-more-less-html__markup').text().trim(),
    };
  }

  private extractIndeed($: cheerio.CheerioAPI): Partial<ScrapedJob> {
    return {
      title: $('[data-testid="job-title"]').text().trim() ||
             $('.jobsearch-JobInfoHeader-title').text().trim(),
      company: $('[data-testid="company-name"]').text().trim() ||
               $('.jobsearch-CompanyInfoContainer').text().trim(),
      description: $('#jobDescriptionText').text().trim() ||
                   $('.jobsearch-jobDescriptionText').text().trim(),
    };
  }

  private extractGlassdoor($: cheerio.CheerioAPI): Partial<ScrapedJob> {
    return {
      title: $('[data-test="job-title"]').text().trim(),
      company: $('[data-test="employer-name"]').text().trim(),
      description: $('.jobDescriptionContent').text().trim(),
    };
  }

  private cleanDescription(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, '\n')
      .trim()
      .substring(0, 10000); // Limit to 10k characters
  }

  parseJobDescription(content: string): ScrapedJob {
    // Parse pasted job description text
    const lines = content.split('\n').map(l => l.trim()).filter(l => l);
    
    let title = '';
    let company = '';
    let location = '';
    
    // Try to extract from first few lines
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      
      // Look for job title patterns
      if (!title && (
        line.toLowerCase().includes('position:') ||
        line.toLowerCase().includes('job title:') ||
        line.toLowerCase().includes('role:') ||
        (i === 0 && line.length < 100)
      )) {
        title = line.replace(/^(position|job title|role):\s*/i, '').trim();
      }
      
      // Look for company patterns
      if (!company && (
        line.toLowerCase().includes('company:') ||
        line.toLowerCase().includes('employer:') ||
        line.toLowerCase().includes('organization:')
      )) {
        company = line.replace(/^(company|employer|organization):\s*/i, '').trim();
      }
      
      // Look for location patterns
      if (!location && (
        line.toLowerCase().includes('location:') ||
        line.toLowerCase().includes('based in:')
      )) {
        location = line.replace(/^(location|based in):\s*/i, '').trim();
      }
    }

    return {
      title: title || 'Job Position',
      company: company || '',
      location: location || null,
      description: content,
      requirements: [],
      salary: null,
      url: '',
    };
  }
}

export const jobScraperService = new JobScraperService();
export default jobScraperService;
